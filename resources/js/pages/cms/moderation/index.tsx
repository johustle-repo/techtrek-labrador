import { Head, Link } from '@inertiajs/react';
import { Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type QueueItem = {
    id: number;
    module: 'attractions' | 'events' | 'businesses' | 'announcements' | string;
    title: string;
    status: string;
    updated_at: string | null;
    edit_url: string;
};

type Props = {
    queue: QueueItem[];
    counts: {
        total: number;
        attractions: number;
        events: number;
        businesses: number;
        announcements: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Moderation', href: '/cms/moderation' },
];

function formatDateTime(value: string | null) {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
}

function formatText(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function moduleBadgeVariant(module: string): 'default' | 'secondary' | 'outline' {
    if (module === 'events') return 'default';
    if (module === 'announcements') return 'secondary';
    return 'outline';
}

export default function ModerationIndex({ queue, counts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moderation Queue" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-amber-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-yellow-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Moderation
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Approval Queue
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review draft submissions and publish when ready.
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-start gap-3 md:w-auto md:justify-end">
                            <div className="min-w-[150px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">Total drafts</p>
                                <p className="text-lg font-semibold">{counts.total}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Attractions</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{counts.attractions}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Events</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{counts.events}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{counts.businesses}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{counts.announcements}</CardContent>
                    </Card>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Draft Queue</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {queue.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                Queue is clear. No draft items for moderation.
                            </div>
                        )}

                        {queue.map((item) => (
                            <div
                                key={`${item.module}-${item.id}`}
                                className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={moduleBadgeVariant(item.module)}>
                                            {formatText(item.module)}
                                        </Badge>
                                        <Badge variant="outline">{formatText(item.status)}</Badge>
                                    </div>
                                    <p className="font-medium leading-snug">{item.title}</p>
                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        Updated: {formatDateTime(item.updated_at)}
                                    </p>
                                </div>

                                <Button asChild>
                                    <Link href={item.edit_url}>
                                        <Sparkles className="mr-1.5 h-4 w-4" />
                                        Review & Edit
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
