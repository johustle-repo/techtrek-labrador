<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\AuditLog;
use App\Models\Business;
use App\Models\BusinessProduct;
use App\Models\Event;
use App\Support\Media;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $jsonRouteName = DB::connection()->getDriverName() === 'sqlite'
            ? "json_extract(after_json, '$.route_name')"
            : "JSON_UNQUOTE(JSON_EXTRACT(after_json, '$.route_name'))";

        $featuredAttractions = Attraction::query()
            ->where('status', 'published')
            ->latest()
            ->limit(3)
            ->get(['id', 'name', 'slug', 'description', 'featured_image_path'])
            ->map(fn (Attraction $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => Str::limit(strip_tags((string) $item->description), 110),
                'featured_image_url' => Media::url($item->featured_image_path),
            ]);

        $upcomingEvents = Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>=', $now)
            ->orderBy('starts_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'starts_at', 'venue_name'])
            ->map(fn (Event $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'starts_at' => $item->starts_at?->toDateTimeString(),
                'venue_name' => $item->venue_name,
            ]);

        $latestAnnouncements = Announcement::query()
            ->where('status', 'published')
            ->where(function ($query) use ($now) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', $now);
            })
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get(['id', 'title', 'published_at', 'is_pinned'])
            ->map(fn (Announcement $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'published_at' => $item->published_at?->toDateTimeString(),
                'is_pinned' => $item->is_pinned,
            ]);

        $featuredProducts = BusinessProduct::query()
            ->with('business:id,name,slug,status')
            ->where('status', 'active')
            ->whereHas('business', function ($query) {
                $query->where('status', 'published');
            })
            ->latest()
            ->limit(6)
            ->get(['id', 'business_id', 'name', 'slug', 'category', 'price', 'is_service', 'featured_image_path'])
            ->map(fn (BusinessProduct $item) => [
                'id' => $item->id,
                'business_name' => $item->business?->name,
                'business_slug' => $item->business?->slug,
                'name' => $item->name,
                'slug' => $item->slug,
                'category' => $item->category,
                'price' => $item->price,
                'is_service' => $item->is_service,
                'featured_image_url' => Media::url($item->featured_image_path),
            ]);

        $recentActivity = AuditLog::query()
            ->where('actor_user_id', auth()->id())
            ->where('action', 'view')
            ->where('module', 'visitor_page')
            ->latest()
            ->limit(6)
            ->get(['id', 'after_json', 'created_at'])
            ->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'route_name' => $log->after_json['route_name'] ?? null,
                'path' => $log->after_json['path'] ?? null,
                'visited_at' => $log->created_at?->toDateTimeString(),
            ]);

        $topPages = AuditLog::query()
            ->selectRaw("{$jsonRouteName} as route_name")
            ->selectRaw('COUNT(*) as total')
            ->where('actor_user_id', auth()->id())
            ->where('action', 'view')
            ->where('module', 'visitor_page')
            ->groupBy('route_name')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'route_name' => $row->route_name,
                'total' => (int) $row->total,
            ]);

        return Inertia::render('visitor/home', [
            'stats' => [
                'attractions' => Attraction::where('status', 'published')->count(),
                'events' => Event::where('status', 'published')->count(),
                'businesses' => Business::where('status', 'published')->count(),
                'upcoming_events' => Event::where('status', 'published')
                    ->where('starts_at', '>=', $now)
                    ->count(),
            ],
            'featured_attractions' => $featuredAttractions,
            'upcoming_events' => $upcomingEvents,
            'announcements' => $latestAnnouncements,
            'featured_products' => $featuredProducts,
            'recent_activity' => $recentActivity,
            'top_pages' => $topPages,
            'quick_facts' => [
                'Population (2020)' => '26,811',
                'Barangays' => '10',
                'Land Area' => '90.99 km2',
                'Province' => 'Pangasinan',
            ],
            'about' => [
                'summary' => 'Labrador is a coastal municipality in Pangasinan, Region I, known for beaches, local food culture, and community-based tourism growth.',
                'highlights' => [
                    'Gateway to shoreline destinations and sunset viewpoints',
                    'Home to local businesses offering food, stays, and services',
                    'Municipal events and advisories are published in one portal',
                    'Interactive map helps visitors plan routes efficiently',
                ],
            ],
        ]);
    }
}
