#!/usr/bin/env bash
# Restores a backup made by backup-db.sh into an EMPTY database.
#
#   TARGET_DATABASE_URL=postgresql://.../valorian_restore ./scripts/restore-db.sh backups/valorian-....dump
#
# Restore into a new database first, check it, then switch DATABASE_URL. This script refuses to run
# against a database that already contains tables, so it cannot overwrite production data by accident.
set -euo pipefail

: "${TARGET_DATABASE_URL:?Set TARGET_DATABASE_URL to an empty database}"
file="${1:?Usage: restore-db.sh <backup.dump>}"
url="${TARGET_DATABASE_URL%%\?*}"

existing=$(psql "$url" -tAc "select count(*) from information_schema.tables where table_schema = 'public'")
if [ "$existing" != "0" ]; then
  echo "Refusing to restore: the target database already has $existing tables." >&2
  exit 1
fi

pg_restore --no-owner --no-privileges --exit-on-error --dbname "$url" "$file"
echo "Restore complete. Next: point DATABASE_URL at it and run 'npm run db:deploy' to apply any newer migrations."
