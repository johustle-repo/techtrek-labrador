# TechTrek Labrador Implementation Blueprint

This document converts the thesis scope into a build-ready technical checklist for this codebase.

## 1. Scope Lock (What To Build)

In scope:
- Tourist attraction information pages
- Event and announcement module
- Local business directory
- Interactive map and navigation
- Admin CMS for LGU-maintained content
- Role-based access control and secure post-login routing
- Responsive web UI (desktop + mobile browser)

Out of scope:
- Native Android/iOS app
- Online booking, payment, reservations
- AI chatbot, recommendation engine, AR tours
- Long-term impact analytics and economic forecasting

## 2. Current State Snapshot

Already present:
- Laravel + Inertia React starter structure
- Auth (Fortify), password reset, email verification, 2FA
- Role column on `users` table
- Role middleware (`role:...`)
- Super admin dashboard route: `/superadmin/dashboard`
- Role-aware redirects after login and from `/`

Core domain status:
- Tourism domain tables are implemented.
- CMS CRUD flows are implemented for LGU/admin modules.
- Public discovery/search/filter pages are implemented.
- Moderation and publish workflow is implemented.

## 3. Feature Checklist (Execution Order)

## Phase 1: Foundation
- [x] Define role constants and central policy map
- [x] Add database tables for tourism modules
- [x] Add model relationships and factories/seeders
- [x] Add form request validation for create/update actions
- [x] Add audit fields (`created_by`, `updated_by`) for admin-edited content

## Phase 2: Public Modules
- [x] Public attractions list + detail pages
- [x] Public events list + detail pages
- [x] Public business directory + detail pages
- [x] Search + category filters + basic sorting
- [x] Map view with geotagged attractions/businesses

## Phase 3: CMS (LGU/Admin)
- [x] CMS dashboard summary cards (counts, pending approvals, drafts)
- [x] CRUD for attractions
- [x] CRUD for events/announcements
- [x] CRUD for businesses
- [x] Fee management (environmental fees, commissions, ad promotion fees)
- [x] Media upload management
- [x] Draft/publish/archive lifecycle controls

## Phase 4: Moderation and Security
- [x] Approval queue for submissions/edits
- [x] Policy/Gate enforcement per module and action
- [x] Server-side role checks in every protected route/action
- [x] Rate limiting for sensitive actions
- [x] Activity/audit log for critical admin actions

## Phase 5: Evaluation-Ready Outputs (Thesis Alignment)
- [x] Instrumented usability checkpoints (task completion, error points)
- [x] SUS-ready user test script and test accounts per role
- [x] Exportable evaluation screenshots and flow map

## 4. Suggested Role Model

Use a strict single-role enum initially:
- `super_admin`: platform-wide control, security, user/role control
- `lgu_admin`: municipality content management and publishing
- `business_owner`: manage own listing/profile data only
- `tourist`: authenticated end-user (optional), mostly read actions
- `visitor`: unauthenticated guest

If needed later, migrate to many-to-many roles/permissions.

## 5. RBAC Matrix (Minimum Secure Baseline)

Legend:
- `R` read/view
- `C` create
- `U` update
- `D` delete
- `P` publish/approve

| Module | visitor | tourist | business_owner | lgu_admin | super_admin |
|---|---|---|---|---|---|
| Public attractions/events/businesses | R | R | R | R | R |
| Own profile/account settings | - | U | U | U | U |
| Business listing (own) | - | - | C/U | R | R |
| Attractions CMS | - | - | - | C/U/D/P | C/U/D/P |
| Events CMS | - | - | - | C/U/D/P | C/U/D/P |
| Business CMS (all entries) | - | - | - | C/U/D/P | C/U/D/P |
| Moderation queue | - | - | - | R/P | R/P |
| User role management | - | - | - | - | C/U/D |
| Platform settings | - | - | - | - | C/U |
| Audit logs | - | - | - | R | R |

Security rule:
- Never rely on UI-only hiding. Enforce all permissions in backend Policies/Gates and route middleware.

## 6. Data Model (Entity Map)

Core entities and relationships:

- `users`
  - hasMany `attractions` (as creator/updater)
  - hasMany `events` (as creator/updater)
  - hasMany `businesses` (as creator/updater/owner)

- `categories`
  - hasMany `attractions`
  - hasMany `businesses`

- `attractions`
  - belongsTo `category`
  - hasMany `attraction_media`
  - mayHaveMany `tags`

- `events`
  - optional belongsTo `attraction`
  - hasMany `event_media`

- `businesses`
  - belongsTo `category`
  - belongsTo `user` (owner, optional for LGU-managed entries)
  - hasMany `business_media`

- `announcements`
  - standalone LGU updates/news

- `audit_logs`
  - records actor, action, module, target id, metadata

## 7. Suggested Table Blueprint (Minimal Columns)

`categories`
- `id`, `name`, `slug`, `type` (`attraction`/`business`), timestamps

`attractions`
- `id`, `name`, `slug`, `description`, `address`
- `latitude`, `longitude`
- `category_id`
- `status` (`draft`/`published`/`archived`)
- `featured_image_path`
- `created_by`, `updated_by`
- timestamps

`events`
- `id`, `title`, `slug`, `description`
- `starts_at`, `ends_at`
- `venue_name`, `venue_address`
- `latitude`, `longitude` (optional)
- `attraction_id` (optional)
- `status`, `created_by`, `updated_by`
- timestamps

`businesses`
- `id`, `name`, `slug`, `description`
- `owner_user_id` (nullable)
- `contact_email`, `contact_phone`
- `address`, `latitude`, `longitude`
- `category_id`
- `status`, `created_by`, `updated_by`
- timestamps

`announcements`
- `id`, `title`, `content`, `is_pinned`, `status`
- `published_at`
- `created_by`, `updated_by`
- timestamps

`audit_logs`
- `id`, `actor_user_id`, `action`, `module`, `target_id`
- `before_json`, `after_json`, `ip_address`, `user_agent`
- timestamps

## 8. Route Structure (Recommended)

Public:
- `GET /` (guest-only welcome, auth users redirected by role)
- `GET /attractions`, `GET /attractions/{slug}`
- `GET /events`, `GET /events/{slug}`
- `GET /businesses`, `GET /businesses/{slug}`
- `GET /map`

Authenticated:
- `GET /dashboard` (non-super-admin dashboard)
- `GET /superadmin/dashboard` (`role:super_admin`)

LGU CMS (`auth`, `verified`, `role:lgu_admin,super_admin`):
- `/cms/attractions/*`
- `/cms/events/*`
- `/cms/businesses/*`
- `/cms/announcements/*`
- `/cms/moderation/*`

Business owner (`auth`, `verified`, `role:business_owner,super_admin`):
- `/owner/dashboard`
- `/owner/businesses/*` (owner-scoped actions)
- `/owner/products/*` (owner-scoped products/services)
- `/owner/orders/*` (owner-scoped orders/services)
- `/owner/fees` (applied fee visibility)

## 9. Backend Security Checklist

- [x] Add authorization policies for each content model
- [x] Enforce owner-scoped queries for `business_owner`
- [x] Validate all create/update inputs with Form Requests
- [x] Sanitize rich text input (if HTML allowed)
- [x] Restrict upload mime types and size; store outside public root
- [x] Record critical writes in `audit_logs`
- [x] Protect admin routes with both auth+verified+role middleware
- [x] Keep redirect logic role-aware after login and on root access

## 10. UI/UX Checklist (Aligned to Thesis)

- [x] Clear, searchable public tourism pages
- [x] Mobile-first responsive cards + detail pages
- [x] Consistent navigation and breadcrumb for CMS
- [x] Empty states and error states for all data lists
- [x] Accessibility baseline: labels, focus states, keyboard navigation
- [x] Fast first-load with paginated lists and optimized images

## 11. Immediate Next Build Tasks (Recommended Sprint)

1. Create migrations/models for `categories`, `attractions`, `events`, `businesses`, `announcements`.
2. Seed realistic Labrador sample data for demos/usability tests.
3. Build public list/detail pages for attractions/events/businesses.
4. Build LGU CMS CRUD for attractions first (as template for other modules).
5. Add policy checks and audit logs before broad rollout.

