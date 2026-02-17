import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    order: {
        id: number;
        business_id: number;
        business_product_id: number | null;
        order_type: string;
        reference_no: string | null;
        customer_name: string;
        customer_contact: string | null;
        quantity: number;
        total_amount: string;
        status: string;
        scheduled_at: string | null;
        notes: string | null;
    };
    businesses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; business_id: number; name: string }>;
};

export default function OwnerOrdersEdit({ order, businesses, products }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Owner', href: '/owner/dashboard' },
        { title: 'Orders/Services', href: '/owner/orders' },
        { title: 'Edit', href: `/owner/orders/${order.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        business_id: String(order.business_id),
        business_product_id: order.business_product_id ? String(order.business_product_id) : '',
        order_type: order.order_type ?? 'product_order',
        reference_no: order.reference_no ?? '',
        customer_name: order.customer_name ?? '',
        customer_contact: order.customer_contact ?? '',
        quantity: String(order.quantity ?? 1),
        total_amount: order.total_amount ?? '',
        status: order.status ?? 'pending',
        scheduled_at: order.scheduled_at ?? '',
        notes: order.notes ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/owner/orders/${order.id}`);
    };

    const filteredProducts = products.filter((item) => String(item.business_id) === data.business_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Order/Service" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Order/Service</h1>
                    <Button asChild variant="outline">
                        <Link href="/owner/orders">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="business_id">Business</Label>
                            <select
                                id="business_id"
                                value={data.business_id}
                                onChange={(e) => {
                                    setData('business_id', e.target.value);
                                    setData('business_product_id', '');
                                }}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                {businesses.map((business) => (
                                    <option key={business.id} value={business.id}>
                                        {business.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.business_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="business_product_id">Product/Service (Optional)</Label>
                            <select
                                id="business_product_id"
                                value={data.business_product_id}
                                onChange={(e) => setData('business_product_id', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="">None</option>
                                {filteredProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.business_product_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="order_type">Type</Label>
                            <select
                                id="order_type"
                                value={data.order_type}
                                onChange={(e) => setData('order_type', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="product_order">Product Order</option>
                                <option value="service_booking">Service Booking</option>
                                <option value="custom_service">Custom Service</option>
                            </select>
                            <InputError message={errors.order_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reference_no">Reference No (Optional)</Label>
                            <Input
                                id="reference_no"
                                value={data.reference_no}
                                onChange={(e) => setData('reference_no', e.target.value)}
                            />
                            <InputError message={errors.reference_no} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="customer_name">Customer Name</Label>
                            <Input
                                id="customer_name"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                            />
                            <InputError message={errors.customer_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="customer_contact">Customer Contact</Label>
                            <Input
                                id="customer_contact"
                                value={data.customer_contact}
                                onChange={(e) => setData('customer_contact', e.target.value)}
                            />
                            <InputError message={errors.customer_contact} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                            />
                            <InputError message={errors.quantity} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="total_amount">Total Amount</Label>
                            <Input
                                id="total_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.total_amount}
                                onChange={(e) => setData('total_amount', e.target.value)}
                            />
                            <InputError message={errors.total_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="scheduled_at">Scheduled At (Optional)</Label>
                        <Input
                            id="scheduled_at"
                            type="datetime-local"
                            value={data.scheduled_at}
                            onChange={(e) => setData('scheduled_at', e.target.value)}
                        />
                        <InputError message={errors.scheduled_at} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/owner/orders">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
