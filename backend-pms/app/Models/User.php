<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'address',
        'contactNum',
        'password',
        'role',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for arrays and JSON.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password', // Added 'password' to be hidden for security
        'remember_token',
    ];

    /**
     * Relationship with the Cart model.
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
}
