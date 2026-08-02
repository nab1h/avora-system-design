<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', 'paid')
            ->orderBy('order_items.id')
            ->select([
                'order_items.id as order_item_id',
                'order_items.order_id',
                'order_items.product_id',
                'order_items.quantity',
                'order_items.unit_amount',
                'orders.user_id',
                'orders.currency',
            ])
            ->chunkById(100, function ($items) {
                $now = now();

                DB::table('my_product')->insertOrIgnore(
                    $items->map(fn ($item) => [
                        'user_id' => $item->user_id,
                        'product_id' => $item->product_id,
                        'order_id' => $item->order_id,
                        'order_item_id' => $item->order_item_id,
                        'quantity' => $item->quantity,
                        'unit_amount' => $item->unit_amount,
                        'currency' => $item->currency,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])->all(),
                );
            }, 'order_items.id', 'order_item_id');
    }

    public function down(): void
    {
        // Intentionally retained: these rows represent confirmed historical purchases.
    }
};
