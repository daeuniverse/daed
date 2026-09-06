# Linux / OpenWrt installation notes

The opkg/DEB/RPM packages built from this repo install the daemon
(`/usr/bin/daed`) and a systemd unit (`daed.service`) by default. This
document describes the *companion* files that make daed production-ready
on init systems other than systemd — specifically the **OpenWrt procd**
init system used by iStoreOS / ImmortalWrt / official OpenWrt.

## Files in this directory

| File | Install to | Purpose |
|------|-----------|---------|
| `install/linux/daed-guard` | `/usr/bin/daed-guard` (0755) | Thin shell wrapper that runs `cleanup.sh` before exec'ing the daemon, and again on `EXIT/INT/TERM/HUP/QUIT`. |
| `install/linux/cleanup.sh` | `/usr/share/daed/cleanup.sh` (0755) | Idempotent reaper for the `daens` netns, the `dae0` veth pair, and pinned eBPF programs under `/sys/fs/bpf/daed`. |
| `install/openwrt/daed` | `/etc/init.d/daed` (0755) | procd init script with `logger` calls, bumped `respawn 3600 10 5` budget, `oom_adj=-16`, and post-stop dataplane state reporting. |
| `install/daed.service` | `/lib/systemd/system/daed.service` (systemd only) | systemd unit with `MemoryHigh=512M`, `OOMScoreAdjust=-100`, `Type=simple`, `Restart=on-failure`. Aligned with `dae.service` upstream. |

## Why these files exist

Upstream `dae` is a stateless eBPF dataplane. Its three pieces of kernel
state (the `daens` netns, the `dae0` veth pair, and the pinned eBPF
programs under `/sys/fs/bpf/daed`) have *different* lifetimes from the
`daed` userspace process:

- `daens` netns: created at first boot, reaped by `daed-guard` on the
  next start. Reaped correctly on graceful shutdown.
- `dae0` veth pair: same as the netns.
- `/sys/fs/bpf/daed`: reaped on a successful non-reload `Close()`. *Not*
  reaped on process-exit, OOM-kill, or kernel panic.

When daed exits unexpectedly (OOM-kill, kernel panic, SIGHUP from the
package manager), the eBPF dataplane is left attached to `br-lan`
ingress. New connections on UDP/53 (DNS) and TCP/7844 (Cloudflare
tunnel) are then redirected into a dead userspace listener. ICMP keeps
working, so an operator has no way to tell from `ping` that the network
is partially black-holed. The fix is for the wrapper to do the
`bpftool prog detach` + `rm -rf` on every exit, not just on the next
startup.

`daed-guard` + `cleanup.sh` add exactly that: a `trap EXIT INT TERM
HUP QUIT` that runs the same reaper the startup path runs.

## OpenWrt / iStoreOS install

1. Copy the files into place:
   ```sh
   install -m 0755 install/linux/daed-guard   /usr/bin/daed-guard
   install -m 0755 install/linux/cleanup.sh   /usr/share/daed/cleanup.sh
   install -m 0755 install/openwrt/daed       /etc/init.d/daed
   /etc/init.d/daed enable
   ```
2. Make sure `bpftool` is available so the eBPF reaper can do its work
   on unexpected exit. On OpenWrt:
   ```sh
   opkg update
   opkg install bpftool-full
   ```
3. Reload procd:
   ```sh
   /etc/init.d/daed restart
   ```
4. Verify the dataplane is intact after the restart:
   ```sh
   logread | grep -i daed-init
   ls /sys/fs/bpf/daed | head
   ```

## Why we are not shipping a DEB/RPM-style hook for these

The opkg package produced by `kenzok8/openwrt-daede` (the actual
distribution on the iStoreOS / OpenWrt side) carries its own
`/etc/init.d/daed` and its own daed-guard. We are providing the
*upstream reference* here so that (a) the kenzok8 package can pull the
same source of truth, (b) other distributions (Alpine, Nix, custom
Docker images) have a copy-paste path to the same shape, and (c) when
the next version of daed is cut, the wrapper changes are visible in
the upstream diff and not hidden inside an opkg recipe.
