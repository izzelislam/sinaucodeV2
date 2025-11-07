<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PenulisSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample penulis (writer) users
        $penulisUsers = [
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad@sinaucode.com',
                'bio' => 'Tech writer specializing in Laravel, Vue.js, and modern web development. Passionate about sharing knowledge and helping developers grow.',
            ],
            [
                'name' => 'Sarah Putri',
                'email' => 'sarah@sinaucode.com',
                'bio' => 'Frontend developer and technical writer. Love creating tutorials about React, TypeScript, and UI/UX best practices.',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@sinaucode.com',
                'bio' => 'Full-stack developer with expertise in PHP, JavaScript, and cloud technologies. Enjoy solving complex problems.',
            ],
        ];

        foreach ($penulisUsers as $penulis) {
            // Check if user already exists
            $existingUser = User::where('email', $penulis['email'])->first();

            if ($existingUser) {
                $this->command->info("User {$penulis['email']} already exists!");
                continue;
            }

            User::create([
                'name' => $penulis['name'],
                'email' => $penulis['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'penulis',
                'bio' => $penulis['bio'],
                'remember_token' => Str::random(10),
            ]);

            $this->command->info("✅ Penulis user created: {$penulis['email']}");
        }

        $this->command->info('✅ All penulis users created successfully!');
        $this->command->info('Default password for all accounts: password');
        $this->command->warn('⚠️  Please change the passwords in production!');
    }
}