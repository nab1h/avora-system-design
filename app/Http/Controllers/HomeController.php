<?php

namespace App\Http\Controllers;

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
