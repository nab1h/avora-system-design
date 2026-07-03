<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('payment_gateways')) {
            DB::statement('ALTER TABLE payment_gateways MODIFY secret_config TEXT NULL');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('payment_gateways')) {
            DB::statement('ALTER TABLE payment_gateways MODIFY secret_config JSON NULL');
        }
    }
};
