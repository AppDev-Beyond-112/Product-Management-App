<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $user = DB::table('users')->where('username', $username)->first();

        if ($user && Hash::check($password, $user->password)) {
            $token = bin2hex(random_bytes(32));

            Session::put('user_token', $token);
            Session::put('user_id', $user->id);  

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Incorrect username or password'
            ]);
        }
    }

    public function isAuthenticated(Request $request)
    {
        $token = Session::get('user_token');

        if ($token) {
            return response()->json([
                'status' => 'success',
                'message' => 'User is authenticated'
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'User is not authenticated'
            ]);
        }
    }

    public function logout(Request $request)
    {
        Session::forget('user_token');
        Session::forget('user_id');
        Session::flush();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }
}
