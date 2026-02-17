<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // If not logged in
        if (!$user) {
            abort(401);
        }

        // If role not allowed
        if (!in_array($user->role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
