<?php

namespace App\Http\Controllers\Owner;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\StoreOwnedProductRequest;
use App\Http\Requests\Owner\UpdateOwnedProductRequest;
use App\Models\Business;
use App\Models\BusinessProduct;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use App\Support\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = BusinessProduct::query()
            ->with('business:id,name')
            ->whereIn('business_id', $this->ownedBusinessIds())
            ->latest()
            ->paginate(12)
            ->through(fn (BusinessProduct $product) => [
                'id' => $product->id,
                'business' => $product->business?->name,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'is_service' => $product->is_service,
                'status' => $product->status,
                'featured_image_url' => $product->featured_image_path
                    ? Media::url($product->featured_image_path)
                    : null,
                'updated_at' => $product->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('Owner/Products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Owner/Products/create', [
            'businesses' => $this->ownedBusinesses(),
        ]);
    }

    public function store(StoreOwnedProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->ensureBusinessAllowed((int) $data['business_id']);

        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $counter = 2;

        while (BusinessProduct::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $request->file('featured_image')->store('business-products', Media::DISK);
        }
        unset($data['featured_image']);

        $product = BusinessProduct::create([
            ...$data,
            'slug' => $slug,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'owner_products',
            targetId: $product->id,
            after: $product->getAttributes(),
        );

        return to_route('owner.products.index')->with('success', 'Product/service created.');
    }

    public function edit(BusinessProduct $product): Response
    {
        $this->ensureBusinessAllowed($product->business_id);

        return Inertia::render('Owner/Products/edit', [
            'product' => [
                'id' => $product->id,
                'business_id' => $product->business_id,
                'name' => $product->name,
                'description' => $product->description,
                'category' => $product->category,
                'featured_image_url' => $product->featured_image_path
                    ? Media::url($product->featured_image_path)
                    : null,
                'price' => (string) $product->price,
                'is_service' => $product->is_service,
                'status' => $product->status,
            ],
            'businesses' => $this->ownedBusinesses(),
        ]);
    }

    public function update(UpdateOwnedProductRequest $request, BusinessProduct $product): RedirectResponse
    {
        $this->ensureBusinessAllowed($product->business_id);

        $data = $request->validated();
        $this->ensureBusinessAllowed((int) $data['business_id']);
        $before = $product->getAttributes();

        $data['description'] = InputSanitizer::plain($data['description'] ?? null);
        if ($product->name !== $data['name']) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 2;

            while (BusinessProduct::where('slug', $slug)->whereKeyNot($product->id)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $data['slug'] = $slug;
        }

        if ($request->hasFile('featured_image')) {
            if ($product->featured_image_path) {
                Storage::disk(Media::DISK)->delete($product->featured_image_path);
            }

            $data['featured_image_path'] = $request->file('featured_image')->store('business-products', Media::DISK);
        }
        unset($data['featured_image']);

        $product->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $product->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'owner_products',
            targetId: $product->id,
            before: $before,
            after: $product->getAttributes(),
        );

        return to_route('owner.products.index')->with('success', 'Product/service updated.');
    }

    public function destroy(Request $request, BusinessProduct $product): RedirectResponse
    {
        $this->ensureBusinessAllowed($product->business_id);

        $before = $product->getAttributes();

        if ($product->featured_image_path) {
            Storage::disk(Media::DISK)->delete($product->featured_image_path);
        }

        $product->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'owner_products',
            targetId: $before['id'] ?? null,
            before: $before,
        );

        return to_route('owner.products.index')->with('success', 'Product/service deleted.');
    }

    /**
     * @return array<int, int>
     */
    private function ownedBusinessIds(): array
    {
        $user = auth()->user();

        if ($user?->hasRole(UserRole::SUPER_ADMIN)) {
            return Business::query()->pluck('id')->all();
        }

        return Business::query()
            ->where('owner_user_id', $user?->id)
            ->pluck('id')
            ->all();
    }

    private function ensureBusinessAllowed(int $businessId): void
    {
        abort_unless(in_array($businessId, $this->ownedBusinessIds(), true), 403);
    }

    private function ownedBusinesses()
    {
        return Business::query()
            ->whereIn('id', $this->ownedBusinessIds())
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
