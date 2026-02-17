<?php

namespace App\Http\Controllers\Owner;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\FeeRule;
use Inertia\Inertia;
use Inertia\Response;

class FeeManagementController extends Controller
{
    public function index(): Response
    {
        $businessIds = $this->ownedBusinessIds();

        $monthlyRevenue = (float) BusinessOrder::query()
            ->whereIn('business_id', $businessIds)
            ->where('status', 'completed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('total_amount');

        $completedOrders = BusinessOrder::query()
            ->whereIn('business_id', $businessIds)
            ->where('status', 'completed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->count();

        $fees = FeeRule::query()
            ->where('status', 'active')
            ->whereIn('type', ['business_commission', 'event_commission', 'ad_promotion_fee', 'environmental_fee'])
            ->latest()
            ->get()
            ->map(function (FeeRule $rule) use ($monthlyRevenue, $completedOrders) {
                $estimated = 0.0;

                if ($rule->charge_basis === 'percent') {
                    $estimated = $monthlyRevenue * ((float) $rule->amount / 100);
                } else {
                    $estimated = ((float) $rule->amount) * max(1, $completedOrders);
                }

                if ($rule->minimum_amount !== null) {
                    $estimated = max($estimated, (float) $rule->minimum_amount);
                }

                return [
                    'id' => $rule->id,
                    'name' => $rule->name,
                    'type' => $rule->type,
                    'charge_basis' => $rule->charge_basis,
                    'amount' => $rule->amount,
                    'minimum_amount' => $rule->minimum_amount,
                    'description' => $rule->description,
                    'estimated_monthly_fee' => round($estimated, 2),
                ];
            });

        $estimatedTotal = (float) $fees->sum('estimated_monthly_fee');

        return Inertia::render('Owner/Fees/index', [
            'summary' => [
                'business_count' => count($businessIds),
                'monthly_revenue' => round($monthlyRevenue, 2),
                'completed_orders' => $completedOrders,
                'estimated_total_fees' => round($estimatedTotal, 2),
            ],
            'fees' => $fees->values(),
        ]);
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
}
