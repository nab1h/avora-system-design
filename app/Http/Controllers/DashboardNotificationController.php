<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DashboardNotificationController extends Controller
{
    public function read(Request $request, string $notification): RedirectResponse
    {
        $databaseNotification = $request->user()
            ->notifications()
            ->where('id', $notification)
            ->firstOrFail();

        $databaseNotification->markAsRead();

        return redirect()->to((string) data_get($databaseNotification->data, 'url', route('dashboard')));
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
