<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $cartProducts = collect();
        $favoriteProducts = collect();

        if ($user) {
            $cartProducts = $user
                ->cartProducts()
                ->with([
                    'images',
                    'category',
                    'subCategory',
                    'productClass',
                    'offer',
                ])
                ->get();

            $favoriteProducts = $user
                ->favoriteProducts()
                ->with([
                    'images',
                    'category',
                    'subCategory',
                    'productClass',
                    'offer',
                ])
                ->get();
        }

        return Inertia::render('Welcome', [
            'products' => Product::query()
                ->where('is_active', true)
                ->with('images:id,product_id,image,type')
                ->latest()
                ->get(['id', 'name_ar', 'name_en', 'desc_ar', 'desc_en', 'price']),
            'cartProducts' => $cartProducts,
            'favoriteProducts' => $favoriteProducts,

            'cartCount' => $cartProducts->sum(
                fn($product) => (int) $product->pivot->quantity
            ),

            'cartItemsCount' => $cartProducts->count(),

            'favoritesCount' => $favoriteProducts->count(),
        ]);
    }

}
