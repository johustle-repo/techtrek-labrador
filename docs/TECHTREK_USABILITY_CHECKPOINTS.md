# TechTrek Labrador Usability Checkpoints

This file defines measurable checkpoints for thesis evaluation runs.

## 1. Instrumentation Scope

Track these per task:
- `start_time`
- `end_time`
- `completion_status` (`success`, `partial`, `failed`)
- `error_count`
- `help_requests`
- `notes`

Use manual observer logging for now (spreadsheet or paper form).  
Optional: later automate with client-side event capture.

## 2. Participant Groups

- `visitor` (guest, no login)
- `tourist` (authenticated read-only user)
- `business_owner`
- `lgu_admin`
- `super_admin`

## 3. Task Checkpoints

## Public/Visitor tasks
- `V1`: Find one attraction and open its detail page.
  - Success: detail page opened within 2 minutes.
  - Errors: wrong page opens, filters not understood.
- `V2`: Find one upcoming event and identify date + venue.
  - Success: correct date and venue verbalized.
  - Errors: misread schedule/location.
- `V3`: Open map and locate Labrador area pins.
  - Success: user identifies at least one map pin correctly.
  - Errors: map not used, cannot pan/zoom.

## LGU Admin tasks
- `L1`: Login and open CMS dashboard.
  - Success: reaches `/cms/dashboard` without support.
  - Errors: auth confusion, role redirect issues.
- `L2`: Create and publish an attraction with image.
  - Success: record saved with `published` status.
  - Errors: validation fail, image upload fail.
- `L3`: Create event with poster image and schedule.
  - Success: event appears in CMS event list.
  - Errors: category/status/date mistakes.
- `L4`: Create fee rule (environmental or commission).
  - Success: rule appears in fee list with correct type/amount.
  - Errors: wrong basis (`fixed` vs `percent`), save failure.

## Super Admin tasks
- `S1`: Create new user and assign role.
  - Success: user appears in User Management.
  - Errors: role selection mistakes, validation errors.
- `S2`: Open audit logs and filter by module/action.
  - Success: filter returns expected rows.
  - Errors: filter misunderstanding or empty-state confusion.

## Business Owner task
- `B1`: Login and verify access restriction behavior.
  - Success: cannot access protected LGU/SuperAdmin modules.
  - Errors: unexpected access or broken route.

## 4. Error Taxonomy

- `navigation_error`: wrong route/page
- `form_error`: validation or data-entry mistake
- `permission_error`: unauthorized action attempted
- `system_error`: exception/white screen/loading failure
- `comprehension_error`: user cannot interpret labels/instructions

## 5. Output Template (Per Participant)

- Participant ID:
- Role:
- Device:
- Network condition:
- Task results:
  - Task code:
  - Completion status:
  - Time to complete:
  - Errors observed:
  - Notes:
- Overall usability issues:
- Recommended UI fix:
