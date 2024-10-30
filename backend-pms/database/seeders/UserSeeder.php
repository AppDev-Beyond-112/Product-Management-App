<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'sample',
            'password' => 'pass',
            'remember_token' => Str::random(10),
        ]);
    }
}
