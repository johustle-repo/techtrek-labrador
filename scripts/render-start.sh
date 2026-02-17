#!/usr/bin/env bash
set -e

# Ensure APP_KEY exists before Laravel boots.
if [ -z "${APP_KEY:-}" ]; then
  if [ "${AUTO_GENERATE_APP_KEY:-false}" = "true" ]; then
    echo "APP_KEY not found in environment. Generating ephemeral APP_KEY..."
    php artisan key:generate --force
  else
    echo "ERROR: APP_KEY is missing. Set APP_KEY in Render Environment Variables."
    exit 1
  fi
fi

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
