<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class WebsiteSettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'website_name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:3072'],
            'favicon_96' => ['nullable', 'image', 'max:3072'],
            'favicon_svg' => ['nullable', 'file', 'mimes:svg,xml', 'max:3072'],
            'favicon_ico' => ['nullable', 'file', 'mimes:ico,cur', 'max:3072'],
            'apple_touch_icon' => ['nullable', 'image', 'max:3072'],
            'web_app_manifest_192' => ['nullable', 'image', 'max:3072'],
            'web_app_manifest_512' => ['nullable', 'image', 'max:3072'],
            'site_webmanifest' => ['nullable', 'file', 'mimes:json,webmanifest', 'max:3072'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'currency' => ['required', 'string', 'max:10'],
            'default_language' => ['required', 'in:auto,ar,en'],
            'default_theme' => ['required', 'in:system,light,dark'],
            'google_login_enabled' => ['sometimes', 'boolean'],
            'google_client_id' => ['nullable', 'string', 'max:255'],
            'google_client_secret' => ['nullable', 'string', 'max:1000'],
            'google_redirect_url' => ['nullable', 'url', 'max:255'],
            'facebook_login_enabled' => ['sometimes', 'boolean'],
            'facebook_client_id' => ['nullable', 'string', 'max:255'],
            'facebook_client_secret' => ['nullable', 'string', 'max:1000'],
            'facebook_redirect_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'x_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'telegram_url' => ['nullable', 'url', 'max:255'],
            'snapchat_url' => ['nullable', 'url', 'max:255'],
            'pinterest_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'discord_url' => ['nullable', 'url', 'max:255'],
            'threads_url' => ['nullable', 'url', 'max:255'],
            'smtp_host' => ['nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],
            'smtp_encryption' => ['nullable', 'in:tls,ssl'],
            'smtp_from_address' => ['nullable', 'email', 'max:255'],
            'smtp_from_name' => ['nullable', 'string', 'max:255'],
        ]);

        $settings = WebsiteSetting::current();

        foreach ($this->fileFields() as $input => $column) {
            if ($request->hasFile($input)) {
                if ($settings->{$column}) {
                    Storage::disk('public')->delete($settings->{$column});
                }

                $validated[$column] = $request->file($input)->store('website-settings', 'public');
            }

            unset($validated[$input]);
        }

        if (blank($validated['smtp_password'] ?? null)) {
            unset($validated['smtp_password']);
        }

        if (blank($validated['google_client_secret'] ?? null)) {
            unset($validated['google_client_secret']);
        }

        if (blank($validated['facebook_client_secret'] ?? null)) {
            unset($validated['facebook_client_secret']);
        }

        $validated['google_login_enabled'] = $request->boolean('google_login_enabled');
        $validated['facebook_login_enabled'] = $request->boolean('facebook_login_enabled');
        $validated['google_redirect_url'] = $validated['google_redirect_url'] ?: url('/auth/google/callback');
        $validated['facebook_redirect_url'] = $validated['facebook_redirect_url'] ?: url('/auth/facebook/callback');

        $settings->update($validated);

        return back();
    }

    public function sendTestEmail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $settings = WebsiteSetting::current();

        abort_unless($settings->smtp_host && $settings->smtp_port, 422, 'SMTP settings are not configured.');

        Mail::raw(
            "SMTP test email from {$settings->website_name}.\n\nIf you received this email, your SMTP settings are working.",
            function ($message) use ($validated, $settings) {
                $message
                    ->to($validated['email'])
                    ->subject("SMTP test - {$settings->website_name}");
            },
        );

        return back()->with('status', 'smtp-test-sent');
    }

    private function fileFields(): array
    {
        return [
            'logo' => 'logo_path',
            'favicon_96' => 'favicon_96_path',
            'favicon_svg' => 'favicon_svg_path',
            'favicon_ico' => 'favicon_ico_path',
            'apple_touch_icon' => 'apple_touch_icon_path',
            'web_app_manifest_192' => 'web_app_manifest_192_path',
            'web_app_manifest_512' => 'web_app_manifest_512_path',
            'site_webmanifest' => 'site_webmanifest_path',
        ];
    }
}
