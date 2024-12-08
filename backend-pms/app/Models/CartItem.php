<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = ['cart_id', 'product_id', 'quantity'];

    public function cart()
    {
        //Item belong to a Cart
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        //This item exists in the products
        return $this->belongsTo(Product::class);
    }
}
