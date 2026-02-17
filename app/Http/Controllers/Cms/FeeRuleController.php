<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreFeeRuleRequest;
use App\Http\Requests\Cms\UpdateFeeRuleRequest;
use App\Models\FeeRule;
use App\Support\AuditLogger;
use App\Support\InputSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeRuleController extends Controller
{
    /**
     * Display a listing of fee rules.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', FeeRule::class);

        $summary = [
            'total' => FeeRule::query()->count(),
            'active' => FeeRule::query()->where('status', 'active')->count(),
            'draft' => FeeRule::query()->where('status', 'draft')->count(),
            'inactive' => FeeRule::query()->where('status', 'inactive')->count(),
            'archived' => FeeRule::query()->where('status', 'archived')->count(),
            'by_type' => [
                'environmental_fee' => FeeRule::query()->where('type', 'environmental_fee')->count(),
                'business_commission' => FeeRule::query()->where('type', 'business_commission')->count(),
                'event_commission' => FeeRule::query()->where('type', 'event_commission')->count(),
                'ad_promotion_fee' => FeeRule::query()->where('type', 'ad_promotion_fee')->count(),
            ],
        ];

        $fees = FeeRule::query()
            ->latest()
            ->paginate(12)
            ->through(fn (FeeRule $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'charge_basis' => $item->charge_basis,
                'amount' => $item->amount,
                'minimum_amount' => $item->minimum_amount,
                'status' => $item->status,
                'effective_from' => $item->effective_from?->toDateTimeString(),
                'effective_to' => $item->effective_to?->toDateTimeString(),
                'updated_at' => $item->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('cms/fees/index', [
            'fees' => $fees,
            'summary' => $summary,
        ]);
    }

    /**
     * Show the form for creating a new fee rule.
     */
    public function create(): Response
    {
        $this->authorize('create', FeeRule::class);

        return Inertia::render('cms/fees/create');
    }

    /**
     * Store a newly created fee rule in storage.
     */
    public function store(StoreFeeRuleRequest $request): RedirectResponse
    {
        $this->authorize('create', FeeRule::class);

        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);

        $fee = FeeRule::create([
            ...$data,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        AuditLogger::log(
            request: $request,
            action: 'create',
            module: 'fees',
            targetId: $fee->id,
            after: $fee->getAttributes(),
        );

        return to_route('cms.fees.index')->with('success', 'Fee rule created successfully.');
    }

    /**
     * Show the form for editing the specified fee rule.
     */
    public function edit(FeeRule $fee): Response
    {
        $this->authorize('update', $fee);

        return Inertia::render('cms/fees/edit', [
            'fee' => [
                'id' => $fee->id,
                'name' => $fee->name,
                'type' => $fee->type,
                'charge_basis' => $fee->charge_basis,
                'amount' => (string) $fee->amount,
                'minimum_amount' => $fee->minimum_amount === null ? '' : (string) $fee->minimum_amount,
                'status' => $fee->status,
                'description' => $fee->description,
                'effective_from' => $fee->effective_from?->format('Y-m-d\TH:i'),
                'effective_to' => $fee->effective_to?->format('Y-m-d\TH:i'),
            ],
        ]);
    }

    /**
     * Update the specified fee rule in storage.
     */
    public function update(UpdateFeeRuleRequest $request, FeeRule $fee): RedirectResponse
    {
        $this->authorize('update', $fee);

        $before = $fee->getAttributes();

        $data = $request->validated();
        $data['description'] = InputSanitizer::plain($data['description'] ?? null);

        $fee->update([
            ...$data,
            'updated_by' => $request->user()?->id,
        ]);

        $fee->refresh();
        AuditLogger::log(
            request: $request,
            action: 'update',
            module: 'fees',
            targetId: $fee->id,
            before: $before,
            after: $fee->getAttributes(),
        );

        return to_route('cms.fees.index')->with('success', 'Fee rule updated successfully.');
    }

    /**
     * Remove the specified fee rule from storage.
     */
    public function destroy(Request $request, FeeRule $fee): RedirectResponse
    {
        $this->authorize('delete', $fee);

        $before = $fee->getAttributes();
        $fee->delete();

        AuditLogger::log(
            request: $request,
            action: 'delete',
            module: 'fees',
            targetId: $fee->id,
            before: $before,
        );

        return to_route('cms.fees.index')->with('success', 'Fee rule deleted successfully.');
    }
}
