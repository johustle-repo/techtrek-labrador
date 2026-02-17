<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Category;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessPageController extends Controller
{
    /**
     * Display public businesses listing (published only).
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $category = (string) $request->query('category', '');
        $sort = (string) $request->query('sort', 'latest');

        $allowedSorts = ['latest', 'oldest', 'name_asc', 'name_desc'];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'latest';
        }

        $businesses = Business::query()
            ->with(['category:id,name,slug'])
            ->where('status', 'published')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($category !== '', function ($query) use ($category) {
                $query->whereHas('category', function ($nested) use ($category) {
                    $nested->where('slug', $category);
                });
            })
            ->when($sort === 'latest', fn ($query) => $query->latest())
            ->when($sort === 'oldest', fn ($query) => $query->oldest())
            ->when($sort === 'name_asc', fn ($query) => $query->orderBy('name'))
            ->when($sort === 'name_desc', fn ($query) => $query->orderByDesc('name'))
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Business $business) => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'description' => Str::limit(strip_tags((string) $business->description), 170),
                'category' => $business->category?->name,
                'address' => $business->address,
                'contact_email' => $business->contact_email,
                'contact_phone' => $business->contact_phone,
                'featured_image_url' => $business->featured_image_path
                    ? Media::url($business->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/businesses/index', [
            'businesses' => $businesses,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort,
            ],
            'categories' => Category::query()
                ->where('type', 'business')
                ->orderBy('name')
                ->get(['name', 'slug']),
        ]);
    }

    /**
     * Display business details to public users (published only).
     */
    public function show(string $slug): Response
    {
        $business = Business::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Business::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->whereKeyNot($business->id)
            ->when($business->category_id, function ($query) use ($business) {
                $query->where('category_id', $business->category_id);
            })
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Business $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'category' => $item->category?->name,
                'address' => $item->address,
                'contact_email' => $item->contact_email,
                'contact_phone' => $item->contact_phone,
                'featured_image_url' => $item->featured_image_path
                    ? Media::url($item->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/businesses/show', [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'description' => $business->description,
                'category' => $business->category?->name,
                'address' => $business->address,
                'contact_email' => $business->contact_email,
                'contact_phone' => $business->contact_phone,
                'latitude' => $business->latitude,
                'longitude' => $business->longitude,
                'featured_image_url' => $business->featured_image_path
                    ? Media::url($business->featured_image_path)
                    : null,
            ],
            'related' => $related,
        ]);
    }
}
