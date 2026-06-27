@php
    $websiteSettings = \App\Models\WebsiteSetting::current();
    $appName = $websiteSettings->website_name;
    $assetUrl = fn (?string $path, string $fallback) => $path ? '/storage/'.$path : asset($fallback);
@endphp

<!DOCTYPE html>
<html
    lang="{{ in_array($websiteSettings->default_language, ['ar', 'en'], true) ? $websiteSettings->default_language : str_replace('_', '-', app()->getLocale()) }}"
    dir="{{ $websiteSettings->default_language === 'ar' ? 'rtl' : 'ltr' }}"
    data-app-name="{{ $appName }}"
    data-default-language="{{ $websiteSettings->default_language ?: 'auto' }}"
    data-default-theme="{{ $websiteSettings->default_theme ?: 'system' }}"
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $appName }}</title>

        <link rel="icon" type="image/png" href="{{ $assetUrl($websiteSettings->favicon_96_path, 'favicon-96x96.png') }}" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="{{ $assetUrl($websiteSettings->favicon_svg_path, 'favicon.svg') }}" />
        <link rel="shortcut icon" href="{{ $assetUrl($websiteSettings->favicon_ico_path, 'favicon.ico') }}" />
        <link rel="apple-touch-icon" sizes="180x180" href="{{ $assetUrl($websiteSettings->apple_touch_icon_path, 'apple-touch-icon.png') }}" />
        <link rel="manifest" href="{{ route('site.webmanifest') }}" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cairo:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
