<?php

namespace App\Http\Controllers\Owner;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\BusinessProduct;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the business owner dashboard.
     */
    public function index(): Response
    {
        $user = auth()->user();

        $businessesQuery = Business::query()
            ->when(
                $user?->hasRole(UserRole::BUSINESS_OWNER),
                fn ($query) => $query->where('owner_user_id', $user?->id),
            );

        $businessIds = (clone $businessesQuery)->pluck('id');

        $metrics = [
            'total_products' => BusinessProduct::query()
                ->whereIn('business_id', $businessIds)
                ->where('is_service', false)
                ->count(),
            'total_services' => BusinessProduct::query()
                ->whereIn('business_id', $businessIds)
                ->where('is_service', true)
                ->count(),
            'total_earnings' => (float) BusinessOrder::query()
                ->whereIn('business_id', $businessIds)
                ->where('status', 'completed')
                ->sum('total_amount'),
            'pending_requests' => BusinessOrder::query()
                ->whereIn('business_id', $businessIds)
                ->where('status', 'pending')
                ->count(),
            'pending_today' => BusinessOrder::query()
                ->whereIn('business_id', $businessIds)
                ->where('status', 'pending')
                ->whereDate('created_at', now()->toDateString())
                ->count(),
        ];

        $latestBusinesses = (clone $businessesQuery)
            ->latest('updated_at')
            ->limit(5)
            ->get(['id', 'name', 'status', 'updated_at'])
            ->map(fn (Business $business) => [
                'id' => $business->id,
                'name' => $business->name,
                'status' => $business->status,
                'updated_at' => $business->updated_at?->toDateTimeString(),
            ]);

        $upcomingEvents = Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at')
            ->limit(4)
            ->get(['id', 'title', 'starts_at', 'venue_name'])
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'starts_at' => $event->starts_at?->toDateTimeString(),
                'venue_name' => $event->venue_name,
            ]);

        $announcements = Announcement::query()
            ->where('status', 'published')
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->limit(4)
            ->get(['id', 'title', 'published_at', 'is_pinned'])
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'published_at' => $announcement->published_at?->toDateTimeString(),
                'is_pinned' => $announcement->is_pinned,
            ]);

        $pendingRequests = BusinessOrder::query()
            ->with(['business:id,name', 'product:id,name'])
            ->whereIn('business_id', $businessIds)
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (BusinessOrder $order) => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'business_name' => $order->business?->name,
                'product_name' => $order->product?->name ?? $order->order_type,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Owner/Dashboard', [
            'metrics' => $metrics,
            'latest_businesses' => $latestBusinesses,
            'upcoming_events' => $upcomingEvents,
            'announcements' => $announcements,
            'pending_requests' => $pendingRequests,
        ]);
    }
}
