<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

// Authenticated user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User authentication routes
Route::post('login', [UserController::class, 'login']);
Route::get('is-authenticated', [UserController::class, 'isAuthenticated']);
Route::post('logout', [UserController::class, 'logout']);
Route::post('register', [UserController::class, 'register']);

// Cart routes within the UserController
Route::middleware('auth:sanctum')->group(function () {
    Route::get('cart', [UserController::class, 'viewCart']); // View cart contents
    Route::post('cart/{productId}', [UserController::class, 'addProductToCart']); // Add product to cart
    Route::delete('cart/{productId}', [UserController::class, 'removeProductFromCart']); // Remove product from cart
    Route::post('cart/checkout', [UserController::class, 'checkout']); // Checkout cart
});

// Admin-specific product management routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::resource('products', ProductController::class)->only([
        'index', 'store', 'update', 'destroy'
    ]);
    Route::get('products/{id}/find', [ProductController::class, 'find']);
});
