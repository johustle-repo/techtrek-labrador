# TechTrek Production Runbook

## Release Steps (Laravel 12 + React/Inertia)

1. Put app in maintenance mode (optional but recommended)
```bash
php artisan down
```

2. Install PHP dependencies
```bash
composer install --no-dev --optimize-autoloader
```

3. Install and build frontend assets
```bash
npm ci
npm run build
```

4. Run database migrations
```bash
php artisan migrate --force
```

5. Ensure storage symlink exists
```bash
php artisan storage:link
```

6. Warm runtime caches
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

7. Restart queue workers
```bash
php artisan queue:restart
```

8. Bring application online
```bash
php artisan up
```

## Post-Deploy Validation

0. Security smoke test (automated)
```bash
composer run test:security-smoke
```

1. Login routing and role dashboards
- super_admin -> `/superadmin/dashboard`
- lgu_admin -> `/cms/dashboard`
- business_owner -> `/owner/dashboard`
- tourist/visitor -> `/visitor/home`

2. Public/visitor pages
- `/visitor/home`
- `/attractions`
- `/events`
- `/businesses`
- `/shops`

3. Commerce flow
- Visitor creates order/booking from `/shops`
- Owner sees orders in `/owner/orders`
- LGU/Super Admin sees order records in `/cms/orders`

4. Media loading
- Verify uploaded media renders through `/media/{path}` URLs

## Emergency Rollback (Minimal)

1. Put app down
```bash
php artisan down
```

2. Restore DB from backup and redeploy previous release artifact

3. Clear/rebuild caches
```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

4. Bring app up
```bash
php artisan up
```
