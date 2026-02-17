<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitorActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();
        if (! $user) {
            return $response;
        }

        if (! in_array($user->role, [UserRole::TOURIST->value, UserRole::VISITOR->value], true)) {
            return $response;
        }

        if (! $request->isMethod('GET')) {
            return $response;
        }

        if ($request->expectsJson()) {
            return $response;
        }

        $routeName = $request->route()?->getName();
        if (! $routeName || $routeName === 'media.show') {
            return $response;
        }

        AuditLog::create([
            'actor_user_id' => $user->id,
            'action' => 'view',
            'module' => 'visitor_page',
            'target_id' => null,
            'before_json' => null,
            'after_json' => [
                'route_name' => $routeName,
                'path' => $request->path(),
                'full_url' => $request->fullUrl(),
                'referer' => $request->headers->get('referer'),
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $response;
    }
}

