#!/usr/bin/env bash
# Logical backup of the Valorian database. Prefer your hosting provider's automated backups
# (Supabase, Neon, Render, Railway all offer them) and use this as an extra copy.
#
#   DATABASE_URL=postgresql://... ./scripts/backup-db.sh [backup-dir]
#
# Keep backups outside the repository (backups/ is git-ignored) and copy them off the server.
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to the database to back up}"
dir="${1:-backups}"
keep="${BACKUP_KEEP:-14}"
mkdir -p "$dir"
file="$dir/valorian-$(date -u +%Y%m%dT%H%M%SZ).dump"

# pg_dump does not understand Prisma's ?schema= parameter.
url="${DATABASE_URL%%\?*}"
pg_dump --format=custom --no-owner --no-privileges --file "$file" "$url"
pg_restore --list "$file" > /dev/null   # fails if the archive is unreadable
chmod 600 "$file"
echo "Backup written: $file"

# Retention: keep the newest $keep backups.
ls -1t "$dir"/valorian-*.dump 2>/dev/null | tail -n +"$((keep + 1))" | xargs -r rm --
