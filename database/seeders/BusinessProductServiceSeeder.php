<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\BusinessProduct;
use App\Models\User;
use Illuminate\Database\Seeder;

class BusinessProductServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::query()->where('email', 'owner@techtrek.local')->first();
        $lguAdmin = User::query()->where('email', 'lguadmin@techtrek.local')->first();

        if (! $owner || ! $lguAdmin) {
            return;
        }

        $shorelineHomestay = Business::query()->where('slug', 'shoreline-homestay')->first();
        $bayviewSeafood = Business::query()->where('slug', 'bayview-seafood-grill')->first();

        if (! $shorelineHomestay || ! $bayviewSeafood) {
            return;
        }

        $records = [
            [
                'business_id' => $shorelineHomestay->id,
                'slug' => 'shoreline-standard-room',
                'name' => 'Standard Room Overnight',
                'description' => 'Basic overnight room with fan and private bathroom.',
                'category' => 'Room Rental',
                'price' => 1200.00,
                'is_service' => true,
                'status' => 'active',
            ],
            [
                'business_id' => $shorelineHomestay->id,
                'slug' => 'shoreline-family-room',
                'name' => 'Family Room Package',
                'description' => 'Large room package for families with added bedding.',
                'category' => 'Room Rental',
                'price' => 2200.00,
                'is_service' => true,
                'status' => 'active',
            ],
            [
                'business_id' => $shorelineHomestay->id,
                'slug' => 'shoreline-island-tour-booking',
                'name' => 'Island Tour Booking Assistance',
                'description' => 'Assistance service for nearby island hopping arrangements.',
                'category' => 'Booking Service',
                'price' => 350.00,
                'is_service' => true,
                'status' => 'active',
            ],
            [
                'business_id' => $bayviewSeafood->id,
                'slug' => 'bayview-grilled-bangus',
                'name' => 'Grilled Bangus Bilao',
                'description' => 'Freshly grilled milkfish platter good for 3 to 4 persons.',
                'category' => 'Seafood Meal',
                'price' => 680.00,
                'is_service' => false,
                'status' => 'active',
            ],
            [
                'business_id' => $bayviewSeafood->id,
                'slug' => 'bayview-seafood-combo',
                'name' => 'Seafood Fiesta Combo',
                'description' => 'Mixed seafood platter with rice and side dishes.',
                'category' => 'Seafood Meal',
                'price' => 1450.00,
                'is_service' => false,
                'status' => 'active',
            ],
            [
                'business_id' => $bayviewSeafood->id,
                'slug' => 'bayview-event-catering',
                'name' => 'Small Event Catering Service',
                'description' => 'Catering package for community meetings and private events.',
                'category' => 'Catering Service',
                'price' => 8500.00,
                'is_service' => true,
                'status' => 'active',
            ],
            [
                'business_id' => $bayviewSeafood->id,
                'slug' => 'bayview-table-reservation',
                'name' => 'Group Table Reservation',
                'description' => 'Advance group table reservation with preferred schedule.',
                'category' => 'Booking Service',
                'price' => 200.00,
                'is_service' => true,
                'status' => 'inactive',
            ],
        ];

        foreach ($records as $record) {
            BusinessProduct::updateOrCreate(
                ['slug' => $record['slug']],
                [
                    ...$record,
                    'created_by' => $owner->id ?? $lguAdmin->id,
                    'updated_by' => $owner->id ?? $lguAdmin->id,
                ]
            );
        }
    }
}
