<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\BusinessProduct;
use App\Support\Media;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopPageController extends Controller
{
    /**
     * Display published products/services from active local businesses.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $type = (string) $request->query('type', 'all');
        $allowedTypes = ['all', 'product', 'service'];

        if (! in_array($type, $allowedTypes, true)) {
            $type = 'all';
        }

        $products = BusinessProduct::query()
            ->with('business:id,name,slug,status,latitude,longitude')
            ->where('status', 'active')
            ->whereHas('business', function ($query) {
                $query->where('status', 'published');
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->when($type === 'product', fn ($query) => $query->where('is_service', false))
            ->when($type === 'service', fn ($query) => $query->where('is_service', true))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (BusinessProduct $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'price' => $item->price,
                'is_service' => $item->is_service,
                'business_name' => $item->business?->name,
                'business_slug' => $item->business?->slug,
                'business_latitude' => $item->business?->latitude,
                'business_longitude' => $item->business?->longitude,
                'featured_image_url' => $item->featured_image_path
                    ? Media::url($item->featured_image_path)
                    : null,
            ]);

        return Inertia::render('public/shops/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ],
            'counts' => [
                'all' => BusinessProduct::query()
                    ->where('status', 'active')
                    ->whereHas('business', fn ($query) => $query->where('status', 'published'))
                    ->count(),
                'products' => BusinessProduct::query()
                    ->where('status', 'active')
                    ->where('is_service', false)
                    ->whereHas('business', fn ($query) => $query->where('status', 'published'))
                    ->count(),
                'services' => BusinessProduct::query()
                    ->where('status', 'active')
                    ->where('is_service', true)
                    ->whereHas('business', fn ($query) => $query->where('status', 'published'))
                    ->count(),
            ],
        ]);
    }
}
