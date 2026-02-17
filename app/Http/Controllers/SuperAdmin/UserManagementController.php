<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreUserRequest;
use App\Http\Requests\SuperAdmin\UpdateUserRequest;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->latest()
            ->paginate(12)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at?->toDateTimeString(),
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('SuperAdmin/Users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('SuperAdmin/Users/create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
            'email_verified_at' => ! empty($data['email_verified']) ? now() : null,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'users',
            targetId: $user->id,
            after: $user->getAttributes(),
        );

        return to_route('superadmin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('SuperAdmin/Users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified' => $user->email_verified_at !== null,
            ],
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $before = $user->getAttributes();
        $data = $request->validated();

        $updates = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'email_verified_at' => ! empty($data['email_verified']) ? ($user->email_verified_at ?? now()) : null,
        ];

        if (! empty($data['password'])) {
            $updates['password'] = Hash::make($data['password']);
        }

        $user->update($updates);

        $user->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'users',
            targetId: $user->id,
            before: $before,
            after: $user->getAttributes(),
        );

        return to_route('superadmin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if (auth()->id() === $user->id) {
            return to_route('superadmin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $before = $user->getAttributes();
        $user->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'users',
            targetId: $user->id,
            before: $before,
        );

        return to_route('superadmin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
