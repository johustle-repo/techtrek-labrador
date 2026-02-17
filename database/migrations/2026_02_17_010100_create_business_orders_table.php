<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('business_product_id')->nullable()->constrained('business_products')->nullOnDelete();
            $table->string('order_type', 30)->default('product_order'); // product_order | service_booking | custom_service
            $table->string('reference_no', 50)->nullable()->index();
            $table->string('customer_name');
            $table->string('customer_contact', 100)->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('status', 30)->default('pending'); // pending | confirmed | in_progress | completed | cancelled
            $table->dateTime('scheduled_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('business_id');
            $table->index('status');
            $table->index('order_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_orders');
    }
};
