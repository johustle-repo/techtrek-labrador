import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock3, Layers3, Megaphone, Pin, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AnnouncementRow = {
    id: number;
    title: string;
    is_pinned: boolean;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    updated_at: string | null;
};

type Props = {
    announcements: {
        data: AnnouncementRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Announcements', href: '/cms/announcements' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function statusVariant(status: AnnouncementRow['status']) {
    if (status === 'published') return 'default';
    if (status === 'archived') return 'secondary';
    return 'outline';
}

export default function AnnouncementsIndex({ announcements }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;
    const totalRecords = announcements.data.length;

    const handleDelete = (id: number) => {
        if (!confirm('Delete this announcement? This action cannot be undone.')) {
            return;
        }

        router.delete(`/cms/announcements/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Announcements" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Layers3 className="h-3.5 w-3.5" />
                                CMS Module
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Announcements Hub
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Publish official notices and tourism advisories.
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-start gap-3 md:w-auto md:justify-end">
                            <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">
                                    Total records
                                </p>
                                <p className="text-lg font-semibold">
                                    {totalRecords}
                                </p>
                            </div>
                            <Button asChild className="h-11 px-5">
                                <Link href="/cms/announcements/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Announcement
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Announcement Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {announcements.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No announcements yet. Create your first post.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-2">
                            {announcements.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="space-y-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-lg font-semibold leading-tight">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {item.is_pinned && (
                                                <Badge variant="secondary">
                                                    <Pin className="mr-1 h-3.5 w-3.5" />
                                                    Pinned
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={statusVariant(
                                                    item.status,
                                                )}
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Megaphone className="h-4 w-4" />
                                            Published:{' '}
                                            {item.published_at
                                                ? new Date(
                                                      item.published_at,
                                                  ).toLocaleString()
                                                : 'Not set'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock3 className="h-4 w-4" />
                                            Updated:{' '}
                                            {item.updated_at
                                                ? new Date(
                                                      item.updated_at,
                                                  ).toLocaleString()
                                                : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/cms/announcements/${item.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {announcements.links.map((link, idx) => (
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
                                        <span>
                                            {cleanPaginationLabel(link.label)}
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
