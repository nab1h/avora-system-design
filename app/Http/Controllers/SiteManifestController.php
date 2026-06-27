<?php

namespace App\Http\Controllers;

use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

class SiteManifestController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $settings = WebsiteSetting::current();

        return response()->json([
            'name' => $settings->website_name,
            'short_name' => $settings->website_name,
            'icons' => array_values(array_filter([
                $settings->web_app_manifest_192_path ? [
                    'src' => $settings->fileUrl($settings->web_app_manifest_192_path),
                    'sizes' => '192x192',
                    'type' => 'image/png',
                ] : null,
                $settings->web_app_manifest_512_path ? [
                    'src' => $settings->fileUrl($settings->web_app_manifest_512_path),
                    'sizes' => '512x512',
                    'type' => 'image/png',
                ] : null,
            ])),
            'theme_color' => '#ffffff',
            'background_color' => '#ffffff',
            'display' => 'standalone',
        ], 200, [
            'Content-Type' => 'application/manifest+json',
        ]);
    }
}
