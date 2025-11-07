<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if super admin already exists
        $existingSuperAdmin = User::where('email', 'superadmin@sinaucode.com')->first();

        if ($existingSuperAdmin) {
            $this->command->info('Super admin already exists!');
            return;
        }

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@sinaucode.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Change this in production!
            'role' => 'admin',
            'bio' => 'Super Administrator of Sinaucode platform. Full access to all system features and settings.',
            'remember_token' => Str::random(10),
        ]);

        $this->command->info('✅ Super admin created successfully!');
        $this->command->info('Email: superadmin@sinaucode.com');
        $this->command->info('Password: password');
        $this->command->info('Role: admin');
        $this->command->warn('⚠️  Please change the password in production!');
    }
}