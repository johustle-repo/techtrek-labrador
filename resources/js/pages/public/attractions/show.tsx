import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type AttractionDetail = {
    id: number;
    name: string;
    slug: string;
    description: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    environmental_fee: string | null;
    category: string | null;
    featured_image_url: string | null;
};

type RelatedAttraction = {
    id: number;
    name: string;
    slug: string;
    address: string | null;
    category: string | null;
    featured_image_url: string | null;
};

type Props = {
    attraction: AttractionDetail;
    related: RelatedAttraction[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Attractions', href: '/attractions' },
];

export default function PublicAttractionShow({ attraction, related }: Props) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`${attraction.name} | TechTrek Labrador`} />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button asChild variant="outline">
                                <Link href="/attractions">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to attractions
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/map?type=attraction&slug=${attraction.slug}`}>
                                    View on interactive map
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="aspect-[16/8] bg-slate-100">
                            {attraction.featured_image_url ? (
                                <img
                                    src={attraction.featured_image_url}
                                    alt={attraction.name}
                                    loading="eager"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 p-5 md:p-7">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                    {attraction.category || 'Uncategorized'}
                                </p>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {attraction.name}
                                </h1>
                                <p className="flex items-center gap-1.5 text-sm text-slate-600">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    {attraction.address || 'Address not set'}
                                </p>
                                {attraction.environmental_fee && Number(attraction.environmental_fee) > 0 && (
                                    <p className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Environmental Fee: PHP {Number(attraction.environmental_fee).toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div className="prose max-w-none prose-slate">
                                <p>{attraction.description}</p>
                            </div>

                            {(attraction.latitude || attraction.longitude) && (
                                <p className="text-sm text-slate-600">
                                    Coordinates: {attraction.latitude ?? 'N/A'},{' '}
                                    {attraction.longitude ?? 'N/A'}
                                </p>
                            )}
                        </div>
                    </article>

                    {related.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold">Related attractions</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/attractions/${item.slug}`}
                                        className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="aspect-[16/10] bg-slate-100">
                                            {item.featured_image_url ? (
                                                <img
                                                    src={item.featured_image_url}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1 p-4">
                                            <p className="text-lg font-semibold leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {item.category || 'Uncategorized'}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {item.address || 'Address not set'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </AppHeaderLayout>
    );
}
