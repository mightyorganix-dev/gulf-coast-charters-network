# Digital Operator Packet — Wet-Ink / E-Sign / Counsel Gates

**STATUS:** DRAFT ops guidance for GCCN site onboarding HTML + fillable/e-sign — **not legal advice.**  
GCCN Legal is not a licensed attorney. E-sign enforceability, ESIGN/UETA, maritime, and consumer rules are **counsel-gated** before any live captain signs digitally.

**Source of truth:** numbered markdown `01`–`03` (and `04` field guide). Print PDF remains `GCCN_Dock_Operator_Packet_PRINT.pdf`.  
**Audience:** Chief of Staff / eng building digital onboarding; Mighty Organix owner; counsel.

---

## Bottom line

| Artifact | Digital fillable OK (staging)? | Live e-sign OK? | Notes |
|----------|--------------------------------|-----------------|-------|
| `01` Operator / IC Participation Agreement | Yes, with huge DRAFT banner | **Only after counsel green-lights** e-sign + final text | Do not collect “binding” signatures on placeholder liability language |
| `02` Trip Listing Addendum | Yes | Same — counsel-gated | Price/deposit/cancel must match published guest terms |
| `03` Compliance Checklist acknowledgment | Yes | Counsel + broker-gated for “clear to list” effect | Uploads of COI/USCG ≠ legal clearance |
| `04` Do-not-sign guide | Publish as staff/ops help only | **Never** as something captains “sign” | Internal/field guide |
| Guest waivers | Out of scope for this packet | Counsel + broker draft first | Do **not** invent in HTML |
| W-9 / tax | Separate secure flow | CPA/Accounting process | Not on dock clipboard; not casual HTML POST without security review |
| Bank / Stripe Connect onboarding | Processor’s flow only | Follow Stripe + Accounting | Never ask for full bank-portal passwords in GCCN HTML |

---

## Must stay counsel-gated before **any** live digital use

1. **Final contract text** — No live e-sign on drafts that still say “COUNSEL TO DRAFT” for indemnity, limitation of liability, governing law/venue, or arbitration.  
2. **E-sign legality & process** — Counsel confirms ESIGN/UETA (and any AL-specific) approach: intent to sign, consent to electronic records, association of signature with record, retention, and whether any term must remain wet-ink. **Do not assume “checkbox = signature” is enough.**  
3. **Identity assurance** — Who must the signer be (individual vs LLC authorized signer)? Any ID check / authority representation counsel wants on the form.  
4. **IC classification language** — Locked by counsel before mass digital rollout (not just first friendly captain).  
5. **Deposit / cancel / weather** — Align `02` with guest-facing Terms; counsel hardens refund tiers before guests pay against digital listings.  
6. **COI / additional insured** — Broker sets limits and wording; digital “I uploaded my COI” must **not** auto-activate listings without human review against broker checklist.  
7. **Guest waiver** — Separate product; counsel/broker. Not part of operator HTML v1.  
8. **Multi-state / clone** — Digital packet is AL flagship only until local counsel says otherwise.

## Prefer wet-ink or in-person (ops preference — counsel may override)

These are **ops risk preferences**, not statutes. Ask counsel if any must be wet-ink-only:

- **First Network-side countersignature** on v1.0 after counsel lock (owner or named Network signer) — keeps a clear “we meant this version” trail; later captains can be e-sign if counsel allows.  
- **Anything counsel flags** as needing special formality (rare for marketplace IC forms, but their call).  
- **Do not** require wet-ink solely for theater if counsel has approved a proper e-sign stack — premier + fair means respect their time.

**Nothing in `01`–`03` is inherently “wet-ink only” under this ops memo** — the gate is **counsel approval of text + e-sign method**, not paper for paper’s sake.

## Must NOT do in the HTML flow (even in staging that looks “live”)

- No “You are legally cleared / USCG approved / seaworthy certified by GCCN” copy. Checklist = acknowledgment + document collection.  
- No exclusive / non-compete / personal guaranty / employment packet in v1 digital (see `04`).  
- No blank fee (“we’ll set later”) — fee % visible before sign.  
- No backdating.  
- No pressure UX (“sign in 60 seconds to stay listed”).  
- No storing full SSNs in site DB if W-9 can live in Accounting/Stripe tax flow instead — follow CPA + security.  
- No guaranteed catch / false scarcity in listing fields Marketing can publish unchecked.  
- **DRAFT banner** on every page until owner + counsel mark v1.0; disable submit-to-production until then (staging-only signatures labeled non-binding if you need UX testing).

## Recommended digital UX (ops)

1. Show economics plainly: ~12% network / ~88% operator, non-exclusive, Stripe deposit % from addendum.  
2. Separate steps: (A) read `01` → (B) fill `02` trip → (C) `03` uploads + acknowledgments → (D) e-sign only if `LIVE_ESIGN=false` until counsel lock.  
3. Human review queue: credential/COI expiry dates; **Hold listing** default when gaps.  
4. Retain PDFs of what was signed (version hash / document version id in footer).  
5. Sister brand GCS: optional checkbox only if counsel-approved GCS rules exist — don’t force.

## Sync teammates

- **Accounting:** payout / 1099 / Stripe Connect — not invented in Legal HTML.  
- **Marketing:** listing claims gates.  
- **Owner:** no live captains on draft e-sign without explicit go-ahead post-counsel.

---

## One-line for eng

> Build fillable DRAFT UI from `01`–`03` now; **block binding e-sign and auto “clear to list”** until counsel (+ broker for COI) sign off; never imply GCCN certified the vessel.

---
*Prepared by GCCN Legal (ops). Retain licensed counsel. Not legal advice.*
