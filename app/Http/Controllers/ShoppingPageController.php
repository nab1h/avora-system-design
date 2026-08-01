<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShoppingPageController extends Controller
{
    public function index(Request $request): Response
    {
        $cartProducts = $request->user()?->cartProducts()
            ->with(['images', 'category', 'subCategory', 'productClass', 'offer'])
            ->get() ?? collect();
        $favorites = $request->user()?->favoriteProducts()->pluck('products.id') ?? collect();
        return Inertia::render('Shopping', [
            'products' => Product::query()->where('is_active', true)->with([
                'images:id,product_id,image,type', 'category:id,name_ar,name_en',
                'subCategory:id,categories_id,name_ar,name_en', 'offer:id,name_ar,name_en,type,value,is_active',
                'colors:id,name_ar,name_en,hex', 'sizes:id,name_ar,name_en', 'weights:id,name_ar,name_en', 'materials:id,name_ar,name_en',
            ])->withCount('favoritedByUsers')->latest()->get(),
            'favoriteProductIds' => $favorites->values(),
            'cartProducts' => $cartProducts,
        ]);
    }
}
