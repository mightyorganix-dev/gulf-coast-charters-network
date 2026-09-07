# Launch Package — Gulf Coast Charters Network

## Brand
Gulf Coast Charters Network — Alabama Gulf Coast. Quiet luxury multi-operator charter marketplace. Hub: Gulf Shores 36542 / Orange Beach 36561. Sister brand: Gulf Coast Spearfishing (spear products only).

## Go-live checklist
1. Domain + deploy dist/ to Vercel (Stripe API ready).
2. Operator agreements, USCG credential verification, insurance certificates, ADCNR/federal compliance literacy.
3. Replace demo seed with live operator calendar feeds; keep quiet-luxury chrome.
4. Stripe deposits: api/create-checkout-session.js; set stripe-config.js enabled:false until STRIPE_SECRET_KEY is in Vercel env. No Cloudflare.
5. SMS provider for Green/Yellow/Red guest templates (portal already simulates copy).
6. Auth for captain-portal + admin before production PII.
7. Brand photography — boats & water, not fish-species identity.

## First-screen standard
Hero must feel inevitable: curated captains, corridor ZIPs, live-feeling fleet stats, trust strip (premier / weather / itinerary / stewardship / sister-brand bar) — not a coupon marketplace.

## Demo vs production
Demo = Vite MPA + localStorage (gccn_*). Production needs auth, payments, SMS, and live availability.
