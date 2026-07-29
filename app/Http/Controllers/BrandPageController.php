<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Inertia\Inertia;
use Inertia\Response;

class BrandPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Brands', [
            'brands' => Brand::query()
                ->withCount('products')
                ->orderBy('name_ar')
                ->get(['id', 'name_ar', 'name_en', 'desc_ar', 'desc_en', 'image']),
        ]);
    }
}
