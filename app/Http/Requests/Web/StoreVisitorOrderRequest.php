<?php

namespace App\Http\Requests\Web;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVisitorOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([
            UserRole::TOURIST,
            UserRole::VISITOR,
        ]) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_product_id' => ['required', 'integer', Rule::exists('business_products', 'id')],
            'quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'customer_contact' => ['required', 'string', 'max:100'],
            'scheduled_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'visitor_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'visitor_longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }
}

