<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

// User-related Routes
Route::post('login', [UserController::class, 'login'])->name('login');
Route::get('is-authenticated', [UserController::class, 'isAuthenticated']);
Route::post('logout', [UserController::class, 'logout'])->name('logout');
Route::post('/register', [UserController::class, 'register'])->withoutMiddleware(['auth']);

//Cart Routes <-- User lang gumagamit
Route::post('cart/checkout/{userId}', [CartController::class, 'checkout']); // Remove all of the Cart Content by userId
Route::post('cart/{productId}', [CartController::class, 'addToCart']); // Add product to cart
Route::put('cart/{productId}', [CartController::class, 'updateCart']); // Update product in cart
Route::delete('cart/{productId}', [CartController::class, 'removeFromCart']); // Remove product from cart
Route::get('cart/{userId}', [CartController::class, 'viewCart']); // View cart details by user_id

//Product Routes <-- Admin lang gumagamit
Route::get('products', [ProductController::class, 'index'])->name('products.index'); // pang get lahat ng product
Route::post('products', [ProductController::class, 'store'])->name('products.store'); // add product
Route::put('products/{id}', [ProductController::class, 'update'])->name('products.update'); // update product
Route::delete('products/{id}', [ProductController::class, 'destroy'])->name('products.destroy'); // delete product
Route::get('products/{id}/find', [ProductController::class, 'find'])->name('products.find'); // finding a specific product

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json(['message' => 'Resource not found'], 404);
})->name('fallback');
