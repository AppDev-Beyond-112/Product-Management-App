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
Route::post('products/{id}/add-to-cart', [ProductController::class, 'addProductToCart']);
