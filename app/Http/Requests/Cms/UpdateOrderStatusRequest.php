<?php

namespace App\Http\Requests\Cms;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([
            UserRole::LGU_ADMIN,
            UserRole::SUPER_ADMIN,
        ]) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])],
        ];
    }
}

