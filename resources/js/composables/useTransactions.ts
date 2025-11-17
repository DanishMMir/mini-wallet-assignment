import { ref } from 'vue';
import type { Transaction } from '@/types/transaction';

export function useTransactions() {
  const data = ref<Transaction[]>([]);
  const balance = ref<string | null>(null);
  const transactionListLoading = ref(false);
  const transactionSaveLoading = ref(false);
  const transactionListError = ref<string | null>(null);
  const transactionSaveError = ref<string | null>(null);
  const page = ref(1);
  const lastPage = ref<number | null>(null);
  const sendAmount = ref<number | null>(null);
  const selectedRecipient = ref<string | null>(null);

  async function fetchTransactions(p: number = 1) {
      transactionListLoading.value = true;
      transactionListError.value = null;
    try {
      const res = await fetch(`/api/transactions?page=${p}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`Failed (${res.statusText} - ${res.status})`);
      const json = await res.json();
      balance.value = json.balance;
      data.value = json.transactions.data;
      page.value = json.transactions.current_page;
      lastPage.value = json.transactions.last_page;
    } catch (e: any) {
        transactionListError.value = e.message;
    } finally {
        transactionListLoading.value = false;
    }
  }
  function sendMoney() {
    if (!sendAmount.value || !selectedRecipient.value) return;
    transactionSaveLoading.value = true;
    transactionSaveError.value = null;
    fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({
            receiver_id: selectedRecipient.value,
            amount: sendAmount.value,
        }),
    })
        .then(async res => {
            if (!res.ok) throw new Error(`Failed (${res.statusText} - ${res.status})`);
            await fetchTransactions();
        })
        .catch(e => {
            transactionSaveError.value = e.message;
        })
        .finally(() => {
            transactionSaveLoading.value = false;

        });
}

  return { data, balance, transactionListLoading, transactionSaveLoading, transactionListError, transactionSaveError, page, lastPage, fetchTransactions, sendAmount, selectedRecipient, sendMoney };
}
