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
        Schema::create('shop_coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->decimal('discount_percent', 5, 2)->nullable(); // Contoh: 10.00 untuk 10%
            $table->decimal('discount_amount', 16, 2)->nullable();
            $table->dateTime('valid_until')->nullable(); // opsional
            $table->integer('quota')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_coupons');
    }
};
