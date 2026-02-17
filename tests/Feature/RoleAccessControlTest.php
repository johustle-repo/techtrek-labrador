<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_cannot_access_cms_dashboard(): void
    {
        $visitor = User::factory()->create([
            'role' => UserRole::VISITOR->value,
        ]);

        $response = $this->actingAs($visitor)->get(route('cms.attractions.index'));

        $response->assertForbidden();
    }

    public function test_business_owner_cannot_access_super_admin_dashboard(): void
    {
        $owner = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $response = $this->actingAs($owner)->get(route('superadmin.dashboard'));

        $response->assertForbidden();
    }

    public function test_lgu_admin_can_access_cms_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $response = $this->actingAs($admin)->get(route('cms.attractions.index'));

        $response->assertOk();
    }
}
