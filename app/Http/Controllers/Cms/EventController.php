<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreEventRequest;
use App\Http\Requests\Cms\UpdateEventRequest;
use App\Models\Attraction;
use App\Models\Event;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Event::class);

        $events = Event::query()
            ->with('attraction')
            ->latest()
            ->paginate(12)
            ->through(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'starts_at' => $event->starts_at?->toDateTimeString(),
                'ends_at' => $event->ends_at?->toDateTimeString(),
                'venue_name' => $event->venue_name,
                'status' => $event->status,
                'attraction' => $event->attraction?->name,
                'featured_image_url' => $event->featured_image_path
                    ? Media::url($event->featured_image_path)
                    : null,
                'updated_at' => $event->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('cms/events/index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function create(): Response
    {
        $this->authorize('create', Event::class);

        return Inertia::render('cms/events/create', [
            'attractions' => Attraction::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        $this->authorize('create', Event::class);

        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['venue_name'] = InputSanitizer::plain($data['venue_name'] ?? null);
        $data['venue_address'] = InputSanitizer::plain($data['venue_address'] ?? null);

        $baseSlug = Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 2;

        while (Event::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $request->file('featured_image')->store('events', Media::DISK);
        }

        unset($data['featured_image']);

        $event = Event::create([
            ...$data,
            'slug' => $slug,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'events',
            targetId: $event->id,
            after: $event->getAttributes(),
        );

        return to_route('cms.events.index')
            ->with('success', 'Event created successfully.');
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(Event $event): Response
    {
        $this->authorize('update', $event);

        return Inertia::render('cms/events/edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'starts_at' => $event->starts_at?->format('Y-m-d\TH:i'),
                'ends_at' => $event->ends_at?->format('Y-m-d\TH:i'),
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'latitude' => $event->latitude,
                'longitude' => $event->longitude,
                'attraction_id' => $event->attraction_id,
                'status' => $event->status,
            ],
            'featuredImageUrl' => $event->featured_image_path
                ? Media::url($event->featured_image_path)
                : null,
            'attractions' => Attraction::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);

        $before = $event->getAttributes();
        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['venue_name'] = InputSanitizer::plain($data['venue_name'] ?? null);
        $data['venue_address'] = InputSanitizer::plain($data['venue_address'] ?? null);

        if ($event->title !== $data['title']) {
            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $counter = 2;

            while (Event::where('slug', $slug)->whereKeyNot($event->id)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $data['slug'] = $slug;
        }

        if ($request->hasFile('featured_image')) {
            if ($event->featured_image_path) {
                Storage::disk(Media::DISK)->delete($event->featured_image_path);
            }

            $data['featured_image_path'] = $request->file('featured_image')->store('events', Media::DISK);
        }

        unset($data['featured_image']);

        $event->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $event->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'events',
            targetId: $event->id,
            before: $before,
            after: $event->getAttributes(),
        );

        return to_route('cms.events.index')
            ->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(Request $request, Event $event): RedirectResponse
    {
        $this->authorize('delete', $event);

        $before = $event->getAttributes();

        if ($event->featured_image_path) {
            Storage::disk(Media::DISK)->delete($event->featured_image_path);
        }

        $event->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'events',
            targetId: $event->id,
            before: $before,
        );

        return to_route('cms.events.index')
            ->with('success', 'Event deleted successfully.');
    }
}
