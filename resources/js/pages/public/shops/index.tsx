import { FormEvent, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { LocateFixed, Search, ShoppingBag, Store } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

type ProductCard = {
    id: number;
    name: string;
    category: string | null;
    price: string;
    is_service: boolean;
    business_name: string | null;
    business_slug: string | null;
    business_latitude: number | null;
    business_longitude: number | null;
    featured_image_url: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    products: {
        data: ProductCard[];
        links: PaginationLink[];
    };
    filters: {
        search: string;
        type: 'all' | 'product' | 'service';
    };
    counts: {
        all: number;
        products: number;
        services: number;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Shops', href: '/shops' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export default function PublicShopsIndex({ products, filters, counts }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;
    const [activeOrderProductId, setActiveOrderProductId] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderErrors, setOrderErrors] = useState<Record<string, string>>({});
    const [orderForm, setOrderForm] = useState({
        quantity: '1',
        customer_contact: '',
        scheduled_at: '',
        notes: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        router.get(
            '/shops',
            {
                search: (formData.get('search') as string) ?? '',
                type: (formData.get('type') as string) ?? 'all',
            },
            { preserveState: true, replace: true },
        );
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationError(null);
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                setLocationError('Unable to get your location. Please allow location access.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            },
        );
    };

    const distanceKm = (item: ProductCard): number | null => {
        if (!userLocation || item.business_latitude === null || item.business_longitude === null) {
            return null;
        }

        const toRad = (value: number) => (value * Math.PI) / 180;
        const earthRadiusKm = 6371;
        const lat1 = toRad(userLocation.latitude);
        const lat2 = toRad(item.business_latitude);
        const dLat = lat2 - lat1;
        const dLng = toRad(item.business_longitude - userLocation.longitude);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    };

    const sortedProducts = useMemo(() => {
        if (!userLocation) {
            return products.data;
        }

        return [...products.data].sort((a, b) => {
            const aDistance = distanceKm(a);
            const bDistance = distanceKm(b);

            if (aDistance === null && bDistance === null) return 0;
            if (aDistance === null) return 1;
            if (bDistance === null) return -1;

            return aDistance - bDistance;
        });
    }, [products.data, userLocation]);

    const openOrderForm = (productId: number) => {
        setActiveOrderProductId(productId);
        setOrderErrors({});
        setOrderForm({
            quantity: '1',
            customer_contact: '',
            scheduled_at: '',
            notes: '',
        });
    };

    const submitOrder = (event: FormEvent<HTMLFormElement>, product: ProductCard) => {
        event.preventDefault();
        setOrderProcessing(true);
        setOrderErrors({});

        router.post(
            '/shops/orders',
            {
                business_product_id: product.id,
                quantity: Number(orderForm.quantity || 1),
                customer_contact: orderForm.customer_contact,
                scheduled_at: product.is_service && orderForm.scheduled_at ? orderForm.scheduled_at : null,
                notes: orderForm.notes,
                visitor_latitude: userLocation?.latitude ?? null,
                visitor_longitude: userLocation?.longitude ?? null,
            },
            {
                preserveScroll: true,
                onError: (errors) => setOrderErrors(errors as Record<string, string>),
                onFinish: () => setOrderProcessing(false),
                onSuccess: () => {
                    setActiveOrderProductId(null);
                    setOrderForm({
                        quantity: '1',
                        customer_contact: '',
                        scheduled_at: '',
                        notes: '',
                    });
                },
            },
        );
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Shops | TechTrek Labrador" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
                    <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                TechTrek Labrador
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Shops: Products and Services
                            </h1>
                            <p className="text-sm text-slate-600 md:text-base">
                                Browse offers from local businesses including food, stays, rentals, and services.
                            </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border bg-white px-3 py-1.5">All: <strong>{counts.all}</strong></span>
                            <span className="rounded-full border bg-white px-3 py-1.5">Products: <strong>{counts.products}</strong></span>
                            <span className="rounded-full border bg-white px-3 py-1.5">Services: <strong>{counts.services}</strong></span>
                            <Button type="button" variant="outline" size="sm" className="h-8" onClick={requestLocation}>
                                <LocateFixed className="mr-1.5 h-3.5 w-3.5" />
                                Use my location
                            </Button>
                        </div>
                        {locationError && <p role="status" aria-live="polite" className="mt-2 text-xs text-rose-600">{locationError}</p>}
                        {userLocation && (
                            <p role="status" aria-live="polite" className="mt-2 text-xs text-emerald-700">
                                Showing nearest offers first based on your current location.
                            </p>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_auto]"
                        >
                            <div className="relative">
                                <label htmlFor="shops-search" className="sr-only">
                                    Search products and services
                                </label>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="shops-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search by product name, category, or keyword"
                                    className="pl-9"
                                />
                            </div>

                            <label htmlFor="shops-type" className="sr-only">
                                Filter by offer type
                            </label>
                            <select
                                id="shops-type"
                                name="type"
                                defaultValue={filters.type}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            >
                                <option value="all">All offers</option>
                                <option value="product">Products only</option>
                                <option value="service">Services only</option>
                            </select>

                            <Button type="submit">Apply Filters</Button>
                        </form>
                    </section>

                    {success && (
                        <div role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    {products.data.length === 0 && (
                        <div role="status" aria-live="polite" className="rounded-xl border border-dashed bg-white p-12 text-center text-sm text-slate-600">
                            No products/services found for this filter.
                        </div>
                    )}

                    <section aria-label="Products and services list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {sortedProducts.map((item) => (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
                            >
                                <div className="aspect-[16/10] bg-slate-100">
                                    {item.featured_image_url ? (
                                        <img
                                            src={item.featured_image_url}
                                            alt={item.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 id={`shop-item-title-${item.id}`} className="text-lg font-semibold leading-tight">{item.name}</h2>
                                        <Badge variant={item.is_service ? 'secondary' : 'outline'}>
                                            {item.is_service ? 'Service' : 'Product'}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-slate-600">{item.category || 'General'}</p>

                                    <div className="flex items-center justify-between text-sm">
                                        <p className="font-bold text-emerald-700">
                                            PHP {Number(item.price).toFixed(2)}
                                        </p>
                                        <p className="text-slate-500">
                                            <ShoppingBag className="mr-1 inline h-4 w-4" />
                                            Offer
                                        </p>
                                    </div>
                                    {userLocation && distanceKm(item) !== null && (
                                        <p className="text-xs font-medium text-emerald-700">
                                            Approx. {distanceKm(item)?.toFixed(2)} km from your location
                                        </p>
                                    )}

                                    <div className="border-t pt-3">
                                        <p className="mb-2 flex items-center gap-1.5 text-sm text-slate-600">
                                            <Store className="h-4 w-4 text-emerald-600" />
                                            {item.business_name || 'Local business'}
                                        </p>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {item.business_slug && (
                                                <Button asChild variant="outline" className="w-full">
                                                    <Link href={`/businesses/${item.business_slug}`}>View business</Link>
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={() => openOrderForm(item.id)}
                                                aria-expanded={activeOrderProductId === item.id}
                                                aria-controls={`shop-order-form-${item.id}`}
                                            >
                                                {item.is_service ? 'Book Service' : 'Order Product'}
                                            </Button>
                                        </div>
                                    </div>

                                    {activeOrderProductId === item.id && (
                                        <form
                                            id={`shop-order-form-${item.id}`}
                                            onSubmit={(event) => submitOrder(event, item)}
                                            className="mt-3 space-y-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3"
                                        >
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <div>
                                                    <label htmlFor={`quantity-${item.id}`} className="mb-1 block text-xs font-medium text-slate-700">
                                                        Quantity
                                                    </label>
                                                    <Input
                                                        id={`quantity-${item.id}`}
                                                        type="number"
                                                        min={1}
                                                        value={orderForm.quantity}
                                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                                    />
                                                    <InputError message={orderErrors.quantity} />
                                                </div>
                                                <div>
                                                    <label htmlFor={`contact-${item.id}`} className="mb-1 block text-xs font-medium text-slate-700">
                                                        Contact Number
                                                    </label>
                                                    <Input
                                                        id={`contact-${item.id}`}
                                                        value={orderForm.customer_contact}
                                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, customer_contact: e.target.value }))}
                                                        placeholder="09xx xxx xxxx"
                                                    />
                                                    <InputError message={orderErrors.customer_contact} />
                                                </div>
                                            </div>

                                            {item.is_service && (
                                                <div>
                                                    <label htmlFor={`scheduled-${item.id}`} className="mb-1 block text-xs font-medium text-slate-700">
                                                        Preferred Schedule (optional)
                                                    </label>
                                                    <Input
                                                        id={`scheduled-${item.id}`}
                                                        type="datetime-local"
                                                        value={orderForm.scheduled_at}
                                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, scheduled_at: e.target.value }))}
                                                    />
                                                    <InputError message={orderErrors.scheduled_at} />
                                                </div>
                                            )}

                                            <div>
                                                <label htmlFor={`notes-${item.id}`} className="mb-1 block text-xs font-medium text-slate-700">
                                                    Notes (optional)
                                                </label>
                                                <textarea
                                                    id={`notes-${item.id}`}
                                                    value={orderForm.notes}
                                                    onChange={(e) => setOrderForm((prev) => ({ ...prev, notes: e.target.value }))}
                                                    className="min-h-20 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                                                    placeholder="Pickup details, preferred time, etc."
                                                />
                                                <InputError message={orderErrors.notes} />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={orderProcessing}>
                                                    Confirm {item.is_service ? 'Booking' : 'Order'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setActiveOrderProductId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>

                    <nav aria-label="Shops pagination" className="flex flex-wrap gap-2">
                        {products.links.map((link, idx) => (
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
                                        <span aria-disabled="true">{cleanPaginationLabel(link.label)}</span>
                                    )}
                            </Button>
                        ))}
                    </nav>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
