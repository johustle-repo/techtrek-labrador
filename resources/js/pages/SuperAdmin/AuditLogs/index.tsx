import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ScrollText, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/superadmin';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuditRow = {
    id: number;
    actor: string;
    actor_email: string | null;
    action: string;
    module: string;
    target_id: number | null;
    ip_address: string | null;
    created_at: string | null;
};

type Props = {
    logs: {
        data: AuditRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        module: string;
        action: string;
        actor: string;
        start_date: string;
        end_date: string;
    };
    modules: string[];
    actions: string[];
    actors: Array<{ id: number; name: string }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Super Admin', href: dashboard().url },
    { title: 'Audit Logs', href: '/superadmin/audit-logs' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function formatText(value: string) {
    return value.replaceAll('_', ' ');
}

function actionVariant(action: string) {
    if (action === 'create') return 'default';
    if (action === 'update') return 'secondary';
    if (action === 'delete') return 'destructive';
    return 'outline';
}

export default function SuperAdminAuditLogsIndex({
    logs,
    filters,
    modules,
    actions,
    actors,
}: Props) {
    const [form, setForm] = useState(filters);

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get('/superadmin/audit-logs', form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const cleared = {
            search: '',
            module: '',
            action: '',
            actor: '',
            start_date: '',
            end_date: '',
        };
        setForm(cleared);
        router.get('/superadmin/audit-logs', cleared, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Audit Logs" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Shield className="h-3.5 w-3.5" />
                                Super Admin Security
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Activity Audit Logs
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Track create, update, and delete actions across modules.
                            </p>
                        </div>

                        <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                            <p className="text-muted-foreground">Shown records</p>
                            <p className="text-lg font-semibold">{logs.data.length}</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScrollText className="h-4 w-4" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-3">
                            <div className="grid gap-2 md:col-span-3">
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    value={form.search}
                                    placeholder="module, action, user name, email, target id"
                                    onChange={(e) => setForm((prev) => ({ ...prev, search: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="module">Module</Label>
                                <select
                                    id="module"
                                    value={form.module}
                                    onChange={(e) => setForm((prev) => ({ ...prev, module: e.target.value }))}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="">All modules</option>
                                    {modules.map((module) => (
                                        <option key={module} value={module}>
                                            {formatText(module)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="action">Action</Label>
                                <select
                                    id="action"
                                    value={form.action}
                                    onChange={(e) => setForm((prev) => ({ ...prev, action: e.target.value }))}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="">All actions</option>
                                    {actions.map((action) => (
                                        <option key={action} value={action}>
                                            {formatText(action)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="actor">Actor</Label>
                                <select
                                    id="actor"
                                    value={form.actor}
                                    onChange={(e) => setForm((prev) => ({ ...prev, actor: e.target.value }))}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="">All users</option>
                                    {actors.map((actor) => (
                                        <option key={actor.id} value={String(actor.id)}>
                                            {actor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">From Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date">To Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                                />
                            </div>

                            <div className="flex items-end gap-2 md:col-span-3">
                                <Button type="submit">Apply Filters</Button>
                                <Button type="button" variant="outline" onClick={resetFilters}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {logs.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No audit logs for the selected filters.
                            </div>
                        )}

                        {logs.data.length > 0 && (
                            <div className="overflow-hidden rounded-xl border">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-muted/60">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actor</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Module</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Target ID</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.data.map((item) => (
                                                <tr key={item.id} className="border-t transition-colors hover:bg-muted/40">
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{item.actor}</p>
                                                        {item.actor_email && (
                                                            <p className="text-xs text-muted-foreground">{item.actor_email}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={actionVariant(item.action)}>{formatText(item.action)}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">{formatText(item.module)}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {item.target_id ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {item.ip_address ?? '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                            {logs.links.map((link, idx) => (
                                <Button
                                    key={`${link.label}-${idx}`}
                                    asChild={Boolean(link.url)}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url} preserveScroll preserveState>
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
