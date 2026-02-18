import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-emerald-700/60 bg-emerald-900 px-4 text-white shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-5">
            <div className="flex items-center gap-2.5">
                <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg border border-emerald-700/70 bg-emerald-800 text-white hover:bg-emerald-700" />
                <div className="[&_[data-slot=breadcrumb-list]]:text-emerald-100 [&_[data-slot=breadcrumb-link]]:text-emerald-100 [&_[data-slot=breadcrumb-link]]:hover:text-white [&_[data-slot=breadcrumb-page]]:text-white [&_[data-slot=breadcrumb-separator]]:text-emerald-300">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
