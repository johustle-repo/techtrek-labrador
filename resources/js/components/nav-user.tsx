import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';

type NavUserProps = {
    role?: string;
};

export function NavUser({ role }: NavUserProps) {
    const { auth } = usePage().props as { auth: { user: any } };
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const cleanup = useMobileNavigation();
    const isVisitorRole = role === 'tourist' || role === 'visitor';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            type="button"
                            className={cn(
                                'group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent',
                                isVisitorRole && 'h-12 rounded-2xl bg-emerald-800/45 text-emerald-50 hover:bg-emerald-700/55',
                            )}
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="z-[120] w-56 rounded-lg"
                        align={isMobile ? 'end' : 'start'}
                        sideOffset={8}
                        collisionPadding={12}
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'right'
                                  : 'top'
                        }
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                                <UserInfo user={auth.user} showEmail={true} />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                cleanup();
                                router.visit('/settings/profile');
                            }}
                        >
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                cleanup();
                                router.post('/logout');
                            }}
                            data-test="logout-button"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
