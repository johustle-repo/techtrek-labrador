import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type EventDetail = {
    id: number;
    title: string;
    slug: string;
    description: string;
    starts_at: string | null;
    ends_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    latitude: number | null;
    longitude: number | null;
    featured_image_url: string | null;
    attraction: { name: string; slug: string } | null;
};

type RelatedEvent = {
    id: number;
    title: string;
    slug: string;
    starts_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    attraction: string | null;
    featured_image_url: string | null;
};

type Props = {
    event: EventDetail;
    related: RelatedEvent[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Events', href: '/events' },
];

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

export default function PublicEventShow({ event, related }: Props) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`${event.title} | TechTrek Labrador`} />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <Button asChild variant="outline">
                            <Link href="/events">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to events
                            </Link>
                        </Button>
                    </div>

                    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="aspect-[16/8] bg-slate-100">
                            {event.featured_image_url ? (
                                <img
                                    src={event.featured_image_url}
                                    alt={event.title}
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

                        <div className="p-6 md:p-7">
                        <div className="space-y-3">
                            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Public Event
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight">
                                {event.title}
                            </h1>

                            <p className="text-sm text-slate-600">
                                {formatDateTime(event.starts_at)}
                                {event.ends_at ? ` to ${formatDateTime(event.ends_at)}` : ''}
                            </p>

                            <p className="flex items-center gap-1.5 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                {event.venue_name || event.venue_address || 'Venue not set'}
                            </p>

                            {event.attraction && (
                                <p className="text-sm text-slate-600">
                                    Linked attraction:{' '}
                                    <Link
                                        href={`/attractions/${event.attraction.slug}`}
                                        className="font-semibold text-emerald-700 hover:underline"
                                    >
                                        {event.attraction.name}
                                    </Link>
                                </p>
                            )}
                        </div>

                        <div className="prose mt-6 max-w-none prose-slate">
                            <p>{event.description}</p>
                        </div>

                        {(event.latitude || event.longitude) && (
                            <p className="mt-5 text-sm text-slate-600">
                                Coordinates: {event.latitude ?? 'N/A'},{' '}
                                {event.longitude ?? 'N/A'}
                            </p>
                        )}
                        </div>
                    </article>

                    {related.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold">Related events</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/events/${item.slug}`}
                                        className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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
                                        <div className="p-4">
                                            <p className="text-lg font-semibold leading-tight">
                                                {item.title}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {formatDateTime(item.starts_at)}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {item.venue_name || item.venue_address || 'Venue not set'}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {item.attraction ? `Near ${item.attraction}` : 'General municipality event'}
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
