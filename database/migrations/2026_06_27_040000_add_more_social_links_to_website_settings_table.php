<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            $table->string('telegram_url')->nullable()->after('tiktok_url');
            $table->string('snapchat_url')->nullable()->after('telegram_url');
            $table->string('pinterest_url')->nullable()->after('snapchat_url');
            $table->string('github_url')->nullable()->after('pinterest_url');
            $table->string('discord_url')->nullable()->after('github_url');
            $table->string('threads_url')->nullable()->after('discord_url');
        });
    }

    public function down(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            $table->dropColumn([
                'telegram_url',
                'snapchat_url',
                'pinterest_url',
                'github_url',
                'discord_url',
                'threads_url',
            ]);
        });
    }
};
