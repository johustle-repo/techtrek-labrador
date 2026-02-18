import { FormEvent } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type OrderRow = {
    id: number;
    business: string | null;
    product: string | null;
    order_type: string;
    reference_no: string | null;
    customer_name: string;
    customer_contact: string | null;
    quantity: number;
    total_amount: string;
    status: string;
    cancellation_reason?: string | null;
    scheduled_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
    updated_by: string | null;
};

type Props = {
    orders: {
        data: OrderRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    summary: {
        total: number;
        pending: number;
        completed: number;
        total_revenue: number;
    };
    filters: {
        search: string;
        status: string;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Orders', href: '/cms/orders' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function statusVariant(status: string) {
    if (status === 'completed') return 'default';
    if (status === 'cancelled') return 'destructive';
    if (status === 'confirmed' || status === 'in_progress') return 'secondary';
    return 'outline';
}

function readableStatus(status: string) {
    return status
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function CmsOrdersIndex({ orders, summary, filters }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        router.get(
            '/cms/orders',
            {
                search: (formData.get('search') as string) ?? '',
                status: (formData.get('status') as string) ?? 'all',
            },
            { preserveState: true, replace: true },
        );
    };

    const updateStatus = (id: number, status: string) => {
        router.patch(
            `/cms/orders/${id}/status`,
            { status },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Orders" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Order Management</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        LGU and Super Admin track business order/service records for monitoring and reporting.
                    </p>
                </div>

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Records</p>
                            <p className="mt-1 text-2xl font-bold">{summary.total}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Pending</p>
                            <p className="mt-1 text-2xl font-bold">{summary.pending}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Completed</p>
                            <p className="mt-1 text-2xl font-bold">{summary.completed}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tracked Revenue</p>
                            <p className="mt-1 text-2xl font-bold">PHP {Number(summary.total_revenue).toFixed(2)}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order & Service Track Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <form onSubmit={applyFilters} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_220px_auto]">
                            <input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search customer, reference, order type"
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            />
                            <select
                                name="status"
                                defaultValue={filters.status}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="all">All statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <Button type="submit">Apply</Button>
                        </form>

                        {orders.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No order records found for this filter.
                            </div>
                        )}

                        <div className="space-y-3">
                            {orders.data.map((item) => (
                                <div key={item.id} className="rounded-xl border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-lg font-semibold">{item.customer_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.business ?? 'No business'} | {item.product ?? item.order_type}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Ref: {item.reference_no ?? 'N/A'} | Contact: {item.customer_contact ?? 'N/A'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Created by: {item.created_by ?? 'N/A'} | Updated by: {item.updated_by ?? 'N/A'}
                                            </p>
                                        </div>
                                        <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                                    </div>

                                    <div className="mt-2 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Total: PHP {Number(item.total_amount).toFixed(2)}</p>
                                        <p>Scheduled: {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'N/A'}</p>
                                        <p>Updated: {item.updated_at ? new Date(item.updated_at).toLocaleString() : 'N/A'}</p>
                                        {item.status === 'cancelled' && (
                                            <p className="md:col-span-2">Cancellation reason: {item.cancellation_reason ?? 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Update status:</span>
                                        {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                                            <Button
                                                key={status}
                                                size="sm"
                                                variant={item.status === status ? 'default' : 'outline'}
                                                onClick={() => updateStatus(item.id, status)}
                                            >
                                                {readableStatus(status)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {orders.links.map((link, idx) => (
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
