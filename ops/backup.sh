#!/usr/bin/env bash
# Reiz Postgres backup — pg_dump | gzip → /var/backups/reiz/<utc-iso>.sql.gz
#
# Designed to run from cron on the prod VM. Idempotent, exits non-zero on
# any step failure so cron's MAILTO surfaces it. Uses `set -euo pipefail`
# so a partial pg_dump failure doesn't leave a half-written .gz around.
#
# Retention (default): keep the last 7 daily + 4 weekly snapshots. Older
# files in $BACKUP_DIR are pruned at the end of the run. Tunable via env.
#
# Off-site upload: NOT included by design — this script is the local-tier
# backup. Add an off-site step in `ops/upload-backup.sh` (rclone/aws-cli/
# scp/whatever you actually use) and chain it from cron after this one.
# Splitting the two means a flaky off-site provider doesn't lose us the
# local snapshot.

set -euo pipefail

# ─── Config (overridable via env) ──────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-/var/backups/reiz}"
PG_CONTAINER="${PG_CONTAINER:-reiz-postgres-1}"
PG_USER="${PG_USER:-postgres}"
PG_DB="${PG_DB:-reiz}"
DAILY_KEEP="${DAILY_KEEP:-7}"      # last N daily snapshots
WEEKLY_KEEP="${WEEKLY_KEEP:-4}"    # last N weekly (Sunday) snapshots
LOG_FILE="${LOG_FILE:-/var/log/reiz-backup.log}"

log() {
    printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG_FILE"
}

mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
DOW="$(date -u +%u)"   # 1..7 (Mon..Sun)
LABEL="daily"
[[ "$DOW" == "7" ]] && LABEL="weekly"

OUT="$BACKUP_DIR/reiz-${LABEL}-${TS}.sql.gz"
TMP="${OUT}.partial"

log "Starting $LABEL backup → $OUT"

# pg_dump runs inside the container so we don't need pg_dump on the host.
# Streaming through the container's stdout into gzip on the host keeps
# the work in pipes (no intermediate uncompressed file). The temp file
# pattern means if anything fails mid-stream, the final .sql.gz never
# appears (so cleanup logic doesn't accidentally delete a good backup
# in favour of a half-written one).
docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" "$PG_DB" \
    | gzip -9 > "$TMP"

# Sanity gate: the gzip stream is well-formed and contains at least one
# CREATE TABLE statement (catches "container OK but DB empty" incidents).
if ! gunzip -t "$TMP" 2>/dev/null; then
    log "FATAL: gzip integrity check failed"
    rm -f "$TMP"
    exit 1
fi
TABLE_COUNT="$(gunzip -c "$TMP" | grep -c '^CREATE TABLE' || true)"
if [[ "$TABLE_COUNT" -lt 10 ]]; then
    log "FATAL: dump contains only $TABLE_COUNT CREATE TABLE statements (expected >= 10)"
    rm -f "$TMP"
    exit 1
fi

mv "$TMP" "$OUT"
SIZE="$(du -h "$OUT" | cut -f1)"
log "Backup OK: $OUT ($SIZE, $TABLE_COUNT tables)"

# ─── Retention sweep ───────────────────────────────────────────────────
# Keep the N newest of each label, delete the rest. -t sorts by mtime,
# desc. ls is fine here since we control filenames (no spaces / quotes).
prune() {
    local pattern="$1"
    local keep="$2"
    local files=()
    while IFS= read -r f; do files+=("$f"); done < <(ls -1t "$BACKUP_DIR"/$pattern 2>/dev/null || true)
    local total="${#files[@]}"
    if (( total > keep )); then
        for ((i = keep; i < total; i++)); do
            log "Pruning old $pattern: ${files[$i]}"
            rm -f "${files[$i]}"
        done
    fi
}
prune "reiz-daily-*.sql.gz"  "$DAILY_KEEP"
prune "reiz-weekly-*.sql.gz" "$WEEKLY_KEEP"

log "Done. Local snapshots:"
ls -lh "$BACKUP_DIR" | tee -a "$LOG_FILE"
