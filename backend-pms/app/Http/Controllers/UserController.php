<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;

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
    
        // Fetch the user and ensure the role is included
        $user = DB::table('users')->where('name', $username)->first();
    
        if ($user && Hash::check($password, $user->password)) {
            $token = bin2hex(random_bytes(32)); // Generate a session token
    
            // Store the token in session or database
            Session::put('user_token', $token);
            Session::put('user_id', $user->id);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'role' => $user->role, // Return the role
                'token' => $token
            ]);
        }
    
        return response()->json([
            'status' => 'error',
            'message' => 'Incorrect username or password'
        ], 401);
    }
    

    public function isAuthenticated(Request $request)
    {
        $token = Session::get('user_token'); // Retrieve the token from the session
    
        if ($token) {
            // Retrieve the user's data from the session
            $userId = Session::get('user_id');
    
            // Fetch the user's role from the database
            $user = DB::table('users')->where('id', $userId)->first();
    
            if ($user) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'User is authenticated',
                    'role' => $user->role // Include the role in the response
                ]);
            }
        }
    
        return response()->json([
            'status' => 'error',
            'message' => 'User is not authenticated'
        ], 401);
    }
    

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contactNum' => 'required|digits_between:10,12',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = DB::table('users')->insert([
            'name' => $request->input('name'),
            'address' => $request->input('address'),
            'email' => $request->input('email'),
            'contactNum' => $request->input('contactNum'),
            'password' => Hash::make($request->input('password')),
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($user) {
            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully'
            ], 201);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Registration failed'
        ], 500);
    }


    public function logout(Request $request)
    {
        // Destroy the user session
        Session::forget('user_token');
        Session::forget('user_id');

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }
}
