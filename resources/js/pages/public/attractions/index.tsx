import { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Search } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AttractionCard = {
    id: number;
    name: string;
    slug: string;
    description: string;
    address: string | null;
    environmental_fee: string | null;
    category: string | null;
    featured_image_url: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    attractions: {
        data: AttractionCard[];
        links: PaginationLink[];
    };
    filters: {
        search: string;
        category: string;
        sort: string;
    };
    categories: Array<{ name: string; slug: string }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Attractions', href: '/attractions' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export default function PublicAttractionsIndex({
    attractions,
    filters,
    categories,
}: Props) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(
            '/attractions',
            {
                search: (formData.get('search') as string) ?? '',
                category: (formData.get('category') as string) ?? '',
                sort: (formData.get('sort') as string) ?? 'latest',
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Attractions | TechTrek Labrador" />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                TechTrek Labrador
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Tourist Attractions
                            </h1>
                            <p className="text-sm text-slate-600 md:text-base">
                                Explore published destination entries around
                                Labrador, Pangasinan.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 grid gap-3 md:grid-cols-[1fr_200px_200px_auto]"
                        >
                            <div className="relative">
                                <label htmlFor="attractions-search" className="sr-only">
                                    Search attractions
                                </label>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="attractions-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search by name, description, or address"
                                    className="pl-9"
                                />
                            </div>

                            <label htmlFor="attractions-category" className="sr-only">
                                Filter attractions by category
                            </label>
                            <select
                                id="attractions-category"
                                name="category"
                                defaultValue={filters.category}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            >
                                <option value="">All categories</option>
                                {categories.map((item) => (
                                    <option key={item.slug} value={item.slug}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="attractions-sort" className="sr-only">
                                Sort attractions
                            </label>
                            <select
                                id="attractions-sort"
                                name="sort"
                                defaultValue={filters.sort}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            >
                                <option value="latest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="name_asc">Name A-Z</option>
                                <option value="name_desc">Name Z-A</option>
                            </select>

                            <Button type="submit">Apply Filters</Button>
                        </form>
                    </section>

                    {attractions.data.length === 0 && (
                        <div role="status" aria-live="polite" className="rounded-xl border border-dashed bg-white p-12 text-center text-sm text-slate-600">
                            No published attractions found for this filter.
                        </div>
                    )}

                    <section aria-label="Attractions list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {attractions.data.map((item) => (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
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

                                <div className="space-y-3 p-4">
                                    <div className="space-y-1">
                                        <h2 id={`attraction-title-${item.id}`} className="text-lg font-semibold leading-tight">
                                            {item.name}
                                        </h2>
                                        {item.environmental_fee && Number(item.environmental_fee) > 0 && (
                                            <p className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                                Environmental Fee: PHP {Number(item.environmental_fee).toFixed(2)}
                                            </p>
                                        )}
                                        <p className="line-clamp-3 text-sm text-slate-600">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="space-y-1 text-sm text-slate-600">
                                        <p>{item.category || 'Uncategorized'}</p>
                                        <p className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-emerald-600" />
                                            {item.address || 'Address not set'}
                                        </p>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={`/attractions/${item.slug}`}>
                                                View details
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full">
                                            <Link href={`/map?type=attraction&slug=${item.slug}`}>
                                                View on map
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    <nav aria-label="Attractions pagination" className="flex flex-wrap gap-2">
                        {attractions.links.map((link, idx) => (
                            <Button
                                key={`${link.label}-${idx}`}
                                asChild={Boolean(link.url)}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                            >
                                {link.url ? (
                                        <Link href={link.url} preserveScroll>
                                            {cleanPaginationLabel(link.label)}
                                        </Link>
                                    ) : (
                                        <span aria-disabled="true">{cleanPaginationLabel(link.label)}</span>
                                    )}
                            </Button>
                        ))}
                    </nav>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
