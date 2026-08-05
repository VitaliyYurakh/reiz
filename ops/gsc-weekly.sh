#!/usr/bin/env bash
# Reiz GSC weekly monitor — pulls a fresh 28-day Search Console snapshot
# and writes a week-over-week position diff report.
#
# Designed to run from cron on the prod VM. Idempotent output (dated
# folders), exits non-zero on any step failure so cron's MAILTO surfaces
# it. Uses `set -euo pipefail` for the same reason as backup.sh.
#
# This is the FETCH + DIFF half only — no LLM in the loop. The "why did
# this move and what should we fix" analysis is done on demand: ask
# Claude Code to run the seo-auditor agent against the freshest
# _audit/gsc/<date>/diff-report.md. Kept manual on purpose — see
# ops/README.md GSC section for why.
#
# Sends a done/failed ping to Telegram using the same bot the site
# already notifies bookings/leads through (TELEGRAM_BOT_TOKEN /
# TELEGRAM_CHAT_ID, read from $ENV_FILE — no separate bot to manage).
# This is a status ping, not the analysis itself — it says "report's
# ready" or "run failed", never "here's why the position moved".
#
# One-time setup: `cd /opt/reiz/ops/gsc-monitor && npm install`
# (installs the one dependency, googleapis — never touches front/'s
# node_modules, which only ever exist inside the Docker build).

set -euo pipefail

REIZ_ROOT="${REIZ_ROOT:-/opt/reiz}"
ENV_FILE="${ENV_FILE:-$REIZ_ROOT/.env}"
LOG_FILE="${LOG_FILE:-/var/log/reiz-gsc.log}"
SNAPSHOT_KEEP="${SNAPSHOT_KEEP:-12}"  # ~3 months of weekly snapshots

log() {
    printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG_FILE"
}

get_env_var() {
    local key="$1"
    [[ -f "$ENV_FILE" ]] || return 0
    grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d= -f2-
}

# Best-effort — a Telegram outage should never fail the cron run itself.
notify_telegram() {
    local text="$1"
    local token chat_id
    token="$(get_env_var TELEGRAM_BOT_TOKEN)"
    chat_id="$(get_env_var TELEGRAM_CHAT_ID)"
    if [[ -z "$token" || -z "$chat_id" ]]; then
        log "Telegram not configured (missing TELEGRAM_BOT_TOKEN/CHAT_ID in $ENV_FILE) — skipping notification"
        return 0
    fi
    curl -fsS -m 10 "https://api.telegram.org/bot${token}/sendMessage" \
        -d "chat_id=${chat_id}" \
        -d "parse_mode=HTML" \
        --data-urlencode "text=${text}" \
        > /dev/null || log "Telegram notification failed to send"
}

on_error() {
    local line="$1"
    log "FAILED at line $line"
    notify_telegram "$(printf '❌ <b>GSC-моніторинг: помилка</b>\nЗбій на рядку %s.\nЛог: <code>tail -50 %s</code>' "$line" "$LOG_FILE")"
}
trap 'on_error $LINENO' ERR

mkdir -p "$(dirname "$LOG_FILE")"

cd "$REIZ_ROOT/ops/gsc-monitor"

log "Fetching GSC snapshot..."
FETCH_OUT="$(node fetch.mjs 2>&1 | tee -a "$LOG_FILE")"
FETCH_SUMMARY="$(grep '^Wrote' <<< "$FETCH_OUT" || true)"

log "Running week-over-week diff..."
node diff.mjs > /dev/null 2>> "$LOG_FILE"

log "Diff report written. Pruning old snapshots (keeping last $SNAPSHOT_KEEP)..."

# Keep the N newest dated snapshot folders, delete the rest.
GSC_DIR="$REIZ_ROOT/_audit/gsc"
SNAPSHOTS=()
while IFS= read -r d; do SNAPSHOTS+=("$d"); done < <(find "$GSC_DIR" -maxdepth 1 -mindepth 1 -type d -name '20*-*-*' | sort)
TOTAL="${#SNAPSHOTS[@]}"
if (( TOTAL > SNAPSHOT_KEEP )); then
    PRUNE_COUNT=$(( TOTAL - SNAPSHOT_KEEP ))
    for ((i = 0; i < PRUNE_COUNT; i++)); do
        log "Pruning old snapshot: ${SNAPSHOTS[$i]}"
        rm -rf "${SNAPSHOTS[$i]}"
    done
fi

LATEST_DATE="$(basename "${SNAPSHOTS[$((TOTAL - 1))]}")"
notify_telegram "$(printf '✅ <b>GSC-моніторинг: звіт готовий</b>\n%s\nDiff: %s/%s/diff-report.md\n\nЦе лише дані — попроси Claude Code розібрати чому і що правити.' "$FETCH_SUMMARY" "$GSC_DIR" "$LATEST_DATE")"

log "Done."
