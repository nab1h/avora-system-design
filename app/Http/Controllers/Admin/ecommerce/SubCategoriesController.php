<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SubCategoriesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'subCategories',
            'subCategories' => SubCategory::with('category')->get(),
            'categories' => Category::select(
                'id',
                'name_ar',
                'name_en',
                'img',
            )->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'categories_id' => 'required|exists:categories,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'desc_ar' => 'nullable|string|max:500',
            'desc_en' => 'nullable|string|max:500',
            'slug_ar' => ['required', 'string', 'max:255', Rule::unique('sub_categories', 'slug_ar')],
            'slug_en' => ['required', 'string', 'max:255', Rule::unique('sub_categories', 'slug_en')],
            'img' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'required|in:0,1',
        ]);

        $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('img')) {
            $validated['img'] = $request->file('img')->store('sub_categories', 'public');
        } else {
            $validated['img'] = null;
        }

        SubCategory::create($validated);

        return back()->with('success', "SubCategory created successfully.");
    }

    public function update(Request $request, SubCategory $subcategory): RedirectResponse
    {
        $validated = $request->validate([
            'categories_id' => 'required|exists:categories,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'desc_ar' => 'nullable|string|max:500',
            'desc_en' => 'nullable|string|max:500',
            'slug_ar' => ['required', 'string', 'max:255', Rule::unique('sub_categories', 'slug_ar')->ignore($subcategory->id)],
            'slug_en' => ['required', 'string', 'max:255', Rule::unique('sub_categories', 'slug_en')->ignore($subcategory->id)],
            'img' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'sometimes|in:0,1',
        ]);

        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('img')) {
            if ($subcategory->img && Storage::disk('public')->exists($subcategory->img)) {
                Storage::disk('public')->delete($subcategory->img);
            }
            $validated['img'] = $request->file('img')->store('sub_categories', 'public');
        } else {
            unset($validated['img']);
        }

        $subcategory->update($validated);

        return back()->with('success', 'SubCategory updated successfully.');
    }

    public function destroy(SubCategory $subcategory): RedirectResponse
    {
        if ($subcategory->img && Storage::disk('public')->exists($subcategory->img)) {
            Storage::disk('public')->delete($subcategory->img);
        }

        $subcategory->delete();

        return back()->with('success', 'SubCategory deleted successfully.');
    }
}
