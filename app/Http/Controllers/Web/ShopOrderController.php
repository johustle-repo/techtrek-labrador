<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreVisitorOrderRequest;
use App\Models\BusinessOrder;
use App\Models\BusinessProduct;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ShopOrderController extends Controller
{
    public function store(StoreVisitorOrderRequest $request): RedirectResponse
    {
        $payload = $request->validated();

        $product = BusinessProduct::query()
            ->with('business:id,status')
            ->whereKey($payload['business_product_id'])
            ->where('status', 'active')
            ->firstOrFail();

        abort_unless($product->business?->status === 'published', 422);

        $quantity = (int) $payload['quantity'];
        $unitPrice = (float) $product->price;
        $totalAmount = round($unitPrice * $quantity, 2);

        $notes = InputSanitizer::plain($payload['notes'] ?? null);
        if (isset($payload['visitor_latitude'], $payload['visitor_longitude'])) {
            $locationNote = sprintf(
                'Visitor location: lat=%s, lng=%s',
                $payload['visitor_latitude'],
                $payload['visitor_longitude'],
            );
            $notes = $notes ? $notes."\n".$locationNote : $locationNote;
        }

        $order = BusinessOrder::create([
            'business_id' => $product->business_id,
            'business_product_id' => $product->id,
            'order_type' => $product->is_service ? 'service_booking' : 'product_order',
            'reference_no' => $this->nextReference(),
            'customer_name' => $request->user()?->name ?? 'Visitor',
            'customer_contact' => InputSanitizer::plain($payload['customer_contact']),
            'quantity' => $quantity,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'scheduled_at' => $payload['scheduled_at'] ?? null,
            'notes' => $notes,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'visitor_orders',
            targetId: $order->id,
            after: $order->getAttributes(),
        );

        return back()->with('success', 'Order submitted. The business owner will review it.');
    }

    private function nextReference(): string
    {
        return 'TTL-ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
    }
}

