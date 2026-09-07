# Gulf Coast Charters Network

Premier multi-operator charter marketplace for the Alabama Gulf Coast
(Gulf Shores 36542 · Orange Beach 36561 · Fort Morgan · Perdido).

Quiet luxury. Once-in-a-lifetime guest care. Category-defining — not a discount aggregator, and not a single-operator charter site.

## Commands

Use the package manager to install dependencies, start the Vite development server,
create the production bundle, and preview the dist output (see package.json).

## Stack
- Vite multi-page app, vanilla HTML/CSS/JS
- Shared layout: src/js/layout.js
- Store: src/js/store.js (localStorage keys gccn_*, seed version gccn_seed_v2)
- Seed: src/data/seed.json — operators, boats, trips, marinas, bookings, reviews

## Pages
index, trips, trip, book, captains, captain, captain-portal, fleet, admin, itinerary,
about, faq, what-to-bring, safety, contact, reviews, operators

## Docs
- MARKET_GULF_COAST_CHARTERS.md — research brief
- LAUNCH_PACKAGE.md — go-live (domain, Stripe/Vercel, deposits enabled:false, no Cloudflare)

## Stripe
Optional deposit checkout via api/create-checkout-session.js.
Disabled by default in src/js/stripe-config.js. No Cloudflare.

## How this differs from Gulf Coast Spearfishing
Spearfishing is a single-operator spear charter brand (species, certs, dive-forward identity).
GCCN is a network marketplace: many captains/boats/trip types; operators run manifests;
admin runs platform revenue; guests filter a curated catalog across fishing, dolphin,
sunset, watersports, and private yacht — with light sister-brand reference on spear products only.
