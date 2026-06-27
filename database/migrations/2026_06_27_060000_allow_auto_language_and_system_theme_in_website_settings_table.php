<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('website_settings')->update([
            'default_language' => 'auto',
            'default_theme' => 'system',
        ]);
    }

    public function down(): void
    {
        DB::table('website_settings')
            ->where('default_language', 'auto')
            ->update(['default_language' => 'ar']);

        DB::table('website_settings')
            ->where('default_theme', 'system')
            ->update(['default_theme' => 'light']);
    }
};
