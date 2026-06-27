<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:'.Permission::class],
        ]);

        Permission::create([
            'name' => $validated['name_ar'],
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
            'slug' => $this->uniqueSlug($validated['slug'] ?: $validated['name_en']),
        ]);

        return back();
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Permission::class)->ignore($permission->id)],
        ]);

        $permission->update([
            'name' => $validated['name_ar'],
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
            'slug' => Str::slug($validated['slug']) ?: $permission->slug,
        ]);

        return back();
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back();
    }

    private function uniqueSlug(string $value): string
    {
        $base = Str::slug($value) ?: 'permission';
        $slug = $base;
        $counter = 2;

        while (Permission::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
