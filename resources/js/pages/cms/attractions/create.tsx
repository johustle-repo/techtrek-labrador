import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = { id: number; name: string };

type Props = {
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Attractions', href: '/cms/attractions' },
    { title: 'Create', href: '/cms/attractions/create' },
];

export default function AttractionsCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        address: string;
        latitude: string;
        longitude: string;
        environmental_fee: string;
        category_id: string;
        status: string;
        featured_image: File | null;
    }>({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        environmental_fee: '',
        category_id: '',
        status: 'draft',
        featured_image: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/cms/attractions', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Attraction" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Attraction
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new tourist attraction entry.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/cms/attractions">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid gap-5 max-w-3xl">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        <InputError message={errors.address} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.0000001"
                                value={data.latitude}
                                onChange={(e) =>
                                    setData('latitude', e.target.value)
                                }
                            />
                            <InputError message={errors.latitude} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.0000001"
                                value={data.longitude}
                                onChange={(e) =>
                                    setData('longitude', e.target.value)
                                }
                            />
                            <InputError message={errors.longitude} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="environmental_fee">Environmental Fee (PHP)</Label>
                            <Input
                                id="environmental_fee"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.environmental_fee}
                                onChange={(e) =>
                                    setData('environmental_fee', e.target.value)
                                }
                                placeholder="0.00"
                            />
                            <p className="text-xs text-muted-foreground">
                                Optional. Leave blank if no environmental fee is collected.
                            </p>
                            <InputError message={errors.environmental_fee} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Category</Label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} />
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
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="featured_image">Featured Image</Label>
                        <Input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            className="h-11 cursor-pointer py-1 text-sm file:mr-4 file:h-8 file:rounded-md file:border-0 file:bg-emerald-700 file:px-4 file:py-0 file:text-sm file:font-semibold file:leading-8 file:text-white hover:file:bg-emerald-800"
                            onChange={(e) =>
                                setData(
                                    'featured_image',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Optional. Max file size: 5MB.
                        </p>
                        <InputError message={errors.featured_image} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Attraction
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/cms/attractions">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
