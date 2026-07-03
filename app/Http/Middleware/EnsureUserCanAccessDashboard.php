<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanAccessDashboard
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(count($request->user()?->permissionSlugs() ?? []) > 0, 403);

        return $next($request);
    }
}
