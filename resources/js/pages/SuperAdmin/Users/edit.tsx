import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/superadmin';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserModel = {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'lgu_admin' | 'business_owner' | 'tourist' | 'visitor';
    email_verified: boolean;
};

type Props = {
    user: UserModel;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Super Admin', href: dashboard().url },
    { title: 'Users', href: '/superadmin/users' },
    { title: 'Edit', href: '#' },
];

export default function SuperAdminUsersEdit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        role: user.role ?? 'visitor',
        password: '',
        password_confirmation: '',
        email_verified: user.email_verified ?? false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/superadmin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit User
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update role, credentials, and verification.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/superadmin/users">Back to List</Link>
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
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="lgu_admin">LGU Admin</option>
                            <option value="business_owner">Business Owner</option>
                            <option value="tourist">Tourist</option>
                            <option value="visitor">Visitor</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password (optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="email_verified"
                            checked={data.email_verified}
                            onCheckedChange={(checked) =>
                                setData('email_verified', Boolean(checked))
                            }
                        />
                        <Label htmlFor="email_verified">
                            Mark email as verified
                        </Label>
                    </div>
                    <InputError message={errors.email_verified} />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update User
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/superadmin/users">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
