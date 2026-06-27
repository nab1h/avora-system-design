<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteSettingPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'settings',
            'websiteSettings' => WebsiteSetting::current()->toFrontend(),
        ]);
    }
}
