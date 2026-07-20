<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OffersController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'offers',

            'offers' => Offer::query()
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Offer::create(
            $this->validateOffer($request)
        );

        return back()->with(
            'success',
            'تمت إضافة العرض بنجاح.'
        );
    }

    public function update(
        Request $request,
        Offer $offer
    ): RedirectResponse {
        $offer->update(
            $this->validateOffer($request)
        );

        return back()->with(
            'success',
            'تم تعديل العرض بنجاح.'
        );
    }

    public function destroy(Offer $offer): RedirectResponse
    {
        DB::transaction(function () use ($offer) {
            // إزالة العرض من المنتجات المرتبطة قبل حذفه
            $offer->products()->update([
                'offer_id' => null,
            ]);

            $offer->delete();
        });

        return back()->with(
            'success',
            'تم حذف العرض بنجاح.'
        );
    }

    private function validateOffer(Request $request): array
    {
        return $request->validate([
            'name_ar' => [
                'required',
                'string',
                'max:255',
            ],

            'name_en' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in([
                    'fixed',
                    'percent',
                ]),
            ],

            'value' => [
                'required',
                'numeric',
                'min:0',

                Rule::when(
                    $request->input('type') === 'percent',
                    ['max:100']
                ),
            ],

            'start_at' => [
                'nullable',
                'date',
            ],

            'end_at' => [
                'nullable',
                'date',
                'after_or_equal:start_at',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],
        ]);
    }
}
