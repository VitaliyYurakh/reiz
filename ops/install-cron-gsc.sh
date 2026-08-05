#!/usr/bin/env bash
# Idempotently install the weekly GSC monitor cron job. Safe to re-run —
# uses a marker comment to detect an existing installation. Re-running
# after a frequency change replaces the old entry with the new one
# in-place rather than duplicating.
#
# What this installs (in root's crontab):
#   * Weekly snapshot + diff, Monday 05:07 UTC. Off-peak, and offset from
#     the 02:13 backup job so the two don't contend for the same minute.
#   * Output captured to /var/log/reiz-gsc.log.
#
# Prereq (one-time, not handled by this script):
#   cd /opt/reiz/ops/gsc-monitor && npm install

set -euo pipefail

MARKER="# reiz-gsc-cron-managed"
CRON_LINE="7 5 * * 1 /opt/reiz/ops/gsc-weekly.sh >> /var/log/reiz-gsc.log 2>&1 ${MARKER}"

EXISTING="$(crontab -l 2>/dev/null || true)"
FILTERED="$(grep -v -F "$MARKER" <<< "$EXISTING" || true)"

{
    [[ -n "$FILTERED" ]] && printf '%s\n' "$FILTERED"
    printf '%s\n' "$CRON_LINE"
} | crontab -

echo "Installed Reiz GSC monitor cron job. Will run weekly, Monday 05:07 UTC."
echo ""
echo "Verify with:"
echo "    crontab -l | grep reiz-gsc"
echo ""
echo "Next manual test:"
echo "    sudo /opt/reiz/ops/gsc-weekly.sh"
echo "    cat /var/log/reiz-gsc.log"
