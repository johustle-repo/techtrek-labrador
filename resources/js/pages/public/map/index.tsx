import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, MapPin, Mountain } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type Marker = {
    id: number;
    type: 'attraction' | 'business';
    name: string;
    slug: string;
    category: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    href: string;
};

type Props = {
    markers: Marker[];
    counts: {
        attractions: number;
        businesses: number;
        total: number;
    };
    center: {
        latitude: number;
        longitude: number;
    };
    focus: {
        type: 'attraction' | 'business' | null;
        id: number | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Map', href: '/map' },
];

function buildEmbedUrl(lat: number, lng: number, delta = 0.025) {
    const lonMin = lng - delta;
    const latMin = lat - delta;
    const lonMax = lng + delta;
    const latMax = lat + delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${lonMin}%2C${latMin}%2C${lonMax}%2C${latMax}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function PublicMapIndex({ markers, counts, center, focus }: Props) {
    const initialType = focus.type === 'attraction' || focus.type === 'business' ? focus.type : 'all';
    const initialSelected = focus.id ?? markers[0]?.id ?? null;

    const [activeType, setActiveType] = useState<'all' | 'attraction' | 'business'>(initialType);
    const [selectedId, setSelectedId] = useState<number | null>(initialSelected);

    const filtered = useMemo(() => {
        if (activeType === 'all') return markers;
        return markers.filter((item) => item.type === activeType);
    }, [markers, activeType]);

    const selected = useMemo(() => {
        const inFiltered = filtered.find((item) => item.id === selectedId);
        if (inFiltered) return inFiltered;
        return filtered[0] ?? null;
    }, [filtered, selectedId]);

    const mapLat = selected?.latitude ?? center.latitude;
    const mapLng = selected?.longitude ?? center.longitude;
    const mapUrl = buildEmbedUrl(mapLat, mapLng, selected ? 0.015 : 0.03);
    const fullMapUrl = `https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLng}#map=14/${mapLat}/${mapLng}`;

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Interactive Map | TechTrek Labrador" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            TechTrek Labrador
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                            Interactive Location Map
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 md:text-base">
                            Explore geotagged attractions and local businesses in Labrador, Pangasinan.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-full border bg-white px-3 py-1.5">
                                Total points: <strong>{counts.total}</strong>
                            </span>
                            <span className="rounded-full border bg-white px-3 py-1.5">
                                Attractions: <strong>{counts.attractions}</strong>
                            </span>
                            <span className="rounded-full border bg-white px-3 py-1.5">
                                Businesses: <strong>{counts.businesses}</strong>
                            </span>
                        </div>
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                            <iframe
                                title="Labrador interactive map"
                                src={mapUrl}
                                className="h-[540px] w-full"
                                loading="lazy"
                            />
                            <div className="flex items-center justify-between border-t bg-slate-50 px-4 py-3 text-xs text-slate-600">
                                <span>
                                    {selected
                                        ? `${selected.name} (${selected.latitude.toFixed(5)}, ${selected.longitude.toFixed(5)})`
                                        : 'Labrador, Pangasinan center'}
                                </span>
                                <a
                                    href={fullMapUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-teal-700 hover:text-teal-600"
                                >
                                    Open full map
                                </a>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white p-4 shadow-sm">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant={activeType === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveType('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    type="button"
                                    variant={activeType === 'attraction' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveType('attraction')}
                                >
                                    Attractions
                                </Button>
                                <Button
                                    type="button"
                                    variant={activeType === 'business' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveType('business')}
                                >
                                    Businesses
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {filtered.length === 0 && (
                                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-600">
                                        No geotagged records for this filter.
                                    </div>
                                )}

                                {filtered.map((item) => (
                                    <button
                                        key={`${item.type}-${item.id}`}
                                        type="button"
                                        onClick={() => setSelectedId(item.id)}
                                        className={`w-full rounded-xl border p-3 text-left transition ${
                                            selected?.id === item.id
                                                ? 'border-emerald-300 bg-emerald-50'
                                                : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {item.type === 'attraction' ? (
                                                <Mountain className="h-3.5 w-3.5 text-emerald-700" />
                                            ) : (
                                                <Building2 className="h-3.5 w-3.5 text-blue-700" />
                                            )}
                                            {item.type}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-600">
                                            {item.category || 'Uncategorized'}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
                                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                                            {item.address || 'Address not set'}
                                        </p>
                                        <div className="mt-2">
                                            <Link
                                                href={item.href}
                                                className="text-xs font-semibold text-teal-700 hover:text-teal-600"
                                            >
                                                View details
                                            </Link>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
