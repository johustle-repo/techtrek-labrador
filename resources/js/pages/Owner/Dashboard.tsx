import { Head, Link } from '@inertiajs/react';
import { Bell, Building2, CalendarDays, Clock3 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    metrics: {
        total_products: number;
        total_services: number;
        total_earnings: number;
        pending_requests: number;
        pending_today: number;
    };
    latest_businesses: Array<{
        id: number;
        name: string;
        status: string;
        updated_at: string | null;
    }>;
    upcoming_events: Array<{
        id: number;
        title: string;
        starts_at: string | null;
        venue_name: string | null;
    }>;
    announcements: Array<{
        id: number;
        title: string;
        published_at: string | null;
        is_pinned: boolean;
    }>;
    pending_requests: Array<{
        id: number;
        customer_name: string;
        business_name: string | null;
        product_name: string | null;
        created_at: string | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/dashboard' },
    { title: 'Dashboard', href: '/owner/dashboard' },
];

function statusVariant(status: string) {
    if (status === 'published') return 'default';
    if (status === 'archived') return 'secondary';
    return 'outline';
}

function formatDate(value: string | null) {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
}

export default function OwnerDashboard({
    metrics,
    latest_businesses,
    upcoming_events,
    announcements,
    pending_requests,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Owner Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-100/70 via-white to-teal-100/70 p-5 shadow-lg shadow-emerald-100/60 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                Business Owner Panel
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Dashboard Overview
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Track your listing status and stay updated with municipal tourism activity.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Total Products</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{metrics.total_products}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Total Services</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{metrics.total_services}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Total Earnings</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            PHP {metrics.total_earnings.toFixed(2)}
                        </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50/60">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Pending Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{metrics.pending_requests}</p>
                            <p className="text-xs text-amber-700">{metrics.pending_today} new today</p>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-1 border-amber-200 bg-amber-50/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Pending Requests</CardTitle>
                            <Link href="/owner/orders?status=pending" className="text-xs font-medium text-amber-700">
                                Open queue
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pending_requests.length === 0 && (
                                <p className="text-sm text-muted-foreground">No pending requests right now.</p>
                            )}
                            {pending_requests.map((item) => (
                                <div key={item.id} className="rounded-lg border border-amber-200 bg-white p-3">
                                    <p className="text-sm font-semibold">{item.customer_name}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {item.business_name ?? 'No business'} | {item.product_name ?? 'Service'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Requested: {formatDate(item.created_at)}
                                    </p>
                                    <Button asChild size="sm" variant="outline" className="mt-3">
                                        <Link href={`/owner/orders/${item.id}/edit`}>Open</Link>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">My Recent Listings</CardTitle>
                            <Link href="/owner/businesses" className="text-xs font-medium text-emerald-700">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {latest_businesses.length === 0 && (
                                <p className="text-sm text-muted-foreground">No assigned businesses yet.</p>
                            )}
                            {latest_businesses.map((business) => (
                                <div key={business.id} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold">{business.name}</p>
                                        <Badge variant={statusVariant(business.status)}>{business.status}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Updated: {formatDate(business.updated_at)}
                                    </p>
                                    <Button asChild size="sm" variant="outline" className="mt-3">
                                        <Link href={`/owner/businesses/${business.id}/edit`}>Edit</Link>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-emerald-700" />
                            <CardTitle className="text-base">Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcoming_events.length === 0 && (
                                <p className="text-sm text-muted-foreground">No upcoming events.</p>
                            )}
                            {upcoming_events.map((event) => (
                                <div key={event.id} className="rounded-lg border p-3">
                                    <p className="text-sm font-semibold">{event.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(event.starts_at)}</p>
                                    <p className="text-xs text-muted-foreground">{event.venue_name ?? 'Venue not set'}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Bell className="h-4 w-4 text-emerald-700" />
                            <CardTitle className="text-base">Announcements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements.length === 0 && (
                                <p className="text-sm text-muted-foreground">No announcements yet.</p>
                            )}
                            {announcements.map((item) => (
                                <div key={item.id} className="rounded-lg border p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold">{item.title}</p>
                                        {item.is_pinned && <Badge>Pinned</Badge>}
                                    </div>
                                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        {formatDate(item.published_at)}
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
