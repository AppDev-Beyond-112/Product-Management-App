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
        $user = auth()->user(); // Assuming the user is authenticated
        $cart = $user->cart;
    
        if (!$cart) {
            return response()->json(['message' => 'Cart is empty'], 200);
        }
    
        $cartItems = $cart->items->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
                'total' => $item->quantity * $item->product->price,
            ];
        });
    
        return response()->json(['cart' => $cartItems]);
    }
    
    
    public function removeProductFromCart($productId)
    {
        $user = auth()->user();
        $cart = $user->cart;
    
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
    
        $cartItem = $cart->items()->where('product_id', $productId)->first();
    
        if (!$cartItem) {
            return response()->json(['message' => 'Product not in cart'], 404);
        }
    
        $cartItem->delete();
    
        return response()->json(['message' => 'Product removed from cart']);
    }
    

    public function checkout()
    {
        $user = auth()->user();
        $cart = $user->cart;
    
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }
    
        foreach ($cart->items as $item) {
            $product = $item->product;
    
            if ($product->stock < $item->quantity) {
                return response()->json(['message' => 'Not enough stock for product ' . $product->name], 400);
            }
    
            $product->stock -= $item->quantity;
            $product->save();
        }
    
        $cart->items()->delete(); // Clear the cart after checkout
    
        return response()->json(['message' => 'Checkout successful']);
    }
    

    
    public function addProductToCart(Request $request, $productId)
    {
        $user = auth()->user(); // Assuming the user is authenticated
        $quantity = $request->input('quantity', 1);
    
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }
    
        // Ensure the user has a cart
        $cart = $user->cart()->firstOrCreate();
    
        // Check if the product is already in the cart
        $cartItem = $cart->items()->where('product_id', $productId)->first();
    
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }
    
        return response()->json(['message' => 'Product added to cart', 'cart' => $cart->items], 200);
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
