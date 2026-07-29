<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Article;
use App\Models\Brand;
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
                ->withCount('favoritedByUsers')
                ->latest()
                ->get(['id', 'name_ar', 'name_en', 'desc_ar', 'desc_en', 'price']),
            'articles' => Article::query()->where('is_published', true)->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })->latest('published_at')->limit(6)->get(['id', 'title_ar', 'title_en', 'excerpt_ar', 'excerpt_en', 'slug_ar', 'slug_en', 'image']),
            'brands' => Brand::query()
                ->orderBy('name_ar')
                ->get(['id', 'name_ar', 'name_en', 'image']),
            'cartProducts' => $cartProducts,
            'favoriteProducts' => $favoriteProducts,
            'favoriteProductIds' => $favoriteProducts->pluck('id')->values(),

            'cartCount' => $cartProducts->sum(
                fn($product) => (int) $product->pivot->quantity
            ),

            'cartItemsCount' => $cartProducts->count(),

            'favoritesCount' => $favoriteProducts->count(),
        ]);
    }

}
