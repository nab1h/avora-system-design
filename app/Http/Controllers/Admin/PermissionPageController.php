<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;

class PermissionPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'permissions',
            'roles' => Role::query()
                ->with(['permissions:id,name,name_ar,name_en,slug'])
                ->withCount('users')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'users_count' => $role->users_count,
                    'permission_ids' => $role->permissions->pluck('id')->values(),
                    'permissions' => $role->permissions->map(fn (Permission $permission) => [
                        'id' => $permission->id,
                        'name_ar' => $permission->name_ar ?? $permission->name,
                        'name_en' => $permission->name_en ?? $permission->name,
                        'slug' => $permission->slug,
                    ])->values(),
                ]),
            'permissions' => Permission::query()
                ->orderBy('name')
                ->get(['id', 'name', 'name_ar', 'name_en', 'slug'])
                ->map(fn (Permission $permission) => [
                    'id' => $permission->id,
                    'name_ar' => $permission->name_ar ?? $permission->name,
                    'name_en' => $permission->name_en ?? $permission->name,
                    'slug' => $permission->slug,
                ]),
        ]);
    }
}
