#!/usr/bin/env bash
set -e

# Support Aiven/managed MySQL SSL without shell access:
# if MYSQL_ATTR_SSL_CA_PEM is set in Render env, write it to a file
# and point MYSQL_ATTR_SSL_CA to that file path.
if [ -n "${MYSQL_ATTR_SSL_CA_PEM:-}" ]; then
  CA_PATH="/tmp/mysql-ca.pem"
  printf "%s" "$MYSQL_ATTR_SSL_CA_PEM" > "$CA_PATH"
  export MYSQL_ATTR_SSL_CA="$CA_PATH"
fi

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
