import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    BellRing,
    Building2,
    CalendarDays,
    CalendarRange,
    Clock3,
    FileText,
    MapPinned,
    Megaphone,
    Pin,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/superadmin';
import { index as eventsIndex } from '@/routes/cms/events';
import { index as announcementsIndex } from '@/routes/cms/announcements';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin',
        href: dashboard().url,
    },
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type DashboardMetrics = {
    total_users: number;
    verified_users: number;
    pending_verifications: number;
    super_admins: number;
    attractions: number;
    events: number;
    businesses: number;
    announcements: number;
};

type RecentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string | null;
};

type RecentAudit = {
    id: number;
    actor: string;
    action: string;
    module: string;
    target_id: number | null;
    created_at: string | null;
};

type Props = {
    metrics: DashboardMetrics;
    recent_users: RecentUser[];
    recent_audits: RecentAudit[];
    incoming_events: IncomingEvent[];
    incoming_announcements: IncomingAnnouncement[];
};

type IncomingEvent = {
    id: number;
    title: string;
    starts_at: string | null;
    venue_name: string | null;
    status: string;
};

type IncomingAnnouncement = {
    id: number;
    title: string;
    is_pinned: boolean;
    published_at: string | null;
    status: string;
};

function formatDateTime(value: string | null) {
    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleString();
}

function formatText(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
}

function formatRole(role: string) {
    return formatText(role);
}

function formatAction(action: string) {
    return formatText(action);
}

function formatStatus(status: string) {
    return formatText(status);
}

function moduleBadgeVariant(module: string): 'default' | 'secondary' | 'outline' {
    if (module === 'users') {
        return 'default';
    }

    if (module === 'attractions' || module === 'events') {
        return 'secondary';
    }

    return 'outline';
}

export default function SuperAdminDashboard({
    metrics,
    recent_users,
    recent_audits,
    incoming_events,
    incoming_announcements,
}: Props) {
    const moduleCardClass =
        'overflow-hidden border-emerald-100/70 py-0 gap-0 shadow-sm';
    const moduleHeaderClass =
        'flex flex-row items-center justify-between gap-3 space-y-0 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 px-5 py-4';
    const moduleItemClass =
        'space-y-2 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md';
    const verificationRate = metrics.total_users
        ? Math.round((metrics.verified_users / metrics.total_users) * 100)
        : 0;
    const totalContent =
        metrics.attractions +
        metrics.events +
        metrics.businesses +
        metrics.announcements;

    const topMetrics = [
        {
            label: 'Total Users',
            value: metrics.total_users,
            subtitle: `${verificationRate}% verified accounts`,
            icon: Users,
            tone: 'from-emerald-50 to-teal-50',
            iconTone: 'bg-emerald-100 text-emerald-700',
            barTone: 'from-emerald-500 to-teal-500',
        },
        {
            label: 'Verified Users',
            value: metrics.verified_users,
            subtitle: `${metrics.pending_verifications} pending verification`,
            icon: UserCheck,
            tone: 'from-teal-50 to-cyan-50',
            iconTone: 'bg-teal-100 text-teal-700',
            barTone: 'from-teal-500 to-cyan-500',
        },
        {
            label: 'Pending Verification',
            value: metrics.pending_verifications,
            subtitle: 'Accounts waiting approval',
            icon: Activity,
            tone: 'from-amber-50 to-lime-50',
            iconTone: 'bg-amber-100 text-amber-700',
            barTone: 'from-amber-500 to-lime-500',
        },
        {
            label: 'Super Admins',
            value: metrics.super_admins,
            subtitle: 'Privileged platform operators',
            icon: Shield,
            tone: 'from-green-50 to-emerald-50',
            iconTone: 'bg-green-100 text-green-700',
            barTone: 'from-green-600 to-emerald-600',
        },
    ];

    const cmsMetrics = [
        {
            label: 'Attractions',
            value: metrics.attractions,
            subtitle: 'Tourist destination entries',
            icon: MapPinned,
            tone: 'from-emerald-50 to-green-50',
            iconTone: 'bg-emerald-100 text-emerald-700',
            barTone: 'from-emerald-500 to-green-500',
        },
        {
            label: 'Events',
            value: metrics.events,
            subtitle: 'Upcoming and archived events',
            icon: CalendarDays,
            tone: 'from-teal-50 to-emerald-50',
            iconTone: 'bg-teal-100 text-teal-700',
            barTone: 'from-teal-500 to-emerald-500',
        },
        {
            label: 'Businesses',
            value: metrics.businesses,
            subtitle: 'Registered local businesses',
            icon: Building2,
            tone: 'from-cyan-50 to-teal-50',
            iconTone: 'bg-cyan-100 text-cyan-700',
            barTone: 'from-cyan-500 to-teal-500',
        },
        {
            label: 'Announcements',
            value: metrics.announcements,
            subtitle: 'Public advisories and notices',
            icon: FileText,
            tone: 'from-lime-50 to-emerald-50',
            iconTone: 'bg-lime-100 text-lime-700',
            barTone: 'from-lime-500 to-emerald-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/80 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Shield className="h-3.5 w-3.5" />
                                Super Admin Module
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Dashboard Overview
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Live platform metrics and recent admin activity.
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-start gap-3 md:w-auto md:justify-end">
                            <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">
                                    Total users
                                </p>
                                <p className="text-lg font-semibold">
                                    {formatNumber(metrics.total_users)}
                                </p>
                            </div>
                            <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">
                                    Total content
                                </p>
                                <p className="text-lg font-semibold">
                                    {formatNumber(totalContent)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {topMetrics.map((item) => (
                        <Card
                            key={item.label}
                            className={`group relative overflow-hidden border-white/60 bg-gradient-to-br ${item.tone} shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
                        >
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/60 blur-xl" />
                            <CardHeader className="relative flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">
                                    {item.label}
                                </CardTitle>
                                <div
                                    className={`rounded-lg p-2 shadow-sm ${item.iconTone}`}
                                >
                                    <item.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-4xl font-bold tracking-tight text-slate-900">
                                    {formatNumber(item.value)}
                                </div>
                                <p className="mt-2 text-xs text-slate-600">
                                    {item.subtitle}
                                </p>
                                <div
                                    className={`mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r ${item.barTone}`}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cmsMetrics.map((item) => (
                        <Card
                            key={item.label}
                            className={`group relative overflow-hidden border-white/60 bg-gradient-to-br ${item.tone} shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
                        >
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/60 blur-xl" />
                            <CardHeader className="relative flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700">
                                    {item.label}
                                </CardTitle>
                                <div
                                    className={`rounded-lg p-2 shadow-sm ${item.iconTone}`}
                                >
                                    <item.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-4xl font-bold tracking-tight text-slate-900">
                                    {formatNumber(item.value)}
                                </div>
                                <p className="mt-2 text-xs text-slate-600">
                                    {item.subtitle}
                                </p>
                                <div
                                    className={`mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r ${item.barTone}`}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card className={moduleCardClass}>
                        <CardHeader className={moduleHeaderClass}>
                            <CardTitle>Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 pt-5 pb-6">
                            {recent_users.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No recent users found.
                                </div>
                            )}

                            {recent_users.map((user) => (
                                <div
                                    key={user.id}
                                    className={`${moduleItemClass} flex flex-col gap-2 md:flex-row md:items-center md:justify-between`}
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium leading-snug">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground break-all">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {formatRole(user.role)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDateTime(user.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={moduleCardClass}>
                        <CardHeader className={moduleHeaderClass}>
                            <CardTitle>Recent Audit Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 pt-5 pb-6">
                            {recent_audits.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No recent audits found.
                                </div>
                            )}

                            {recent_audits.map((item) => (
                                <div
                                    key={item.id}
                                    className={moduleItemClass}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium">
                                            {item.actor} {formatAction(item.action)}
                                        </p>
                                        <Badge variant={moduleBadgeVariant(item.module)}>
                                            {formatText(item.module)}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <p className="flex items-center gap-1.5">
                                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                                            Target: {item.target_id ?? 'N/A'}
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Clock3 className="h-3.5 w-3.5 text-emerald-600" />
                                            {formatDateTime(item.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card className={moduleCardClass}>
                        <CardHeader className={moduleHeaderClass}>
                            <CardTitle className="text-slate-800">
                                Incoming Events
                            </CardTitle>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-lg border-emerald-200 bg-white/90 px-4 text-emerald-800 hover:bg-white"
                            >
                                <Link href={eventsIndex().url}>
                                    View all
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 pt-5 pb-6">
                            {incoming_events.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No upcoming events found.
                                </div>
                            )}

                            {incoming_events.map((event) => (
                                <div
                                    key={event.id}
                                    className={moduleItemClass}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium leading-snug">
                                            {event.title}
                                        </p>
                                        <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                            {formatStatus(event.status)}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <CalendarRange className="h-3.5 w-3.5 text-emerald-600" />
                                            {formatDateTime(event.starts_at)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPinned className="h-3.5 w-3.5 text-emerald-600" />
                                            {event.venue_name || 'Venue not set'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={moduleCardClass}>
                        <CardHeader className={moduleHeaderClass}>
                            <CardTitle className="text-slate-800">
                                Announcements
                            </CardTitle>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-lg border-emerald-200 bg-white/90 px-4 text-emerald-800 hover:bg-white"
                            >
                                <Link href={announcementsIndex().url}>
                                    View all
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 px-5 pt-5 pb-6">
                            {incoming_announcements.length === 0 && (
                                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No announcements found.
                                </div>
                            )}

                            {incoming_announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={moduleItemClass}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium">
                                            {announcement.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {announcement.is_pinned && (
                                                <Badge className="gap-1 bg-emerald-700 text-white hover:bg-emerald-700">
                                                    <Pin className="h-3 w-3" />
                                                    Pinned
                                                </Badge>
                                            )}
                                            <Badge className="border-emerald-200 bg-white text-emerald-700 hover:bg-white">
                                                {formatStatus(announcement.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Megaphone className="h-3.5 w-3.5 text-emerald-600" />
                                            Published
                                        </p>
                                        <p>{formatDateTime(announcement.published_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BellRing className="h-4 w-4 text-emerald-600" />
                                Event Readiness
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {incoming_events.length > 0
                                ? `${incoming_events.length} incoming published event(s) are scheduled.`
                                : 'No incoming events yet. Add new published events from CMS.'}
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-100 bg-gradient-to-br from-white to-teal-50/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                Announcement Coverage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {incoming_announcements.length > 0
                                ? `${incoming_announcements.length} published announcement(s) are visible now.`
                                : 'No published announcements yet. Publish advisories to inform users.'}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
