import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';

type OrderItem = {
    id: number;
    reference_no: string | null;
    business_name: string | null;
    product_name: string | null;
    order_type: string;
    quantity: number;
    total_amount: string;
    status: string;
    scheduled_at: string | null;
    created_at: string | null;
};

type Props = {
    orders: {
        data: OrderItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    summary: {
        total: number;
        orders: number;
        bookings: number;
        pending: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
    };
    filters: {
        type: string;
        status: string;
    };
    base_path: string;
    page_title: string;
};

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function readableType(type: string): string {
    return type
        .replace('_', ' ')
        .replace('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function readableStatus(status: string): string {
    return status
        .replace('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusVariant(status: string) {
    if (status === 'completed') return 'default';
    if (status === 'cancelled') return 'destructive';
    if (status === 'confirmed' || status === 'in_progress') return 'secondary';
    return 'outline';
}

export default function VisitorOrdersIndex({ orders, summary, filters, base_path, page_title }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Visitor', href: '/visitor/home' },
        { title: page_title, href: base_path },
    ];

    const applyFilter = (name: 'type' | 'status', value: string) => {
        router.get(
            base_path,
            {
                type: name === 'type' ? value : filters.type,
                status: name === 'status' ? value : filters.status,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`${page_title} | TechTrek Labrador`} />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm">
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{page_title}</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Track your product purchases and service bookings in one place.
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <Card><CardContent className="p-4"><p className="text-xs uppercase text-slate-500">Total</p><p className="text-2xl font-bold">{summary.total}</p></CardContent></Card>
                            <Card><CardContent className="p-4"><p className="text-xs uppercase text-slate-500">Product Orders</p><p className="text-2xl font-bold">{summary.orders}</p></CardContent></Card>
                            <Card><CardContent className="p-4"><p className="text-xs uppercase text-slate-500">Bookings</p><p className="text-2xl font-bold">{summary.bookings}</p></CardContent></Card>
                            <Card><CardContent className="p-4"><p className="text-xs uppercase text-slate-500">Pending</p><p className="text-2xl font-bold">{summary.pending}</p></CardContent></Card>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant={filters.type === 'all' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('type', 'all')}>All Types</Button>
                            <Button variant={filters.type === 'product_order' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('type', 'product_order')}>Product Orders</Button>
                            <Button variant={filters.type === 'bookings' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('type', 'bookings')}>Service Bookings</Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Button variant={filters.status === 'all' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'all')}>All ({summary.total})</Button>
                            <Button variant={filters.status === 'pending' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'pending')}>Pending ({summary.pending})</Button>
                            <Button variant={filters.status === 'confirmed' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'confirmed')}>Confirmed ({summary.confirmed})</Button>
                            <Button variant={filters.status === 'in_progress' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'in_progress')}>In Progress ({summary.in_progress})</Button>
                            <Button variant={filters.status === 'completed' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'completed')}>Completed ({summary.completed})</Button>
                            <Button variant={filters.status === 'cancelled' ? 'secondary' : 'outline'} size="sm" onClick={() => applyFilter('status', 'cancelled')}>Cancelled ({summary.cancelled})</Button>
                        </div>
                    </section>

                    {orders.data.length === 0 && (
                        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-slate-600">
                            No records yet. You can place orders and book services from <Link href="/shops" className="font-semibold text-emerald-700">Shops</Link>.
                        </div>
                    )}

                    <section className="space-y-3">
                        {orders.data.map((item) => (
                            <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-lg font-semibold">{item.product_name ?? 'Service / Product'}</p>
                                        <p className="text-sm text-slate-600">{item.business_name ?? 'Local Business'}</p>
                                        <p className="text-xs text-slate-500">Ref: {item.reference_no ?? 'N/A'}</p>
                                    </div>
                                    <Badge variant={statusVariant(item.status)}>{readableStatus(item.status)}</Badge>
                                </div>

                                <div className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                                    <p>Type: {readableType(item.order_type)}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total: PHP {Number(item.total_amount).toFixed(2)}</p>
                                    <p>Requested: {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</p>
                                    <p>Schedule: {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div className="mt-3">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`${base_path}/${item.id}`}>View details</Link>
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="flex flex-wrap gap-2">
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
                    </section>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
