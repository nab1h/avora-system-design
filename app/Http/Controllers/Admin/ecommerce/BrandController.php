<?php

namespace App\Http\Controllers\Admin\ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'brands',
            'brands' => Brand::query()->withCount('products')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateBrand($request, true);
        $data['image'] = $request->file('image')->store('brands', 'public');
        Brand::create($data);

        return back()->with('success', 'Brand created successfully.');
    }

    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $data = $this->validateBrand($request);

        if ($request->hasFile('image')) {
            if ($brand->image && Storage::disk('public')->exists($brand->image)) {
                Storage::disk('public')->delete($brand->image);
            }

            $data['image'] = $request->file('image')->store('brands', 'public');
        }

        $brand->update($data);

        return back()->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            return back()->withErrors([
                'brand' => 'This brand cannot be deleted while products are assigned to it.',
            ]);
        }

        if ($brand->image && Storage::disk('public')->exists($brand->image)) {
            Storage::disk('public')->delete($brand->image);
        }

        $brand->delete();

        return back()->with('success', 'Brand deleted successfully.');
    }

    private function validateBrand(Request $request, bool $imageRequired = false): array
    {
        return $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'desc_ar' => ['nullable', 'string'],
            'desc_en' => ['nullable', 'string'],
            'image' => [$imageRequired ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);
    }
}
