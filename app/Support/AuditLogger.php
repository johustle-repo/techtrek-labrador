<?php

namespace App\Support;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogger
{
    /**
     * Record an audit log entry.
     *
     * @param array<string, mixed>|null $before
     * @param array<string, mixed>|null $after
     */
    public static function log(
        Request $request,
        string $action,
        string $module,
        ?int $targetId = null,
        ?array $before = null,
        ?array $after = null,
    ): void {
        AuditLog::create([
            'actor_user_id' => $request->user()?->id,
            'action' => $action,
            'module' => $module,
            'target_id' => $targetId,
            'before_json' => $before,
            'after_json' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
