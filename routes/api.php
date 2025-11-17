<?php

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/tokens/create', [UserController::class, 'createToken']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', function (Request $request) {
        return response()->json([
            'users' => User::all()
        ]);
    });
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
});
