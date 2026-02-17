import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    businesses: Array<{ id: number; name: string }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/dashboard' },
    { title: 'Products', href: '/owner/products' },
    { title: 'Create', href: '/owner/products/create' },
];

export default function OwnerProductsCreate({ businesses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        business_id: businesses[0]?.id ? String(businesses[0].id) : '',
        name: '',
        description: '',
        category: '',
        featured_image: null as File | null,
        price: '',
        is_service: false,
        status: 'active',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/owner/products');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product/Service" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Create Product/Service</h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/owner/products">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="business_id">Business</Label>
                        <select
                            id="business_id"
                            value={data.business_id}
                            onChange={(e) => setData('business_id', e.target.value)}
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
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                            <InputError message={errors.category} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            <InputError message={errors.price} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="featured_image">Product/Service Image</Label>
                        <Input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            className="h-12 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:leading-none file:text-white hover:file:bg-emerald-800"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.featured_image} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="is_service">Type</Label>
                            <select
                                id="is_service"
                                value={data.is_service ? '1' : '0'}
                                onChange={(e) => setData('is_service', e.target.value === '1')}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="0">Product</option>
                                <option value="1">Service</option>
                            </select>
                            <InputError message={errors.is_service} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/owner/products">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
