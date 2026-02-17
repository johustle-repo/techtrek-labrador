import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ClipboardList, Compass, MapPinned, Waves } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/landing' },
    { title: 'Landing', href: '/visitor/landing' },
];

const quickLinks = [
    {
        title: 'Tourist Attractions',
        description: 'Browse verified destinations and must-visit places in Labrador.',
        href: '/attractions',
        icon: Compass,
    },
    {
        title: 'Events and Updates',
        description: 'Track upcoming events, festivals, and LGU announcements.',
        href: '/events',
        icon: CalendarDays,
    },
    {
        title: 'My Orders',
        description: 'Track your orders and service bookings in real time.',
        href: '/visitor/orders',
        icon: ClipboardList,
    },
    {
        title: 'Interactive Map',
        description: 'View geotagged places and navigate across Labrador, Pangasinan.',
        href: '/map',
        icon: MapPinned,
    },
];

export default function VisitorLanding() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Visitor Landing" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-100/80 via-white to-teal-100/80 p-6 shadow-sm md:p-8">
                    <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-300/30 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-teal-300/30 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                <Waves className="h-3.5 w-3.5" />
                                Visitor Access Portal
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Welcome to TechTrek Labrador
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                                Your account is now authenticated for secure access, activity tracking, and tourism engagement.
                                Start exploring destinations, events, and local businesses.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className="group"
                        >
                            <Card className="h-full rounded-2xl border-emerald-100 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                                <CardHeader className="pb-2">
                                    <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">{item.description}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </section>
            </div>
        </AppHeaderLayout>
    );
}
