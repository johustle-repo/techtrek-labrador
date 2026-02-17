<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\BusinessOrder;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $ownerAlerts = [
            'pending_today' => 0,
            'pending_total' => 0,
        ];

        $user = $request->user();
        if ($user?->hasRole(UserRole::BUSINESS_OWNER)) {
            $businessIds = Business::query()
                ->where('owner_user_id', $user->id)
                ->pluck('id');

            $ownerAlerts = [
                'pending_today' => BusinessOrder::query()
                    ->whereIn('business_id', $businessIds)
                    ->where('status', 'pending')
                    ->whereDate('created_at', now()->toDateString())
                    ->count(),
                'pending_total' => BusinessOrder::query()
                    ->whereIn('business_id', $businessIds)
                    ->where('status', 'pending')
                    ->count(),
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'owner_alerts' => $ownerAlerts,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
