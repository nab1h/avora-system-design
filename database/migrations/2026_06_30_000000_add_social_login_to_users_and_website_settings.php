<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email_verified_at');
            $table->string('facebook_id')->nullable()->unique()->after('google_id');
            $table->string('social_avatar_url')->nullable()->after('avatar_path');
        });

        Schema::table('website_settings', function (Blueprint $table) {
            $table->boolean('google_login_enabled')->default(false)->after('default_theme');
            $table->string('google_client_id')->nullable()->after('google_login_enabled');
            $table->text('google_client_secret')->nullable()->after('google_client_id');
            $table->string('google_redirect_url')->nullable()->after('google_client_secret');
            $table->boolean('facebook_login_enabled')->default(false)->after('google_redirect_url');
            $table->string('facebook_client_id')->nullable()->after('facebook_login_enabled');
            $table->text('facebook_client_secret')->nullable()->after('facebook_client_id');
            $table->string('facebook_redirect_url')->nullable()->after('facebook_client_secret');
        });
    }

    public function down(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            $table->dropColumn([
                'google_login_enabled',
                'google_client_id',
                'google_client_secret',
                'google_redirect_url',
                'facebook_login_enabled',
                'facebook_client_id',
                'facebook_client_secret',
                'facebook_redirect_url',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'facebook_id', 'social_avatar_url']);
        });
    }
};
