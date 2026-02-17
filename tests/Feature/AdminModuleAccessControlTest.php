<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminModuleAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_lgu_admin_can_access_cms_fees_and_moderation(): void
    {
        $lguAdmin = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $this->actingAs($lguAdmin)
            ->get(route('cms.fees.index'))
            ->assertOk();

        $this->actingAs($lguAdmin)
            ->get(route('cms.moderation.index'))
            ->assertOk();
    }

    public function test_super_admin_can_access_cms_fees_and_moderation(): void
    {
        $superAdmin = User::factory()->create([
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('cms.fees.index'))
            ->assertOk();

        $this->actingAs($superAdmin)
            ->get(route('cms.moderation.index'))
            ->assertOk();
    }

    public function test_business_owner_cannot_access_cms_fees_and_moderation(): void
    {
        $owner = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $this->actingAs($owner)
            ->get(route('cms.fees.index'))
            ->assertForbidden();

        $this->actingAs($owner)
            ->get(route('cms.moderation.index'))
            ->assertForbidden();
    }

    public function test_only_super_admin_can_access_user_management_and_audit_logs(): void
    {
        $superAdmin = User::factory()->create([
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $lguAdmin = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('superadmin.users.index'))
            ->assertOk();

        $this->actingAs($superAdmin)
            ->get(route('superadmin.audit-logs.index'))
            ->assertOk();

        $this->actingAs($lguAdmin)
            ->get(route('superadmin.users.index'))
            ->assertForbidden();

        $this->actingAs($lguAdmin)
            ->get(route('superadmin.audit-logs.index'))
            ->assertForbidden();
    }
}
