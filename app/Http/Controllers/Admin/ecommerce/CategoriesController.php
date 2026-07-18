<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoriesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'categories',
            'categories' => Category::with('subCategories')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'desc_ar' => 'nullable|string|max:500',
            'desc_en' => 'nullable|string|max:500',
            'slug_ar' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug_ar')],
            'slug_en' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug_en')],
            'img' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:0,1',
        ]);

        $validated['status'] = filter_var($validated['status'], FILTER_VALIDATE_BOOLEAN);
        $validated['img'] = $request->file('img')->store('categories', 'public');

        Category::create($validated);

        return back()->with('success', "Category created successfully.");
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'desc_ar' => 'nullable|string|max:500',
            'desc_en' => 'nullable|string|max:500',
            'slug_ar' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug_ar')->ignore($category->id)],
            'slug_en' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug_en')->ignore($category->id)],
            'img' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'sometimes|in:0,1',
        ]);

        if (isset($validated['status'])) {
            $validated['status'] = filter_var($validated['status'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('img')) {
            if ($category->img && Storage::disk('public')->exists($category->img)) {
                Storage::disk('public')->delete($category->img);
            }
            $validated['img'] = $request->file('img')->store('categories', 'public');
        } else {
            unset($validated['img']);
        }

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->img && Storage::disk('public')->exists($category->img)) {
            Storage::disk('public')->delete($category->img);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
