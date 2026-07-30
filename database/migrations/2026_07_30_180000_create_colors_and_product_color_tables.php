<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('hex', 7);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->boolean('has_custom_color_stock')->default(false)->after('stock');
        });

        Schema::create('color_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('color_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('stock')->nullable();
            $table->timestamps();
            $table->unique(['product_id', 'color_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('color_product');
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn('has_custom_color_stock'));
        Schema::dropIfExists('colors');
    }
};
