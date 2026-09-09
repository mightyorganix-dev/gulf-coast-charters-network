# GCCN Lean Startup Checklist (~$1.5k path)

**Brand:** Gulf Coast Charters Network · **Domain:** gulfcoastprivatecharters.com  
**Model:** Asset-light marketplace · ~12% take · high-AOV private / yacht / spear / celebrations  
**Print and check off in order.** All $ amounts are ASSUMPTION / estimates except domain ~$10.46.

> Absolute DIY floor. Responsible Accounting seed is ~$8–12k. Do not skip COI / USCG before live guest money.

---

## Cash map (~$1,500)

| Slice | Budget |
| --- | --- |
| Domain + LLC + phone + print/QR | ~$250–350 |
| Dock gas / misc | ~$100–150 |
| Weather / refund buffer (do not spend on OpEx) | ~$500–700 |
| Contingency | ~$300–400 |

---

## Week 0 — Cash out (~$300–400)

- [ ] Buy domain `gulfcoastprivatecharters.com` (~$11, Cloudflare Registrar)
- [ ] Cloudflare Email Routing → personal inbox (`book@` / `hello@` / `captains@`)
- [ ] File Alabama LLC (DIY) — confirm current SOS filing fee (~$200 buffer)
- [ ] Get free IRS EIN
- [ ] Open **business bank account** (LLC + EIN) — needed before live Stripe payouts
- [ ] Cheap business phone (Google Voice or lowest OpenPhone) (~$15)

## Week 1 — Stack (≈$0)

- [ ] Create Stripe account (start in **Test** mode)
- [ ] Attach business bank account + EIN in Stripe (before going Live)
- [ ] Vercel: import `mightyorganix-dev/gulf-coast-charters-network`
- [ ] Connect custom domain · HTTPS green
- [ ] Add `STRIPE_SECRET_KEY` **only** in Vercel env (never GitHub / chat)
- [ ] Keep `enabled: false` until a Test deposit works, then Live + small refundable test
- [ ] Set up GA4 + Google Search Console + claim Google Business Profile

## Week 1–2 — Supply (gas ~$100)

- [ ] Dock visits — Captains Portfolio top 5 (one signature private trip each)
- [ ] Collect **COI + USCG** proof before any captain goes live (non-negotiable)
- [ ] Signed simple operator / IC agreement on file (template OK; counsel later)
- [ ] Replace demo seed with 3–5 real Items (calendar, real price, real photos OK)
- [ ] Hide party / jet ski / cheap seats from homepage (high-AOV only)

## Week 2 — Prove money

- [ ] Soft-launch: 3–5 trusted guests complete **real small** Stripe deposits
- [ ] Refund / complete at least one test cleanly
- [ ] Confirm flow: deposit → itinerary → weather Green/Yellow/Red (manual text OK)
- [ ] Do **not** spend guest deposit float on OpEx or personal bills

## Hold until first real revenue / soft-launch works

- [ ] Paid ads
- [ ] Pro photography budget
- [ ] Full counsel polish (get quote; buy before public ads scale)
- [ ] E&O / cyber policy (get quote now; required before public scale)
- [ ] OTAs / FareHarbor as primary
- [ ] Hiring CX / contractors

## Stop rules

- [ ] No COI / USCG → no public Book Now
- [ ] Test deposit fails → do not flip Live keys
- [ ] No business bank in Stripe → stay in Test; do not take real guest money
- [ ] Weather buffer empty in peak season → pause new bookings until topped up

## Business bank — why / when

| When | Need bank? |
| --- | --- |
| Building site / GitHub Pages preview | No |
| Stripe Test mode | No |
| Live guest deposits + Stripe payouts | **Yes** |
| Separating deposits / captain payouts from personal cash | **Yes** |

**Order:** LLC + EIN → business checking → attach in Stripe → then Live deposits.

---

Gulf Coast Charters Network · Lean checklist · Revoke GitHub PATs after every push · Stripe secrets only in Vercel
