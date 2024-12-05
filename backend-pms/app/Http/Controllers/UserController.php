<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use App\Models\Product;
use App\Models\Cart;
use App\Models\CartItem;

class UserController extends Controller
{
    // View the authenticated user's cart
    public function viewCart()
    {
        $user = auth()->user(); // Get authenticated user
        $cart = $user->cart;

        if (!$cart || $cart->items->isEmpty()) {
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

    // Add a product to the cart
    public function addProductToCart(Request $request, $productId)
    {
        $user = auth()->user();
        $quantity = $request->input('quantity', 1);

        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $cart = $user->cart()->firstOrCreate();

        // Add or update cart item
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

        return response()->json(['message' => 'Product added to cart', 'cart' => $cart->items]);
    }

    // Remove a product from the cart
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

    // Checkout the cart
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

        $cart->items()->delete(); // Clear the cart

        return response()->json(['message' => 'Checkout successful']);
    }
}
