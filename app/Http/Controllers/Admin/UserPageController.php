<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'users',
            'users' => User::query()
                ->with('role:id,name')
                ->latest()
                ->get(['id', 'name', 'email', 'role_id', 'created_at'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role?->name,
                    'created_at' => $user->created_at?->toDateString(),
                ]),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
