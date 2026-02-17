<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreAttractionRequest;
use App\Http\Requests\Cms\UpdateAttractionRequest;
use App\Models\Attraction;
use App\Models\Category;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use App\Support\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttractionController extends Controller
{
    /**
     * Display a listing of attractions.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Attraction::class);

        $attractions = Attraction::query()
            ->with(['category', 'creator'])
            ->latest()
            ->paginate(12)
            ->through(fn (Attraction $attraction) => [
                'id' => $attraction->id,
                'name' => $attraction->name,
                'slug' => $attraction->slug,
                'address' => $attraction->address,
                'status' => $attraction->status,
                'category' => $attraction->category?->name,
                'featured_image_url' => $attraction->featured_image_path
                    ? Media::url($attraction->featured_image_path)
                    : null,
                'updated_at' => $attraction->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('cms/attractions/index', [
            'attractions' => $attractions,
        ]);
    }

    /**
     * Show the form for creating a new attraction.
     */
    public function create(): Response
    {
        $this->authorize('create', Attraction::class);

        return Inertia::render('cms/attractions/create', [
            'categories' => Category::query()
                ->where('type', 'attraction')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created attraction in storage.
     */
    public function store(StoreAttractionRequest $request): RedirectResponse
    {
        $this->authorize('create', Attraction::class);

        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['address'] = InputSanitizer::plain($data['address'] ?? null);

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $counter = 2;

        while (Attraction::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $request->file('featured_image')->store('attractions', Media::DISK);
        }

        unset($data['featured_image']);

        $attraction = Attraction::create([
            ...$data,
            'slug' => $slug,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'attractions',
            targetId: $attraction->id,
            after: $attraction->getAttributes(),
        );

        return to_route('cms.attractions.index')
            ->with('success', 'Attraction created successfully.');
    }

    /**
     * Show the form for editing the specified attraction.
     */
    public function edit(Attraction $attraction): Response
    {
        $this->authorize('update', $attraction);

        return Inertia::render('cms/attractions/edit', [
            'attraction' => $attraction->only([
                'id',
                'name',
                'description',
                'address',
                'latitude',
                'longitude',
                'category_id',
                'status',
            ]),
            'featuredImageUrl' => $attraction->featured_image_path
                ? Media::url($attraction->featured_image_path)
                : null,
            'categories' => Category::query()
                ->where('type', 'attraction')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified attraction in storage.
     */
    public function update(UpdateAttractionRequest $request, Attraction $attraction): RedirectResponse
    {
        $this->authorize('update', $attraction);

        $before = $attraction->getAttributes();
        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['address'] = InputSanitizer::plain($data['address'] ?? null);

        if ($attraction->name !== $data['name']) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 2;

            while (Attraction::where('slug', $slug)->whereKeyNot($attraction->id)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $data['slug'] = $slug;
        }

        if ($request->hasFile('featured_image')) {
            if ($attraction->featured_image_path) {
                Storage::disk(Media::DISK)->delete($attraction->featured_image_path);
            }

            $data['featured_image_path'] = $request->file('featured_image')->store('attractions', Media::DISK);
        }

        unset($data['featured_image']);

        $attraction->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $attraction->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'attractions',
            targetId: $attraction->id,
            before: $before,
            after: $attraction->getAttributes(),
        );

        return to_route('cms.attractions.index')
            ->with('success', 'Attraction updated successfully.');
    }

    /**
     * Remove the specified attraction from storage.
     */
    public function destroy(Request $request, Attraction $attraction): RedirectResponse
    {
        $this->authorize('delete', $attraction);

        $before = $attraction->getAttributes();

        if ($attraction->featured_image_path) {
            Storage::disk(Media::DISK)->delete($attraction->featured_image_path);
        }

        $attraction->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'attractions',
            targetId: $attraction->id,
            before: $before,
        );

        return to_route('cms.attractions.index')
            ->with('success', 'Attraction deleted successfully.');
    }
}
