<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\BusinessProduct;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrderAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_business_owner_cannot_access_cms_orders(): void
    {
        $owner = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $response = $this->actingAs($owner)->get(route('cms.orders.index'));

        $response->assertForbidden();
    }

    public function test_lgu_admin_can_access_cms_orders(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::LGU_ADMIN->value,
        ]);

        $response = $this->actingAs($admin)->get(route('cms.orders.index'));

        $response->assertOk();
    }

    public function test_super_admin_can_access_cms_orders(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $response = $this->actingAs($admin)->get(route('cms.orders.index'));

        $response->assertOk();
    }

    public function test_visitor_cannot_access_owner_orders(): void
    {
        $visitor = User::factory()->create([
            'role' => UserRole::VISITOR->value,
        ]);

        $response = $this->actingAs($visitor)->get(route('owner.orders.index'));

        $response->assertForbidden();
    }

    public function test_business_owner_can_access_owner_orders(): void
    {
        $owner = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $response = $this->actingAs($owner)->get(route('owner.orders.index'));

        $response->assertOk();
    }

    public function test_visitor_can_view_only_their_own_order(): void
    {
        [$business, $product] = $this->createBusinessAndProduct();
        $visitorA = User::factory()->create(['role' => UserRole::VISITOR->value]);
        $visitorB = User::factory()->create(['role' => UserRole::VISITOR->value]);

        $ownOrder = BusinessOrder::create([
            'business_id' => $business->id,
            'business_product_id' => $product->id,
            'order_type' => 'product_order',
            'reference_no' => 'OWN-001',
            'customer_name' => 'Visitor A',
            'quantity' => 1,
            'total_amount' => 120,
            'status' => 'pending',
            'created_by' => $visitorA->id,
            'updated_by' => $visitorA->id,
        ]);

        $otherOrder = BusinessOrder::create([
            'business_id' => $business->id,
            'business_product_id' => $product->id,
            'order_type' => 'product_order',
            'reference_no' => 'OTH-001',
            'customer_name' => 'Visitor B',
            'quantity' => 1,
            'total_amount' => 120,
            'status' => 'pending',
            'created_by' => $visitorB->id,
            'updated_by' => $visitorB->id,
        ]);

        $this->actingAs($visitorA)
            ->get(route('visitor.orders.show', $ownOrder))
            ->assertOk();

        $this->actingAs($visitorA)
            ->get(route('visitor.orders.show', $otherOrder))
            ->assertForbidden();
    }

    public function test_visitor_can_cancel_own_pending_order_with_reason(): void
    {
        [$business, $product] = $this->createBusinessAndProduct();
        $visitor = User::factory()->create(['role' => UserRole::VISITOR->value]);

        $order = BusinessOrder::create([
            'business_id' => $business->id,
            'business_product_id' => $product->id,
            'order_type' => 'product_order',
            'reference_no' => 'CAN-001',
            'customer_name' => 'Visitor',
            'quantity' => 1,
            'total_amount' => 180,
            'status' => 'pending',
            'created_by' => $visitor->id,
            'updated_by' => $visitor->id,
        ]);

        $this->actingAs($visitor)
            ->patch(route('visitor.orders.cancel', $order), [
                'cancellation_reason' => 'Change of schedule',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('business_orders', [
            'id' => $order->id,
            'status' => 'cancelled',
            'cancellation_reason' => 'Change of schedule',
        ]);
    }

    public function test_visitor_cannot_cancel_non_pending_order(): void
    {
        [$business, $product] = $this->createBusinessAndProduct();
        $visitor = User::factory()->create(['role' => UserRole::VISITOR->value]);

        $order = BusinessOrder::create([
            'business_id' => $business->id,
            'business_product_id' => $product->id,
            'order_type' => 'product_order',
            'reference_no' => 'DONE-001',
            'customer_name' => 'Visitor',
            'quantity' => 1,
            'total_amount' => 180,
            'status' => 'completed',
            'created_by' => $visitor->id,
            'updated_by' => $visitor->id,
        ]);

        $this->actingAs($visitor)
            ->patch(route('visitor.orders.cancel', $order), [
                'cancellation_reason' => 'Too late',
            ])
            ->assertStatus(422);
    }

    /**
     * @return array{0: Business, 1: BusinessProduct}
     */
    private function createBusinessAndProduct(): array
    {
        $owner = User::factory()->create([
            'role' => UserRole::BUSINESS_OWNER->value,
        ]);

        $category = Category::create([
            'name' => 'Food',
            'slug' => 'food-'.Str::random(6),
            'type' => 'business',
        ]);

        $business = Business::create([
            'name' => 'Sample Business '.Str::random(4),
            'slug' => 'sample-business-'.Str::random(8),
            'description' => 'Test business',
            'owner_user_id' => $owner->id,
            'category_id' => $category->id,
            'status' => 'published',
            'created_by' => $owner->id,
            'updated_by' => $owner->id,
        ]);

        $product = BusinessProduct::create([
            'business_id' => $business->id,
            'name' => 'Sample Product '.Str::random(4),
            'slug' => 'sample-product-'.Str::random(8),
            'description' => 'Test product',
            'category' => 'Food',
            'price' => 120,
            'is_service' => false,
            'status' => 'active',
            'created_by' => $owner->id,
            'updated_by' => $owner->id,
        ]);

        return [$business, $product];
    }
}
