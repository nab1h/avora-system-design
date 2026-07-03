<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialAuthController extends Controller
{
    private const PROVIDERS = ['google', 'facebook'];

    public function redirect(string $provider): SymfonyRedirectResponse
    {
        $this->abortIfInvalidProvider($provider);
        $this->configureProvider($provider);

        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $this->abortIfInvalidProvider($provider);
        $this->configureProvider($provider);

        $socialUser = Socialite::driver($provider)->stateless()->user();
        $email = $socialUser->getEmail();

        if (! $email) {
            return redirect()
                ->route('login')
                ->with('status', 'لم نستطع قراءة البريد الإلكتروني من الحساب الاجتماعي.');
        }

        $providerColumn = "{$provider}_id";

        $user = User::query()
            ->where($providerColumn, $socialUser->getId())
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            $user->forceFill([
                $providerColumn => $socialUser->getId(),
                'name' => $user->name ?: $this->fallbackName($socialUser),
                'social_avatar_url' => $socialUser->getAvatar() ?: $user->social_avatar_url,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();
        } else {
            $user = User::query()->create([
                'name' => $this->fallbackName($socialUser),
                'email' => $email,
                $providerColumn => $socialUser->getId(),
                'social_avatar_url' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => Hash::make(Str::password(32)),
            ]);
        }

        Auth::login($user, remember: true);

        if (count($user->permissionSlugs()) > 0) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        session()->forget('url.intended');

        return redirect()->route('home');
    }

    private function configureProvider(string $provider): void
    {
        $settings = WebsiteSetting::current();

        abort_unless(
            $provider === 'google' ? $settings->googleLoginReady() : $settings->facebookLoginReady(),
            404,
        );

        config([
            "services.{$provider}.client_id" => $settings->{"{$provider}_client_id"},
            "services.{$provider}.client_secret" => $settings->{"{$provider}_client_secret"},
            "services.{$provider}.redirect" => $settings->{"{$provider}_redirect_url"} ?: url("/auth/{$provider}/callback"),
        ]);
    }

    private function abortIfInvalidProvider(string $provider): void
    {
        abort_unless(in_array($provider, self::PROVIDERS, true), 404);
    }

    private function fallbackName($socialUser): string
    {
        return $socialUser->getName()
            ?: $socialUser->getNickname()
            ?: Str::before((string) $socialUser->getEmail(), '@')
            ?: 'User';
    }
}
