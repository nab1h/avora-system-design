<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    protected $fillable = [
        'website_name',
        'logo_path',
        'favicon_96_path',
        'favicon_svg_path',
        'favicon_ico_path',
        'apple_touch_icon_path',
        'web_app_manifest_192_path',
        'web_app_manifest_512_path',
        'site_webmanifest_path',
        'contact_email',
        'phone',
        'whatsapp',
        'currency',
        'default_language',
        'default_theme',
        'google_login_enabled',
        'google_client_id',
        'google_client_secret',
        'google_redirect_url',
        'facebook_login_enabled',
        'facebook_client_id',
        'facebook_client_secret',
        'facebook_redirect_url',
        'facebook_url',
        'instagram_url',
        'x_url',
        'linkedin_url',
        'youtube_url',
        'tiktok_url',
        'telegram_url',
        'snapchat_url',
        'pinterest_url',
        'github_url',
        'discord_url',
        'threads_url',
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password',
        'smtp_encryption',
        'smtp_from_address',
        'smtp_from_name',
    ];

    protected function casts(): array
    {
        return [
            'smtp_password' => 'encrypted',
            'google_login_enabled' => 'boolean',
            'google_client_secret' => 'encrypted',
            'facebook_login_enabled' => 'boolean',
            'facebook_client_secret' => 'encrypted',
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate([], [
            'website_name' => config('app.name', 'Avora'),
            'contact_email' => config('mail.from.address'),
            'smtp_from_address' => config('mail.from.address'),
            'smtp_from_name' => config('mail.from.name'),
            'currency' => 'EGP',
            'default_language' => 'auto',
            'default_theme' => 'system',
            'google_redirect_url' => url('/auth/google/callback'),
            'facebook_redirect_url' => url('/auth/facebook/callback'),
        ]);
    }

    public function fileUrl(?string $path): ?string
    {
        return $path ? '/storage/'.$path : null;
    }

    public function toFrontend(): array
    {
        return [
            'website_name' => $this->website_name,
            'logo_url' => $this->fileUrl($this->logo_path),
            'favicon_96_url' => $this->fileUrl($this->favicon_96_path),
            'favicon_svg_url' => $this->fileUrl($this->favicon_svg_path),
            'favicon_ico_url' => $this->fileUrl($this->favicon_ico_path),
            'apple_touch_icon_url' => $this->fileUrl($this->apple_touch_icon_path),
            'web_app_manifest_192_url' => $this->fileUrl($this->web_app_manifest_192_path),
            'web_app_manifest_512_url' => $this->fileUrl($this->web_app_manifest_512_path),
            'site_webmanifest_url' => $this->fileUrl($this->site_webmanifest_path),
            'contact_email' => $this->contact_email ?: config('mail.from.address'),
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'currency' => $this->currency,
            'default_language' => $this->default_language ?: 'auto',
            'default_theme' => $this->default_theme ?: 'system',
            'google_login_enabled' => (bool) $this->google_login_enabled,
            'google_login_ready' => $this->googleLoginReady(),
            'google_client_id' => $this->google_client_id,
            'google_redirect_url' => $this->google_redirect_url ?: url('/auth/google/callback'),
            'google_secret_configured' => filled($this->google_client_secret),
            'facebook_login_enabled' => (bool) $this->facebook_login_enabled,
            'facebook_login_ready' => $this->facebookLoginReady(),
            'facebook_client_id' => $this->facebook_client_id,
            'facebook_redirect_url' => $this->facebook_redirect_url ?: url('/auth/facebook/callback'),
            'facebook_secret_configured' => filled($this->facebook_client_secret),
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'x_url' => $this->x_url,
            'linkedin_url' => $this->linkedin_url,
            'youtube_url' => $this->youtube_url,
            'tiktok_url' => $this->tiktok_url,
            'telegram_url' => $this->telegram_url,
            'snapchat_url' => $this->snapchat_url,
            'pinterest_url' => $this->pinterest_url,
            'github_url' => $this->github_url,
            'discord_url' => $this->discord_url,
            'threads_url' => $this->threads_url,
            'smtp_host' => $this->smtp_host,
            'smtp_port' => $this->smtp_port,
            'smtp_username' => $this->smtp_username,
            'smtp_encryption' => $this->smtp_encryption,
            'smtp_from_address' => $this->smtp_from_address ?: config('mail.from.address'),
            'smtp_from_name' => $this->smtp_from_name ?: config('mail.from.name'),
        ];
    }

    public function googleLoginReady(): bool
    {
        return $this->google_login_enabled
            && filled($this->google_client_id)
            && filled($this->google_client_secret);
    }

    public function facebookLoginReady(): bool
    {
        return $this->facebook_login_enabled
            && filled($this->facebook_client_id)
            && filled($this->facebook_client_secret);
    }
}
