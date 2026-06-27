<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'overview',
            'dashboardStats' => [
                'usersCount' => User::count(),
                'rolesCount' => Role::count(),
            ],
        ]);
    }

    public function section(string $section): Response
    {
        return Inertia::render('Dashboard', [
            'section' => $section,
        ]);
    }
}
