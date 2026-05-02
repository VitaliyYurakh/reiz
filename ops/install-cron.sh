#!/usr/bin/env bash
# Idempotently install the daily Reiz backup cron job. Safe to re-run —
# uses a marker comment to detect an existing installation. Re-running
# after a frequency change replaces the old entry with the new one
# in-place rather than duplicating.
#
# What this installs (in root's crontab):
#   * Daily backup at 02:13 UTC. Off-peak for Lviv traffic + an
#     intentionally weird minute so we don't pile onto every other
#     server's "0 3 * * *" cron rush.
#   * Output captured to /var/log/reiz-backup.log (the script itself
#     also tee's there for a unified record).

set -euo pipefail

MARKER="# reiz-backup-cron-managed"
CRON_LINE="13 2 * * * /opt/reiz/ops/backup.sh >> /var/log/reiz-backup.log 2>&1 ${MARKER}"

# Pull current crontab (may not exist yet — || true to handle that).
EXISTING="$(crontab -l 2>/dev/null || true)"

# Strip any prior reiz-backup line so re-running after a frequency
# change replaces the entry instead of leaving the old one alongside.
FILTERED="$(grep -v -F "$MARKER" <<< "$EXISTING" || true)"

# Write the merged crontab — preserve unrelated jobs, add the current
# managed line.
{
    [[ -n "$FILTERED" ]] && printf '%s\n' "$FILTERED"
    printf '%s\n' "$CRON_LINE"
} | crontab -

echo "Installed Reiz backup cron job. Will run daily at 02:13 UTC."
echo ""
echo "Verify with:"
echo "    crontab -l | grep reiz-backup"
echo ""
echo "Next manual test:"
echo "    sudo /opt/reiz/ops/backup.sh"
echo "    ls -lh /var/backups/reiz/"
