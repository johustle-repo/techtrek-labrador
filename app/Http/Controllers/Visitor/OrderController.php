<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\BusinessOrder;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return $this->renderList(bookingsView: false);
    }

    public function bookings(): Response
    {
        return $this->renderList(bookingsView: true);
    }

    public function show(Request $request, BusinessOrder $order): Response
    {
        abort_unless($order->created_by === $request->user()?->id, 403);
        $isBookingView = $request->routeIs('visitor.bookings.show');
        $backPath = $isBookingView ? '/visitor/bookings' : '/visitor/orders';
        $backTitle = $isBookingView ? 'My Bookings' : 'My Orders';

        $order->load([
            'business:id,name,slug,address,contact_phone',
            'product:id,name,is_service,price',
        ]);

        $statusSteps = ['pending', 'confirmed', 'in_progress', 'completed'];
        $currentStatus = $order->status;
        $currentIndex = array_search($currentStatus, $statusSteps, true);
        $currentIndex = $currentIndex === false ? null : $currentIndex;

        $timeline = collect($statusSteps)->map(function (string $step, int $index) use ($currentIndex, $currentStatus) {
            $state = 'upcoming';

            if ($currentStatus === 'cancelled') {
                $state = 'upcoming';
            } elseif ($currentIndex !== null && $index < $currentIndex) {
                $state = 'completed';
            } elseif ($currentIndex !== null && $index === $currentIndex) {
                $state = 'current';
            }

            return [
                'key' => $step,
                'label' => str($step)->replace('_', ' ')->title()->toString(),
                'state' => $state,
            ];
        })->values();

        return Inertia::render('visitor/orders/show', [
            'order' => [
                'id' => $order->id,
                'reference_no' => $order->reference_no,
                'status' => $order->status,
                'order_type' => $order->order_type,
                'quantity' => $order->quantity,
                'total_amount' => $order->total_amount,
                'scheduled_at' => $order->scheduled_at?->toDateTimeString(),
                'created_at' => $order->created_at?->toDateTimeString(),
                'updated_at' => $order->updated_at?->toDateTimeString(),
                'notes' => $order->notes,
                'cancellation_reason' => $order->cancellation_reason,
                'business' => [
                    'name' => $order->business?->name,
                    'slug' => $order->business?->slug,
                    'address' => $order->business?->address,
                    'contact_phone' => $order->business?->contact_phone,
                ],
                'product' => [
                    'name' => $order->product?->name,
                    'is_service' => $order->product?->is_service,
                    'price' => $order->product?->price,
                ],
            ],
            'timeline' => $timeline,
            'back_path' => $backPath,
            'back_title' => $backTitle,
        ]);
    }

    public function cancel(Request $request, BusinessOrder $order): RedirectResponse
    {
        abort_unless($order->created_by === $request->user()?->id, 403);
        abort_unless($order->status === 'pending', 422);
        $validated = $request->validate([
            'cancellation_reason' => ['required', 'string', 'max:500'],
        ]);

        $before = $order->getAttributes();
        $order->update([
            'status' => 'cancelled',
            'cancellation_reason' => trim($validated['cancellation_reason']),
            'updated_by' => $request->user()?->id,
        ]);
        $order->refresh();

        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'visitor_orders',
            targetId: $order->id,
            before: $before,
            after: $order->getAttributes(),
        );

        return back()->with('success', 'Order request cancelled.');
    }

    private function renderList(bool $bookingsView): Response
    {
        $type = (string) request('type', $bookingsView ? 'bookings' : 'all');
        $status = (string) request('status', 'all');

        $allowedTypes = ['all', 'bookings', 'product_order', 'service_booking', 'custom_service'];
        $allowedStatuses = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

        if (! in_array($type, $allowedTypes, true)) {
            $type = $bookingsView ? 'bookings' : 'all';
        }

        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'all';
        }

        $query = BusinessOrder::query()
            ->with([
                'business:id,name',
                'product:id,name,is_service',
            ])
            ->where('created_by', auth()->id())
            ->when($type === 'bookings', fn ($builder) => $builder->whereIn('order_type', ['service_booking', 'custom_service']))
            ->when(! in_array($type, ['all', 'bookings'], true), fn ($builder) => $builder->where('order_type', $type))
            ->when($status !== 'all', fn ($builder) => $builder->where('status', $status));

        $orders = $query
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (BusinessOrder $order) => [
                'id' => $order->id,
                'reference_no' => $order->reference_no,
                'business_name' => $order->business?->name,
                'product_name' => $order->product?->name,
                'order_type' => $order->order_type,
                'quantity' => $order->quantity,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'cancellation_reason' => $order->cancellation_reason,
                'scheduled_at' => $order->scheduled_at?->toDateTimeString(),
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        $summaryBase = BusinessOrder::query()->where('created_by', auth()->id());

        return Inertia::render('visitor/orders/index', [
            'orders' => $orders,
            'summary' => [
                'total' => (clone $summaryBase)->count(),
                'orders' => (clone $summaryBase)->where('order_type', 'product_order')->count(),
                'bookings' => (clone $summaryBase)->whereIn('order_type', ['service_booking', 'custom_service'])->count(),
                'pending' => (clone $summaryBase)->where('status', 'pending')->count(),
                'confirmed' => (clone $summaryBase)->where('status', 'confirmed')->count(),
                'in_progress' => (clone $summaryBase)->where('status', 'in_progress')->count(),
                'completed' => (clone $summaryBase)->where('status', 'completed')->count(),
                'cancelled' => (clone $summaryBase)->where('status', 'cancelled')->count(),
            ],
            'filters' => [
                'type' => $type,
                'status' => $status,
            ],
            'base_path' => $bookingsView ? '/visitor/bookings' : '/visitor/orders',
            'page_title' => $bookingsView ? 'My Bookings' : 'My Orders',
        ]);
    }
}
