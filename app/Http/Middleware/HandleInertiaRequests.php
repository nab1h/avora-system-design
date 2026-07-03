<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\WebsiteSetting;
use App\Models\PaymentGateway;
use Illuminate\Support\Facades\Schema;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $websiteSettings = WebsiteSetting::current();

        return [
            ...parent::share($request),
            'appName' => $websiteSettings->website_name,
            'websiteSettings' => $websiteSettings->toFrontend(),
            'paymentGateways' => fn () => Schema::hasTable('payment_gateways')
                ? PaymentGateway::query()
                    ->orderBy('id')
                    ->get()
                    ->map
                    ->toFrontend()
                : [],
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'email_verified_at' => $request->user()->email_verified_at,
                        'role' => $request->user()->role?->only(['id', 'name', 'slug']),
                        'permissions' => $request->user()->permissionSlugs(),
                        'avatar_url' => $request->user()->avatar_path
                            ? '/storage/'.$request->user()->avatar_path
                            : $request->user()->social_avatar_url,
                    ]
                    : null,
            ],
        ];
    }
}
