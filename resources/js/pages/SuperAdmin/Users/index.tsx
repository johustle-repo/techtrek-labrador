import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Plus, Shield, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/superadmin';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'lgu_admin' | 'business_owner' | 'tourist' | 'visitor';
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
};

type Props = {
    users: {
        data: UserRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    flash?: { success?: string; error?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Super Admin', href: dashboard().url },
    { title: 'Users', href: '/superadmin/users' },
];

function cleanPaginationLabel(label: string) {
    return label
        .replace('&laquo;', '<<')
        .replace('&raquo;', '>>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function roleVariant(role: UserRow['role']) {
    if (role === 'super_admin') return 'default';
    if (role === 'lgu_admin') return 'secondary';
    return 'outline';
}

function formatRole(role: UserRow['role']) {
    return role.replaceAll('_', ' ');
}

export default function SuperAdminUsersIndex({ users }: Props) {
    const page = usePage<Props>();
    const success = page.props.flash?.success;
    const error = page.props.flash?.error;
    const totalRecords = users.data.length;

    const handleDelete = (id: number) => {
        if (!confirm('Delete this user account?')) {
            return;
        }

        router.delete(`/superadmin/users/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Users" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50/70 via-background to-background p-5 md:p-6">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-2xl" />
                    <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <Shield className="h-3.5 w-3.5" />
                                Super Admin Module
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                User Management
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage platform accounts, roles, and verification status.
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-start gap-3 md:w-auto md:justify-end">
                            <div className="min-w-[160px] rounded-xl border bg-white/80 px-4 py-2 text-sm">
                                <p className="text-muted-foreground">
                                    Total records
                                </p>
                                <p className="text-lg font-semibold">
                                    {totalRecords}
                                </p>
                            </div>
                            <Button asChild className="h-11 px-5">
                                <Link href="/superadmin/users/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New User
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

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>User Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {users.data.length === 0 && (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                No users found.
                            </div>
                        )}

                        {users.data.length > 0 && (
                            <div className="overflow-hidden rounded-xl border">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-muted/60">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                    Name
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                    Email
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                    Role
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                    Verification
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                    Created
                                                </th>
                                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-t transition-colors hover:bg-muted/40"
                                                >
                                                    <td className="px-4 py-3 font-medium">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {item.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={roleVariant(item.role)}>
                                                            {formatRole(item.role)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                                                            {item.email_verified_at ? (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-amber-500" />
                                                            )}
                                                            {item.email_verified_at
                                                                ? 'Verified'
                                                                : 'Not verified'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {item.created_at
                                                            ? new Date(
                                                                  item.created_at,
                                                              ).toLocaleString()
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" asChild size="sm">
                                                                <Link href={`/superadmin/users/${item.id}/edit`}>
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                            {users.links.map((link, idx) => (
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
                                        <span>
                                            {cleanPaginationLabel(link.label)}
                                        </span>
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
