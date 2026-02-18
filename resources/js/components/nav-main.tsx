import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

type NavMainProps = {
    items: NavItem[];
    role?: string;
};

export function NavMain({ items = [], role }: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const isVisitorRole = role === 'tourist' || role === 'visitor';

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-sidebar-foreground/75 uppercase tracking-[0.08em] group-data-[collapsible=icon]:hidden">
                {isVisitorRole ? 'Explore' : 'Platform'}
            </SidebarGroupLabel>
            <SidebarMenu
                className={
                    isVisitorRole
                        ? 'gap-2 group-data-[collapsible=icon]:mt-3 group-data-[collapsible=icon]:gap-3'
                        : 'gap-1.5 group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:gap-2'
                }
            >
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={{ children: item.title }}
                            className={
                                isVisitorRole
                                    ? 'h-11 rounded-2xl px-3.5 font-medium text-emerald-50/90 transition-all duration-200 hover:bg-emerald-800/70 hover:text-white data-[active=true]:bg-emerald-600/40 data-[active=true]:text-white data-[active=true]:ring-1 data-[active=true]:ring-emerald-300/35 group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:[&>span]:hidden'
                                    : 'h-10 rounded-xl px-3 font-medium transition-all duration-200 hover:translate-x-0.5 hover:bg-sidebar-accent/90 data-[active=true]:bg-teal-500/18 data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-teal-200/35 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden'
                            }
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <item.icon
                                        className={
                                            isVisitorRole
                                                ? 'h-4.5 w-4.5 opacity-95 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6'
                                                : 'h-4.5 w-4.5 opacity-95 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5'
                                        }
                                    />
                                )}
                                <span>{item.title}</span>
                                {active && (
                                    <span className={isVisitorRole ? 'ml-auto h-2 w-2 rounded-full bg-emerald-200' : 'ml-auto h-2 w-2 rounded-full bg-teal-300'} />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )})}
            </SidebarMenu>
        </SidebarGroup>
    );
}
