<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Add a product to the cart.
     */
    public function addToCart(Request $request, $product_id)
    {
        $user = Auth::user();

        // Validate quantity
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $quantity = $request->input('quantity');

        // Find the product
        $product = Product::find($product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Not enough stock available'], 400);
        }

        // Find or create the cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Check if the product already exists in the cart
        $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $product_id)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;

            if ($cartItem->quantity > $product->stock) {
                return response()->json(['message' => 'Exceeds available stock'], 400);
            }

            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product_id,
                'quantity' => $quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart']);
    }

    /**
     * Remove a product from the cart.
     */
    public function removeFromCart($product_id)
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $product_id)->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Product not in cart'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart']);
    }

    /**
     * View the cart.
     */
    public function viewCart()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->with('cartItems.product')->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty']);
        }

        $cartDetails = $cart->cartItems->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'quantity' => $item->quantity,
                'price_per_item' => $item->product->price,
                'total_price' => $item->quantity * $item->product->price,
            ];
        });

        return response()->json(['cart' => $cartDetails]);
    }

    /**
     * Checkout the cart.
     */
    public function checkout()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->with('cartItems.product')->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        foreach ($cart->cartItems as $item) {
            $product = $item->product;

            if ($product->stock < $item->quantity) {
                return response()->json(['message' => "Not enough stock for product {$product->name}"], 400);
            }

            // Deduct stock
            $product->stock -= $item->quantity;
            $product->save();
        }

        // Clear the cart
        $cart->cartItems()->delete();

        return response()->json(['message' => 'Checkout successful']);
    }
}
