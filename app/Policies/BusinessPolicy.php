<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\User;

class BusinessPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::cmsRoles());
    }

    public function view(User $user, Business $business): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Business $business): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Business $business): bool
    {
        return $this->viewAny($user);
    }
}
