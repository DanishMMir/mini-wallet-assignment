<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $transactions = Transaction::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->with(['sender', 'receiver'])
            ->paginate(20);
        return response()->json([
            'balance' => $user->balance,
            'transactions' => $transactions
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01|max:1000000',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $sender = $request->user();
            $receiver = User::findOrFail($validated['receiver_id']);
            $amount = $validated['amount'];

            if ($sender->id === $receiver->id) {
                throw ValidationException::withMessages([
                    'receiver_id' => ['Cannot transfer to yourself']
                ]);
            }

            $commissionFee = round($amount * 0.015, 2);
            $totalDebit = $amount + $commissionFee;

            $sender = User::where('id', $sender->id)->lockForUpdate()->first();
            if ($sender->balance < $totalDebit) {
                throw ValidationException::withMessages([
                    'balance' => ['Insufficient funds']
                ]);
            }

            $sender->balance -= $totalDebit;
            $receiver->balance += $amount;

            $sender->save();
            $receiver->save();

            $transaction = Transaction::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'amount' => $amount,
                'commission_fee' => $commissionFee,
            ]);

            return response()->json([
                'message' => 'Transfer successful',
                'new_balance' => $sender->balance,
                'transaction_id' => $transaction->id
            ], 201);
        });
    }
}
