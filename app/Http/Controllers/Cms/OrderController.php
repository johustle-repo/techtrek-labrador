<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\UpdateOrderStatusRequest;
use App\Models\BusinessOrder;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
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
            ->with([
                'business:id,name',
                'product:id,name',
                'creator:id,name',
                'updater:id,name',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('customer_name', 'like', "%{$search}%")
                        ->orWhere('reference_no', 'like', "%{$search}%")
                        ->orWhere('order_type', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
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
                'created_at' => $order->created_at?->toDateTimeString(),
                'updated_at' => $order->updated_at?->toDateTimeString(),
                'created_by' => $order->creator?->name,
                'updated_by' => $order->updater?->name,
            ]);

        return Inertia::render('cms/orders/index', [
            'orders' => $orders,
            'summary' => [
                'total' => BusinessOrder::count(),
                'pending' => BusinessOrder::where('status', 'pending')->count(),
                'completed' => BusinessOrder::where('status', 'completed')->count(),
                'total_revenue' => (float) BusinessOrder::where('status', 'completed')->sum('total_amount'),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, BusinessOrder $order): RedirectResponse
    {
        $before = $order->getAttributes();
        $order->update([
            'status' => $request->validated('status'),
            'updated_by' => $request->user()?->id,
        ]);
        $order->refresh();

        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'cms_orders',
            targetId: $order->id,
            before: $before,
            after: $order->getAttributes(),
        );

        return back()->with('success', 'Order status updated.');
    }
}
