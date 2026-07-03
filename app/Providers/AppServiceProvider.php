<?php

namespace App\Providers;

use App\Models\WebsiteSetting;
use App\Models\PaymentGateway;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureMailFromWebsiteSettings();
        $this->configureSocialLoginFromWebsiteSettings();
        $this->configureCashierFromPaymentGateway();

        Vite::prefetch(concurrency: 3);
    }

    private function configureMailFromWebsiteSettings(): void
    {
        try {
            if (! Schema::hasTable('website_settings')) {
                return;
            }

            $settings = WebsiteSetting::query()->first();

            if (! $settings || ! $settings->smtp_host || ! $settings->smtp_port) {
                return;
            }

            $scheme = $settings->smtp_encryption === 'ssl' ? 'smtps' : 'smtp';

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $settings->smtp_host,
                'mail.mailers.smtp.port' => $settings->smtp_port,
                'mail.mailers.smtp.username' => $settings->smtp_username,
                'mail.mailers.smtp.password' => $settings->smtp_password,
                'mail.mailers.smtp.scheme' => $scheme,
                'mail.from.address' => $settings->smtp_from_address ?: $settings->contact_email ?: config('mail.from.address'),
                'mail.from.name' => $settings->smtp_from_name ?: $settings->website_name,
            ]);
        } catch (Throwable) {
            return;
        }
    }

    private function configureSocialLoginFromWebsiteSettings(): void
    {
        try {
            if (! Schema::hasTable('website_settings')) {
                return;
            }

            $settings = WebsiteSetting::query()->first();

            if (! $settings) {
                return;
            }

            config([
                'services.google.client_id' => $settings->google_client_id,
                'services.google.client_secret' => $settings->google_client_secret,
                'services.google.redirect' => $settings->google_redirect_url ?: url('/auth/google/callback'),
                'services.facebook.client_id' => $settings->facebook_client_id,
                'services.facebook.client_secret' => $settings->facebook_client_secret,
                'services.facebook.redirect' => $settings->facebook_redirect_url ?: url('/auth/facebook/callback'),
            ]);
        } catch (Throwable) {
            return;
        }
    }

    private function configureCashierFromPaymentGateway(): void
    {
        try {
            if (! Schema::hasTable('payment_gateways')) {
                return;
            }

            $stripe = PaymentGateway::query()->where('slug', 'stripe')->first();

            if (! $stripe) {
                return;
            }

            $publicConfig = $stripe->public_config ?? [];
            $secretConfig = $stripe->secret_config ?? [];

            config([
                'cashier.key' => $publicConfig['publishable_key'] ?? config('cashier.key'),
                'cashier.secret' => $secretConfig['secret_key'] ?? config('cashier.secret'),
                'cashier.webhook.secret' => $secretConfig['webhook_secret'] ?? config('cashier.webhook.secret'),
                'cashier.currency' => strtolower(config('app.currency', 'usd')),
            ]);
        } catch (Throwable) {
            return;
        }
    }
}
