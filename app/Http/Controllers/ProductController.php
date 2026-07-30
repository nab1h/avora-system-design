<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Request $request, Product $product): Response
    {
        abort_unless($product->is_active, 404);
        $product->increment('views');
        $cartProducts = collect();

        if ($request->user()) {
            $cartProducts = $request->user()
                ->cartProducts()
                ->with(['images', 'category', 'subCategory', 'productClass', 'offer'])
                ->get();
        }

        $product->load(['images:id,product_id,image,type', 'category:id,name_ar,name_en', 'subCategory:id,name_ar,name_en', 'brand:id,name_ar,name_en,desc_ar,desc_en,image', 'productClass:id,name_ar,name_en', 'offer:id,name_ar,name_en,type,value,start_at,end_at,is_active', 'features:id,product_id,feature', 'colors:id,name_ar,name_en,hex', 'sizes:id,name_ar,name_en', 'weights:id,name_ar,name_en', 'materials:id,name_ar,name_en']);
        $offer = $product->offer;
        $active = $offer && $offer->is_active && (! $offer->start_at || $offer->start_at->isPast()) && (! $offer->end_at || $offer->end_at->isToday() || $offer->end_at->isFuture());
        $price = (float) $product->price;
        $salePrice = $active ? max(0, $offer->type === 'percent' ? $price * (1 - ((float) $offer->value / 100)) : $price - (float) $offer->value) : $price;

        return Inertia::render('ProductShow', ['cartProducts' => $cartProducts, 'product' => [
            'id' => $product->id, 'name_ar' => $product->name_ar, 'name_en' => $product->name_en,
            'desc_ar' => $product->desc_ar, 'desc_en' => $product->desc_en, 'price' => number_format($price, 2, '.', ''), 'sale_price' => number_format($salePrice, 2, '.', ''), 'stock' => $product->stock, 'images' => $product->images,
            'category' => $product->category, 'sub_category' => $product->subCategory, 'brand' => $product->brand, 'product_class' => $product->productClass,
            'offer' => $active ? ['name_ar' => $offer->name_ar, 'name_en' => $offer->name_en, 'type' => $offer->type, 'value' => $offer->value, 'end_at' => $offer->end_at?->toDateString()] : null,
            'features' => $product->features->pluck('feature')->values(),
            'colors' => $product->colors,
            'sizes' => $product->sizes,
            'weights' => $product->weights,
            'materials' => $product->materials,
            'attributes' => [],
        ]]);
    }
}
