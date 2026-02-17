import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronRight,
    Clock3,
    Layers3,
    MapPin,
    Megaphone,
    Pin,
    ShieldCheck,
    Store,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ModuleMetrics = {
    total: number;
    published: number;
    draft: number;
    archived: number;
};

type Props = {
    metrics: {
        attractions: ModuleMetrics;
        events: ModuleMetrics;
        businesses: ModuleMetrics;
        announcements: ModuleMetrics;
    };
    upcoming_events: Array<{
        id: number;
        title: string;
        starts_at: string | null;
        venue_name: string | null;
        status: string;
        featured_image_url: string | null;
    }>;
    recent_announcements: Array<{
        id: number;
        title: string;
        is_pinned: boolean;
        published_at: string | null;
        status: string;
    }>;
    visitor_insights: {
        today_views: number;
        week_views: number;
        week_unique_visitors: number;
        top_pages: Array<{
            route_name: string | null;
            total: number;
        }>;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Dashboard', href: '/cms/dashboard' },
];

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
}

function safePercent(part: number, total: number) {
    if (!total) return 0;
    return Math.round((part / total) * 100);
}

function formatDateTime(value: string | null) {
    if (!value) return 'N/A';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
}

function formatStatus(value: string) {
    return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CmsDashboard({
    metrics,
    upcoming_events,
    recent_announcements,
    visitor_insights,
}: Props) {
    const moduleCards = [
        {
            title: 'Attractions',
            href: '/cms/attractions',
            icon: MapPin,
            data: metrics.attractions,
            tone: 'from-emerald-50 via-white to-teal-50',
            iconTone: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            accent: 'from-emerald-500 to-teal-500',
        },
        {
            title: 'Upcoming Events',
            href: '/cms/events',
            icon: CalendarDays,
            data: metrics.events,
            tone: 'from-teal-50 via-white to-cyan-50',
            iconTone: 'bg-teal-100 text-teal-700 border border-teal-200',
            accent: 'from-teal-500 to-cyan-500',
        },
        {
            title: 'Businesses',
            href: '/cms/businesses',
            icon: Store,
            data: metrics.businesses,
            tone: 'from-cyan-50 via-white to-emerald-50',
            iconTone: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
            accent: 'from-cyan-500 to-emerald-500',
        },
        {
            title: 'Announcements',
            href: '/cms/announcements',
            icon: Megaphone,
            data: metrics.announcements,
            tone: 'from-lime-50 via-white to-emerald-50',
            iconTone: 'bg-lime-100 text-lime-700 border border-lime-200',
            accent: 'from-lime-500 to-emerald-500',
        },
    ];

    const pendingApprovals = moduleCards.reduce((sum, card) => sum + card.data.draft, 0);
    const totalRecords = moduleCards.reduce((sum, card) => sum + card.data.total, 0);
    const totalPublished = moduleCards.reduce((sum, card) => sum + card.data.published, 0);
    const publishingRate = safePercent(totalPublished, totalRecords);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-100/70 via-white to-teal-100/70 p-5 shadow-lg shadow-emerald-100/70 md:p-6">
                    <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-teal-200/60 blur-3xl" />
                    <div className="absolute -left-10 -bottom-12 h-36 w-36 rounded-full bg-emerald-200/60 blur-3xl" />
                    <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
                                <Layers3 className="h-3.5 w-3.5" />
                                CMS Module
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                CMS Dashboard
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                                Premium overview of all LGU-managed content, approval pipeline, and publication readiness.
                            </p>

                            <div className="mt-4 w-full max-w-md">
                                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-600">
                                    <span>Publishing rate</span>
                                    <span className="font-semibold text-emerald-700">{publishingRate}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-emerald-100">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                        style={{ width: `${publishingRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid w-full gap-3 sm:grid-cols-3 md:w-auto md:min-w-[540px]">
                            <div className="rounded-2xl border border-emerald-200 bg-white/85 px-4 py-3 text-sm shadow-sm">
                                <p className="text-slate-500">Total content</p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">{formatNumber(totalRecords)}</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200 bg-white/85 px-4 py-3 text-sm shadow-sm">
                                <p className="text-slate-500">Pending approvals</p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">{formatNumber(pendingApprovals)}</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200 bg-white/85 px-4 py-3 text-sm shadow-sm">
                                <p className="text-slate-500">Published live</p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">{formatNumber(totalPublished)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {moduleCards.map((item) => (
                        <Card
                            key={item.title}
                            className={`group relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-gradient-to-br ${item.tone} shadow-md shadow-emerald-100/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/70 blur-xl" />
                            <CardHeader className="relative flex-row items-center justify-between pb-1">
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    {item.title}
                                </CardTitle>
                                <div className={`rounded-xl p-2.5 shadow-sm ${item.iconTone}`}>
                                    <item.icon className="h-4.5 w-4.5" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative space-y-3">
                                <div className="text-5xl font-bold tracking-tight text-slate-900">
                                    {formatNumber(item.data.total)}
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                        Published: {formatNumber(item.data.published)}
                                    </Badge>
                                    <Badge variant="outline" className="border-amber-300 text-amber-700">
                                        Draft: {formatNumber(item.data.draft)}
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-300 text-slate-700">
                                        Archived: {formatNumber(item.data.archived)}
                                    </Badge>
                                </div>

                                <div className="pt-1">
                                    <div className="mb-2 h-1.5 rounded-full bg-slate-100">
                                        <div
                                            className={`h-1.5 rounded-full bg-gradient-to-r ${item.accent}`}
                                            style={{ width: `${safePercent(item.data.published, item.data.total)}%` }}
                                        />
                                    </div>
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-600"
                                    >
                                        Open module
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-3xl border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock3 className="h-4 w-4 text-emerald-600" />
                                Pending Approvals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Draft records are treated as pending approval for publishing.
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-emerald-100 bg-gradient-to-br from-white to-teal-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                Content Governance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Keep archived entries for historical traceability and preserve a clean public catalog.
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                    <Card className="rounded-3xl border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Visitor Insights (Last 7 Days)</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-emerald-100 bg-white p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Today Views</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {formatNumber(visitor_insights.today_views)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-white p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Week Views</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {formatNumber(visitor_insights.week_views)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-white p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Unique Visitors</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {formatNumber(visitor_insights.week_unique_visitors)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-emerald-100 bg-gradient-to-br from-white to-teal-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Top Viewed Visitor Pages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {visitor_insights.top_pages.length === 0 && (
                                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    No visitor page views yet.
                                </div>
                            )}
                            {visitor_insights.top_pages.map((item) => (
                                <div
                                    key={`${item.route_name}-${item.total}`}
                                    className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white px-3 py-2"
                                >
                                    <p className="text-sm font-semibold text-slate-900">
                                        {formatStatus(item.route_name ?? 'unknown_page')}
                                    </p>
                                    <Badge variant="outline">{formatNumber(item.total)} views</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card className="overflow-hidden rounded-3xl border-emerald-100/80 py-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4">
                            <CardTitle className="text-base text-slate-800">Upcoming Events</CardTitle>
                            <Link href="/cms/events" className="text-xs font-semibold text-emerald-700 hover:text-emerald-600">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 py-5">
                            {upcoming_events.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No upcoming published events.
                                </div>
                            )}

                            {upcoming_events.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-3 shadow-sm"
                                >
                                    <div className="flex gap-3">
                                        <div className="h-18 w-28 overflow-hidden rounded-md border bg-slate-100">
                                            {event.featured_image_url ? (
                                                <img
                                                    src={event.featured_image_url}
                                                    alt={event.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-[10px] text-slate-500">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold leading-snug text-slate-900">
                                                    {event.title}
                                                </p>
                                                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                    {formatStatus(event.status)}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-600">
                                                {formatDateTime(event.starts_at)}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                {event.venue_name || 'Venue not set'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-3xl border-emerald-100/80 py-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4">
                            <CardTitle className="text-base text-slate-800">Announcements</CardTitle>
                            <Link
                                href="/cms/announcements"
                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-600"
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 py-5">
                            {recent_announcements.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No published announcements yet.
                                </div>
                            )}

                            {recent_announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold leading-snug text-slate-900">
                                            {announcement.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {announcement.is_pinned && (
                                                <Badge className="gap-1 bg-emerald-700 text-white hover:bg-emerald-700">
                                                    <Pin className="h-3 w-3" />
                                                    Pinned
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                                                {formatStatus(announcement.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-600">
                                        {formatDateTime(announcement.published_at)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
