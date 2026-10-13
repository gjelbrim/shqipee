# Security Policy

## Supported versions

Only the current version is supported: the site live at [shqip.ee](https://shqip.ee), built from the `main` branch. There are no separate releases to patch.

## How the site handles data

shqip.ee is a static web app without a backend, accounts or cookies. Everything you type is processed in your browser and stored only there (`localStorage`: the last input, the direction, the history and the theme). Text leaves the browser only when you share a link yourself (`?text=…` in the URL). Vercel Web Analytics and Speed Insights collect anonymous page-view and performance data.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report them privately through GitHub: go to the repository's **Security** tab → **Report a vulnerability** ([direct link](https://github.com/gjelbrim/shqipee/security/advisories/new)).

Please include:

- what the problem is and what an attacker could do with it
- steps or a URL to reproduce it (for example a crafted share link)
- browser and device, if relevant

This is a small project maintained in spare time. We aim to confirm your report within **7 days** and to tell you what we plan to do; a fix follows as soon as possible, depending on severity.

## Scope

In scope, for example:

- cross-site scripting or HTML injection, e.g. through share links (`?text=`, `&from=`) or stored history
- ways around the Content-Security-Policy or the other security headers in `vercel.json`
- service worker issues, e.g. serving stale or manipulated content
- vulnerable dependencies that end up in the built site

Out of scope:

- the Vercel platform itself (report those to [Vercel](https://vercel.com/security))
- findings from automated scanners without a demonstrated impact
- denial of service, spam or social engineering
- issues that need a compromised device or browser extension
- text a user chose to put into a share link themselves

## Disclosure

Please give us time to fix the problem before you publish it. Once it is fixed, we publish a GitHub security advisory and are happy to credit you, if you like.
