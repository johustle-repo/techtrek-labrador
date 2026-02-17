# Render Deployment (No Credit Card Path)

This setup is for a free-tier thesis/demo deployment.

## 1. Push Required Files
- `render.yaml`
- `Dockerfile`
- `scripts/render-start.sh`

## 2. Create Render Blueprint
1. Open Render dashboard.
2. Click `New` -> `Blueprint`.
3. Select this repository and branch.
4. Render will create:
   - Web service: `techtrek-labrador`
   - Postgres DB: `techtrek-db` (free plan)

Note:
- This repo is configured for `runtime: docker` because some Render accounts no longer show native PHP in runtime choices.

## 3. Set Required Environment Values
In the web service environment tab, set:
- `APP_KEY` = output of `php artisan key:generate --show`
- `APP_URL` = your Render service URL (or custom domain URL)

Notes:
- `APP_ENV=production` and `APP_DEBUG=false` are already defined in `render.yaml`.
- Database variables are auto-linked from Render Postgres.

## 4. Deploy
- Trigger deploy from Render (or push to your deploy branch).
- Docker image build runs:
  - `composer install --no-dev --optimize-autoloader`
  - `npm ci`
  - `npm run build`
- Container start script runs:
  - `php artisan migrate --force`
  - `php artisan storage:link`
  - `php artisan optimize:clear`
  - cache warmup commands
  - `php artisan serve --host=0.0.0.0 --port=$PORT`

## 5. Post-Deploy Validation
Run:
```bash
composer run test:security-smoke
```

Then execute:
- `docs/ROLE_BY_ROLE_SMOKE_TEST.md`

## 6. Free Tier Reminder
Render free web services spin down after inactivity and wake on request.
Use this for demo/staging, not strict 24/7 production uptime.
