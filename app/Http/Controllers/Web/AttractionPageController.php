<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Attraction;
use App\Models\Category;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AttractionPageController extends Controller
{
    /**
     * Display public attractions listing (published only).
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

        $attractions = Attraction::query()
            ->with('category:id,name,slug')
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
            ->through(fn (Attraction $attraction) => [
                'id' => $attraction->id,
                'name' => $attraction->name,
                'slug' => $attraction->slug,
                'description' => Str::limit(strip_tags($attraction->description), 180),
                'address' => $attraction->address,
                'environmental_fee' => $attraction->environmental_fee,
                'category' => $attraction->category?->name,
                'featured_image_url' => $attraction->featured_image_path
                    ? Media::url($attraction->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/attractions/index', [
            'attractions' => $attractions,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort,
            ],
            'categories' => Category::query()
                ->where('type', 'attraction')
                ->orderBy('name')
                ->get(['name', 'slug']),
        ]);
    }

    /**
     * Display attraction details to public users (published only).
     */
    public function show(string $slug): Response
    {
        $attraction = Attraction::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Attraction::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->whereKeyNot($attraction->id)
            ->when($attraction->category_id, function ($query) use ($attraction) {
                $query->where('category_id', $attraction->category_id);
            })
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Attraction $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'address' => $item->address,
                'category' => $item->category?->name,
                'featured_image_url' => $item->featured_image_path
                    ? Media::url($item->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/attractions/show', [
            'attraction' => [
                'id' => $attraction->id,
                'name' => $attraction->name,
                'slug' => $attraction->slug,
                'description' => $attraction->description,
                'address' => $attraction->address,
                'latitude' => $attraction->latitude,
                'longitude' => $attraction->longitude,
                'environmental_fee' => $attraction->environmental_fee,
                'category' => $attraction->category?->name,
                'featured_image_url' => $attraction->featured_image_path
                    ? Media::url($attraction->featured_image_path)
                    : null,
            ],
            'related' => $related,
        ]);
    }
}
