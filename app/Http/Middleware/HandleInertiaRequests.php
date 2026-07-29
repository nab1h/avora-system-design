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
            'dashboardNotifications' => fn () => $request->user() && Schema::hasTable('notifications')
                ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'items' => $request->user()
                        ->notifications()
                        ->latest()
                        ->limit(10)
                        ->get()
                        ->map(fn ($notification) => [
                            'id' => $notification->id,
                            'title' => data_get($notification->data, 'title'),
                            'body' => data_get($notification->data, 'body'),
                            'url' => data_get($notification->data, 'url'),
                            'event_type' => data_get($notification->data, 'event_type'),
                            'read_at' => $notification->read_at?->toISOString(),
                            'created_at' => $notification->created_at?->diffForHumans(),
                        ]),
                ]
                : [
                    'unread_count' => 0,
                    'items' => [],
                ],
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
            'cartProducts' => fn () => $request->user()
                ? $request->user()
                    ->cartProducts()
                    ->with(['images', 'category', 'subCategory', 'productClass', 'offer'])
                    ->get()
                : [],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ];
    }
}
