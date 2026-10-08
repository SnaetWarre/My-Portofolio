#!/usr/bin/env bash
# Build the site and serve dist/ with `astro preview` on its own port.
# usage: serve.sh start [port] | stop | status
# Writes the pid to $STATE/preview.pid and the log to $STATE/preview.log.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
STATE="${VERIFY_STATE:-/tmp/verify-portfolio}"
mkdir -p "$STATE"
pidfile="$STATE/preview.pid"
portfile="$STATE/preview.port"

case "${1:-}" in
  start)
    port="${2:-4399}"
    if [[ -f "$pidfile" ]] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
      echo "already running: pid $(cat "$pidfile") on port $(cat "$portfile")"; exit 0
    fi
    if ss -ltn "sport = :$port" | grep -q LISTEN; then
      echo "port $port is taken by something we did not start; pass another port" >&2; exit 1
    fi
    (cd "$root" && npm run build >"$STATE/build.log" 2>&1) || { echo "build failed, see $STATE/build.log" >&2; tail -20 "$STATE/build.log" >&2; exit 1; }
    cd "$root"
    setsid npx astro preview --port "$port" --host 127.0.0.1 >"$STATE/preview.log" 2>&1 &
    echo $! >"$pidfile"; echo "$port" >"$portfile"
    for _ in $(seq 1 60); do
      if curl -sf "http://127.0.0.1:$port/My-Portofolio/" >/dev/null; then
        echo "ready: http://127.0.0.1:$port/My-Portofolio/ (pid $(cat "$pidfile"))"; exit 0
      fi
      sleep 0.5
    done
    echo "preview did not answer, see $STATE/preview.log" >&2; exit 1
    ;;
  stop)
    if [[ -f "$pidfile" ]]; then
      pid="$(cat "$pidfile")"
      # setsid made the preview its own process group; kill only that group.
      kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
      rm -f "$pidfile" "$portfile"; echo "stopped pid $pid"
    else
      echo "nothing to stop"
    fi
    ;;
  status)
    if [[ -f "$pidfile" ]] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
      port="$(cat "$portfile")"
      code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/My-Portofolio/")"
      built="$(stat -c %y "$root/dist/index.html" 2>/dev/null | cut -d. -f1)"
      echo "pid $(cat "$pidfile"), port $port, home returns $code, dist built $built, HEAD $(git -C "$root" rev-parse --short HEAD)"
    else
      echo "not running"; exit 1
    fi
    ;;
  *) echo "usage: serve.sh start [port] | stop | status" >&2; exit 2 ;;
esac
