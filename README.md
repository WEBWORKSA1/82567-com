# 82567.com — Prime Calculators for Money, Business, AI & Everyday Numbers

Static, dependency-free website (HTML + CSS + vanilla JS) built for GitHub Pages (free plan, `main` branch, root folder).

**Concept:** 82,567 is a prime number — indivisible. The site is a hub of fast, private, client-side calculators (28 tools across Money, Business, AI and Everyday) plus a Number Explorer for any integer, original guides, curated videos, a high-converting expert-help lead funnel, and a support hub (donations, sponsorship, advertising, careers, contests).

## Monetization
- Google AdSense Auto ads (`ca-pub-6620975821265271`) in every page `<head>`; `ads.txt` at the root.
- Lead generation: `get-quote.html` (3-step funnel) + "Need expert help?" CTA on every calculator.
- Donations / sponsorship / advertising / partnership / careers / contests: `support.html`.
- Domain/sponsorship banner on top of every page.

## Forms
All forms post via FormSubmit (AJAX). The destination address is assembled at runtime in `js/app.js` and never appears in page text.
**One-time step:** the first submission triggers an activation email from FormSubmit to the inbox — click *Activate* once.

## Deploy (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
Custom domain: add `82567.com` in Settings → Pages (this creates `CNAME`), then point DNS:
`A @ 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153` and `CNAME www WEBWORKSA1.github.io`.
AdSense requires `ads.txt` at the root of the custom domain, so connect 82567.com before applying.

## Auto-refresh
`.github/workflows/refresh.yml` runs daily (03:17 UTC), on every push to `main`, and on demand: it refreshes `data/daily.json` (Number of the Day) and `sitemap.xml` `<lastmod>`, commits, then mirrors `main` to `gh-pages` (the branch Pages currently serves).

See `PROMPTS.md` for the phase-wise build prompts and `RESEARCH.md` for the niche research.
