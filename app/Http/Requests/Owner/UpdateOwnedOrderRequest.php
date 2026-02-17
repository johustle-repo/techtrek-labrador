<?php

namespace App\Http\Requests\Owner;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOwnedOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([
            UserRole::BUSINESS_OWNER,
            UserRole::SUPER_ADMIN,
        ]) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_id' => ['required', 'integer', Rule::exists('businesses', 'id')],
            'business_product_id' => ['nullable', 'integer', Rule::exists('business_products', 'id')],
            'order_type' => ['required', Rule::in(['product_order', 'service_booking', 'custom_service'])],
            'reference_no' => ['nullable', 'string', 'max:50'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_contact' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])],
            'scheduled_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
