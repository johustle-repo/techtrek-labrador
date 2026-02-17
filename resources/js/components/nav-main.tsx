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

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-sidebar-foreground/75 uppercase tracking-[0.08em]">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={{ children: item.title }}
                            className="h-10 rounded-xl px-3 font-medium transition-all duration-200 hover:translate-x-0.5 hover:bg-sidebar-accent/90 data-[active=true]:bg-teal-500/18 data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-teal-200/35"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <item.icon className="h-4 w-4 opacity-95" />
                                )}
                                <span>{item.title}</span>
                                {active && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-teal-300" />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )})}
            </SidebarMenu>
        </SidebarGroup>
    );
}
