import { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Mail, MapPin, Phone, Search } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type BusinessCard = {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string | null;
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    featured_image_url: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    businesses: {
        data: BusinessCard[];
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
    { title: 'Businesses', href: '/businesses' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export default function PublicBusinessesIndex({
    businesses,
    filters,
    categories,
}: Props) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(
            '/businesses',
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
            <Head title="Businesses | TechTrek Labrador" />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                TechTrek Labrador
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Local Directory
                            </h1>
                            <p className="text-sm text-slate-600 md:text-base">
                                Discover published local businesses and service
                                providers in Labrador.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 grid gap-3 md:grid-cols-[1fr_200px_200px_auto]"
                        >
                            <div className="relative">
                                <label htmlFor="businesses-search" className="sr-only">
                                    Search businesses
                                </label>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="businesses-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search by name, category, or address"
                                    className="pl-9"
                                />
                            </div>

                            <label htmlFor="businesses-category" className="sr-only">
                                Filter businesses by category
                            </label>
                            <select
                                id="businesses-category"
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

                            <label htmlFor="businesses-sort" className="sr-only">
                                Sort businesses
                            </label>
                            <select
                                id="businesses-sort"
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

                    {businesses.data.length === 0 && (
                        <div role="status" aria-live="polite" className="rounded-xl border border-dashed bg-white p-12 text-center text-sm text-slate-600">
                            No published businesses found for this filter.
                        </div>
                    )}

                    <section aria-label="Businesses list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {businesses.data.map((item) => (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
                            >
                                <div className="aspect-[16/9] bg-slate-100">
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

                                <div className="p-5">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {item.category || 'Directory'}
                                </div>

                                <h2 id={`business-title-${item.id}`} className="text-lg font-semibold leading-tight">
                                    {item.name}
                                </h2>

                                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                                    {item.description || 'No description available.'}
                                </p>

                                <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                                    <p className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        {item.address || 'Address not set'}
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Mail className="h-4 w-4 text-emerald-600" />
                                        {item.contact_email || 'No contact email'}
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Phone className="h-4 w-4 text-emerald-600" />
                                        {item.contact_phone || 'No contact phone'}
                                    </p>
                                </div>

                                <Button asChild variant="outline" className="mt-4 w-full">
                                    <Link href={`/businesses/${item.slug}`}>
                                        View details
                                    </Link>
                                </Button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <nav aria-label="Businesses pagination" className="flex flex-wrap gap-2">
                        {businesses.links.map((link, idx) => (
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
