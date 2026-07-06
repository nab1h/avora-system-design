<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Models\PaymentTransaction;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'overview',
            'dashboardStats' => $this->dashboardStats(),
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

    private function dashboardStats(): array
    {
        $paidStatuses = ['paid', 'paid_waiting_webhook'];
        $now = now();
        $currentMonthStart = $now->copy()->startOfMonth();
        $previousMonthStart = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $previousMonthEnd = $previousMonthStart->copy()->endOfMonth();

        $paidTransactions = PaymentTransaction::query()->whereIn('status', $paidStatuses);
        $allTransactions = PaymentTransaction::query();
        $customers = User::query()->whereNull('role_id');

        $totalSalesMinor = (clone $paidTransactions)->sum('amount');
        $currentMonthSalesMinor = (clone $paidTransactions)
            ->whereBetween('created_at', [$currentMonthStart, $now])
            ->sum('amount');
        $previousMonthSalesMinor = (clone $paidTransactions)
            ->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])
            ->sum('amount');

        $totalOrders = (clone $allTransactions)->count();
        $currentMonthOrders = (clone $allTransactions)->whereBetween('created_at', [$currentMonthStart, $now])->count();
        $previousMonthOrders = (clone $allTransactions)->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])->count();

        $newCustomers = (clone $customers)->whereBetween('created_at', [$currentMonthStart, $now])->count();
        $previousNewCustomers = User::query()
            ->whereNull('role_id')
            ->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])
            ->count();

        $failedOrCancelled = (clone $allTransactions)->whereIn('status', ['failed', 'cancelled'])->count();
        $paidOrders = (clone $allTransactions)->whereIn('status', $paidStatuses)->count();
        $successRate = $totalOrders > 0 ? round(($paidOrders / $totalOrders) * 100, 1) : 0;

        $monthlySales = collect(range(1, 12))->map(function (int $month) use ($paidStatuses, $now) {
            $date = Carbon::create($now->year, $month, 1);

            $amountMinor = PaymentTransaction::query()
                ->whereIn('status', $paidStatuses)
                ->whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()])
                ->sum('amount');

            return [
                'month' => $date->format('M'),
                'amount' => round($amountMinor / 100, 2),
            ];
        })->all();

        $recentOrders = PaymentTransaction::query()
            ->with(['user:id,name,email', 'gateway:id,name,slug'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (PaymentTransaction $transaction) => [
                'id' => '#'.substr($transaction->uuid, 0, 8),
                'customer' => $transaction->user?->name ?? 'زائر',
                'product' => $transaction->product_name,
                'amount' => $transaction->amountDecimal().' '.$transaction->currency,
                'status' => $transaction->status,
                'gateway' => $transaction->gateway?->name ?? $transaction->gateway_slug,
            ])
            ->all();

        $monthlyTargetMinor = max(100000 * 100, (int) ceil($currentMonthSalesMinor * 1.25));
        $remainingMinor = max(0, $monthlyTargetMinor - $currentMonthSalesMinor);
        $targetPercent = $monthlyTargetMinor > 0
            ? min(100, round(($currentMonthSalesMinor / $monthlyTargetMinor) * 100))
            : 0;

        return [
            'usersCount' => User::count(),
            'rolesCount' => Role::count(),
            'customersCount' => (clone $customers)->count(),
            'paymentGatewaysCount' => PaymentGateway::count(),
            'activeGatewaysCount' => PaymentGateway::query()->where('enabled', true)->count(),
            'metrics' => [
                'totalSales' => [
                    'value' => $this->formatMoney($totalSalesMinor),
                    'change' => $this->percentageChange($currentMonthSalesMinor, $previousMonthSalesMinor),
                    'trend' => $currentMonthSalesMinor >= $previousMonthSalesMinor ? 'up' : 'down',
                ],
                'totalOrders' => [
                    'value' => number_format($totalOrders),
                    'change' => $this->percentageChange($currentMonthOrders, $previousMonthOrders),
                    'trend' => $currentMonthOrders >= $previousMonthOrders ? 'up' : 'down',
                ],
                'newCustomers' => [
                    'value' => number_format($newCustomers),
                    'change' => $this->percentageChange($newCustomers, $previousNewCustomers),
                    'trend' => $newCustomers >= $previousNewCustomers ? 'up' : 'down',
                ],
                'paymentSuccessRate' => [
                    'value' => $successRate.'%',
                    'change' => $failedOrCancelled.' failed/cancelled',
                    'trend' => $successRate >= 50 ? 'up' : 'down',
                ],
            ],
            'monthlySales' => $monthlySales,
            'recentOrders' => $recentOrders,
            'monthlyTarget' => [
                'percent' => $targetPercent,
                'achieved' => $this->formatMoney($currentMonthSalesMinor),
                'remaining' => $this->formatMoney($remainingMinor),
            ],
        ];
    }

    private function formatMoney(int|float $amountMinor): string
    {
        return number_format($amountMinor / 100, 2).' EGP';
    }

    private function percentageChange(int|float $current, int|float $previous): string
    {
        if ((float) $previous === 0.0) {
            return $current > 0 ? '100%' : '0%';
        }

        return round((($current - $previous) / $previous) * 100, 1).'%';
    }
}
