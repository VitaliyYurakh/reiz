# Reiz operations runbook

Scripts for backup, restore, and emergency operations on the prod VM.
Lives in `/opt/reiz/ops/` after a deploy.

## Daily backup

`backup.sh` runs nightly via cron (02:13 UTC) and writes a
gzip-compressed `pg_dump` snapshot to `/var/backups/reiz/`.

Retention by default: 7 daily + 4 weekly snapshots. Older files are
pruned at the end of each run.

```bash
# Manual run (also fine — cron just calls this same script)
sudo /opt/reiz/ops/backup.sh

# Inspect what's there
ls -lh /var/backups/reiz/

# Last cron run logs
tail -50 /var/log/reiz-backup.log
```

### Sanity gates

The script aborts and removes the partial file if either:
- `gunzip -t` fails (corrupt gzip stream)
- The dump contains fewer than 10 `CREATE TABLE` statements (caught
  the "container OK but DB empty" failure mode that bit us in
  another life)

This means a green exit code from cron actually means "the file is
valid and contains schema content" — not just "pg_dump didn't crash".

### Off-site copy (TODO)

`backup.sh` is the **local-tier** backup only. If the VM dies, the
backups die with it. Add a separate `ops/upload-backup.sh` step that
ships the latest snapshot to off-site storage (S3 / Backblaze B2 /
rclone target), and chain it from cron after `backup.sh`. Splitting
the two means a flaky off-site provider doesn't cost us the local
snapshot.

Suggested chain (untested, depends on which provider gets picked):
```bash
13 2 * * * /opt/reiz/ops/backup.sh && /opt/reiz/ops/upload-backup.sh
```

## Restore from a snapshot

`restore.sh` drops the `reiz` database and recreates it from a
`.sql.gz` dump. **This is destructive — only use during an actual
incident.**

```bash
sudo /opt/reiz/ops/restore.sh /var/backups/reiz/reiz-daily-20260502T030000Z.sql.gz
```

The script will:
1. Validate the dump (gzip integrity + table count)
2. Print a checklist of pre-flight steps and require typing `yes` to
   proceed (skip with `FORCE_YES=1` if you really mean it)
3. `DROP DATABASE reiz` + `CREATE DATABASE reiz` + restore the dump
4. Print row counts for the main tables (cars / photos / users /
   rentals / reservations) so you can sanity-check immediately

Pre-flight steps (do these manually, the script reminds you):
1. Take a fresh backup of the **current** broken state — restore is
   one-way: `sudo /opt/reiz/ops/backup.sh`
2. Stop the api container so no writes happen during restore:
   `cd /opt/reiz && docker compose stop api`

Post-restore:
1. Start the api container: `cd /opt/reiz && docker compose start api`
2. Watch the startup logs: `docker logs -f reiz-api-1`
3. Hit health: `curl http://127.0.0.1:8080/api/health -H 'Host: reiz.com.ua'`
4. Smoke a known route: `curl -sL -o /dev/null -w '%{http_code}\n' https://reiz.com.ua/`

## Cron installation

`install-cron.sh` registers the daily backup job. Idempotent — uses a
marker comment in the crontab to detect an existing installation, so
re-running it after a deploy doesn't add duplicates.

```bash
sudo /opt/reiz/ops/install-cron.sh
crontab -l | grep reiz-backup    # verify
```

## Disaster-recovery drill

Untested backups are just hopes. At least once a quarter:

1. Take a fresh backup: `sudo /opt/reiz/ops/backup.sh`
2. On a clean VM (or a temporary Postgres container), restore that
   backup using the same procedure as `restore.sh`. **Don't restore
   over prod — point a temp Postgres container at `/tmp/restore-test/`
   instead.**
3. Spin up the api against the restored DB: `DATABASE_URL=...
   node build/app/index.js`
4. Hit `/api/health` + `/api/car` + a couple of admin endpoints with
   a real session cookie.
5. If anything breaks, fix the backup script before the real incident.

## Quick reference

| Task | Command |
|---|---|
| Manual backup now | `sudo /opt/reiz/ops/backup.sh` |
| List local backups | `ls -lh /var/backups/reiz/` |
| Restore from a snapshot | `sudo /opt/reiz/ops/restore.sh <file>` |
| Install/refresh cron | `sudo /opt/reiz/ops/install-cron.sh` |
| Last cron run logs | `tail -50 /var/log/reiz-backup.log` |
| Verify cron registered | `crontab -l \| grep reiz-backup` |
