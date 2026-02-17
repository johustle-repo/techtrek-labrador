import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'CMS', href: '/cms/dashboard' },
    { title: 'Announcements', href: '/cms/announcements' },
    { title: 'Create', href: '/cms/announcements/create' },
];

export default function AnnouncementsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        is_pinned: false,
        status: 'draft',
        published_at: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/cms/announcements');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Announcement" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Announcement
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Post an official tourism notice or advisory.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/cms/announcements">Back to List</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid gap-5 max-w-3xl">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="min-h-40 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        />
                        <InputError message={errors.content} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Published At</Label>
                            <input
                                id="published_at"
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) =>
                                    setData('published_at', e.target.value)
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            />
                            <InputError message={errors.published_at} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_pinned"
                            checked={data.is_pinned}
                            onCheckedChange={(checked) =>
                                setData('is_pinned', Boolean(checked))
                            }
                        />
                        <Label htmlFor="is_pinned">Pin this announcement</Label>
                    </div>
                    <InputError message={errors.is_pinned} />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Announcement
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/cms/announcements">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
