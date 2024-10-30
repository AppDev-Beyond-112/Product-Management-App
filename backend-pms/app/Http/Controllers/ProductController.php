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
            'category' => 'nullable|string|max:255',
        ]);

        $product = Product::create([
            'barcode' => $request->barcode,
            'name' => $request->name,
            'description' => $request->description,
            'stock' => $request->stock,
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
            'category' => 'nullable|string|max:255',
        ]);
    
        $product->update($request->only(['name', 'description', 'stock', 'category']));
    
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
}
