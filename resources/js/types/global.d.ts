import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            owner_alerts: {
                pending_today: number;
                pending_total: number;
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
