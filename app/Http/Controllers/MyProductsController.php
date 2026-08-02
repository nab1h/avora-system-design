<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyProductsController extends Controller
{
    public function index(Request $request): Response
    {
        $myProducts = $request->user()
            ->myProducts()
            ->with([
                'product:id,name_ar,name_en,price',
                'product.images:id,product_id,image,type',
            ])
            ->latest()
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'purchased_at' => $item->created_at?->format('Y-m-d H:i'),
                'product' => $item->product,
            ]);

        return Inertia::render('MyProducts', [
            'myProducts' => $myProducts,
        ]);
    }
}
