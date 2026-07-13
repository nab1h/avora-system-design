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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sub_category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name_ar');
            $table->string('name_en');

            $table->string('slug_ar')->unique()->nullable();
            $table->string('slug_en')->unique()->nullable();

            $table->text('desc_ar')->nullable();
            $table->text('desc_en')->nullable();

            $table->decimal('price', 10, 2);

            $table->integer('stock')->default(0);

            $table->foreignId('offer_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->boolean('is_active')->default(true);

            // analties
            // =================
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('favorites_count')->default(0);
            $table->unsignedInteger('cart_count')->default(0);
            $table->unsignedInteger('sales_count')->default(0);
            // =======================
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
