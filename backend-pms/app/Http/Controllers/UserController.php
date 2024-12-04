<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use App\Models\Product;

class UserController extends Controller
{
    public function viewCart()
    {
        $cart = session()->get('cart', []);
        $productDetails = Product::whereIn('id', array_keys($cart))->get();
    
        $cartWithDetails = $productDetails->map(function ($product) use ($cart) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'quantity' => $cart[$product->id],
                'price' => $product->price,
            ];
        });
    
        return response()->json(['cart' => $cartWithDetails]);
    }
    
    public function removeProductFromCart($id)
    {
        $cart = session()->get('cart', []);
        if (isset($cart[$id])) {
            unset($cart[$id]);
            session()->put('cart', $cart);
            return response()->json(['message' => 'Product removed from cart']);
        }
    
        return response()->json(['message' => 'Product not in cart'], 404);
    }

    public function checkout(Request $request)
    {
       
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }
    
        foreach ($cart as $productId => $quantity) {

            $product = Product::find($productId);
    
            if (!$product) {
                continue;
            }
    
            // Ensure that stock is sufficient before updating the quantity
            if ($product->stock < $quantity) {
                return response()->json(['message' => 'Not enough stock for product ' . $product->name], 400);
            }
    
            // Reduce the stock based on the quantity in the cart
            $product->stock -= $quantity;
            $product->save();
        }
    
        // Clear the cart after checkout
        session()->forget('cart');
    
        return response()->json(['message' => 'Checkout successful, cart is cleared']);
    }

    
    public function addProductToCart(Request $request, $id)
    {
        $quantity = $request->input('quantity', 1);
        $product = Product::find($id);
    
        $cart = session()->get('cart', []);
    
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Requested quantity exceeds available stock'], 400);
        }
    
    
        if (isset($cart[$id])) {
            $newQuantity = $cart[$id] + $quantity;
    
            if ($newQuantity > $product->stock) {
                return response()->json(['message' => 'Not enough stock'], 400);
            }
    
            $cart[$id] = $newQuantity; 
        } else {
         
            $cart[$id] = $quantity;
        }
    
        session()->put('cart', $cart);
    
        return response()->json(['message' => 'Product added to cart', 'cart' => $cart], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $user = DB::table('users')->where('name', $username)->first();

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
            ], 401);
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
        }

        return response()->json([
            'status' => 'error',
            'message' => 'User is not authenticated'
        ], 401);
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
}
