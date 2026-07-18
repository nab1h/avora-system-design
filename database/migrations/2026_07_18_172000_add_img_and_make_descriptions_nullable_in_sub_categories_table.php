<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sub_categories', function (Blueprint $table) {
            $table->string('img')->nullable()->after('slug_en');
            $table->text('desc_ar')->nullable()->change();
            $table->text('desc_en')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('sub_categories', function (Blueprint $table) {
            $table->dropColumn('img');
            $table->text('desc_ar')->nullable(false)->change();
            $table->text('desc_en')->nullable(false)->change();
        });
    }
};
