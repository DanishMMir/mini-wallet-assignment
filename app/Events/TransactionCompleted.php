<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionCompleted implements ShouldBroadcast{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Transaction $transaction;
    public $senderBalance;
    public $receiverBalance;

    public function __construct(Transaction $transaction, $senderBalance, $receiverBalance)
    {
        $this->transaction = $transaction;
        $this->senderBalance = $senderBalance;
        $this->receiverBalance = $receiverBalance;
    }

    public function broadcastOn(): array    {
        return [
            new Channel('user-' . $this->transaction->sender_id),
            new Channel('user-' . $this->transaction->receiver_id),
        ];
    }

    public function broadcastAs(): string    {
        return 'transaction.completed';
    }

    public function broadcastWith(): array    {
        return [
            'transaction' => $this->transaction,
            'sender_balance' => $this->senderBalance,
            'receiver_balance' => $this->receiverBalance,
        ];
    }
}
