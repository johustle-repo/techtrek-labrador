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
        Schema::create('fee_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type', 50); // environmental_fee | business_commission | event_commission | ad_promotion_fee
            $table->string('charge_basis', 20)->default('fixed'); // fixed | percent
            $table->decimal('amount', 10, 2);
            $table->decimal('minimum_amount', 10, 2)->nullable();
            $table->string('status', 30)->default('draft'); // draft | active | inactive | archived
            $table->text('description')->nullable();
            $table->dateTime('effective_from')->nullable();
            $table->dateTime('effective_to')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('type');
            $table->index('status');
            $table->index('effective_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_rules');
    }
};

