<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@techtrek.local'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('SuperAdmin123!'),
                'role' => UserRole::SUPER_ADMIN->value,
                'email_verified_at' => now(), // avoids email verification block
            ]
        );
    }
}
