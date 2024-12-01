<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string|max:255|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0'
            'category' => 'nullable|string|max:255',
        ]);

        $product = Product::create([
            'barcode' => $request->barcode,
            'name' => $request->name,
            'description' => $request->description,
            'stock' => $request->stock,
            'price' => $request->price,
            'category' => $request->category,
        ]);
        
        return response()->json($product, 201); 
    }

    public function update(Request $request, $barcode)
    {
        $product = Product::where('barcode', $barcode)->first();
    
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
        ]);
    
        $product->update($request->only(['name', 'description', 'stock', 'price', 'category']));
    
        return response()->json($product);
    }
    
    public function destroy($barcode)
    {
        $product = Product::where('barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function addProductToCart(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

       
        if ($product->stock <= 0) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            if ($cart[$id]['quantity'] < $product->stock) {
                $cart[$id]['quantity']++;
            } else {
                return response()->json(['message' => 'Not enough stock'], 400);
            }
        } else {
            $cart[$id] = [
                'name' => $product->name,
                'quantity' => 1,
                'price' => $product->price,
            ];
        }

        session()->put('cart', $cart);

        return response()->json(['message' => 'Product added to cart', 'cart' => $cart], 200);
    }
}
