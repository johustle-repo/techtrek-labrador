import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

type Props = {
    order: {
        id: number;
        reference_no: string | null;
        status: string;
        order_type: string;
        quantity: number;
        total_amount: string;
        scheduled_at: string | null;
        created_at: string | null;
        updated_at: string | null;
        notes: string | null;
        cancellation_reason: string | null;
        business: {
            name: string | null;
            slug: string | null;
            address: string | null;
            contact_phone: string | null;
        };
        product: {
            name: string | null;
            is_service: boolean | null;
            price: string | null;
        };
    };
    timeline: Array<{
        key: string;
        label: string;
        state: 'completed' | 'current' | 'upcoming';
    }>;
    back_path: string;
    back_title: string;
    flash?: { success?: string };
    errors?: { cancellation_reason?: string };
};

function readableValue(value: string) {
    return value.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusVariant(status: string) {
    if (status === 'completed') return 'default';
    if (status === 'cancelled') return 'destructive';
    if (status === 'confirmed' || status === 'in_progress') return 'secondary';
    return 'outline';
}

export default function VisitorOrderShow({ order, timeline, back_path, back_title }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;
    const errors = page.props.errors ?? {};
    const [cancelReason, setCancelReason] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Visitor', href: '/visitor/home' },
        { title: back_title, href: back_path },
        { title: `Ref ${order.reference_no ?? order.id}`, href: `${back_path}/${order.id}` },
    ];

    const handleCancel = () => {
        if (!confirm('Cancel this request? This action cannot be undone.')) {
            return;
        }

        router.patch(`/visitor/orders/${order.id}/cancel`, {
            cancellation_reason: cancelReason,
        });
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.reference_no ?? order.id} | TechTrek Labrador`} />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Button asChild variant="outline">
                            <Link href={back_path}>Back to {back_title.toLowerCase()}</Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                                <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelReason.trim().length === 0}>
                                    Cancel request
                                </Button>
                            )}
                            <Badge variant={statusVariant(order.status)}>{readableValue(order.status)}</Badge>
                        </div>
                    </div>

                    {success && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Order / Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                            <p>Reference: <strong>{order.reference_no ?? 'N/A'}</strong></p>
                            <p>Type: <strong>{readableValue(order.order_type)}</strong></p>
                            <p>Product/Service: <strong>{order.product.name ?? 'N/A'}</strong></p>
                            <p>Business: <strong>{order.business.name ?? 'N/A'}</strong></p>
                            <p>Quantity: <strong>{order.quantity}</strong></p>
                            <p>Total Amount: <strong>PHP {Number(order.total_amount).toFixed(2)}</strong></p>
                            <p>Scheduled: <strong>{order.scheduled_at ? new Date(order.scheduled_at).toLocaleString() : 'N/A'}</strong></p>
                            <p>Requested: <strong>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</strong></p>
                            <p>Last Update: <strong>{order.updated_at ? new Date(order.updated_at).toLocaleString() : 'N/A'}</strong></p>
                            <p>Business Contact: <strong>{order.business.contact_phone ?? 'N/A'}</strong></p>
                            <p className="md:col-span-2">Business Address: <strong>{order.business.address ?? 'N/A'}</strong></p>
                            <p className="md:col-span-2">Notes: <strong>{order.notes || 'N/A'}</strong></p>
                            <p className="md:col-span-2">Cancellation Reason: <strong>{order.cancellation_reason || 'N/A'}</strong></p>
                        </CardContent>
                    </Card>

                    {order.status === 'pending' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Cancel Request</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-slate-600">
                                    Provide a reason before cancelling this request.
                                </p>
                                <textarea
                                    value={cancelReason}
                                    onChange={(event) => setCancelReason(event.target.value)}
                                    className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                                    placeholder="Reason for cancellation"
                                    maxLength={500}
                                />
                                <InputError message={errors.cancellation_reason} />
                                <p className="text-xs text-slate-500">{cancelReason.length}/500</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Status Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-4">
                                {timeline.map((step) => (
                                    <div
                                        key={step.key}
                                        className={`rounded-lg border p-3 ${
                                            step.state === 'completed'
                                                ? 'border-emerald-300 bg-emerald-50'
                                                : step.state === 'current'
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-slate-200 bg-slate-50'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold">{step.label}</p>
                                        <p className="text-xs text-slate-600">{step.state}</p>
                                    </div>
                                ))}
                            </div>
                            {order.status === 'cancelled' && (
                                <p className="mt-3 text-sm text-rose-700">
                                    This request was cancelled and is closed.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
