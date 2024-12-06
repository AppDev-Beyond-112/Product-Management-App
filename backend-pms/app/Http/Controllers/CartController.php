<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{
    /**
     * Add a product to the cart based on user_id provided.
     */
    public function addToCart(Request $request, $productId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = $request->input('user_id');
        $quantity = $request->input('quantity');

        // Find the product
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Check stock availability
        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Not enough stock available'], 400);
        }

        // Find or create the user's cart
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        // Check if the product already exists in the cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;

            if ($cartItem->quantity > $product->stock) {
                return response()->json(['message' => 'Exceeds available stock'], 400);
            }

            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart'], 200);
    }

    /**
     * Remove a product from the cart based on user_id.
     */
    public function removeFromCart(Request $request, $productId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $userId = $request->input('user_id');

        // Find the user's cart
        $cart = Cart::where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        // Find the cart item
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Product not in cart'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart'], 200);
    }

    /**
     * View the cart details based on user_id.
     */
    public function viewCart(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $userId = $request->input('user_id');

        // Find the user's cart
        $cart = Cart::where('user_id', $userId)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 200);
        }

        // Map cart items for response
        $cartDetails = $cart->items->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'quantity' => $item->quantity,
                'price_per_item' => $item->product->price,
                'total_price' => $item->quantity * $item->product->price,
            ];
        });

        return response()->json(['cart' => $cartDetails], 200);
    }

    /**
     * Checkout the cart based on user_id.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
    
        $userId = $request->input('user_id');
    
        $cart = Cart::where('user_id', $userId)->with('items.product')->first();
    
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }
    
        $insufficientStock = [];
        $checkedOutItems = [];
    
        foreach ($cart->items as $item) {
            $product = $item->product;
    
            if ($product->stock < $item->quantity) {
                $insufficientStock[] = [
                    'product_name' => $product->name,
                    'requested_quantity' => $item->quantity,
                    'available_stock' => $product->stock,
                ];
                continue; // Skip deduction for this item
            }
    
            // Prepare valid checkout items
            $checkedOutItems[] = [
                'product_name' => $product->name,
                'quantity' => $item->quantity,
                'price_per_item' => $product->price,
                'total_price' => $item->quantity * $product->price,
            ];
    
            $product->stock -= $item->quantity;
            $product->save();
        }
    
        // Step 5: Check for insufficient stock
        if (!empty($insufficientStock)) {
            return response()->json([
                'message' => 'Insufficient stock for some products',
                'insufficient_stock' => $insufficientStock,
            ], 400);
        }
    
        // Step 6: Clear the cart
        $cart->items()->delete();
    
        // Step 7: Final response
        return response()->json([
            'message' => 'Checkout successful',
            'user_id' => $userId,
            'checked_out_items' => $checkedOutItems,
        ], 200);
    }
    
    
    
}
