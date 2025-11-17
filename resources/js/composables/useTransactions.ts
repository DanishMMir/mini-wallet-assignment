import { ref } from 'vue';
import type { Transaction } from '@/types/transaction';

export function useTransactions() {
  const data = ref<Transaction[]>([]);
  const balance = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(1);
  const lastPage = ref<number | null>(null);
  const sendAmount = ref<number | null>(null);
  const selectedRecipient = ref<string | null>(null);

  async function fetchTransactions(p: number = 1) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/transactions?page=${p}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const json = await res.json();
      console.log(json);
      balance.value = json.balance;
      data.value = json.transactions.data;
      page.value = json.transactions.current_page;
      lastPage.value = json.transactions.last_page;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }
  function sendMoney() {
    if (!sendAmount.value || !selectedRecipient.value) return;
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
            if (!res.ok) throw new Error(`Failed (${res.status})`);
            await fetchTransactions();
        })
        .catch(e => {
            error.value = e.message;
        });
}

  return { data, balance, loading, error, page, lastPage, fetchTransactions, sendAmount, selectedRecipient, sendMoney };
}
