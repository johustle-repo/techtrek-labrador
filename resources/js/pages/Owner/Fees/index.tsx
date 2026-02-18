import { Head } from '@inertiajs/react';
import { Banknote } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    summary: {
        business_count: number;
        monthly_revenue: number;
        completed_orders: number;
        estimated_total_fees: number;
    };
    fees: Array<{
        id: number;
        name: string;
        type: string;
        charge_basis: string;
        amount: string;
        minimum_amount: string | null;
        description: string | null;
        estimated_monthly_fee: number;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner', href: '/owner/dashboard' },
    { title: 'Fee Management', href: '/owner/fees' },
];

function formatText(value: string) {
    return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OwnerFeesIndex({ summary, fees }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Fee Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Banknote className="h-3.5 w-3.5" />
                        Owner Module
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Fee Management</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View applied LGU fee rules and estimated monthly deductions.
                    </p>
                </div>

                <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">My Businesses</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{summary.business_count}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            PHP {summary.monthly_revenue.toFixed(2)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Completed Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{summary.completed_orders}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Estimated Fees</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            PHP {summary.estimated_total_fees.toFixed(2)}
                        </CardContent>
                    </Card>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Fee Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {fees.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No active fee rules yet.
                            </div>
                        )}
                        {fees.map((fee) => (
                            <div key={fee.id} className="rounded-xl border p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-lg font-semibold">{fee.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatText(fee.type)}</p>
                                    </div>
                                    <Badge variant="outline">{formatText(fee.charge_basis)}</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{fee.description ?? 'No description'}</p>
                                <div className="mt-3 grid gap-1 text-sm">
                                    <p>
                                        Rule Amount: {fee.charge_basis === 'percent'
                                            ? `${Number(fee.amount).toFixed(2)}%`
                                            : `PHP ${Number(fee.amount).toFixed(2)}`}
                                    </p>
                                    <p>
                                        Minimum: {fee.minimum_amount ? `PHP ${Number(fee.minimum_amount).toFixed(2)}` : 'None'}
                                    </p>
                                    <p className="font-medium">
                                        Estimated Monthly Deduction: PHP {fee.estimated_monthly_fee.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
