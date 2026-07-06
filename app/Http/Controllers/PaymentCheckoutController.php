<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Models\PaymentTransaction;
use App\Models\WebsiteSetting;
use App\Support\DashboardNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response;

class PaymentCheckoutController extends Controller
{
    public function store(Request $request): Response
    {
        $data = $request->validate([
            'product_id' => ['required', 'string'],
        ]);

        $product = $this->resolveProduct($data['product_id']);
        $gateway = $this->resolveGateway();
        $currency = strtoupper((string) (WebsiteSetting::current()->currency ?: 'EGP'));

        if (! $gateway) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'لا توجد بوابة دفع مفعلة حاليًا. فعّل بوابة من لوحة التحكم أولًا.',
            ]);
        }

        $transaction = PaymentTransaction::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => Auth::id(),
            'payment_gateway_id' => $gateway->id,
            'gateway_slug' => $gateway->slug,
            'product_name' => $product['name'],
            'amount' => $product['amount'],
            'currency' => $currency,
            'status' => 'pending',
            'payload' => [
                'source' => 'website_product_card',
                'product_id' => $data['product_id'],
            ],
        ]);

        $this->notifyTransaction(
            $transaction,
            'طلب شراء جديد',
            'تم إنشاء طلب شراء: '.$transaction->product_name.' بقيمة '.$transaction->amountDecimal().' '.$transaction->currency,
            'purchase_created',
        );

        if ($gateway->slug === 'stripe') {
            return $this->redirectToStripe($transaction, $gateway);
        }

        if ($gateway->slug === 'paymob') {
            return $this->redirectToPaymob($transaction, $gateway);
        }

        if ($gateway->slug === 'tap') {
            return $this->redirectToTap($transaction, $gateway);
        }

        if ($gateway->slug === 'moyasar') {
            return $this->redirectToMoyasar($transaction, $gateway);
        }

        return redirect()->route('checkout.show', $transaction);
    }

    public function show(PaymentTransaction $paymentTransaction): InertiaResponse
    {
        $paymentTransaction->load('gateway');

        return Inertia::render('Checkout/Show', [
            'transaction' => $paymentTransaction->toFrontend(),
        ]);
    }

    public function success(PaymentTransaction $paymentTransaction): InertiaResponse
    {
        $paymentTransaction->update([
            'status' => 'paid_waiting_webhook',
        ]);

        $this->notifyTransaction(
            $paymentTransaction,
            'عملية دفع ناجحة',
            'تم رجوع العميل من بوابة الدفع بنجاح لطلب '.$paymentTransaction->product_name,
            'payment_success',
        );

        $paymentTransaction->load('gateway');

        return Inertia::render('Checkout/Success', [
            'transaction' => $paymentTransaction->toFrontend(),
        ]);
    }

    public function cancel(PaymentTransaction $paymentTransaction): InertiaResponse
    {
        $paymentTransaction->update([
            'status' => 'cancelled',
        ]);

        $this->notifyTransaction(
            $paymentTransaction,
            'عملية دفع ملغية',
            'تم إلغاء أو فشل عملية دفع لطلب '.$paymentTransaction->product_name,
            'payment_cancelled',
        );

        $paymentTransaction->load('gateway');

        return Inertia::render('Checkout/Failed', [
            'transaction' => $paymentTransaction->toFrontend(),
        ]);
    }

    public function tapWebhook(Request $request, PaymentTransaction $paymentTransaction): Response
    {
        $status = strtolower((string) $request->input('status', ''));

        $paymentTransaction->update([
            'status' => in_array($status, ['captured', 'paid'], true) ? 'paid' : ($status ?: 'tap_webhook_received'),
            'gateway_reference' => $request->input('id', $paymentTransaction->gateway_reference),
            'payload' => array_merge($paymentTransaction->payload ?? [], [
                'tap_webhook' => $request->all(),
            ]),
        ]);

        $this->notifyTransaction(
            $paymentTransaction,
            in_array($status, ['captured', 'paid'], true) ? 'تم تأكيد الدفع' : 'تحديث من بوابة Tap',
            'وصل تحديث من Tap لطلب '.$paymentTransaction->product_name,
            in_array($status, ['captured', 'paid'], true) ? 'payment_paid' : 'payment_gateway_update',
        );

        return response()->noContent();
    }

    public function paymobCallback(Request $request): Response|InertiaResponse
    {
        $merchantOrderId = (string) (
            $request->input('merchant_order_id')
            ?: data_get($request->all(), 'obj.order.merchant_order_id')
            ?: data_get($request->all(), 'order.merchant_order_id')
        );

        $transaction = PaymentTransaction::query()
            ->where('uuid', $merchantOrderId)
            ->orWhere('gateway_reference', (string) $request->input('order'))
            ->first();

        if (! $transaction) {
            return response()->noContent();
        }

        $success = filter_var($request->input('success', data_get($request->all(), 'obj.success', false)), FILTER_VALIDATE_BOOL);
        $pending = filter_var($request->input('pending', data_get($request->all(), 'obj.pending', false)), FILTER_VALIDATE_BOOL);

        $transaction->update([
            'status' => $success && ! $pending ? 'paid' : ($pending ? 'pending' : 'failed'),
            'gateway_reference' => (string) ($request->input('id') ?: data_get($request->all(), 'obj.id') ?: $transaction->gateway_reference),
            'payload' => array_merge($transaction->payload ?? [], [
                'paymob_callback' => $request->all(),
            ]),
        ]);

        $this->notifyTransaction(
            $transaction,
            $success && ! $pending ? 'تم تأكيد الدفع' : ($pending ? 'عملية دفع معلقة' : 'عملية دفع فشلت'),
            'وصل تحديث من Paymob لطلب '.$transaction->product_name,
            $success && ! $pending ? 'payment_paid' : ($pending ? 'payment_pending' : 'payment_failed'),
        );

        $transaction->load('gateway');

        if ($request->isMethod('post')) {
            return response()->noContent();
        }

        return Inertia::render($success && ! $pending ? 'Checkout/Success' : 'Checkout/Failed', [
            'transaction' => $transaction->toFrontend(),
        ]);
    }

    public function moyasarCallback(Request $request): Response
    {
        $invoiceId = (string) ($request->input('id') ?: $request->input('invoice_id'));

        $transaction = PaymentTransaction::query()
            ->where('gateway_reference', $invoiceId)
            ->first();

        if (! $transaction) {
            return response()->noContent();
        }

        $status = strtolower((string) $request->input('status', ''));

        $transaction->update([
            'status' => $status === 'paid' ? 'paid' : ($status ?: 'moyasar_callback_received'),
            'payload' => array_merge($transaction->payload ?? [], [
                'moyasar_callback' => $request->all(),
            ]),
        ]);

        $this->notifyTransaction(
            $transaction,
            $status === 'paid' ? 'تم تأكيد الدفع' : 'تحديث من بوابة Moyasar',
            'وصل تحديث من Moyasar لطلب '.$transaction->product_name,
            $status === 'paid' ? 'payment_paid' : 'payment_gateway_update',
        );

        return response()->noContent();
    }

    private function notifyTransaction(PaymentTransaction $transaction, string $title, string $body, string $eventType): void
    {
        DashboardNotifier::send(
            $title,
            $body,
            route('dashboard.purchases'),
            $eventType,
        );
    }

    private function resolveGateway(): ?PaymentGateway
    {
        $primary = PaymentGateway::query()
            ->where('enabled', true)
            ->orderBy('id')
            ->first();

        if ($primary) {
            return $primary;
        }

        return PaymentGateway::query()
            ->where('is_backup', true)
            ->orderBy('id')
            ->first();
    }

    private function resolveProduct(string $productId): array
    {
        $products = [
            'avora-system' => [
                'name' => 'نظام Avora',
                'amount' => 120000,
            ],
            'color-collection' => [
                'name' => 'حزمة الألوان',
                'amount' => 85000,
            ],
            'grid-collection' => [
                'name' => 'مجموعة الجريد',
                'amount' => 95000,
            ],
        ];

        if (! isset($products[$productId])) {
            throw ValidationException::withMessages([
                'product_id' => 'المنتج غير موجود.',
            ]);
        }

        return $products[$productId];
    }

    private function redirectToStripe(PaymentTransaction $transaction, PaymentGateway $gateway): Response
    {
        $secretConfig = $gateway->secret_config ?? [];
        $secretKey = $secretConfig['secret_key'] ?? config('cashier.secret');

        if (! filled($secretKey)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Stripe متفعل لكن Secret Key غير موجود. ضيفه من إعدادات المدفوعات.',
            ]);
        }

        Stripe::setApiKey($secretKey);

        $session = StripeSession::create([
            'mode' => 'payment',
            'success_url' => route('checkout.success', $transaction).'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel', $transaction),
            'client_reference_id' => $transaction->uuid,
            'metadata' => [
                'transaction_uuid' => $transaction->uuid,
                'user_id' => (string) ($transaction->user_id ?? ''),
            ],
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => strtolower($transaction->currency),
                    'unit_amount' => $transaction->amount,
                    'product_data' => [
                        'name' => $transaction->product_name,
                    ],
                ],
            ]],
        ]);

        $transaction->update([
            'status' => 'redirected',
            'gateway_reference' => $session->id,
            'checkout_url' => $session->url,
            'payload' => array_merge($transaction->payload ?? [], [
                'stripe_session_id' => $session->id,
            ]),
        ]);

        return Inertia::location($session->url);
    }

    private function redirectToPaymob(PaymentTransaction $transaction, PaymentGateway $gateway): Response
    {
        $publicConfig = $gateway->public_config ?? [];
        $secretConfig = $gateway->secret_config ?? [];
        $apiKey = $secretConfig['api_key'] ?? null;
        $integrationId = $publicConfig['integration_id'] ?? null;
        $iframeId = $publicConfig['iframe_id'] ?? null;

        if (! filled($apiKey) || ! filled($integrationId) || ! filled($iframeId)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Paymob متفعلة لكن API Key أو Integration ID أو Iframe ID ناقصين.',
            ]);
        }

        $authResponse = Http::acceptJson()
            ->asJson()
            ->post('https://accept.paymob.com/api/auth/tokens', [
                'api_key' => $apiKey,
            ]);

        if ($authResponse->failed() || ! filled($authResponse->json('token'))) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Paymob رفضت API Key: '.$authResponse->body(),
            ]);
        }

        $authToken = $authResponse->json('token');

        $orderResponse = Http::acceptJson()
            ->asJson()
            ->post('https://accept.paymob.com/api/ecommerce/orders', [
                'auth_token' => $authToken,
                'delivery_needed' => false,
                'amount_cents' => $transaction->amount,
                'currency' => $transaction->currency,
                'merchant_order_id' => $transaction->uuid,
                'items' => [[
                    'name' => $transaction->product_name,
                    'amount_cents' => $transaction->amount,
                    'description' => $transaction->product_name,
                    'quantity' => 1,
                ]],
            ]);

        if ($orderResponse->failed() || ! filled($orderResponse->json('id'))) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Paymob رفضت إنشاء الطلب: '.$orderResponse->body(),
            ]);
        }

        $paymobOrderId = $orderResponse->json('id');
        $settings = WebsiteSetting::current();
        $user = Auth::user();
        $nameParts = preg_split('/\s+/', trim((string) ($user?->name ?: 'Website Customer'))) ?: [];
        $firstName = $nameParts[0] ?? 'Website';
        $lastName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : 'Customer';

        $paymentKeyResponse = Http::acceptJson()
            ->asJson()
            ->post('https://accept.paymob.com/api/acceptance/payment_keys', [
                'auth_token' => $authToken,
                'amount_cents' => $transaction->amount,
                'expiration' => 3600,
                'order_id' => $paymobOrderId,
                'billing_data' => [
                    'apartment' => 'NA',
                    'email' => $user?->email ?: ($settings->contact_email ?: 'customer@example.com'),
                    'floor' => 'NA',
                    'first_name' => $firstName,
                    'street' => 'NA',
                    'building' => 'NA',
                    'phone_number' => $settings->phone ?: '01000000000',
                    'shipping_method' => 'NA',
                    'postal_code' => 'NA',
                    'city' => 'Cairo',
                    'country' => 'EG',
                    'last_name' => $lastName,
                    'state' => 'Cairo',
                ],
                'currency' => $transaction->currency,
                'integration_id' => (int) $integrationId,
                'lock_order_when_paid' => true,
            ]);

        if ($paymentKeyResponse->failed() || ! filled($paymentKeyResponse->json('token'))) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Paymob رفضت إنشاء Payment Key: '.$paymentKeyResponse->body(),
            ]);
        }

        $paymentToken = $paymentKeyResponse->json('token');
        $checkoutUrl = "https://accept.paymob.com/api/acceptance/iframes/{$iframeId}?payment_token={$paymentToken}";

        $transaction->update([
            'status' => 'redirected',
            'gateway_reference' => (string) $paymobOrderId,
            'checkout_url' => $checkoutUrl,
            'payload' => array_merge($transaction->payload ?? [], [
                'paymob_order_id' => $paymobOrderId,
            ]),
        ]);

        return Inertia::location($checkoutUrl);
    }

    private function redirectToTap(PaymentTransaction $transaction, PaymentGateway $gateway): Response
    {
        $secretConfig = $gateway->secret_config ?? [];
        $secretKey = $secretConfig['secret_key'] ?? null;

        if (! filled($secretKey)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Tap متفعلة لكن Secret Key غير موجود. ضيفه من إعدادات المدفوعات.',
            ]);
        }

        $user = Auth::user();
        $nameParts = preg_split('/\s+/', trim((string) ($user?->name ?: 'Website Customer'))) ?: [];
        $firstName = $nameParts[0] ?? 'Website';
        $lastName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : 'Customer';
        $email = $user?->email ?: 'customer@example.com';

        $response = Http::withToken($secretKey)
            ->acceptJson()
            ->asJson()
            ->post('https://api.tap.company/v2/charges/', [
                'amount' => (float) $transaction->amountDecimal(),
                'currency' => $transaction->currency,
                'customer_initiated' => true,
                'threeDSecure' => true,
                'save_card' => false,
                'description' => $transaction->product_name,
                'metadata' => [
                    'transaction_uuid' => $transaction->uuid,
                    'user_id' => (string) ($transaction->user_id ?? ''),
                ],
                'reference' => [
                    'transaction' => $transaction->uuid,
                    'order' => $transaction->uuid,
                ],
                'receipt' => [
                    'email' => true,
                    'sms' => false,
                ],
                'customer' => [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                ],
                'source' => [
                    'id' => 'src_all',
                ],
                'post' => [
                    'url' => route('checkout.tap.webhook', $transaction),
                ],
                'redirect' => [
                    'url' => route('checkout.success', $transaction),
                ],
            ]);

        if ($response->failed()) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Tap رفضت إنشاء عملية الدفع: '.$response->body(),
            ]);
        }

        $payload = $response->json();
        $checkoutUrl = data_get($payload, 'transaction.url');

        if (! filled($checkoutUrl)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Tap لم ترجع رابط دفع. راجع مفاتيح Tap والعملة المفعلة.',
            ]);
        }

        $transaction->update([
            'status' => 'redirected',
            'gateway_reference' => data_get($payload, 'id'),
            'checkout_url' => $checkoutUrl,
            'payload' => array_merge($transaction->payload ?? [], [
                'tap_charge' => $payload,
            ]),
        ]);

        return Inertia::location($checkoutUrl);
    }

    private function redirectToMoyasar(PaymentTransaction $transaction, PaymentGateway $gateway): Response
    {
        $secretConfig = $gateway->secret_config ?? [];
        $secretKey = $secretConfig['secret_key'] ?? null;

        if (! filled($secretKey)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Moyasar متفعلة لكن Secret Key غير موجود. ضيفه من إعدادات المدفوعات.',
            ]);
        }

        $response = Http::withBasicAuth($secretKey, '')
            ->acceptJson()
            ->asJson()
            ->post('https://api.moyasar.com/v1/invoices', [
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'description' => $transaction->product_name,
                'callback_url' => route('checkout.moyasar.callback'),
                'success_url' => route('checkout.success', $transaction),
                'back_url' => route('checkout.cancel', $transaction),
            ]);

        if ($response->failed()) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Moyasar رفضت إنشاء الفاتورة: '.$response->body(),
            ]);
        }

        $payload = $response->json();
        $checkoutUrl = data_get($payload, 'url');
        $invoiceId = data_get($payload, 'id');

        if (! filled($checkoutUrl) || ! filled($invoiceId)) {
            throw ValidationException::withMessages([
                'gateway_slug' => 'Moyasar لم ترجع رابط دفع صالح. راجع المفاتيح والعملة.',
            ]);
        }

        $transaction->update([
            'status' => 'redirected',
            'gateway_reference' => $invoiceId,
            'checkout_url' => $checkoutUrl,
            'payload' => array_merge($transaction->payload ?? [], [
                'moyasar_invoice' => $payload,
            ]),
        ]);

        return Inertia::location($checkoutUrl);
    }
}
