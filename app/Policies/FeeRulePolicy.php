<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\FeeRule;
use App\Models\User;

class FeeRulePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::cmsRoles());
    }

    public function view(User $user, FeeRule $feeRule): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, FeeRule $feeRule): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, FeeRule $feeRule): bool
    {
        return $this->viewAny($user);
    }
}
