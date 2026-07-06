<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Support\DashboardNotifier;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class CustomerAuthController extends Controller
{
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        if ($user) {
            DashboardNotifier::send(
                'عميل دخل الموقع',
                $user->name.' سجل دخول باستخدام '.$user->email,
                route('dashboard.section', ['section' => 'customers']),
                'customer_logged_in',
            );
        }

        return redirect()->route('home')->with('status', 'customer-logged-in');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        DashboardNotifier::send(
            'عميل جديد سجل في الموقع',
            $user->name.' سجل حساب جديد باستخدام '.$user->email,
            route('dashboard.section', ['section' => 'customers']),
            'customer_registered',
        );

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home')->with('status', 'customer-registered');
    }
}
