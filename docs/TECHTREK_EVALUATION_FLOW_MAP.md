# TechTrek Labrador Evaluation Flow Map

Use this as the export-ready flow guide for screenshots and appendix materials.

## 1. Public Visitor Flow

1. `GET /` (welcome page)
2. `GET /attractions` (browse list)
3. `GET /attractions/{slug}` (detail)
4. `GET /events` and `GET /events/{slug}`
5. `GET /businesses` and `GET /businesses/{slug}`
6. `GET /map`

Screenshot checkpoints:
- Home hero
- Attraction list with filters
- Event detail
- Business detail
- Map with pins

## 2. LGU Admin Flow

1. Login as `lgu_admin`
2. Redirect to `/cms/dashboard`
3. Create and publish content:
   - `/cms/attractions/create`
   - `/cms/events/create`
   - `/cms/businesses/create`
   - `/cms/announcements/create`
4. Manage fees:
   - `/cms/fees`
   - `/cms/fees/create`
5. Review draft queue:
   - `/cms/moderation`

Screenshot checkpoints:
- CMS dashboard metrics
- Create form validation state
- Published list item
- Fee management summary
- Moderation queue

## 3. Super Admin Flow

1. Login as `super_admin`
2. Redirect to `/superadmin/dashboard`
3. Manage accounts:
   - `/superadmin/users`
   - `/superadmin/users/create`
4. Inspect audit logs:
   - `/superadmin/audit-logs`

Screenshot checkpoints:
- Super admin dashboard
- User table
- Create user form
- Audit log filters and table

## 4. Security Validation Flow

1. Login as `business_owner` or `tourist`
2. Attempt to open:
   - `/cms/dashboard`
   - `/superadmin/dashboard`
3. Confirm access denied/redirect behavior.

Screenshot checkpoints:
- Unauthorized access response
- Correct role-based redirect target

## 5. Export Naming Convention

Use deterministic names:
- `P1_home.png`
- `P2_attractions_list.png`
- `L1_cms_dashboard.png`
- `L4_fee_management.png`
- `S3_user_management.png`
- `S4_audit_logs.png`
- `SEC1_unauthorized_access.png`

This keeps thesis appendix references stable.
