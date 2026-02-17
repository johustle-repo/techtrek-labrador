<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = $request->user();

        $redirectTo = $user && $user->hasRole(UserRole::SUPER_ADMIN)
            ? route('superadmin.dashboard')
            : route('dashboard');

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->to($redirectTo);
    }
}
