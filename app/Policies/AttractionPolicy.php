<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Attraction;
use App\Models\User;

class AttractionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::cmsRoles());
    }

    public function view(User $user, Attraction $attraction): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Attraction $attraction): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Attraction $attraction): bool
    {
        return $this->viewAny($user);
    }
}
