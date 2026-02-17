import { Head, Link, router, usePage } from '@inertiajs/react';
import { ImageOff, Package } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductRow = {
    id: number;
    business: string | null;
    name: string;
    category: string | null;
    price: string;
    is_service: boolean;
    status: string;
    featured_image_url: string | null;
    updated_at: string | null;
};

type Props = {
    products: {
        data: ProductRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/dashboard' },
    { title: 'Products', href: '/owner/products' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function statusVariant(status: string) {
    if (status === 'active') return 'default';
    if (status === 'inactive') return 'secondary';
    return 'outline';
}

export default function OwnerProductsIndex({ products }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;

    const handleDelete = (id: number) => {
        if (!confirm('Delete this product/service?')) {
            return;
        }
        router.delete(`/owner/products/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        Owner Module
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Manage Products</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add and maintain products/services for your business listings.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/owner/products/create">New Product/Service</Link>
                        </Button>
                    </div>
                </div>

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Product & Service Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {products.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No products or services yet.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-2">
                            {products.data.map((item) => (
                                <div key={item.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                                    <div className="relative h-44 w-full overflow-hidden border-b bg-muted/40">
                                        {item.featured_image_url ? (
                                            <img
                                                src={item.featured_image_url}
                                                alt={item.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                <span className="inline-flex items-center gap-2">
                                                    <ImageOff className="h-4 w-4" />
                                                    No image
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-lg font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.business ?? 'No business'} | {item.category ?? 'No category'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={item.is_service ? 'secondary' : 'outline'}>
                                                    {item.is_service ? 'Service' : 'Product'}
                                                </Badge>
                                                <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">PHP {Number(item.price).toFixed(2)}</p>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/owner/products/${item.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
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
                                        <span>{cleanPaginationLabel(link.label)}</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
