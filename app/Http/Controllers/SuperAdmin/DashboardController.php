<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attraction;
use App\Models\AuditLog;
use App\Models\Business;
use App\Models\Event;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the super admin dashboard.
     */
    public function index(): Response
    {
        $now = now();
        $totalUsers = User::count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $pendingVerifications = User::whereNull('email_verified_at')->count();

        return Inertia::render('SuperAdmin/Dashboard', [
            'metrics' => [
                'total_users' => $totalUsers,
                'verified_users' => $verifiedUsers,
                'pending_verifications' => $pendingVerifications,
                'super_admins' => User::where('role', UserRole::SUPER_ADMIN->value)->count(),
                'attractions' => Attraction::count(),
                'events' => Event::count(),
                'businesses' => Business::count(),
                'announcements' => Announcement::count(),
            ],
            'recent_users' => User::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'role', 'created_at'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at?->toDateTimeString(),
                ]),
            'recent_audits' => AuditLog::query()
                ->with('actor:id,name')
                ->latest()
                ->limit(8)
                ->get(['id', 'actor_user_id', 'action', 'module', 'target_id', 'created_at'])
                ->map(fn (AuditLog $log) => [
                    'id' => $log->id,
                    'actor' => $log->actor?->name ?? 'System',
                    'action' => $log->action,
                    'module' => $log->module,
                    'target_id' => $log->target_id,
                    'created_at' => $log->created_at?->toDateTimeString(),
                ]),
            'incoming_events' => Event::query()
                ->where('status', 'published')
                ->where('starts_at', '>=', $now)
                ->orderBy('starts_at')
                ->limit(6)
                ->get(['id', 'title', 'starts_at', 'venue_name', 'status'])
                ->map(fn (Event $event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'starts_at' => $event->starts_at?->toDateTimeString(),
                    'venue_name' => $event->venue_name,
                    'status' => $event->status,
                ]),
            'incoming_announcements' => Announcement::query()
                ->where('status', 'published')
                ->where(function ($query) use ($now) {
                    $query->whereNull('published_at')
                        ->orWhere('published_at', '<=', $now);
                })
                ->orderByDesc('is_pinned')
                ->orderByDesc('published_at')
                ->limit(6)
                ->get(['id', 'title', 'is_pinned', 'published_at', 'status'])
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'is_pinned' => $announcement->is_pinned,
                    'published_at' => $announcement->published_at?->toDateTimeString(),
                    'status' => $announcement->status,
                ]),
        ]);
    }
}
