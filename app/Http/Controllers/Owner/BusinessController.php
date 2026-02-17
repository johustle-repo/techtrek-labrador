<?php

namespace App\Http\Controllers\Owner;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\UpdateOwnedBusinessRequest;
use App\Models\Business;
use App\Models\Category;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use App\Support\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    /**
     * Display the owner's businesses.
     */
    public function index(): Response
    {
        $user = auth()->user();

        $businesses = Business::query()
            ->when(
                $user?->hasRole(UserRole::BUSINESS_OWNER),
                fn ($query) => $query->where('owner_user_id', $user?->id),
            )
            ->with('category')
            ->latest()
            ->paginate(12)
            ->through(fn (Business $business) => [
                'id' => $business->id,
                'name' => $business->name,
                'status' => $business->status,
                'category' => $business->category?->name,
                'address' => $business->address,
                'contact_email' => $business->contact_email,
                'contact_phone' => $business->contact_phone,
                'featured_image_url' => $business->featured_image_path
                    ? Media::url($business->featured_image_path)
                    : null,
                'updated_at' => $business->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('Owner/Businesses/index', [
            'businesses' => $businesses,
        ]);
    }

    /**
     * Show the form for editing one owned business.
     */
    public function edit(Business $business): Response
    {
        $this->ensureOwnership($business);

        return Inertia::render('Owner/Businesses/edit', [
            'business' => $business->only([
                'id',
                'name',
                'description',
                'contact_email',
                'contact_phone',
                'address',
                'category_id',
            ]),
            'featuredImageUrl' => $business->featured_image_path
                ? Media::url($business->featured_image_path)
                : null,
            'categories' => Category::query()
                ->where('type', 'business')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update one owned business.
     */
    public function update(UpdateOwnedBusinessRequest $request, Business $business): RedirectResponse
    {
        $this->ensureOwnership($business);

        $before = $business->getAttributes();
        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $data['address'] = InputSanitizer::plain($data['address'] ?? null);

        if ($request->hasFile('featured_image')) {
            if ($business->featured_image_path) {
                Storage::disk(Media::DISK)->delete($business->featured_image_path);
            }

            $data['featured_image_path'] = $request->file('featured_image')->store('businesses', Media::DISK);
        }

        unset($data['featured_image']);
        $business->update($data);
        $business->refresh();

        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'owner_businesses',
            targetId: $business->id,
            before: $before,
            after: $business->getAttributes(),
        );

        return to_route('owner.businesses.index')
            ->with('success', 'Business profile updated successfully.');
    }

    private function ensureOwnership(Business $business): void
    {
        $user = auth()->user();

        if ($user?->hasRole(UserRole::SUPER_ADMIN)) {
            return;
        }

        abort_unless(
            $user?->hasRole(UserRole::BUSINESS_OWNER) && $business->owner_user_id === $user->id,
            403
        );
    }
}
