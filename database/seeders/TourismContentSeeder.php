<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\Business;
use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class TourismContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lguAdmin = User::where('email', 'lguadmin@techtrek.local')->first();
        $owner = User::where('email', 'owner@techtrek.local')->first();

        if (! $lguAdmin || ! $owner) {
            return;
        }

        $beachCategory = Category::updateOrCreate(
            ['slug' => 'beaches'],
            [
                'name' => 'Beaches',
                'type' => 'attraction',
            ]
        );

        $fallsCategory = Category::updateOrCreate(
            ['slug' => 'falls'],
            [
                'name' => 'Falls',
                'type' => 'attraction',
            ]
        );

        $mountainsCategory = Category::updateOrCreate(
            ['slug' => 'mountains'],
            [
                'name' => 'Mountains',
                'type' => 'attraction',
            ]
        );

        $heritageCategory = Category::updateOrCreate(
            ['slug' => 'heritage-sites'],
            [
                'name' => 'Heritages',
                'type' => 'attraction',
            ]
        );

        $parksCategory = Category::updateOrCreate(
            ['slug' => 'parks'],
            [
                'name' => 'Parks',
                'type' => 'attraction',
            ]
        );

        $stayCategory = Category::updateOrCreate(
            ['slug' => 'accommodations'],
            [
                'name' => 'Accommodations',
                'type' => 'business',
            ]
        );

        $foodCategory = Category::updateOrCreate(
            ['slug' => 'food-and-dining'],
            [
                'name' => 'Food and Dining',
                'type' => 'business',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'inns'],
            ['name' => 'Inns', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'hotels'],
            ['name' => 'Hotels', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'fast-food'],
            ['name' => 'Fast Food', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'cafes'],
            ['name' => 'Cafes', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'rental-services'],
            ['name' => 'Rental Services', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'booking-services'],
            ['name' => 'Booking Services', 'type' => 'business']
        );
        Category::updateOrCreate(
            ['slug' => 'pasalubong-and-souvenirs'],
            ['name' => 'Pasalubong and Souvenirs', 'type' => 'business']
        );

        $tubuanBeach = Attraction::updateOrCreate(
            ['slug' => 'tubuan-beach'],
            [
                'name' => 'Tubuan Beach',
                'description' => 'A coastal attraction in Labrador known for sunset views and calm shoreline.',
                'address' => 'Barangay Tubuan, Labrador, Pangasinan',
                'latitude' => 16.0154123,
                'longitude' => 120.1451221,
                'category_id' => $beachCategory->id,
                'status' => 'published',
                'featured_image_path' => null,
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        $lighthousePoint = Attraction::updateOrCreate(
            ['slug' => 'labrador-lighthouse-point'],
            [
                'name' => 'Labrador Lighthouse Point',
                'description' => 'A scenic viewpoint and historic marker area ideal for sightseeing and photos.',
                'address' => 'Coastal Road, Labrador, Pangasinan',
                'latitude' => 16.0012011,
                'longitude' => 120.1289008,
                'category_id' => $heritageCategory->id,
                'status' => 'published',
                'featured_image_path' => null,
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Business::updateOrCreate(
            ['slug' => 'shoreline-homestay'],
            [
                'name' => 'Shoreline Homestay',
                'description' => 'A family-run homestay offering affordable rooms near the beach.',
                'owner_user_id' => $owner->id,
                'contact_email' => 'shoreline@example.com',
                'contact_phone' => '09171234567',
                'address' => 'Barangay Poblacion, Labrador, Pangasinan',
                'latitude' => 16.0089012,
                'longitude' => 120.1366022,
                'category_id' => $stayCategory->id,
                'status' => 'published',
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Business::updateOrCreate(
            ['slug' => 'bayview-seafood-grill'],
            [
                'name' => 'Bayview Seafood Grill',
                'description' => 'Local seafood restaurant serving fresh catch and regional specialties.',
                'owner_user_id' => $owner->id,
                'contact_email' => 'bayview@example.com',
                'contact_phone' => '09179876543',
                'address' => 'Seaside Avenue, Labrador, Pangasinan',
                'latitude' => 16.0112334,
                'longitude' => 120.1390112,
                'category_id' => $foodCategory->id,
                'status' => 'published',
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Event::updateOrCreate(
            ['slug' => 'labrador-coastal-cleanup-week'],
            [
                'title' => 'Labrador Coastal Cleanup Week',
                'description' => 'A municipality-led volunteer cleanup and eco-awareness campaign.',
                'starts_at' => now()->addDays(10)->setTime(7, 0),
                'ends_at' => now()->addDays(10)->setTime(16, 0),
                'venue_name' => 'Tubuan Beachfront',
                'venue_address' => 'Barangay Tubuan, Labrador, Pangasinan',
                'latitude' => 16.0154123,
                'longitude' => 120.1451221,
                'attraction_id' => $tubuanBeach->id,
                'status' => 'published',
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Event::updateOrCreate(
            ['slug' => 'sunset-culture-and-food-fair'],
            [
                'title' => 'Sunset Culture and Food Fair',
                'description' => 'An evening event featuring local food stalls, crafts, and performances.',
                'starts_at' => now()->addDays(20)->setTime(17, 0),
                'ends_at' => now()->addDays(20)->setTime(22, 0),
                'venue_name' => 'Lighthouse Point Grounds',
                'venue_address' => 'Coastal Road, Labrador, Pangasinan',
                'latitude' => 16.0012011,
                'longitude' => 120.1289008,
                'attraction_id' => $lighthousePoint->id,
                'status' => 'published',
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Welcome to TechTrek Labrador'],
            [
                'content' => 'Explore attractions, discover local businesses, and stay updated with municipality events.',
                'is_pinned' => true,
                'status' => 'published',
                'published_at' => now(),
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Tourism Office Advisory'],
            [
                'content' => 'Please check weather updates before planning coastal activities.',
                'is_pinned' => false,
                'status' => 'published',
                'published_at' => now()->subDay(),
                'created_by' => $lguAdmin->id,
                'updated_by' => $lguAdmin->id,
            ]
        );
    }
}
