<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'region',
        'website_url',
        'enabled',
        'is_backup',
        'test_mode',
        'public_config',
        'secret_config',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'is_backup' => 'boolean',
            'test_mode' => 'boolean',
            'public_config' => 'array',
            'secret_config' => 'encrypted:array',
        ];
    }

    public function toFrontend(): array
    {
        $publicConfig = $this->public_config ?? [];
        $secretConfig = $this->secret_config ?? [];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'region' => $this->region,
            'website_url' => $this->website_url,
            'enabled' => $this->enabled,
            'is_backup' => $this->is_backup,
            'test_mode' => $this->test_mode,
            'public_config' => $publicConfig,
            'secret_fields' => collect($secretConfig)
                ->map(fn ($value) => filled($value))
                ->all(),
        ];
    }
}
