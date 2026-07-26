<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\DashboardNotifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $product = Product::query()
            ->whereKey($validated['product_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $user = $request->user();
        $existingQuantity = $user->cartProducts()
            ->whereKey($product->id)
            ->first()?->pivot->quantity;

        $user->cartProducts()->syncWithoutDetaching([
            $product->id => ['quantity' => ($existingQuantity ?? 0) + 1],
        ]);

        DashboardNotifier::send(
            'تمت إضافة منتج إلى عربة التسوق',
            $user->name.' أضاف المنتج '.$product->name_ar.' إلى عربة التسوق.',
            route('dashboard.products.index'),
            'cart_product_added',
        );

        return back()->with('success', 'تمت إضافة المنتج إلى عربة التسوق.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $request->user()->cartProducts()->detach($product->id);

        return back()->with('success', 'تم حذف المنتج من عربة التسوق.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'delta' => ['required', 'integer', 'in:-1,1'],
        ]);

        $cartProduct = $request->user()->cartProducts()
            ->whereKey($product->id)
            ->firstOrFail();
        $quantity = (int) $cartProduct->pivot->quantity + (int) $validated['delta'];

        if ($quantity <= 0) {
            $request->user()->cartProducts()->detach($product->id);
        } else {
            $request->user()->cartProducts()->updateExistingPivot($product->id, [
                'quantity' => $quantity,
            ]);
        }

        return back();
    }
}
