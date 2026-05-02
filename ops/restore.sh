#!/usr/bin/env bash
# Reiz Postgres restore — read a .sql.gz dump and apply it to the
# running Postgres container. INTENDED FOR LIVE INCIDENTS — this script
# DROPS the existing reiz database and recreates it from the dump.
#
# Usage:
#     sudo /opt/reiz/ops/restore.sh /var/backups/reiz/reiz-daily-20260502T030000Z.sql.gz
#
# Pre-flight: the script asks for an explicit "yes" confirmation in
# stdin so a sleep-deprived oncall can't lose prod data with a single
# typo. Skip the prompt with `FORCE_YES=1` only when you're certain.

set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <backup.sql.gz>" >&2
    exit 2
fi

BACKUP_FILE="$1"
PG_CONTAINER="${PG_CONTAINER:-reiz-postgres-1}"
PG_USER="${PG_USER:-postgres}"
PG_DB="${PG_DB:-reiz}"

if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "Backup file not found: $BACKUP_FILE" >&2
    exit 1
fi

# Validate the dump before touching prod — gzip integrity + at least one
# CREATE TABLE statement. Catches "you handed me an empty file" mistakes.
if ! gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo "FATAL: backup file is not a valid gzip stream: $BACKUP_FILE" >&2
    exit 1
fi
TABLE_COUNT="$(gunzip -c "$BACKUP_FILE" | grep -c '^CREATE TABLE' || true)"
if [[ "$TABLE_COUNT" -lt 10 ]]; then
    echo "FATAL: backup looks broken — only $TABLE_COUNT CREATE TABLE statements" >&2
    exit 1
fi

echo "About to restore $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1), $TABLE_COUNT tables) into $PG_DB on $PG_CONTAINER."
echo "This will DROP the existing $PG_DB database and recreate it from the dump."
echo ""
echo "Before continuing:"
echo "  1. Take a fresh backup of the CURRENT prod state — restore is destructive."
echo "     /opt/reiz/ops/backup.sh"
echo "  2. Stop the api container so no writes happen mid-restore."
echo "     cd /opt/reiz && docker compose stop api"
echo ""

if [[ "${FORCE_YES:-}" != "1" ]]; then
    read -r -p 'Type "yes" to proceed: ' CONFIRM
    if [[ "$CONFIRM" != "yes" ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo "Dropping + recreating $PG_DB…"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$PG_DB\";"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -c "CREATE DATABASE \"$PG_DB\";"

echo "Restoring dump…"
gunzip -c "$BACKUP_FILE" | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -q

echo ""
echo "Restore complete. Verify:"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -c "
    SELECT 'cars' AS t, COUNT(*) FROM car
    UNION ALL SELECT 'photos', COUNT(*) FROM car_photo
    UNION ALL SELECT 'users', COUNT(*) FROM \"user\"
    UNION ALL SELECT 'rentals', COUNT(*) FROM rental
    UNION ALL SELECT 'reservations', COUNT(*) FROM reservation;
"

echo ""
echo "Next steps:"
echo "  1. cd /opt/reiz && docker compose start api"
echo "  2. Watch logs: docker logs -f reiz-api-1"
echo "  3. Hit /api/health to confirm: curl http://127.0.0.1:8080/api/health -H 'Host: reiz.com.ua'"
