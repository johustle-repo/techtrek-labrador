<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a filterable list of audit logs.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $filters = [
            'search' => (string) $request->string('search', ''),
            'module' => (string) $request->string('module', ''),
            'action' => (string) $request->string('action', ''),
            'actor' => (string) $request->string('actor', ''),
            'start_date' => (string) $request->string('start_date', ''),
            'end_date' => (string) $request->string('end_date', ''),
        ];

        $logs = AuditLog::query()
            ->with('actor:id,name,email')
            ->when($filters['search'] !== '', function ($query) use ($filters) {
                $query->where(function ($nested) use ($filters) {
                    $nested->where('module', 'like', '%'.$filters['search'].'%')
                        ->orWhere('action', 'like', '%'.$filters['search'].'%')
                        ->orWhere('target_id', 'like', '%'.$filters['search'].'%')
                        ->orWhereHas('actor', function ($actorQuery) use ($filters) {
                            $actorQuery->where('name', 'like', '%'.$filters['search'].'%')
                                ->orWhere('email', 'like', '%'.$filters['search'].'%');
                        });
                });
            })
            ->when($filters['module'] !== '', fn ($query) => $query->where('module', $filters['module']))
            ->when($filters['action'] !== '', fn ($query) => $query->where('action', $filters['action']))
            ->when($filters['actor'] !== '', fn ($query) => $query->where('actor_user_id', $filters['actor']))
            ->when($filters['start_date'] !== '', fn ($query) => $query->whereDate('created_at', '>=', $filters['start_date']))
            ->when($filters['end_date'] !== '', fn ($query) => $query->whereDate('created_at', '<=', $filters['end_date']))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (AuditLog $log) => [
                'id' => $log->id,
                'actor' => $log->actor?->name ?? 'System',
                'actor_email' => $log->actor?->email,
                'action' => $log->action,
                'module' => $log->module,
                'target_id' => $log->target_id,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('SuperAdmin/AuditLogs/index', [
            'logs' => $logs,
            'filters' => $filters,
            'modules' => AuditLog::query()
                ->select('module')
                ->distinct()
                ->orderBy('module')
                ->pluck('module'),
            'actions' => AuditLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action'),
            'actors' => User::query()
                ->whereIn('id', AuditLog::query()->select('actor_user_id')->whereNotNull('actor_user_id'))
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }
}
