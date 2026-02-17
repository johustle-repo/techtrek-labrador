<?php

namespace App\Http\Controllers\Owner;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\StoreOwnedOrderRequest;
use App\Http\Requests\Owner\UpdateOwnedOrderRequest;
use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\BusinessProduct;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $search = trim((string) request('search', ''));
        $status = (string) request('status', 'all');
        $allowedStatuses = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'all';
        }

        $orders = BusinessOrder::query()
            ->with(['business:id,name', 'product:id,name'])
            ->whereIn('business_id', $this->ownedBusinessIds())
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('customer_name', 'like', "%{$search}%")
                        ->orWhere('reference_no', 'like', "%{$search}%")
                        ->orWhere('order_type', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (BusinessOrder $order) => [
                'id' => $order->id,
                'business' => $order->business?->name,
                'product' => $order->product?->name,
                'order_type' => $order->order_type,
                'reference_no' => $order->reference_no,
                'customer_name' => $order->customer_name,
                'customer_contact' => $order->customer_contact,
                'quantity' => $order->quantity,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'cancellation_reason' => $order->cancellation_reason,
                'scheduled_at' => $order->scheduled_at?->toDateTimeString(),
                'updated_at' => $order->updated_at?->toDateTimeString(),
            ]);

        $summaryQuery = BusinessOrder::query()->whereIn('business_id', $this->ownedBusinessIds());
        $pendingQueue = BusinessOrder::query()
            ->with(['business:id,name', 'product:id,name'])
            ->whereIn('business_id', $this->ownedBusinessIds())
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (BusinessOrder $order) => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'business' => $order->business?->name,
                'product' => $order->product?->name ?? $order->order_type,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Owner/Orders/index', [
            'orders' => $orders,
            'summary' => [
                'total' => (clone $summaryQuery)->count(),
                'pending' => (clone $summaryQuery)->where('status', 'pending')->count(),
                'completed' => (clone $summaryQuery)->where('status', 'completed')->count(),
                'total_revenue' => (float) (clone $summaryQuery)->where('status', 'completed')->sum('total_amount'),
                'pending_today' => (clone $summaryQuery)
                    ->where('status', 'pending')
                    ->whereDate('created_at', now()->toDateString())
                    ->count(),
            ],
            'pending_queue' => $pendingQueue,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Owner/Orders/create', [
            'businesses' => $this->ownedBusinesses(),
            'products' => $this->ownedProducts(),
        ]);
    }

    public function store(StoreOwnedOrderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->ensureBusinessAllowed((int) $data['business_id']);
        $this->ensureProductAllowed($data['business_product_id'] ?? null);
        $this->ensureProductMatchesBusiness($data['business_product_id'] ?? null, (int) $data['business_id']);

        $data['notes'] = InputSanitizer::plain($data['notes'] ?? null);
        $order = BusinessOrder::create([
            ...$data,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'owner_orders',
            targetId: $order->id,
            after: $order->getAttributes(),
        );

        return to_route('owner.orders.index')->with('success', 'Order/service created.');
    }

    public function edit(BusinessOrder $order): Response
    {
        $this->ensureBusinessAllowed($order->business_id);

        return Inertia::render('Owner/Orders/edit', [
            'order' => [
                'id' => $order->id,
                'business_id' => $order->business_id,
                'business_product_id' => $order->business_product_id,
                'order_type' => $order->order_type,
                'reference_no' => $order->reference_no,
                'customer_name' => $order->customer_name,
                'customer_contact' => $order->customer_contact,
                'quantity' => $order->quantity,
                'total_amount' => (string) $order->total_amount,
                'status' => $order->status,
                'scheduled_at' => $order->scheduled_at?->format('Y-m-d\TH:i'),
                'notes' => $order->notes,
            ],
            'businesses' => $this->ownedBusinesses(),
            'products' => $this->ownedProducts(),
        ]);
    }

    public function update(UpdateOwnedOrderRequest $request, BusinessOrder $order): RedirectResponse
    {
        $this->ensureBusinessAllowed($order->business_id);

        $data = $request->validated();
        $this->ensureBusinessAllowed((int) $data['business_id']);
        $this->ensureProductAllowed($data['business_product_id'] ?? null);
        $this->ensureProductMatchesBusiness($data['business_product_id'] ?? null, (int) $data['business_id']);
        $before = $order->getAttributes();

        $data['notes'] = InputSanitizer::plain($data['notes'] ?? null);
        $order->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $order->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'owner_orders',
            targetId: $order->id,
            before: $before,
            after: $order->getAttributes(),
        );

        return to_route('owner.orders.index')->with('success', 'Order/service updated.');
    }

    public function destroy(Request $request, BusinessOrder $order): RedirectResponse
    {
        $this->ensureBusinessAllowed($order->business_id);

        $before = $order->getAttributes();
        $order->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'owner_orders',
            targetId: $before['id'] ?? null,
            before: $before,
        );

        return to_route('owner.orders.index')->with('success', 'Order/service deleted.');
    }

    /**
     * @return array<int, int>
     */
    private function ownedBusinessIds(): array
    {
        $user = auth()->user();

        if ($user?->hasRole(UserRole::SUPER_ADMIN)) {
            return Business::query()->pluck('id')->all();
        }

        return Business::query()
            ->where('owner_user_id', $user?->id)
            ->pluck('id')
            ->all();
    }

    private function ensureBusinessAllowed(int $businessId): void
    {
        abort_unless(in_array($businessId, $this->ownedBusinessIds(), true), 403);
    }

    private function ensureProductAllowed(?int $productId): void
    {
        if ($productId === null) {
            return;
        }

        $allowed = BusinessProduct::query()
            ->whereKey($productId)
            ->whereIn('business_id', $this->ownedBusinessIds())
            ->exists();

        abort_unless($allowed, 403);
    }

    private function ensureProductMatchesBusiness(?int $productId, int $businessId): void
    {
        if ($productId === null) {
            return;
        }

        $matches = BusinessProduct::query()
            ->whereKey($productId)
            ->where('business_id', $businessId)
            ->exists();

        abort_unless($matches, 422);
    }

    private function ownedBusinesses()
    {
        return Business::query()
            ->whereIn('id', $this->ownedBusinessIds())
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    private function ownedProducts()
    {
        return BusinessProduct::query()
            ->whereIn('business_id', $this->ownedBusinessIds())
            ->orderBy('name')
            ->get(['id', 'business_id', 'name']);
    }
}
