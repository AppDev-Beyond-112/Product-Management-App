<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

// Authenticated user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User authentication routes
Route::post('login', [UserController::class, 'login']);
Route::get('is-authenticated', [UserController::class, 'isAuthenticated']);
Route::post('logout', [UserController::class, 'logout']); 
Route::post('register', [UserController::class, 'register']);

// Product resource routes
Route::resource('products', ProductController::class)->only([
    'index', 'store', 'update', 'destroy'
]);
Route::get('products/{id}/find', [ProductController::class, 'find']);

// Cart routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('cart/add/{product_id}', [CartController::class, 'addToCart']); // Add product to cart
    Route::delete('cart/remove/{product_id}', [CartController::class, 'removeFromCart']); // Remove product from cart
    Route::get('cart', [CartController::class, 'viewCart']); // View cart contents
    Route::post('cart/checkout', [CartController::class, 'checkout']); // Checkout cart
});
