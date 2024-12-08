<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    public function user()
    {
        //One cart to One User (One cart Has a User)
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        //One cart has many Items
        return $this->hasMany(CartItem::class);
    }
}
