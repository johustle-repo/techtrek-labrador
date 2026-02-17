<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\AuditLog;
use App\Models\Business;
use App\Models\Event;
use App\Support\Media;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the CMS dashboard summary for LGU and super admin users.
     */
    public function index(): Response
    {
        $now = now();
        $jsonRouteName = DB::connection()->getDriverName() === 'sqlite'
            ? "json_extract(after_json, '$.route_name')"
            : "JSON_UNQUOTE(JSON_EXTRACT(after_json, '$.route_name'))";

        $buildMetrics = function (string $modelClass): array {
            return [
                'total' => $modelClass::count(),
                'published' => $modelClass::where('status', 'published')->count(),
                'draft' => $modelClass::where('status', 'draft')->count(),
                'archived' => $modelClass::where('status', 'archived')->count(),
            ];
        };

        return Inertia::render('cms/dashboard', [
            'metrics' => [
                'attractions' => $buildMetrics(Attraction::class),
                'events' => $buildMetrics(Event::class),
                'businesses' => $buildMetrics(Business::class),
                'announcements' => $buildMetrics(Announcement::class),
            ],
            'upcoming_events' => Event::query()
                ->where('status', 'published')
                ->where('starts_at', '>=', $now)
                ->orderBy('starts_at')
                ->limit(6)
                ->get(['id', 'title', 'starts_at', 'venue_name', 'status', 'featured_image_path'])
                ->map(fn (Event $event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'starts_at' => $event->starts_at?->toDateTimeString(),
                    'venue_name' => $event->venue_name,
                    'status' => $event->status,
                    'featured_image_url' => $event->featured_image_path
                        ? Media::url($event->featured_image_path)
                        : null,
                ]),
            'recent_announcements' => Announcement::query()
                ->where('status', 'published')
                ->where(function ($query) use ($now) {
                    $query->whereNull('published_at')
                        ->orWhere('published_at', '<=', $now);
                })
                ->orderByDesc('is_pinned')
                ->orderByDesc('published_at')
                ->limit(6)
                ->get(['id', 'title', 'is_pinned', 'published_at', 'status'])
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'is_pinned' => $announcement->is_pinned,
                    'published_at' => $announcement->published_at?->toDateTimeString(),
                    'status' => $announcement->status,
                ]),
            'visitor_insights' => [
                'today_views' => AuditLog::query()
                    ->where('action', 'view')
                    ->where('module', 'visitor_page')
                    ->whereDate('created_at', $now->toDateString())
                    ->count(),
                'week_views' => AuditLog::query()
                    ->where('action', 'view')
                    ->where('module', 'visitor_page')
                    ->where('created_at', '>=', $now->copy()->subDays(7))
                    ->count(),
                'week_unique_visitors' => AuditLog::query()
                    ->where('action', 'view')
                    ->where('module', 'visitor_page')
                    ->whereNotNull('actor_user_id')
                    ->where('created_at', '>=', $now->copy()->subDays(7))
                    ->distinct('actor_user_id')
                    ->count('actor_user_id'),
                'top_pages' => AuditLog::query()
                    ->selectRaw("{$jsonRouteName} as route_name")
                    ->selectRaw('COUNT(*) as total')
                    ->where('action', 'view')
                    ->where('module', 'visitor_page')
                    ->where('created_at', '>=', $now->copy()->subDays(7))
                    ->groupBy('route_name')
                    ->orderByDesc('total')
                    ->limit(5)
                    ->get()
                    ->map(fn ($row) => [
                        'route_name' => $row->route_name,
                        'total' => (int) $row->total,
                    ]),
            ],
        ]);
    }
}
