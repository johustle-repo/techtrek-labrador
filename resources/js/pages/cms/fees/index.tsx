import { Head, Link, router, usePage } from '@inertiajs/react';
import { Banknote, Clock3, Layers3, Percent, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FeeRow = {
    id: number;
    name: string;
    type: string;
    charge_basis: 'fixed' | 'percent' | string;
    amount: string;
    minimum_amount: string | null;
    status: 'draft' | 'active' | 'inactive' | 'archived' | string;
    effective_from: string | null;
    effective_to: string | null;
    updated_at: string | null;
};

type Props = {
    fees: {
        data: FeeRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    summary: {
        total: number;
        active: number;
        draft: number;
        inactive: number;
        archived: number;
        by_type: {
            environmental_fee: number;
            business_commission: number;
            event_commission: number;
            ad_promotion_fee: number;
        };
    };
    flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Fee Management', href: '/cms/fees' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function formatText(value: string) {
    return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusVariant(status: FeeRow['status']) {
    if (status === 'active') return 'default';
    if (status === 'inactive') return 'secondary';
    if (status === 'archived') return 'outline';
    return 'outline';
}

function formatAmount(item: FeeRow) {
    const amount = Number(item.amount || 0);
    if (item.charge_basis === 'percent') {
        return `${amount}%`;
    }
    return `PHP ${amount.toFixed(2)}`;
}

export default function FeesIndex({ fees, summary }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;
    const totalRecords = summary.total;

    const handleDelete = (id: number) => {
        if (!confirm('Delete this fee rule? This action cannot be undone.')) {
            return;
        }

        router.delete(`/cms/fees/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Management" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Layers3 className="h-3.5 w-3.5" />
                                Monetization Module
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Fee Management
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure environmental fees, commissions, and ad promotion rates.
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-start gap-3 md:w-auto md:justify-end">
                            <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">Total rules</p>
                                <p className="text-lg font-semibold">{totalRecords}</p>
                            </div>
                            <Button asChild className="h-11 px-5">
                                <Link href="/cms/fees/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Fee Rule
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-sm text-muted-foreground">Active rules</p>
                        <p className="text-2xl font-bold">{summary.active}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-sm text-muted-foreground">Environmental fees</p>
                        <p className="text-2xl font-bold">{summary.by_type.environmental_fee}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-sm text-muted-foreground">Business commissions</p>
                        <p className="text-2xl font-bold">{summary.by_type.business_commission}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-sm text-muted-foreground">Event + Ad fees</p>
                        <p className="text-2xl font-bold">
                            {summary.by_type.event_commission + summary.by_type.ad_promotion_fee}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Fee Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {fees.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No fee rules yet. Add your first monetization rule.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-2">
                            {fees.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="space-y-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-lg font-semibold leading-tight">{item.name}</p>
                                        <Badge variant={statusVariant(item.status)}>{formatText(item.status)}</Badge>
                                    </div>

                                    <div className="space-y-1.5 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4" />
                                            Type: {formatText(item.type)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Percent className="h-4 w-4" />
                                            Charge: {formatAmount(item)} ({formatText(item.charge_basis)})
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock3 className="h-4 w-4" />
                                            Effective: {item.effective_from ? new Date(item.effective_from).toLocaleString() : 'Immediate'}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <Button variant="outline" asChild>
                                            <Link href={`/cms/fees/${item.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {fees.links.map((link, idx) => (
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
