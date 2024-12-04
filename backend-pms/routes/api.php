<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User authentication routes
Route::post('login', [UserController::class, 'login']);
Route::get('is-authenticated', [UserController::class, 'isAuthenticated']);
Route::post('logout', [UserController::class, 'logout']); 

// Product resource routes
Route::resource('products', ProductController::class)->only([
    'index', 'store', 'update', 'destroy'
]);

// Add product to cart route
Route::post('products/{id}/add-to-cart', [UserController::class, 'addProductToCart']);

// Remove product from cart route
Route::delete('cart/{id}/remove', [UserController::class, 'removeProductFromCart']);

// View cart route
Route::get('cart', [UserController::class, 'viewCart']);

// Checkout route
Route::post('checkout', [UserController::class, 'checkout']); 

// User registration route
Route::post('register', [UserController::class, 'register']);

// Route for finding a product by ID
Route::get('products/{id}/find', [ProductController::class, 'find']);
