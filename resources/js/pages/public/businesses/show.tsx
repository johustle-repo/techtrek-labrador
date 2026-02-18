import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type BusinessDetail = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    latitude: number | null;
    longitude: number | null;
    featured_image_url: string | null;
};

type RelatedBusiness = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    featured_image_url: string | null;
};

type Props = {
    business: BusinessDetail;
    related: RelatedBusiness[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visitor', href: '/visitor/home' },
    { title: 'Businesses', href: '/businesses' },
];

export default function PublicBusinessShow({ business, related }: Props) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`${business.name} | TechTrek Labrador`} />

            <div className="visitor-page min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <Button asChild variant="outline">
                            <Link href="/businesses">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to directory
                            </Link>
                        </Button>
                    </div>

                    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="aspect-[16/8] bg-slate-100">
                            {business.featured_image_url ? (
                                <img
                                    src={business.featured_image_url}
                                    alt={business.name}
                                    loading="eager"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:p-7">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                {business.category || 'Local Directory'}
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {business.name}
                            </h1>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <p className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                {business.address || 'Address not set'}
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4 text-emerald-600" />
                                {business.contact_email || 'No contact email'}
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Phone className="h-4 w-4 text-emerald-600" />
                                {business.contact_phone || 'No contact phone'}
                            </p>
                        </div>

                        <div className="prose mt-6 max-w-none prose-slate">
                            <p>{business.description || 'No description available.'}</p>
                        </div>

                        {(business.latitude || business.longitude) && (
                            <p className="mt-5 text-sm text-slate-600">
                                Coordinates: {business.latitude ?? 'N/A'},{' '}
                                {business.longitude ?? 'N/A'}
                            </p>
                        )}
                        </div>
                    </article>

                    {related.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold">
                                Related businesses
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/businesses/${item.slug}`}
                                        className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="aspect-[16/9] bg-slate-100">
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
                                        <div className="p-4">
                                            <p className="text-lg font-semibold leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {item.category || 'Local directory'}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {item.address || 'Address not set'}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {item.contact_phone || 'No contact phone'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </AppHeaderLayout>
    );
}
