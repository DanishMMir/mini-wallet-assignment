import { InertiaLinkProps } from '@inertiajs/vue3';
import type { LucideIcon } from 'lucide-vue-next';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
}

export type AppPageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    sender_id: number;
    receiver_id: number;
    amount: number;
    commission_fee: number;
    created_at: string;
    sender?: Pick<User, 'id'|'name'>;
    receiver?: Pick<User, 'id'|'name'>;
}

export interface TransactionsResponse {
    balance: number;
    transactions: {
        data: Transaction[];
    };
}

export type BreadcrumbItemType = BreadcrumbItem;
