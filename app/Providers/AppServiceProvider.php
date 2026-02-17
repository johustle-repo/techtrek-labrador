<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\Business;
use App\Models\Event;
use App\Models\FeeRule;
use App\Models\User;
use App\Policies\AnnouncementPolicy;
use App\Policies\AttractionPolicy;
use App\Policies\BusinessPolicy;
use App\Policies\EventPolicy;
use App\Policies\FeeRulePolicy;
use App\Policies\UserPolicy;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\TwoFactorLoginResponse;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
        $this->app->singleton(TwoFactorLoginResponseContract::class, TwoFactorLoginResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        $this->configureRateLimiting();
        $this->configureDefaults();
    }

    /**
     * Register authorization policies.
     */
    protected function registerPolicies(): void
    {
        Gate::policy(Attraction::class, AttractionPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Business::class, BusinessPolicy::class);
        Gate::policy(Announcement::class, AnnouncementPolicy::class);
        Gate::policy(FeeRule::class, FeeRulePolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }

    /**
     * Configure custom rate limits for privileged write actions.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('cms-writes', function (Request $request) {
            $userId = $request->user()?->id;
            $role = $request->user()?->role;

            return Limit::perMinute(40)->by(($role ?? 'guest').'|'.($userId ?? $request->ip()));
        });
    }
}
