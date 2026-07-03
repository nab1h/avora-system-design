<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'uuid',
        'user_id',
        'payment_gateway_id',
        'gateway_slug',
        'product_name',
        'amount',
        'currency',
        'status',
        'gateway_reference',
        'checkout_url',
        'payload',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'payload' => 'array',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gateway(): BelongsTo
    {
        return $this->belongsTo(PaymentGateway::class, 'payment_gateway_id');
    }

    public function amountDecimal(): string
    {
        return number_format($this->amount / 100, 2, '.', '');
    }

    public function toFrontend(): array
    {
        return [
            'uuid' => $this->uuid,
            'product_name' => $this->product_name,
            'amount' => $this->amount,
            'amount_decimal' => $this->amountDecimal(),
            'currency' => $this->currency,
            'status' => $this->status,
            'gateway_slug' => $this->gateway_slug,
            'gateway_name' => $this->gateway?->name,
            'gateway_reference' => $this->gateway_reference,
            'checkout_url' => $this->checkout_url,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
