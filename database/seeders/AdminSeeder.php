<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $existingAdmin = User::where('email', 'admin@sinaucode.com')->first();

        if ($existingAdmin) {
            $this->command->info('Admin user already exists!');
            return;
        }

        User::create([
            'name' => 'Admin Sinaucode',
            'email' => 'admin@sinaucode.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Change this in production!
            'role' => 'admin',
            'bio' => 'Administrator of Sinaucode platform. Responsible for managing content, users, and system settings.',
            'remember_token' => Str::random(10),
        ]);

        $this->command->info('✅ Admin user created successfully!');
        $this->command->info('Email: admin@sinaucode.com');
        $this->command->info('Password: password');
        $this->command->info('Role: admin');
        $this->command->warn('⚠️  Please change the password in production!');
    }
}