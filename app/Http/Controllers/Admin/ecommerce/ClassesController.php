<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Classes;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ClassesController extends Controller
{
    public function index(){
        return Inertia::render('Dashboard', [
            'section' => 'classes',
            'classes' => Classes::all(),
        ]);

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],

            'desc_ar' => ['nullable', 'string'],
            'desc_en' => ['nullable', 'string'],

            'slug_ar' => ['required', 'string', 'max:255', 'unique:classes,slug_ar'],
            'slug_en' => ['required', 'string', 'max:255', 'unique:classes,slug_en'],

            'img' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'status' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('img')) {
            $validated['img'] = $request
                ->file('img')
                ->store('classes', 'public');
        }
        Classes::create($validated);
        return back()->with('success', 'تمت إضافة الفئة بنجاح.');
    }

    public function update(Request $request, Classes $classes)
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],

            'desc_ar' => ['nullable', 'string'],
            'desc_en' => ['nullable', 'string'],

            'slug_ar' => [
                'required',
                'string',
                'max:255',
                Rule::unique('classes', 'slug_ar')->ignore($classes->id),
            ],

            'slug_en' => [
                'required',
                'string',
                'max:255',
                Rule::unique('classes', 'slug_en')->ignore($classes->id),
            ],

            'img' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'status' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('img')) {
            if (
                $classes->img &&
                Storage::disk('public')->exists($classes->img)
            ) {
                Storage::disk('public')->delete($classes->img);
            }

            $validated['img'] = $request
                ->file('img')
                ->store('classes', 'public');
        } else {
            unset($validated['img']);
        }

        $classes->update($validated);

        return back()->with(
            'success',
            'تم تعديل الفئة بنجاح.'
        );
    }

    public function destroy(Classes $classes)
    {
        if ($classes->img && Storage::disk('public')->exists($classes->img)) {
            Storage::disk('public')->delete($classes->img);
        }

        $classes->delete();

        return back()->with('success', 'تم حذف الفئة بنجاح.');
    }
}
