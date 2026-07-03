<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentGatewayController extends Controller
{
    public function update(Request $request, PaymentGateway $paymentGateway): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => ['sometimes', 'boolean'],
            'is_backup' => ['sometimes', 'boolean'],
            'test_mode' => ['sometimes', 'boolean'],
            'public_config' => ['nullable', 'array'],
            'secret_config' => ['nullable', 'array'],
            'public_config.*' => ['nullable', 'string', 'max:1000'],
            'secret_config.*' => ['nullable', 'string', 'max:2000'],
            'gateway' => ['nullable', Rule::in(['stripe', 'paymob', 'paytabs', 'tap', 'moyasar'])],
        ]);

        $publicConfig = array_merge(
            $paymentGateway->public_config ?? [],
            $validated['public_config'] ?? [],
        );

        $secretConfig = $paymentGateway->secret_config ?? [];

        foreach (($validated['secret_config'] ?? []) as $key => $value) {
            if (filled($value)) {
                $secretConfig[$key] = $value;
            }
        }

        $enabled = $request->boolean('enabled');
        $isBackup = $request->boolean('is_backup');

        if ($enabled) {
            PaymentGateway::query()
                ->whereKeyNot($paymentGateway->id)
                ->update(['enabled' => false]);

            $isBackup = false;
        }

        if ($isBackup) {
            PaymentGateway::query()
                ->whereKeyNot($paymentGateway->id)
                ->update(['is_backup' => false]);

            $enabled = false;
        }

        $paymentGateway->update([
            'enabled' => $enabled,
            'is_backup' => $isBackup,
            'test_mode' => $request->boolean('test_mode'),
            'public_config' => $this->withSecretFlags($paymentGateway->slug, $publicConfig, $secretConfig),
            'secret_config' => $secretConfig,
        ]);

        return back();
    }

    private function withSecretFlags(string $slug, array $publicConfig, array $secretConfig): array
    {
        $flagMap = [
            'stripe' => ['webhook_secret' => 'webhook_secret_set'],
            'paymob' => ['hmac_secret' => 'hmac_secret_set'],
            'paytabs' => ['server_key' => 'server_key_set'],
            'tap' => ['webhook_secret' => 'webhook_secret_set'],
            'moyasar' => ['webhook_secret' => 'webhook_secret_set'],
        ];

        foreach ($flagMap[$slug] ?? [] as $secretKey => $flagKey) {
            $publicConfig[$flagKey] = filled($secretConfig[$secretKey] ?? null);
        }

        return $publicConfig;
    }
}
