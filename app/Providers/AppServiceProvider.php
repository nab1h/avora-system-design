<?php

namespace App\Providers;

use App\Models\WebsiteSetting;
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
}
