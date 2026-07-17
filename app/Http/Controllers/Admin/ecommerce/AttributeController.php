<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attribute;
use Inertia\Inertia;
use Inertia\Response;
class AttributeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'attributes',
            'attributes' => Attribute::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'unit' => 'required|string|max:25',
            'unit_en' => 'required|string|max:25',
            'type' => 'required',
        ]);
        Attribute::create($validated);
        return back()->with('success', "Attribute created successfully.");
    }

    public function edit(Attribute $attribute): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'attributes-edit',
            'attribute' => $attribute,
        ]);
    }

    public function update(Request $request, Attribute $attribute)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'unit' => 'required|string|max:25',
            'unit_en' => 'required|string|max:25',
            'type' => 'required|in:text,number,select,boolean',
        ]);

        $attribute->update($validated);

        return back()->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute)
    {
        $attribute->delete();

        return back()->with('success', 'Attribute deleted successfully.');
    }
}
