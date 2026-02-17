<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\Business;
use App\Models\Event;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    /**
     * Display draft records awaiting moderation/publish review.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Attraction::class);
        $this->authorize('viewAny', Event::class);
        $this->authorize('viewAny', Business::class);
        $this->authorize('viewAny', Announcement::class);

        $attractions = Attraction::query()
            ->where('status', 'draft')
            ->latest('updated_at')
            ->get(['id', 'name', 'updated_at'])
            ->map(fn (Attraction $item) => [
                'id' => $item->id,
                'module' => 'attractions',
                'title' => $item->name,
                'status' => 'draft',
                'updated_at' => $item->updated_at?->toDateTimeString(),
                'edit_url' => '/cms/attractions/'.$item->id.'/edit',
            ]);

        $events = Event::query()
            ->where('status', 'draft')
            ->latest('updated_at')
            ->get(['id', 'title', 'updated_at'])
            ->map(fn (Event $item) => [
                'id' => $item->id,
                'module' => 'events',
                'title' => $item->title,
                'status' => 'draft',
                'updated_at' => $item->updated_at?->toDateTimeString(),
                'edit_url' => '/cms/events/'.$item->id.'/edit',
            ]);

        $businesses = Business::query()
            ->where('status', 'draft')
            ->latest('updated_at')
            ->get(['id', 'name', 'updated_at'])
            ->map(fn (Business $item) => [
                'id' => $item->id,
                'module' => 'businesses',
                'title' => $item->name,
                'status' => 'draft',
                'updated_at' => $item->updated_at?->toDateTimeString(),
                'edit_url' => '/cms/businesses/'.$item->id.'/edit',
            ]);

        $announcements = Announcement::query()
            ->where('status', 'draft')
            ->latest('updated_at')
            ->get(['id', 'title', 'updated_at'])
            ->map(fn (Announcement $item) => [
                'id' => $item->id,
                'module' => 'announcements',
                'title' => $item->title,
                'status' => 'draft',
                'updated_at' => $item->updated_at?->toDateTimeString(),
                'edit_url' => '/cms/announcements/'.$item->id.'/edit',
            ]);

        $queue = collect()
            ->concat($attractions)
            ->concat($events)
            ->concat($businesses)
            ->concat($announcements)
            ->sortByDesc('updated_at')
            ->values();

        return Inertia::render('cms/moderation/index', [
            'queue' => $queue,
            'counts' => [
                'total' => $queue->count(),
                'attractions' => $attractions->count(),
                'events' => $events->count(),
                'businesses' => $businesses->count(),
                'announcements' => $announcements->count(),
            ],
        ]);
    }
}
