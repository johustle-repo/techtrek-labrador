import { Link, usePage } from '@inertiajs/react';
import { Banknote, Building2, CalendarDays, ClipboardList, Compass, LayoutGrid, MapPin, Megaphone, Package, ScrollText, ShieldCheck, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { dashboard as superadminDashboard } from '@/routes/superadmin';

export function AppSidebar() {
    const page = usePage();
    const { auth } = page.props as { auth: { user?: { role?: string } } };
    const role = auth?.user?.role;
    const isVisitorRole = role === 'tourist' || role === 'visitor';
    const dashboardRoute = role === 'super_admin'
        ? superadminDashboard().url
        : role === 'lgu_admin'
            ? '/cms/dashboard'
            : role === 'business_owner'
                ? '/owner/dashboard'
                : role === 'tourist' || role === 'visitor'
                    ? '/visitor/home'
                : dashboard().url;

    const mainNavItems: NavItem[] = [
        {
            title: role === 'tourist' || role === 'visitor' ? 'Home' : 'Dashboard',
            href: dashboardRoute,
            icon: LayoutGrid,
        },
    ];

    if (role === 'super_admin') {
        mainNavItems.push({
            title: 'User Management',
            href: '/superadmin/users',
            icon: Users,
        });
    }

    if (role === 'lgu_admin' || role === 'super_admin') {
        mainNavItems.push({
            title: 'CMS Attractions',
            href: '/cms/attractions',
            icon: MapPin,
        });
        mainNavItems.push({
            title: 'CMS Events',
            href: '/cms/events',
            icon: CalendarDays,
        });
        mainNavItems.push({
            title: 'CMS Businesses',
            href: '/cms/businesses',
            icon: Building2,
        });
        mainNavItems.push({
            title: 'CMS Announcements',
            href: '/cms/announcements',
            icon: Megaphone,
        });
        mainNavItems.push({
            title: 'CMS Orders',
            href: '/cms/orders',
            icon: ClipboardList,
        });
        mainNavItems.push({
            title: 'Fee Management',
            href: '/cms/fees',
            icon: Banknote,
        });
        mainNavItems.push({
            title: 'Moderation Queue',
            href: '/cms/moderation',
            icon: ShieldCheck,
        });
    }

    if (role === 'super_admin') {
        mainNavItems.push({
            title: 'Audit Logs',
            href: '/superadmin/audit-logs',
            icon: ScrollText,
        });
    }

    if (role === 'business_owner') {
        mainNavItems.push({
            title: 'Manage Business',
            href: '/owner/businesses',
            icon: Building2,
        });
        mainNavItems.push({
            title: 'Manage Products',
            href: '/owner/products',
            icon: Package,
        });
        mainNavItems.push({
            title: 'Orders/Services',
            href: '/owner/orders',
            icon: ClipboardList,
        });
        mainNavItems.push({
            title: 'Fee Management',
            href: '/owner/fees',
            icon: Banknote,
        });
    }

    if (role === 'tourist' || role === 'visitor') {
        mainNavItems.push({
            title: 'Attractions',
            href: '/attractions',
            icon: Compass,
        });
        mainNavItems.push({
            title: 'Events',
            href: '/events',
            icon: CalendarDays,
        });
        mainNavItems.push({
            title: 'My Orders',
            href: '/visitor/orders',
            icon: ClipboardList,
        });
        mainNavItems.push({
            title: 'My Bookings',
            href: '/visitor/bookings',
            icon: CalendarDays,
        });
        mainNavItems.push({
            title: 'Interactive Map',
            href: '/map',
            icon: MapPin,
        });
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className={isVisitorRole ? 'border-r border-emerald-800/70 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950' : ''}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardRoute} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} role={role} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser role={role} />
            </SidebarFooter>
        </Sidebar>
    );
}
