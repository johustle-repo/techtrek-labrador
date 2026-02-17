# TechTrek Deployment Readiness Checklist

## 1. Environment and Secrets
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set production `APP_URL`
- [ ] Generate a strong `APP_KEY`
- [ ] Configure production DB credentials
- [ ] Configure production mail provider (`MAIL_*`)
- [ ] Configure queue/caching stores (`QUEUE_CONNECTION`, `CACHE_STORE`)
- [ ] Configure secure session cookie (`SESSION_SECURE_COOKIE=true` on HTTPS)

## 2. Storage and Permissions
- [ ] Ensure writable: `storage/`, `bootstrap/cache/`
- [ ] Run `php artisan storage:link`
- [ ] Confirm uploads resolve through `/media/{path}` route

## 3. Build and Optimize
- [ ] Install dependencies: `composer install --no-dev --optimize-autoloader`
- [ ] Install JS deps and build: `npm ci && npm run build`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Cache config/routes/views:
  - `php artisan config:cache`
  - `php artisan route:cache`
  - `php artisan view:cache`

## 4. Workers and Scheduling
- [ ] Start queue workers in supervised mode (Supervisor/systemd)
- [ ] Add scheduler cron: `* * * * * php /path/to/artisan schedule:run`

## 5. Security Verification
- [ ] Run automated role/access smoke tests: `composer run test:security-smoke`
- [ ] Verify role routing after login:
  - super_admin -> `/superadmin/dashboard`
  - lgu_admin -> `/cms/dashboard`
  - business_owner -> `/owner/dashboard`
  - tourist/visitor -> `/visitor/home`
- [ ] Verify protected routes reject unauthorized roles (403)
- [ ] Verify auth-required modules redirect guests to login
- [ ] Verify logout/settings work from sidebar/header menus

## 6. Smoke Test Matrix
- [ ] Execute manual matrix in `docs/ROLE_BY_ROLE_SMOKE_TEST.md`
- [ ] Super Admin: dashboard, user management, audit logs
- [ ] LGU Admin: CMS CRUD, moderation, fees, order overview
- [ ] Business Owner: business profile, products/services, orders, fee view
- [ ] Visitor/Tourist: home, attractions, events, shops, order + booking tracking

## 7. Rollback Safety
- [ ] Backup DB before release
- [ ] Keep previous release artifact/build
- [ ] Document rollback commands and owner
