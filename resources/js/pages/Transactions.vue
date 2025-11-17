<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { transactions } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import PlaceholderPattern from '../components/PlaceholderPattern.vue';
import { onMounted } from 'vue';
import { useTransactions } from '@/composables/useTransactions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: transactions().url,
    },
];

const {
    data: transactionsList,
    balance,
    loading,
    error,
    page,
    lastPage,
    fetchTransactions,
} = useTransactions();

onMounted(() => {
    fetchTransactions();
});

function nextPage() {
    if (lastPage.value && page.value < lastPage.value) {
        fetchTransactions(page.value + 1);
    }
}

function prevPage() {
    if (page.value > 1) {
        fetchTransactions(page.value - 1);
    }
}

</script>

<template>
    <Head title="Transactions" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div
            class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
        >
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <PlaceholderPattern />
                </div>
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <PlaceholderPattern />
                </div>
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <PlaceholderPattern />
                </div>
            </div>

            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <h1 class="text-2xl font-semibold">Transactions</h1>
                    <span v-if="loading" class="text-sm text-muted-foreground">Loading...</span>
                    <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
                </div>
                <h1 class="text-2xl font-semibold">Current Balance: {{ balance }}</h1>
            </div>
            <div
                class="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border"
            >
                <table class="w-full text-sm">
                    <thead>
                    <tr class="bg-muted/40">
                        <th class="px-3 py-2 text-left">ID</th>
                        <th class="px-3 py-2 text-left">Amount</th>
                        <th class="px-3 py-2 text-left">Commission Fee</th>
                        <th class="px-3 py-2 text-left">Type</th>
                        <th class="px-3 py-2 text-left">Sender</th>
                        <th class="px-3 py-2 text-left">Receiver</th>
                        <th class="px-3 py-2 text-left">Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="t in transactionsList" :key="t.id" class="border-t">
                        <td class="px-3 py-2">{{ t.id }}</td>
                        <td class="px-3 py-2">{{ t.amount }}</td>
                        <td class="px-3 py-2">{{ t.commission_fee }}</td>
                        <td class="px-3 py-2">{{ t.sender_id === $page.props.auth.user.id ? 'Debit' : 'Credit' }}</td>
                        <td class="px-3 py-2">{{ t.sender.name }}</td>
                        <td class="px-3 py-2">{{ t.receiver.name }}</td>
                        <td class="px-3 py-2">{{ new Date(t.created_at).toLocaleString() }}</td>
                    </tr>
                    <tr v-if="!loading && transactionsList.length === 0">
                        <td colspan="6" class="px-3 py-6 text-center text-muted-foreground">
                            No transactions found.
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex items-center gap-2 justify-end">
                <button
                    class="rounded border px-3 py-1 disabled:opacity-50"
                    :disabled="page <= 1 || loading"
                    @click="prevPage"
                >Prev</button>
                <span class="text-sm">Page {{ page }}<span v-if="lastPage"> / {{ lastPage }}</span></span>
                <button
                    class="rounded border px-3 py-1 disabled:opacity-50"
                    :disabled="lastPage && page >= lastPage || loading"
                    @click="nextPage"
                >Next</button>
            </div>
        </div>
    </AppLayout>
</template>
