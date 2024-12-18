<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use Illuminate\Http\Request;

//Consists of Index(Get all product of information), Store (Add), Update, Destroy(delete)
class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        //needed inputs
        $request->validate([
            'barcode' => 'required|string|max:255|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
        ]);

        //product information that will passed and inputted the table
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

    //needs a barcode to update a specific product
    public function update(Request $request, $barcode)
    {
        //this is where it finds it
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
    
    //needs a barcode to delete a specific product
    public function destroy($barcode)
    {
        $product = Product::where('barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function find($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product, 200);
    }

    
}
