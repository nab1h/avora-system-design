<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class CheckoutReviewController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $address = $user->shippingAddress;
        abort_unless($address, 422, 'Shipping address is required.');
        $cart = $user->cartProducts()->where('is_active', true)->with('images')->get();
        abort_if($cart->isEmpty(), 422, 'Cart is empty.');
        $total = $cart->sum(fn($product) => (float) $product->price * (int) $product->pivot->quantity);
        return Inertia::render('Checkout/Review', ['cartProducts' => $cart, 'shippingAddress' => $address, 'total' => $total]);
    }
}
