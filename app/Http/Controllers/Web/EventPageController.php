<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventPageController extends Controller
{
    /**
     * Display public events listing (published only).
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $sort = (string) $request->query('sort', 'starts_asc');

        $allowedSorts = ['starts_asc', 'starts_desc', 'latest', 'oldest'];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'starts_asc';
        }

        $events = Event::query()
            ->with('attraction:id,name,slug')
            ->where('status', 'published')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('venue_name', 'like', "%{$search}%")
                        ->orWhere('venue_address', 'like', "%{$search}%");
                });
            })
            ->when($sort === 'starts_asc', fn ($query) => $query->orderBy('starts_at'))
            ->when($sort === 'starts_desc', fn ($query) => $query->orderByDesc('starts_at'))
            ->when($sort === 'latest', fn ($query) => $query->latest())
            ->when($sort === 'oldest', fn ($query) => $query->oldest())
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => Str::limit(strip_tags($event->description), 170),
                'starts_at' => $event->starts_at?->toDateTimeString(),
                'ends_at' => $event->ends_at?->toDateTimeString(),
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'attraction' => $event->attraction?->name,
                'featured_image_url' => $event->featured_image_path
                    ? Media::url($event->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/events/index', [
            'events' => $events,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display event details to public users (published only).
     */
    public function show(string $slug): Response
    {
        $event = Event::query()
            ->with('attraction:id,name,slug')
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Event::query()
            ->with('attraction:id,name,slug')
            ->where('status', 'published')
            ->whereKeyNot($event->id)
            ->orderBy('starts_at')
            ->limit(4)
            ->get()
            ->map(fn (Event $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'starts_at' => $item->starts_at?->toDateTimeString(),
                'venue_name' => $item->venue_name,
                'venue_address' => $item->venue_address,
                'attraction' => $item->attraction?->name,
                'featured_image_url' => $item->featured_image_path
                    ? Media::url($item->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/events/show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description,
                'starts_at' => $event->starts_at?->toDateTimeString(),
                'ends_at' => $event->ends_at?->toDateTimeString(),
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'latitude' => $event->latitude,
                'longitude' => $event->longitude,
                'featured_image_url' => $event->featured_image_path
                    ? Media::url($event->featured_image_path)
                    : null,
                'attraction' => $event->attraction ? [
                    'name' => $event->attraction->name,
                    'slug' => $event->attraction->slug,
                ] : null,
            ],
            'related' => $related,
        ]);
    }
}
