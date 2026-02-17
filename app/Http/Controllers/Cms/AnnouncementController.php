<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreAnnouncementRequest;
use App\Http\Requests\Cms\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of announcements.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Announcement::class);

        $announcements = Announcement::query()
            ->latest()
            ->paginate(12)
            ->through(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'is_pinned' => $announcement->is_pinned,
                'status' => $announcement->status,
                'published_at' => $announcement->published_at?->toDateTimeString(),
                'updated_at' => $announcement->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('cms/announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Show the form for creating a new announcement.
     */
    public function create(): Response
    {
        $this->authorize('create', Announcement::class);

        return Inertia::render('cms/announcements/create');
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $this->authorize('create', Announcement::class);

        $data = $request->validated();
        $data['content'] = InputSanitizer::plain($data['content'] ?? null);

        $announcement = Announcement::create([
            ...$data,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'announcements',
            targetId: $announcement->id,
            after: $announcement->getAttributes(),
        );

        return to_route('cms.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Show the form for editing the specified announcement.
     */
    public function edit(Announcement $announcement): Response
    {
        $this->authorize('update', $announcement);

        return Inertia::render('cms/announcements/edit', [
            'announcement' => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'content' => $announcement->content,
                'is_pinned' => $announcement->is_pinned,
                'status' => $announcement->status,
                'published_at' => $announcement->published_at?->format('Y-m-d\TH:i'),
            ],
        ]);
    }

    /**
     * Update the specified announcement in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $this->authorize('update', $announcement);

        $before = $announcement->getAttributes();
        $data = $request->validated();
        $data['content'] = InputSanitizer::plain($data['content'] ?? null);

        $announcement->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $announcement->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'announcements',
            targetId: $announcement->id,
            before: $before,
            after: $announcement->getAttributes(),
        );

        return to_route('cms.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified announcement from storage.
     */
    public function destroy(Request $request, Announcement $announcement): RedirectResponse
    {
        $this->authorize('delete', $announcement);

        $before = $announcement->getAttributes();
        $announcement->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'announcements',
            targetId: $announcement->id,
            before: $before,
        );

        return to_route('cms.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
