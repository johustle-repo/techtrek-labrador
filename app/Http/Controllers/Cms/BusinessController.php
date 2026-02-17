<?php

namespace App\Http\Controllers\Cms;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreBusinessRequest;
use App\Http\Requests\Cms\UpdateBusinessRequest;
use App\Models\Business;
use App\Models\Category;
use App\Models\User;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    /**
     * Display a listing of businesses.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Business::class);

        $businesses = Business::query()
            ->with(['category', 'owner'])
            ->latest()
            ->paginate(12)
            ->through(fn (Business $business) => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'contact_email' => $business->contact_email,
                'contact_phone' => $business->contact_phone,
                'address' => $business->address,
                'status' => $business->status,
                'category' => $business->category?->name,
                'owner' => $business->owner?->name,
                'featured_image_url' => $business->featured_image_path
                    ? Media::url($business->featured_image_path)
                    : null,
                'updated_at' => $business->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('cms/businesses/index', [
            'businesses' => $businesses,
        ]);
    }

    /**
     * Show the form for creating a new business.
     */
    public function create(): Response
    {
        $this->authorize('create', Business::class);

        return Inertia::render('cms/businesses/create', [
            'categories' => Category::query()
                ->where('type', 'business')
                ->orderBy('name')
                ->get(['id', 'name']),
            'owners' => User::query()
                ->where('role', UserRole::BUSINESS_OWNER->value)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    /**
     * Store a newly created business in storage.
     */
    public function store(StoreBusinessRequest $request): RedirectResponse
    {
        $this->authorize('create', Business::class);

        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['address'] = InputSanitizer::plain($data['address'] ?? null);

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $counter = 2;

        while (Business::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $request->file('featured_image')->store('businesses', Media::DISK);
        }

        unset($data['featured_image']);

        $business = Business::create([
            ...$data,
            'slug' => $slug,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'businesses',
            targetId: $business->id,
            after: $business->getAttributes(),
        );

        return to_route('cms.businesses.index')
            ->with('success', 'Business created successfully.');
    }

    /**
     * Show the form for editing the specified business.
     */
    public function edit(Business $business): Response
    {
        $this->authorize('update', $business);

        return Inertia::render('cms/businesses/edit', [
            'business' => $business->only([
                'id',
                'name',
                'description',
                'owner_user_id',
                'contact_email',
                'contact_phone',
                'address',
                'latitude',
                'longitude',
                'category_id',
                'status',
            ]),
            'featuredImageUrl' => $business->featured_image_path
                ? Media::url($business->featured_image_path)
                : null,
            'categories' => Category::query()
                ->where('type', 'business')
                ->orderBy('name')
                ->get(['id', 'name']),
            'owners' => User::query()
                ->where('role', UserRole::BUSINESS_OWNER->value)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    /**
     * Update the specified business in storage.
     */
    public function update(UpdateBusinessRequest $request, Business $business): RedirectResponse
    {
        $this->authorize('update', $business);

        $before = $business->getAttributes();
        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['address'] = InputSanitizer::plain($data['address'] ?? null);

        if ($business->name !== $data['name']) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 2;

            while (Business::where('slug', $slug)->whereKeyNot($business->id)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $data['slug'] = $slug;
        }

        if ($request->hasFile('featured_image')) {
            if ($business->featured_image_path) {
                Storage::disk(Media::DISK)->delete($business->featured_image_path);
            }

            $data['featured_image_path'] = $request->file('featured_image')->store('businesses', Media::DISK);
        }

        unset($data['featured_image']);

        $business->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $business->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'businesses',
            targetId: $business->id,
            before: $before,
            after: $business->getAttributes(),
        );

        return to_route('cms.businesses.index')
            ->with('success', 'Business updated successfully.');
    }

    /**
     * Remove the specified business from storage.
     */
    public function destroy(Request $request, Business $business): RedirectResponse
    {
        $this->authorize('delete', $business);

        $before = $business->getAttributes();

        if ($business->featured_image_path) {
            Storage::disk(Media::DISK)->delete($business->featured_image_path);
        }

        $business->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'businesses',
            targetId: $business->id,
            before: $before,
        );

        return to_route('cms.businesses.index')
            ->with('success', 'Business deleted successfully.');
    }
}
