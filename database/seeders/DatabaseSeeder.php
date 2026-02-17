<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class,
            DemoUsersSeeder::class,
            TourismContentSeeder::class,
            BusinessProductServiceSeeder::class,
        ]);
    }
}
