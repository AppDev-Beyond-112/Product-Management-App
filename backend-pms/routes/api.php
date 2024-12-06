<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

// User-related Routes
Route::post('login', [UserController::class, 'login'])->name('login');
Route::get('is-authenticated', [UserController::class, 'isAuthenticated']);
Route::post('logout', [UserController::class, 'logout'])->name('logout');
Route::post('register', [UserController::class, 'register'])->withoutMiddleware(['auth']);


// Cart Routes (No authentication required)
Route::post('cart/checkout', [CartController::class, 'checkout']);
Route::post('cart/{productId}', [CartController::class, 'addToCart']); // Add product to cart
Route::delete('cart/{productId}', [CartController::class, 'removeFromCart']); // Remove product from cart
Route::get('cart', [CartController::class, 'viewCart']); // View cart details


// Product Routes (No authentication required)
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::post('products', [ProductController::class, 'store'])->name('products.store');
Route::put('products/{id}', [ProductController::class, 'update'])->name('products.update');
Route::delete('products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
Route::get('products/{id}/find', [ProductController::class, 'find'])->name('products.find');

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json(['message' => 'Resource not found'], 404);
})->name('fallback');
