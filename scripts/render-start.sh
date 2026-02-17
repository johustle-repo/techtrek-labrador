#!/usr/bin/env bash
set -e

php artisan migrate --force
php artisan storage:link || true

if [ "${AUTO_SEED_DATA:-true}" = "true" ]; then
  php artisan db:seed --force
fi

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
