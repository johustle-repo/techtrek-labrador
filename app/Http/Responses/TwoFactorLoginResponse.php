<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
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
            ? new JsonResponse('', 204)
            : redirect()->to($redirectTo);
    }
}
