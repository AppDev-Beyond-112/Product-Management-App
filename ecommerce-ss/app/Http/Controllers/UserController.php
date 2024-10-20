<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $user = DB::table('users')->where('username', $username)->first();

        if ($user && $password === $user->password) {
            return response()->json(['status' => 'success', 'message' => 'User exists and password is correct']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Incorrect username or password']);
        }
    }
}
