# 82567.com — Phase-wise build prompts

Run these in order to rebuild or extend the site. Each phase is self-contained.

## Phase 1 — Foundation & brand
> Create a static website for **82567.com**, hosted free on GitHub Pages from the `main` branch root. No frameworks or build step: HTML5, one CSS file (`css/style.css`), vanilla JS. Brand: "82567 — Prime Calculators" (82,567 is prime; tagline "Indivisible math for money, business & AI decisions"). Design: violet `#7c5cff` → teal `#19c3a6` gradient, rounded cards, system fonts, light + dark mode (respect `prefers-color-scheme`, toggle saved in localStorage), responsive with mobile burger menu, sticky blurred header, accessible focus states, reduced-motion support. Add `favicon.svg`, `site.webmanifest`, `.nojekyll`, `robots.txt`, `sitemap.xml`, and `ads.txt` = `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.

## Phase 2 — Shared layout & compliance
> Write `js/app.js` that injects on every page: (1) a top bar "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" whose external contact URL is assembled at runtime (not present in HTML); (2) header nav (Home, Calculators, Number Explorer, Guides, Videos, Get Expert Help, Support & Contests), currency selector and theme toggle; (3) footer with newsletter form and links to About, Contact, Privacy, Terms, Disclaimer & Trademark, Cookie settings, Sitemap; (4) cookie-consent banner (Accept / Essential only → `requestNonPersonalizedAds = 1`); (5) back-to-top. Every `<head>` includes the AdSense script for `ca-pub-6620975821265271` and `<meta name="google-adsense-account">`.

## Phase 3 — Calculator engine
> Build `js/calcs.js`: a registry `{id, cat, name, icon, desc, fields, run(values) → {out, chart?}}` rendered as cards with live results, canvas bar charts for time series, "Copy link" deep links (`calculators.html#id`) and a "Need expert help?" CTA to `get-quote.html?topic=`. Money: loan/EMI, mortgage, compound interest, savings goal, FIRE, credit-card payoff, inflation, salary↔hourly, ROI/CAGR, tip splitter. Business: break-even, margin & markup, price from target margin, LTV:CAC, runway, SaaS MRR, sales tax/VAT/GST, discount, ad-revenue estimator. AI: LLM API cost (user-entered prices), AI automation ROI, token estimator, GPU cost. Everyday: percentage, date difference, BMI, trip fuel/EV, length converter. Search + category chips on `calculators.html`; number explorer on `numbers.html` (prime test, factors, divisors, classification, prev/next prime, digit sum, bases, Roman, words) with `?n=` URLs.

## Phase 4 — Content for AdSense approval
> Original content only: home (instant calculator search, stats, Number of the Day, 4 live calculators, categories, lead CTA, videos, guides, FAQ); `guides.html` with 7 worked-example explainers linking to tools; `videos.html` with lite YouTube embeds of verified lessons, each paired with a calculator; About, Contact, Privacy (Google ad-cookie disclosure + opt-out links), Terms, Disclaimer with trademark/copyright notice ("82567" used only as a domain and mathematical reference, no affiliation with third-party products sharing the digits); 404. No placeholder text.

## Phase 5 — Lead generation
> `get-quote.html`: 3-step form with progress bar — need → amount/timeline/country/details (pre-filled from `?topic=`) → name/email/phone/consent. Trust badges, how-it-works, FAQ. AJAX submit to FormSubmit; destination address assembled in JS at runtime, never in the page; `_honey` honeypot.

## Phase 6 — Donations, sponsorship, careers, contests
> `support.html`: donation tiers ($5/$25/$100/$567) + pledge form (amount chips, frequency, purpose incl. operations, promotion & marketing, hiring, prizes; payment method) that triggers an emailed secure payment link; sponsorship/advertising/partnership options + media-kit form (incl. acquiring the domain); monthly "Prime Challenge" contest with puzzle, prizes, entry form and official rules; careers with roles + application form; allocation of funds.

## Phase 7 — Automation & deploy
> Daily GitHub Action (`ops/refresh.yml` → `.github/workflows/`) regenerates `data/daily.json` and sitemap `<lastmod>`. Enable Pages (main / root), connect 82567.com (A records to GitHub Pages IPs, `www` CNAME), enforce HTTPS, submit sitemap in Search Console, apply to AdSense.

## Phase 8 — Growth
> Split each calculator into its own landing page (`/calc/<id>.html`) with 600+ words, FAQ schema and related tools. Add 2 calculators/week targeting high-CPC queries (refinance break-even, debt avalanche vs snowball, HELOC, lease vs buy, payroll cost, freelance rate, SaaS pricing, AI agent cost). Offer embeddable widgets to partners; add manual in-content AdSense units after approval.
