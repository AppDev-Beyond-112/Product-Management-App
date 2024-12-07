<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'User One',
                'email' => 'userone@example.com',
                'password' => Hash::make('password123'),
                'address' => '123 Main Street',
                'contactNum' => '1234567890',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'User Two',
                'email' => 'usertwo@example.com',
                'password' => Hash::make('password123'),
                'address' => '456 Elm Street',
                'contactNum' => '0987654321',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('adminpassword'),
                'address' => '789 Oak Avenue',
                'contactNum' => '1122334455',
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
