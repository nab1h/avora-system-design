<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('region')->nullable();
            $table->string('website_url')->nullable();
            $table->boolean('enabled')->default(false);
            $table->boolean('test_mode')->default(true);
            $table->json('public_config')->nullable();
            $table->text('secret_config')->nullable();
            $table->timestamps();
        });

        DB::table('payment_gateways')->insert([
            [
                'name' => 'Stripe / Laravel Cashier',
                'slug' => 'stripe',
                'region' => 'Global / GCC',
                'website_url' => 'https://stripe.com',
                'enabled' => false,
                'test_mode' => true,
                'public_config' => json_encode(['publishable_key' => '', 'webhook_secret_set' => false]),
                'secret_config' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Paymob',
                'slug' => 'paymob',
                'region' => 'Egypt / MENA',
                'website_url' => 'https://paymob.com',
                'enabled' => false,
                'test_mode' => true,
                'public_config' => json_encode(['iframe_id' => '', 'integration_id' => '', 'hmac_secret_set' => false]),
                'secret_config' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PayTabs',
                'slug' => 'paytabs',
                'region' => 'Egypt / GCC',
                'website_url' => 'https://www.paytabs.com',
                'enabled' => false,
                'test_mode' => true,
                'public_config' => json_encode(['profile_id' => '', 'server_key_set' => false]),
                'secret_config' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tap Payments',
                'slug' => 'tap',
                'region' => 'GCC / MENA',
                'website_url' => 'https://www.tap.company',
                'enabled' => false,
                'test_mode' => true,
                'public_config' => json_encode(['public_key' => '', 'webhook_secret_set' => false]),
                'secret_config' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Moyasar',
                'slug' => 'moyasar',
                'region' => 'Saudi Arabia / GCC',
                'website_url' => 'https://moyasar.com',
                'enabled' => false,
                'test_mode' => true,
                'public_config' => json_encode(['publishable_key' => '', 'webhook_secret_set' => false]),
                'secret_config' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
