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
}
