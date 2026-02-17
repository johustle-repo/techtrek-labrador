<?php

use App\Enums\UserRole;
use App\Http\Controllers\Cms\AttractionController;
use App\Http\Controllers\Cms\AnnouncementController;
use App\Http\Controllers\Cms\BusinessController;
use App\Http\Controllers\Cms\DashboardController as CmsDashboardController;
use App\Http\Controllers\Cms\EventController;
use App\Http\Controllers\Cms\FeeRuleController;
use App\Http\Controllers\Cms\ModerationController;
use App\Http\Controllers\Cms\OrderController as CmsOrderController;
use App\Http\Controllers\Owner\BusinessController as OwnerBusinessController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\FeeManagementController as OwnerFeeManagementController;
use App\Http\Controllers\Owner\OrderController as OwnerOrderController;
use App\Http\Controllers\Owner\ProductController as OwnerProductController;
use App\Http\Controllers\Visitor\HomeController as VisitorHomeController;
use App\Http\Controllers\Visitor\OrderController as VisitorOrderController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\Web\AttractionPageController;
use App\Http\Controllers\Web\BusinessPageController;
use App\Http\Controllers\Web\EventPageController;
use App\Http\Controllers\Web\MapPageController;
use App\Http\Controllers\Web\ShopPageController;
use App\Http\Controllers\Web\ShopOrderController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\AuditLogController;
use App\Http\Controllers\SuperAdmin\UserManagementController;
use App\Models\Attraction;
use App\Models\Event;
use App\Support\Media;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (auth()->check()) {
        $role = auth()->user()->role;

        return $role === UserRole::SUPER_ADMIN->value
            ? redirect()->route('superadmin.dashboard')
            : redirect()->route('dashboard');
    }

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'must_visit_attractions' => Attraction::query()
            ->where('status', 'published')
            ->latest()
            ->limit(6)
            ->get(['id', 'name', 'slug', 'description', 'featured_image_path'])
            ->map(fn (Attraction $attraction) => [
                'id' => $attraction->id,
                'name' => $attraction->name,
                'slug' => $attraction->slug,
                'description' => \Illuminate\Support\Str::limit(strip_tags((string) $attraction->description), 140),
                'featured_image_url' => $attraction->featured_image_path
                    ? Media::url($attraction->featured_image_path)
                    : null,
            ]),
        'incoming_events' => Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'starts_at', 'venue_name', 'featured_image_path'])
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'starts_at' => $event->starts_at?->toDateTimeString(),
                'venue_name' => $event->venue_name,
                'featured_image_url' => $event->featured_image_path
                    ? Media::url($event->featured_image_path)
                    : null,
            ]),
    ]);
})->name('home');

Route::get('dashboard', function () {
    if (auth()->user()?->hasRole(UserRole::SUPER_ADMIN)) {
        return redirect()->route('superadmin.dashboard');
    }

    if (auth()->user()?->hasRole(UserRole::LGU_ADMIN)) {
        return redirect()->route('cms.dashboard');
    }

    if (auth()->user()?->hasRole(UserRole::BUSINESS_OWNER)) {
        return redirect()->route('owner.dashboard');
    }

    if (
        auth()->user()?->hasRole(UserRole::TOURIST)
        || auth()->user()?->hasRole(UserRole::VISITOR)
    ) {
        return redirect()->route('visitor.home');
    }

    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'visitor.track', 'role:'.UserRole::TOURIST->value.','.UserRole::VISITOR->value])
    ->prefix('visitor')
    ->name('visitor.')
    ->group(function () {
        Route::get('/home', [VisitorHomeController::class, 'index'])->name('home');
        Route::get('/orders', [VisitorOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [VisitorOrderController::class, 'show'])->name('orders.show');
        Route::get('/bookings/{order}', [VisitorOrderController::class, 'show'])->name('bookings.show');
        Route::patch('/orders/{order}/cancel', [VisitorOrderController::class, 'cancel'])
            ->middleware('throttle:cms-writes')
            ->name('orders.cancel');
        Route::get('/bookings', [VisitorOrderController::class, 'bookings'])->name('bookings.index');
        Route::get('/landing', fn () => redirect()->route('visitor.home'))->name('landing');
    });

Route::middleware(['auth', 'verified', 'visitor.track'])->group(function () {
    Route::get('/attractions', [AttractionPageController::class, 'index'])->name('attractions.index');
    Route::get('/attractions/{slug}', [AttractionPageController::class, 'show'])->name('attractions.show');
    Route::get('/events', [EventPageController::class, 'index'])->name('events.index');
    Route::get('/events/{slug}', [EventPageController::class, 'show'])->name('events.show');
    Route::get('/businesses', [BusinessPageController::class, 'index'])->name('businesses.index');
    Route::get('/businesses/{slug}', [BusinessPageController::class, 'show'])->name('businesses.show');
    Route::get('/shops', [ShopPageController::class, 'index'])->name('shops.index');
    Route::post('/shops/orders', [ShopOrderController::class, 'store'])
        ->middleware('throttle:cms-writes')
        ->name('shops.orders.store');
    Route::get('/map', [MapPageController::class, 'index'])->name('map.index');
});
Route::get('/media/{path}', [MediaController::class, 'show'])
    ->where('path', '.*')
    ->name('media.show');

/*
|--------------------------------------------------------------------------
| Super Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:'.UserRole::SUPER_ADMIN->value])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserManagementController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

    });

Route::middleware(['auth', 'verified', 'role:'.UserRole::LGU_ADMIN->value.','.UserRole::SUPER_ADMIN->value])
    ->prefix('cms')
    ->name('cms.')
    ->group(function () {
        Route::get('/dashboard', [CmsDashboardController::class, 'index'])->name('dashboard');
        Route::resource('attractions', AttractionController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::resource('events', EventController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::resource('businesses', BusinessController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::resource('announcements', AnnouncementController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::get('/orders', [CmsOrderController::class, 'index'])->name('orders.index');
        Route::patch('/orders/{order}/status', [CmsOrderController::class, 'updateStatus'])
            ->middleware('throttle:cms-writes')
            ->name('orders.update-status');
        Route::resource('fees', FeeRuleController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::get('/moderation', [ModerationController::class, 'index'])->name('moderation.index');
    });

Route::middleware([
    'auth',
    'verified',
    'role:'.UserRole::BUSINESS_OWNER->value.','.UserRole::SUPER_ADMIN->value,
])
    ->prefix('owner')
    ->name('owner.')
    ->group(function () {
        Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/businesses', [OwnerBusinessController::class, 'index'])->name('businesses.index');
        Route::get('/businesses/{business}/edit', [OwnerBusinessController::class, 'edit'])->name('businesses.edit');
        Route::put('/businesses/{business}', [OwnerBusinessController::class, 'update'])
            ->middleware('throttle:cms-writes')
            ->name('businesses.update');
        Route::resource('products', OwnerProductController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::resource('orders', OwnerOrderController::class)
            ->except('show')
            ->middleware('throttle:cms-writes');
        Route::get('/fees', [OwnerFeeManagementController::class, 'index'])->name('fees.index');
    });

require __DIR__.'/settings.php';
