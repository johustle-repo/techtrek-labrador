import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Attraction = { id: number; name: string };

type EventModel = {
    id: number;
    title: string;
    description: string;
    starts_at: string | null;
    ends_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    latitude: number | null;
    longitude: number | null;
    attraction_id: number | null;
    status: 'draft' | 'published' | 'archived';
};

type Props = {
    event: EventModel;
    featuredImageUrl: string | null;
    attractions: Attraction[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Events', href: '/cms/events' },
    { title: 'Edit', href: '#' },
];

export default function EventsEdit({ event, featuredImageUrl, attractions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title ?? '',
        description: event.description ?? '',
        starts_at: event.starts_at ?? '',
        ends_at: event.ends_at ?? '',
        venue_name: event.venue_name ?? '',
        venue_address: event.venue_address ?? '',
        latitude: event.latitude === null ? '' : String(event.latitude),
        longitude: event.longitude === null ? '' : String(event.longitude),
        featured_image: null as File | null,
        attraction_id:
            event.attraction_id === null ? '' : String(event.attraction_id),
        status: event.status ?? 'draft',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/cms/events/${event.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${event.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Event
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update event details and publication status.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/cms/events">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid gap-5 max-w-3xl">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="starts_at">Starts At</Label>
                            <Input
                                id="starts_at"
                                type="datetime-local"
                                value={data.starts_at}
                                onChange={(e) =>
                                    setData('starts_at', e.target.value)
                                }
                            />
                            <InputError message={errors.starts_at} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ends_at">Ends At</Label>
                            <Input
                                id="ends_at"
                                type="datetime-local"
                                value={data.ends_at}
                                onChange={(e) =>
                                    setData('ends_at', e.target.value)
                                }
                            />
                            <InputError message={errors.ends_at} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="venue_name">Venue Name</Label>
                            <Input
                                id="venue_name"
                                value={data.venue_name}
                                onChange={(e) =>
                                    setData('venue_name', e.target.value)
                                }
                            />
                            <InputError message={errors.venue_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="venue_address">Venue Address</Label>
                            <Input
                                id="venue_address"
                                value={data.venue_address}
                                onChange={(e) =>
                                    setData('venue_address', e.target.value)
                                }
                            />
                            <InputError message={errors.venue_address} />
                        </div>
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
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="featured_image">
                                Event Poster / Tarpaulin Design
                            </Label>
                            {featuredImageUrl && (
                                <div className="overflow-hidden rounded-lg border">
                                    <img
                                        src={featuredImageUrl}
                                        alt={event.title}
                                        className="h-40 w-full object-cover"
                                    />
                                </div>
                            )}
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
                                Replace with your updated tarpaulin or Facebook
                                event poster image.
                            </p>
                            <InputError message={errors.featured_image} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="attraction_id">
                                Linked Attraction
                            </Label>
                            <select
                                id="attraction_id"
                                value={data.attraction_id}
                                onChange={(e) =>
                                    setData('attraction_id', e.target.value)
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="">Select attraction</option>
                                {attractions.map((attraction) => (
                                    <option
                                        key={attraction.id}
                                        value={attraction.id}
                                    >
                                        {attraction.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.attraction_id} />
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

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update Event
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/cms/events">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
