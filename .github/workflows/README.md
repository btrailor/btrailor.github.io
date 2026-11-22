# GitHub Actions workflows

## `hugo.yml` — build and deploy (the only active workflow)

Builds the Hugo site from `hugo-site/` and deploys it to GitHub Pages.

The build deliberately does **not** pass `--baseURL`. GitHub's
`configure-pages` `base_url` output for this repo resolves to
`http://digitalartifacts.studio/` (the Pages site has no HTTPS enforcement),
which leaked `http://` URLs into every RSS entry, sitemap `<loc>` and
canonical tag. Letting `hugo-site/hugo.toml` supply the baseURL keeps every
emitted URL on `https://`.

## Ghost → Hugo sync: NOT a GitHub Actions workflow

The Ghost CMS is self-hosted on the UGREEN NAS at `192.168.1.199:2368`, a
**private LAN address that GitHub-hosted runners cannot reach**. The old
`ghost-sync.yml` could therefore never have worked from GitHub-hosted CI —
all 10 of its historical runs failed. It has been removed.

The sync now runs on the Mac Studio, which is on the same LAN:

| Piece | Location |
|---|---|
| Sync script | `scripts/ghost-to-hugo.js` |
| Runner | `~/.openclaw/workspace/main/projects/pose-sync/sync-and-publish.sh` |
| Schedule | `~/Library/LaunchAgents/local.ghost-sync.plist` (hourly, minute 7) |
| Log | `~/.openclaw/workspace/main/projects/pose-sync/logs/sync.log` |

The runner syncs Ghost → `hugo-site/content/scrolls/`, commits, and pushes to
`main`, which triggers `hugo.yml` to build and deploy. GitHub Actions owns the
build and deploy; the Mac owns the capture.

Do not re-add a GitHub-hosted Ghost sync workflow — it cannot reach the NAS.
