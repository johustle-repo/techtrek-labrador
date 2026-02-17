<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'lguadmin@techtrek.local'],
            [
                'name' => 'Labrador Tourism Admin',
                'password' => Hash::make('LguAdmin123!'),
                'role' => UserRole::LGU_ADMIN->value,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'owner@techtrek.local'],
            [
                'name' => 'Local Business Owner',
                'password' => Hash::make('Owner123!'),
                'role' => UserRole::BUSINESS_OWNER->value,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'tourist@techtrek.local'],
            [
                'name' => 'Sample Tourist',
                'password' => Hash::make('Tourist123!'),
                'role' => UserRole::TOURIST->value,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'visitor@techtrek.local'],
            [
                'name' => 'Sample Visitor',
                'password' => Hash::make('Visitor123!'),
                'role' => UserRole::VISITOR->value,
                'email_verified_at' => now(),
            ]
        );
    }
}
