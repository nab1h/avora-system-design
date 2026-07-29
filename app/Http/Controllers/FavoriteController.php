<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $products = $request->user()
            ->favoriteProducts()
            ->where('products.is_active', true)
            ->with([
                'images:id,product_id,image,type',
                'category:id,name_ar,name_en',
                'subCategory:id,categories_id,name_ar,name_en',
            ])
            ->withCount('favoritedByUsers')
            ->latest('favorites.created_at')
            ->get(['products.id', 'products.category_id', 'products.sub_category_id', 'name_ar', 'name_en', 'desc_ar', 'desc_en', 'price', 'products.created_at']);

        return Inertia::render('Favorites', [
            'products' => $products,
            'favoriteProductIds' => $products->pluck('id')->values(),
        ]);
    }

    public function toggle(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $favorites = $request->user()->favoriteProducts();
        $isFavorite = $favorites->whereKey($product->id)->exists();

        if ($isFavorite) {
            $favorites->detach($product->id);
        } else {
            $favorites->attach($product->id);
        }

        return back();
    }
}
