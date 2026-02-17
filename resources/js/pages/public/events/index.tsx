import { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, MapPin, Search } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type EventCard = {
    id: number;
    title: string;
    slug: string;
    description: string;
    starts_at: string | null;
    ends_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    attraction: string | null;
    featured_image_url: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    events: {
        data: EventCard[];
        links: PaginationLink[];
    };
    filters: {
        search: string;
        sort: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Events', href: '/events' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function formatDateTime(value: string | null) {
    if (!value) return 'Date not set';

    return new Date(value).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function PublicEventsIndex({ events, filters }: Props) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(
            '/events',
            {
                search: (formData.get('search') as string) ?? '',
                sort: (formData.get('sort') as string) ?? 'starts_asc',
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Events | TechTrek Labrador" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                TechTrek Labrador
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Events and Updates
                            </h1>
                            <p className="text-sm text-slate-600 md:text-base">
                                Browse published public events in Labrador,
                                Pangasinan.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_auto]"
                        >
                            <div className="relative">
                                <label htmlFor="events-search" className="sr-only">
                                    Search events
                                </label>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="events-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search by title, venue, or description"
                                    className="pl-9"
                                />
                            </div>

                            <label htmlFor="events-sort" className="sr-only">
                                Sort events
                            </label>
                            <select
                                id="events-sort"
                                name="sort"
                                defaultValue={filters.sort}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            >
                                <option value="starts_asc">Event date (soonest)</option>
                                <option value="starts_desc">Event date (latest)</option>
                                <option value="latest">Newest created</option>
                                <option value="oldest">Oldest created</option>
                            </select>

                            <Button type="submit">Apply Filters</Button>
                        </form>
                    </section>

                    {events.data.length === 0 && (
                        <div role="status" aria-live="polite" className="rounded-xl border border-dashed bg-white p-12 text-center text-sm text-slate-600">
                            No published events found for this filter.
                        </div>
                    )}

                    <section aria-label="Events list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {events.data.map((item) => (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
                            >
                                <div className="aspect-[16/9] bg-slate-100">
                                    {item.featured_image_url ? (
                                        <img
                                            src={item.featured_image_url}
                                            alt={item.title}
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
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Event
                                </div>

                                <h2 id={`event-title-${item.id}`} className="text-lg font-semibold leading-tight">
                                    {item.title}
                                </h2>

                                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                                    {item.description}
                                </p>

                                <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                                    <p>{formatDateTime(item.starts_at)}</p>
                                    <p className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        {item.venue_name || item.venue_address || 'Venue not set'}
                                    </p>
                                    <p>{item.attraction ? `Near ${item.attraction}` : 'General municipality event'}</p>
                                </div>

                                <Button asChild variant="outline" className="mt-4 w-full">
                                    <Link href={`/events/${item.slug}`}>View details</Link>
                                </Button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <nav aria-label="Events pagination" className="flex flex-wrap gap-2">
                        {events.links.map((link, idx) => (
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
