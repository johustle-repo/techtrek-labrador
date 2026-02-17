<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::cmsRoles());
    }

    public function view(User $user, Event $event): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Event $event): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->viewAny($user);
    }
}
