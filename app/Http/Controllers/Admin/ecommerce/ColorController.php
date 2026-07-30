<?php

namespace App\Http\Controllers\Admin\ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ColorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'colors',
            'colors' => Color::query()->withCount('products')->orderBy('name_ar')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Color::create($this->validated($request));
        return back()->with('success', 'Color created successfully.');
    }

    public function update(Request $request, Color $color): RedirectResponse
    {
        $color->update($this->validated($request));
        return back()->with('success', 'Color updated successfully.');
    }

    public function destroy(Color $color): RedirectResponse
    {
        if ($color->products()->exists()) {
            return back()->withErrors(['color' => 'This color is assigned to products and cannot be deleted.']);
        }
        $color->delete();
        return back()->with('success', 'Color deleted successfully.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'hex' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);
    }
}
