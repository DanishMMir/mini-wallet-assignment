<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTokenRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function createToken(CreateTokenRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

}
