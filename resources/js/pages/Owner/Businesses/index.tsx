import { Head, Link, usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BusinessRow = {
    id: number;
    name: string;
    status: string;
    category: string | null;
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    featured_image_url: string | null;
    updated_at: string | null;
};

type Props = {
    businesses: {
        data: BusinessRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/businesses' },
    { title: 'My Businesses', href: '/owner/businesses' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function statusVariant(status: string) {
    if (status === 'published') return 'default';
    if (status === 'archived') return 'secondary';
    return 'outline';
}

export default function OwnerBusinessesIndex({ businesses }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Businesses" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            Business Owner Module
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Business Listings</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your profile details for LGU tourism promotion.
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Owned Businesses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {businesses.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No business listing is assigned to your account yet.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-2">
                            {businesses.data.map((item) => (
                                <div key={item.id} className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-lg font-semibold leading-tight">{item.name}</p>
                                        <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <p>{item.category ?? 'Uncategorized'}</p>
                                        <p>{item.address ?? 'No address set'}</p>
                                        <p>{item.contact_email ?? 'No email set'}</p>
                                        <p>{item.contact_phone ?? 'No phone set'}</p>
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href={`/owner/businesses/${item.id}/edit`}>Edit Profile</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
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
                                        <span>{cleanPaginationLabel(link.label)}</span>
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
