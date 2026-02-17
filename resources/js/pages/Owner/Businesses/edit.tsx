import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    business: {
        id: number;
        name: string;
        description: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        address: string | null;
        category_id: number | null;
    };
    featuredImageUrl: string | null;
    categories: Array<{ id: number; name: string }>;
};

export default function OwnerBusinessesEdit({ business, featuredImageUrl, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Owner', href: '/owner/businesses' },
        { title: 'My Businesses', href: '/owner/businesses' },
        { title: 'Edit', href: `/owner/businesses/${business.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: business.name ?? '',
        description: business.description ?? '',
        contact_email: business.contact_email ?? '',
        contact_phone: business.contact_phone ?? '',
        address: business.address ?? '',
        category_id: business.category_id ? String(business.category_id) : '',
        featured_image: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/owner/businesses/${business.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Business Profile" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Edit Business Profile</h1>
                        <p className="text-sm text-muted-foreground">
                            Keep your listing details updated for visitors.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/owner/businesses">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-3xl gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />
                            <InputError message={errors.contact_email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_phone">Contact Phone</Label>
                            <Input
                                id="contact_phone"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />
                            <InputError message={errors.contact_phone} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Business Category</Label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="featured_image">Business Image</Label>
                        <Input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            className="h-12 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:leading-none file:text-white hover:file:bg-emerald-800"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.featured_image} />
                    </div>

                    {featuredImageUrl && (
                        <div className="overflow-hidden rounded-md border">
                            <img src={featuredImageUrl} alt={business.name} className="h-44 w-full object-cover" />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/owner/businesses">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
