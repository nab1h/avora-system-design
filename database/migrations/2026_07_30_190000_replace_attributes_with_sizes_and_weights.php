<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sizes', function (Blueprint $table) { $table->id(); $table->string('name_ar'); $table->string('name_en'); $table->timestamps(); });
        Schema::create('weights', function (Blueprint $table) { $table->id(); $table->string('name_ar'); $table->string('name_en'); $table->timestamps(); });
        Schema::create('product_size', function (Blueprint $table) { $table->id(); $table->foreignId('product_id')->constrained()->cascadeOnDelete(); $table->foreignId('size_id')->constrained()->restrictOnDelete(); $table->unsignedInteger('stock')->nullable(); $table->timestamps(); $table->unique(['product_id', 'size_id']); });
        Schema::create('product_weight', function (Blueprint $table) { $table->id(); $table->foreignId('product_id')->constrained()->cascadeOnDelete(); $table->foreignId('weight_id')->constrained()->restrictOnDelete(); $table->unsignedInteger('stock')->nullable(); $table->timestamps(); $table->unique(['product_id', 'weight_id']); });
        Schema::table('products', function (Blueprint $table) { $table->boolean('has_custom_size_stock')->default(false)->after('has_custom_color_stock'); $table->boolean('has_custom_weight_stock')->default(false)->after('has_custom_size_stock'); });
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');
    }
    public function down(): void {
        Schema::dropIfExists('product_weight'); Schema::dropIfExists('product_size'); Schema::dropIfExists('weights'); Schema::dropIfExists('sizes');
        Schema::table('products', function (Blueprint $table) { $table->dropColumn(['has_custom_size_stock', 'has_custom_weight_stock']); });
    }
};
