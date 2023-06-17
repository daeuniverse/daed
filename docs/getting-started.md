# Quick Start Guide

> **Note**: `daed` (UI component) is bundled with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server) and [dae](https://github.com/daeuniverse/dae) (core).

## How to run

### Download pre-compiled binaries

Releases are available in <https://github.com/daeuniverse/daed/releases>

> **Note**: If you would like to get a taste of new features, there are nightly (latest) builds available. Most of the time, newly proposed changes will be included in `PRs` and will be exported as cross-platform executable binaries in builds (GitHub Action Workflow Build). Noted that newly introduced features are sometimes buggy, do it at your own risk. However, we still highly encourage you to check out our latest builds as it may help us further analyze features stability and resolve potential bugs accordingly.

Nightly builds are available in <https://github.com/daeuniverse/daed/actions/workflows/build-nightly.yml>

### Spin up server locally

```bash
sudo chmod +x ./daed
sudo install -Dm755 daed /usr/bin/
sudo daed run

# helper
sudo daed [-h,--help]
```

If everything goes well, open your browser and navigate to `http://localhost:2023`

Happy Hacking!
