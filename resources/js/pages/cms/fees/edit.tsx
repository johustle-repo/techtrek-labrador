import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    fee: {
        id: number;
        name: string;
        type: string;
        charge_basis: string;
        amount: string;
        minimum_amount: string;
        status: string;
        description: string | null;
        effective_from: string | null;
        effective_to: string | null;
    };
};

export default function FeesEdit({ fee }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'CMS', href: '/cms/dashboard' },
        { title: 'Fee Management', href: '/cms/fees' },
        { title: 'Edit', href: `/cms/fees/${fee.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: fee.name ?? '',
        type: fee.type ?? 'environmental_fee',
        charge_basis: fee.charge_basis ?? 'fixed',
        amount: fee.amount ?? '',
        minimum_amount: fee.minimum_amount ?? '',
        status: fee.status ?? 'draft',
        description: fee.description ?? '',
        effective_from: fee.effective_from ?? '',
        effective_to: fee.effective_to ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/cms/fees/${fee.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Fee Rule" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Edit Fee Rule</h1>
                        <p className="text-sm text-muted-foreground">
                            Update LGU monetization settings for environmental fees and commissions.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/cms/fees">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Rule Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Rule Type</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="environmental_fee">Environmental Fee</option>
                                <option value="business_commission">Business Commission</option>
                                <option value="event_commission">Event Commission</option>
                                <option value="ad_promotion_fee">Ad Promotion Fee</option>
                            </select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="charge_basis">Charge Basis</Label>
                            <select
                                id="charge_basis"
                                value={data.charge_basis}
                                onChange={(e) => setData('charge_basis', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="fixed">Fixed Amount</option>
                                <option value="percent">Percentage</option>
                            </select>
                            <InputError message={errors.charge_basis} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            <InputError message={errors.amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="minimum_amount">Minimum Amount (Optional)</Label>
                            <Input
                                id="minimum_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.minimum_amount}
                                onChange={(e) => setData('minimum_amount', e.target.value)}
                            />
                            <InputError message={errors.minimum_amount} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="effective_from">Effective From</Label>
                            <Input
                                id="effective_from"
                                type="datetime-local"
                                value={data.effective_from}
                                onChange={(e) => setData('effective_from', e.target.value)}
                            />
                            <InputError message={errors.effective_from} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="effective_to">Effective To</Label>
                            <Input
                                id="effective_to"
                                type="datetime-local"
                                value={data.effective_to}
                                onChange={(e) => setData('effective_to', e.target.value)}
                            />
                            <InputError message={errors.effective_to} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update Rule
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/cms/fees">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
