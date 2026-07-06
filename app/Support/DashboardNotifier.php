<?php

namespace App\Support;

use App\Models\User;
use App\Notifications\DashboardEventNotification;

class DashboardNotifier
{
    public static function send(string $title, string $body, string $url, string $eventType = 'general'): void
    {
        User::query()
            ->whereNotNull('role_id')
            ->whereHas('role.permissions')
            ->chunkById(100, function ($users) use ($title, $body, $url, $eventType) {
                foreach ($users as $user) {
                    $user->notify(new DashboardEventNotification($title, $body, $url, $eventType));
                }
            });
    }
}
