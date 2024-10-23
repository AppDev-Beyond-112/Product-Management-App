<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HashPasswords extends Command
{
    protected $signature = 'hash:passwords';
    protected $description = 'Hash existing plain text passwords';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Fetch all users
        $users = DB::table('users')->get();

        foreach ($users as $user) {
            // Check if the password is already hashed (skip if already hashed)
            if (!Hash::needsRehash($user->password)) {
                continue;
            }

            // Hash the plain text password
            $hashedPassword = Hash::make($user->password);

            // Update the password in the database
            DB::table('users')
                ->where('id', $user->id)
                ->update(['password' => $hashedPassword]);

            $this->info("Password for user {$user->username} has been hashed.");
        }

        $this->info('All passwords have been updated.');
    }
}
