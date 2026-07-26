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
        $product->load(['images:id,product_id,image,type', 'category:id,name_ar,name_en', 'subCategory:id,name_ar,name_en', 'productClass:id,name_ar,name_en', 'offer:id,name_ar,name_en,type,value,start_at,end_at,is_active', 'features:id,product_id,feature', 'attributes:id,product_id,attribute_value_id', 'attributes.value:id,attribute_id,value', 'attributes.value.attribute:id,name,name_en,unit,unit_en']);
        $offer = $product->offer;
        $active = $offer && $offer->is_active && (! $offer->start_at || $offer->start_at->isPast()) && (! $offer->end_at || $offer->end_at->isToday() || $offer->end_at->isFuture());
        $price = (float) $product->price;
        $salePrice = $active ? max(0, $offer->type === 'percent' ? $price * (1 - ((float) $offer->value / 100)) : $price - (float) $offer->value) : $price;

        return Inertia::render('ProductShow', ['product' => [
            'id' => $product->id, 'name_ar' => $product->name_ar, 'name_en' => $product->name_en,
            'desc_ar' => $product->desc_ar, 'desc_en' => $product->desc_en, 'price' => number_format($price, 2, '.', ''), 'sale_price' => number_format($salePrice, 2, '.', ''), 'stock' => $product->stock, 'images' => $product->images,
            'category' => $product->category, 'sub_category' => $product->subCategory, 'product_class' => $product->productClass,
            'offer' => $active ? ['name_ar' => $offer->name_ar, 'name_en' => $offer->name_en, 'type' => $offer->type, 'value' => $offer->value, 'end_at' => $offer->end_at?->toDateString()] : null,
            'features' => $product->features->pluck('feature')->values(),
            'attributes' => $product->attributes->map(fn ($item) => ['name_ar' => $item->value?->attribute?->name, 'name_en' => $item->value?->attribute?->name_en, 'value' => $item->value?->value, 'unit_ar' => $item->value?->attribute?->unit, 'unit_en' => $item->value?->attribute?->unit_en])->filter(fn ($item) => $item['value'])->values(),
        ]]);
    }
}
