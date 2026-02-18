import { Head, Link, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
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
    updated_at: string | null;
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
        pending_today: number;
    };
    pending_queue: Array<{
        id: number;
        customer_name: string;
        business: string | null;
        product: string | null;
        created_at: string | null;
    }>;
    filters: {
        search: string;
        status: string;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/dashboard' },
    { title: 'Orders/Services', href: '/owner/orders' },
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

export default function OwnerOrdersIndex({ orders, summary, pending_queue, filters }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;

    const handleDelete = (id: number) => {
        if (!confirm('Delete this order/service record?')) {
            return;
        }
        router.delete(`/owner/orders/${id}`);
    };

    const applyFilters = (formData: FormData) => {
        router.get(
            '/owner/orders',
            {
                search: (formData.get('search') as string) ?? '',
                status: (formData.get('status') as string) ?? 'all',
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Orders/Services" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <ClipboardList className="h-3.5 w-3.5" />
                        Owner Module
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Manage Orders/Services</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Track customer orders and service bookings.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/owner/orders/create">New Order/Service</Link>
                        </Button>
                    </div>
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
                            <p className="text-xs text-amber-700">{summary.pending_today} new today</p>
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

                <Card className="border-amber-200 bg-amber-50/50">
                    <CardHeader>
                        <CardTitle className="text-base">Pending Requests Queue</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {pending_queue.length === 0 && (
                            <p className="text-sm text-muted-foreground">No pending requests right now.</p>
                        )}
                        {pending_queue.map((item) => (
                            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white p-3">
                                <div>
                                    <p className="text-sm font-semibold">{item.customer_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.business ?? 'No business'} | {item.product ?? 'Service'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Requested: {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/owner/orders/${item.id}/edit`}>Open request</Link>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order & Service Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <form
                            className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_220px_auto]"
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilters(new FormData(e.currentTarget));
                            }}
                        >
                            <input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search customer, reference, type"
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
                                No order/service records yet.
                            </div>
                        )}

                        {orders.data.map((item) => (
                            <div key={item.id} className="rounded-xl border p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-lg font-semibold">{item.customer_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.business ?? 'No business'} | {item.product ?? item.order_type}
                                        </p>
                                        {item.reference_no && (
                                            <p className="text-xs text-muted-foreground">Ref: {item.reference_no}</p>
                                        )}
                                    </div>
                                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                                </div>
                                <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                                    <p>Contact: {item.customer_contact ?? 'N/A'}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total: PHP {Number(item.total_amount).toFixed(2)}</p>
                                    <p>Schedule: {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'N/A'}</p>
                                    {item.status === 'cancelled' && (
                                        <p>Cancellation reason: {item.cancellation_reason ?? 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="mt-3 flex justify-end gap-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/owner/orders/${item.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}

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
