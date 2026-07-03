<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'overview',
            'dashboardStats' => [
                'usersCount' => User::count(),
                'rolesCount' => Role::count(),
            ],
        ]);
    }

    public function section(string $section): Response
    {
        return Inertia::render('Dashboard', [
            'section' => $section,
        ]);
    }

    public function payments(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'payments',
        ]);
    }

    public function purchases(): Response
    {
        $purchases = PaymentTransaction::query()
            ->with(['user:id,name,email', 'gateway:id,name,slug'])
            ->latest()
            ->get()
            ->map(fn (PaymentTransaction $transaction) => [
                'uuid' => $transaction->uuid,
                'customer_name' => $transaction->user?->name ?? 'زائر',
                'customer_email' => $transaction->user?->email,
                'product_name' => $transaction->product_name,
                'amount_decimal' => $transaction->amountDecimal(),
                'currency' => $transaction->currency,
                'status' => $transaction->status,
                'gateway_name' => $transaction->gateway?->name ?? $transaction->gateway_slug,
                'gateway_reference' => $transaction->gateway_reference,
                'created_at' => $transaction->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Dashboard', [
            'section' => 'purchases',
            'purchases' => $purchases,
        ]);
    }
}
