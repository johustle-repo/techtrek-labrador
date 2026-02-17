<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Attraction;
use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MapPageController extends Controller
{
    /**
     * Display map view with geotagged attractions and businesses.
     */
    public function index(Request $request): Response
    {
        $focusType = (string) $request->query('type', 'all');
        $focusSlug = trim((string) $request->query('slug', ''));

        $attractions = Attraction::query()
            ->with('category:id,name')
            ->where('status', 'published')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderBy('name')
            ->get()
            ->map(fn (Attraction $item) => [
                'id' => $item->id,
                'type' => 'attraction',
                'name' => $item->name,
                'slug' => $item->slug,
                'category' => $item->category?->name,
                'address' => $item->address,
                'latitude' => $item->latitude,
                'longitude' => $item->longitude,
                'href' => '/attractions/'.$item->slug,
            ]);

        $businesses = Business::query()
            ->with('category:id,name')
            ->where('status', 'published')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderBy('name')
            ->get()
            ->map(fn (Business $item) => [
                'id' => $item->id,
                'type' => 'business',
                'name' => $item->name,
                'slug' => $item->slug,
                'category' => $item->category?->name,
                'address' => $item->address,
                'latitude' => $item->latitude,
                'longitude' => $item->longitude,
                'href' => '/businesses/'.$item->slug,
            ]);

        $markers = $attractions->concat($businesses)->values();

        $defaultLat = 16.015;
        $defaultLng = 120.113;

        if ($markers->isNotEmpty()) {
            $defaultLat = (float) $markers->avg('latitude');
            $defaultLng = (float) $markers->avg('longitude');
        }

        $selectedMarker = null;
        if ($focusSlug !== '' && in_array($focusType, ['attraction', 'business'], true)) {
            $selectedMarker = $markers->first(function (array $marker) use ($focusType, $focusSlug) {
                return $marker['type'] === $focusType && $marker['slug'] === $focusSlug;
            });
        }

        if ($selectedMarker) {
            $defaultLat = (float) $selectedMarker['latitude'];
            $defaultLng = (float) $selectedMarker['longitude'];
        }

        return Inertia::render('public/map/index', [
            'markers' => $markers,
            'counts' => [
                'attractions' => $attractions->count(),
                'businesses' => $businesses->count(),
                'total' => $markers->count(),
            ],
            'center' => [
                'latitude' => $defaultLat,
                'longitude' => $defaultLng,
            ],
            'focus' => [
                'type' => $selectedMarker['type'] ?? null,
                'id' => $selectedMarker['id'] ?? null,
            ],
        ]);
    }
}
