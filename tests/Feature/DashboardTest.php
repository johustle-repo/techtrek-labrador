<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_super_admin_is_redirected_to_super_admin_dashboard()
    {
        $user = User::factory()->create([
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('superadmin.dashboard'));
    }

    public function test_lgu_admin_is_redirected_to_cms_dashboard()
    {
        $user = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('cms.dashboard'));
    }

    public function test_business_owner_is_redirected_to_owner_dashboard()
    {
        $user = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('owner.dashboard'));
    }

    public function test_tourist_is_redirected_to_visitor_home()
    {
        $user = User::factory()->create([
            'role' => UserRole::TOURIST->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('visitor.home'));
    }

    public function test_visitor_is_redirected_to_visitor_home()
    {
        $user = User::factory()->create([
            'role' => UserRole::VISITOR->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('visitor.home'));
    }

    public function test_guest_can_access_home_welcome_page()
    {
        $response = $this->get(route('home'));
        $response->assertOk();
    }

    public function test_authenticated_user_is_redirected_from_home_by_role()
    {
        $user = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('home'));
        $response->assertRedirect(route('dashboard'));
    }
}
