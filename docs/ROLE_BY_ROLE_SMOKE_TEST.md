# TechTrek Role-by-Role Smoke Test

Run this after:
- `php artisan migrate --force`
- `php artisan db:seed --force`
- `composer run test:security-smoke`

Base URL (local): `http://localhost:8000`

## Test Accounts
- Super Admin: `superadmin@techtrek.local` / `SuperAdmin123!`
- LGU Admin: `lguadmin@techtrek.local` / `LguAdmin123!`
- Business Owner: `owner@techtrek.local` / `Owner123!`
- Tourist: `tourist@techtrek.local` / `Tourist123!`
- Visitor: `visitor@techtrek.local` / `Visitor123!`

## A. Guest / Public
- [ ] Open `/` and confirm Welcome page loads.
- [ ] Confirm **Must Visit** cards show real attractions (not hardcoded placeholders).
- [ ] Click `Get Started Now` and confirm redirect to `/login`.
- [ ] Attempt `/cms/dashboard` while logged out and confirm redirect to login.

## B. Super Admin
- [ ] Login using super admin account and confirm redirect to `/superadmin/dashboard`.
- [ ] Open `/superadmin/users` and confirm user list loads.
- [ ] Open `/superadmin/audit-logs` and confirm logs page loads.
- [ ] Open `/cms/dashboard` and confirm access is allowed.
- [ ] Open `/owner/dashboard` and confirm access is allowed (super_admin override).

## C. LGU Admin
- [ ] Login using LGU admin account and confirm redirect to `/cms/dashboard`.
- [ ] Open `/cms/attractions` and perform create + edit + delete on a test record.
- [ ] Open `/cms/events` and perform create + edit + delete on a test record.
- [ ] Open `/cms/businesses` and perform create + edit + delete on a test record.
- [ ] Open `/cms/announcements` and perform create + edit + delete on a test record.
- [ ] Open `/cms/fees` and confirm create/update works.
- [ ] Open `/cms/moderation` and confirm draft queue loads.
- [ ] Open `/cms/orders` and confirm order list/status update works.
- [ ] Attempt `/superadmin/users` and confirm forbidden/blocked.

## D. Business Owner
- [ ] Login using owner account and confirm redirect to `/owner/dashboard`.
- [ ] Open `/owner/businesses` and update own business profile.
- [ ] Open `/owner/products` and create/update/delete a product/service.
- [ ] Open `/owner/orders` and confirm pending/completed rows show for owned business only.
- [ ] Open `/owner/fees` and confirm fee visibility works.
- [ ] Attempt `/cms/orders` and confirm forbidden/blocked.

## E. Tourist/Visitor App Flow
- [ ] Login using tourist account and confirm redirect to `/visitor/home`.
- [ ] Confirm visitor home hero/stat cards load.
- [ ] Confirm **About Labrador** card includes official municipal seal image.
- [ ] Open `/attractions`, `/events`, `/businesses`, `/shops`, `/map` and confirm each page renders.
- [ ] From `/shops`, create one product order and one service booking.
- [ ] Open `/visitor/orders` and confirm records appear.
- [ ] Open `/visitor/bookings` and confirm booking appears.
- [ ] Open order detail and cancel one **pending** order with reason.

## F. Cross-Role Order Tracking
- [ ] Login as owner and confirm new visitor order/booking appears in `/owner/orders`.
- [ ] Login as LGU admin and confirm same order appears in `/cms/orders`.
- [ ] Login as super admin and confirm same order appears in `/cms/orders`.

## G. Session / Account Controls
- [ ] From sidebar/header user menu, open `Settings` successfully.
- [ ] Logout from each role and confirm redirect to login/welcome.
- [ ] Confirm logged-out users cannot access protected routes directly.

## Sign-off
- Tester:
- Date:
- Environment:
- Result: PASS / FAIL
- Notes:
