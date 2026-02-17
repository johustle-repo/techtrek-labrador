import { Link, usePage } from '@inertiajs/react';
import { Banknote, Building2, CalendarDays, ClipboardList, Compass, LayoutGrid, MapPin, Megaphone, Menu, Package, ScrollText, Search, ShieldCheck, ShoppingBag, Users } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, NavItem } from '@/types';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { dashboard } from '@/routes';
import { dashboard as superadminDashboard } from '@/routes/superadmin';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth, owner_alerts } = page.props as {
        auth: { user: { role?: string; avatar?: string; name: string } };
        owner_alerts?: { pending_today?: number; pending_total?: number };
    };
    const role = auth?.user?.role;
    const pendingToday = owner_alerts?.pending_today ?? 0;
    const isVisitorRole = role === 'tourist' || role === 'visitor';
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();
    const dashboardRoute = role === 'super_admin'
        ? superadminDashboard()
        : role === 'lgu_admin'
            ? '/cms/dashboard'
            : role === 'business_owner'
                ? '/owner/dashboard'
                : role === 'tourist' || role === 'visitor'
                    ? '/visitor/home'
            : dashboard();
    const mainNavItems: NavItem[] = [
        {
            title: role === 'tourist' || role === 'visitor' ? 'Home' : 'Dashboard',
            href: dashboardRoute,
            icon: LayoutGrid,
        },
    ];
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
            title: 'User Management',
            href: '/superadmin/users',
            icon: Users,
        });
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
            title: 'Shops',
            href: '/shops',
            icon: ShoppingBag,
        });
    }
    return (
        <>
            <div
                className={cn(
                    'border-b backdrop-blur-sm',
                    isVisitorRole
                        ? 'border-emerald-900/70 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white'
                        : 'border-sidebar-border/80 bg-background/95',
                )}
            >
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        'mr-2 h-[34px] w-[34px]',
                                        isVisitorRole && 'text-white hover:bg-white/10 hover:text-white',
                                    )}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    prefetch
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                    {role === 'business_owner' && item.href === '/owner/orders' && pendingToday > 0 && (
                                                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                            {pendingToday}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboardRoute}
                        prefetch
                        className={cn('flex items-center space-x-2', isVisitorRole && 'text-white')}
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            prefetch
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(item.href, activeItemStyles),
                                                isVisitorRole &&
                                                    'bg-transparent text-emerald-100 hover:bg-white/10 hover:text-white',
                                                isVisitorRole &&
                                                    isCurrentUrl(item.href) &&
                                                    'bg-white/15 text-white',
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                            {role === 'business_owner' && item.href === '/owner/orders' && pendingToday > 0 && (
                                                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    {pendingToday}
                                                </span>
                                            )}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div
                                                className={cn(
                                                    'absolute bottom-0 left-0 h-0.5 w-full translate-y-px',
                                                    isVisitorRole ? 'bg-emerald-300' : 'bg-black dark:bg-white',
                                                )}
                                            ></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    'group h-9 w-9 cursor-pointer',
                                    isVisitorRole && 'text-white hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'size-10 rounded-full p-1',
                                        isVisitorRole && 'hover:bg-white/10',
                                    )}
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {!isVisitorRole && breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
