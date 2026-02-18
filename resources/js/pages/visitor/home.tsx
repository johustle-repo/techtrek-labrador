import type { ComponentType } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Compass, MapPin, Megaphone, Store, Waves } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    stats: {
        attractions: number;
        events: number;
        businesses: number;
        upcoming_events: number;
    };
    featured_attractions: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        environmental_fee: string | null;
        featured_image_url: string | null;
    }>;
    upcoming_events: Array<{
        id: number;
        title: string;
        slug: string;
        starts_at: string | null;
        venue_name: string | null;
    }>;
    announcements: Array<{
        id: number;
        title: string;
        published_at: string | null;
        is_pinned: boolean;
    }>;
    recent_activity: Array<{
        id: number;
        route_name: string | null;
        path: string | null;
        visited_at: string | null;
    }>;
    top_pages: Array<{
        route_name: string | null;
        total: number;
    }>;
    featured_products: Array<{
        id: number;
        business_name: string | null;
        business_slug: string | null;
        name: string;
        slug: string;
        category: string | null;
        price: string;
        is_service: boolean;
        featured_image_url: string | null;
    }>;
    quick_facts: Record<string, string>;
    about: {
        summary: string;
        highlights: string[];
    };
};

function formatDateTime(value: string | null) {
    if (!value) return 'Date TBD';
    return new Date(value).toLocaleString();
}

export default function VisitorHome({
    stats,
    featured_attractions,
    upcoming_events,
    announcements,
    recent_activity,
    top_pages,
    featured_products,
    quick_facts,
    about,
}: Props) {
    const municipalSealUrl = '/labrador-seal.png';

    return (
        <AppHeaderLayout>
            <Head title="Visitor Home" />

            <div className="visitor-page flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
                <section
                    className="relative overflow-hidden rounded-3xl border border-emerald-200 shadow-lg shadow-emerald-900/10"
                    style={{
                        backgroundImage: "url('/bolo-beach-hero.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <img
                        src="/bolo-beach-hero.jpg"
                        alt="Labrador coastline"
                        className="absolute inset-0 h-full w-full object-cover opacity-55"
                    />
                    <div className="visitor-hero-overlay absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/55 to-emerald-900/20 md:from-emerald-950/90 md:via-emerald-900/60 md:to-emerald-900/25" />

                    <div className="relative grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                        <div className="space-y-4 text-white">
                            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                                <Waves className="h-3.5 w-3.5" />
                                Visitor Home
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Home: What To Expect in Labrador
                            </h1>
                            <p className="max-w-2xl text-sm text-emerald-50/95 md:text-base">
                                Discover beaches, events, businesses, and municipal updates in one secure tourism portal.
                                Use this overview to quickly plan your visit.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/attractions"
                                    className="rounded-full bg-emerald-600/90 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
                                >
                                    Explore Attractions
                                </Link>
                                <Link
                                    href="/map"
                                    className="rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                                >
                                    Open Interactive Map
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(quick_facts).map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-2xl border border-white/30 bg-white/10 p-3 text-white backdrop-blur-sm"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/85">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-xl font-bold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    <KpiCard icon={Compass} label="Published Attractions" value={stats.attractions} />
                    <KpiCard icon={CalendarDays} label="Published Events" value={stats.events} />
                    <KpiCard icon={Store} label="Local Businesses" value={stats.businesses} />
                    <KpiCard icon={MapPin} label="Upcoming Events" value={stats.upcoming_events} />
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="rounded-2xl border-emerald-100">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Featured Attractions</CardTitle>
                            <Link href="/attractions" className="text-xs font-semibold text-emerald-700 hover:text-emerald-600">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            {featured_attractions.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/attractions/${item.slug}`}
                                    className="overflow-hidden rounded-xl border border-emerald-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="h-32 bg-slate-100">
                                        {item.featured_image_url ? (
                                            <img src={item.featured_image_url} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                                        )}
                                    </div>
                                    <div className="space-y-1 p-3">
                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                        {item.environmental_fee && Number(item.environmental_fee) > 0 && (
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                                Environmental Fee: PHP {Number(item.environmental_fee).toFixed(2)}
                                            </p>
                                        )}
                                        <p className="line-clamp-3 text-xs text-slate-600">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        <Card className="rounded-2xl border-emerald-100">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">Upcoming Events</CardTitle>
                                <Link href="/events" className="text-xs font-semibold text-emerald-700 hover:text-emerald-600">
                                    View all
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {upcoming_events.length === 0 && (
                                    <p className="text-sm text-slate-600">No upcoming events yet.</p>
                                )}
                                {upcoming_events.map((item) => (
                                    <Link key={item.id} href={`/events/${item.slug}`} className="block rounded-lg border border-emerald-100 p-3 hover:bg-emerald-50/50">
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-600">{formatDateTime(item.starts_at)}</p>
                                        <p className="text-xs text-slate-500">{item.venue_name || 'Venue not set'}</p>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-emerald-100">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Megaphone className="h-4 w-4 text-emerald-700" />
                                    Announcements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {announcements.length === 0 && (
                                    <p className="text-sm text-slate-600">No announcements yet.</p>
                                )}
                                {announcements.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-emerald-100 p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                            {item.is_pinned && (
                                                <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">Pinned</Badge>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.published_at)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="rounded-2xl border-emerald-100">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Featured Local Products & Services</CardTitle>
                            <Link href="/businesses" className="text-xs font-semibold text-emerald-700 hover:text-emerald-600">
                                Explore directory
                            </Link>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2">
                            {featured_products.length === 0 && (
                                <p className="text-sm text-slate-600">No featured products/services yet.</p>
                            )}
                            {featured_products.map((item) => (
                                <div key={item.id} className="overflow-hidden rounded-xl border border-emerald-100 bg-white">
                                    <div className="h-28 bg-slate-100">
                                        {item.featured_image_url ? (
                                            <img src={item.featured_image_url} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                                        )}
                                    </div>
                                    <div className="space-y-1.5 p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.name}</p>
                                            <Badge variant={item.is_service ? 'secondary' : 'outline'}>
                                                {item.is_service ? 'Service' : 'Product'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {item.business_slug ? (
                                                <Link href={`/businesses/${item.business_slug}`} className="font-semibold text-emerald-700 hover:text-emerald-600">
                                                    {item.business_name ?? 'Local business'}
                                                </Link>
                                            ) : (
                                                item.business_name ?? 'Local business'
                                            )}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-600">{item.category ?? 'General'}</p>
                                            <p className="text-sm font-bold text-emerald-700">
                                                PHP {Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg">About Labrador</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white/80 p-3">
                                <img
                                    src={municipalSealUrl}
                                    alt="Official Municipal Seal of Labrador, Pangasinan"
                                    className="h-14 w-14 rounded-full border border-emerald-200 bg-white p-1 object-contain"
                                />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Official Seal</p>
                                    <p className="text-sm font-semibold text-slate-900">Municipality of Labrador</p>
                                    <p className="text-xs text-slate-600">Pangasinan, Philippines</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600">{about.summary}</p>
                            <ul className="space-y-2">
                                {about.highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/map"
                                className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                Plan your route on map
                            </Link>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl border-emerald-100">
                        <CardHeader>
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recent_activity.length === 0 && (
                                <p className="text-sm text-slate-600">No recent browsing activity yet.</p>
                            )}
                            {recent_activity.map((item) => (
                                <div key={item.id} className="rounded-lg border border-emerald-100 p-3">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {formatRouteName(item.route_name)}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.path || 'Unknown path'}</p>
                                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.visited_at)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-emerald-100">
                        <CardHeader>
                            <CardTitle className="text-base">Top Viewed Pages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {top_pages.length === 0 && (
                                <p className="text-sm text-slate-600">No page-view insights yet.</p>
                            )}
                            {top_pages.map((item) => (
                                <div key={`${item.route_name}-${item.total}`} className="flex items-center justify-between rounded-lg border border-emerald-100 px-3 py-2">
                                    <p className="text-sm font-semibold text-slate-900">{formatRouteName(item.route_name)}</p>
                                    <Badge variant="outline">{item.total} views</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <footer className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-emerald-50">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                                TechTrek Labrador
                            </p>
                            <p className="mt-1 text-sm text-emerald-100/90">
                                Secure visitor portal for attractions, events, businesses, and local updates.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/attractions" className="rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">
                                Attractions
                            </Link>
                            <Link href="/events" className="rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">
                                Events
                            </Link>
                            <Link href="/businesses" className="rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">
                                Businesses
                            </Link>
                            <Link href="/map" className="rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">
                                Map
                            </Link>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-emerald-200/90">
                        © {new Date().getFullYear()} Municipality of Labrador, Pangasinan. All rights reserved.
                    </p>
                </footer>
            </div>
        </AppHeaderLayout>
    );
}

function formatRouteName(route: string | null) {
    if (!route) return 'Unknown page';
    return route
        .replaceAll('.', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function KpiCard({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: number;
}) {
    return (
        <Card className="rounded-2xl border-emerald-100 bg-white">
            <CardContent className="flex items-center justify-between p-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                </div>
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                    <Icon className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    );
}
