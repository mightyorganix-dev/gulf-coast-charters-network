# Captain-Facing Surface — When “DRAFT” Can Drop

**STATUS:** Ops risk flag for owner + eng — **not legal advice.**  
GCCN Legal is not a licensed attorney. Counsel owns whether a document may be presented as final and offered for signature.

**Ask from owner (via Chief of Staff):** Omit “DRAFT” on captain-facing digital packet; present final-looking UI. Liability / COI blanks remain.

---

## Hard flag (do not ignore)

**If liability/indemnity/limitation/governing-law language is still placeholder, or COI minimums are still blank, the captain-facing packet must not present as a final, ready-to-bind agreement.**

Removing the word “DRAFT” while those holes remain creates false finality: captains may think they signed a complete deal; Network may think risk was allocated. That is worse than an ugly DRAFT banner.

This is an **ops / product risk flag**, not a courtroom prediction. Retain counsel before treating any version as final.

---

## What must stay clearly non-final on the captain surface

Until counsel (+ broker for COI) lock the text:

| Element | Captain surface requirement |
|---------|-----------------------------|
| Indemnity / limitation of liability / mutual waiver placeholders | **Must not look signed-final.** Either hide section with “Network completing legal terms — signature not open,” or keep an explicit non-final label (see wording options below). |
| Governing law / venue / arbitration blanks | Same as above. |
| COI dollar minimums / additional-insured wording blank | Checklist may collect uploads, but **must not** say “approved,” “cleared,” or “insured to Network standards” until broker numbers are filled and a human reviews. |
| E-sign / submit for binding signature | **Keep disabled** (or explicitly “non-binding interest / application”) until counsel-locked v1.0. |
| Any page that still says “COUNSEL TO DRAFT” in source | Do not show captains that raw placeholder; replace with gated messaging — don’t silently delete the hole and call it final. |

## What may look polished / “final-looking” now

OK to look premier and clean **without** claiming legal finality:

- Brand, tone, layout, progress steps  
- Plain-English economics (~12% / ~88%, non-exclusive, Stripe deposit %) as **proposed Network terms**  
- Trip listing fields (price, schedule, inclusions) as **data entry**  
- Credential / COI **file upload** + expiry fields as onboarding hygiene  
- “04” rules as staff-only (never captain-signed)

## Wording options if owner wants to avoid the word “DRAFT”

Pick one counsel-aware pattern (owner choice; counsel should bless):

1. **Recommended while blanks remain:** No binding signature CTA. Header: **“Operator onboarding — signature opens after Network finalizes legal terms.”** Body looks finished; button is “Save application” not “Agree & sign.”  
2. **If they insist on sign-shaped UX early:** Label **“Non-binding preview / application — not a contract until Network countersigns the counsel-approved version.”**  
3. **After counsel locks text + broker COI minimums:** Then omit DRAFT; use version id (e.g. `GCCN Operator Terms v1.0 · Effective ____`); enable e-sign only on that hash.

**Do not:** strip DRAFT, leave liability/COI holes, and show **“Agree & Sign”** as if complete.

## Staff / internal surfaces

Keep DRAFT / “counsel review” labels on internal tools, PDFs for attorney, and owner review links even if captain UI is polished.

## Ask back to owner (one decision)

Presenting final-looking captain UI while liability/COI blanks remain is only safe if **binding e-sign stays off** (application/save only). If owner wants true final presentation **and** signature, counsel must fill blanks first.

---
*Prepared by GCCN Legal (ops). Retain licensed counsel. Not legal advice.*

---

## Decision log

**2026-09-09:** Owner skipped in-chat pick. Chief of Staff selected **polished application (fill/submit, no binding e-sign)** until counsel/broker lock. Digital onboarding + PDF both shipping that way. Binding e-sign / “final contract” presentation remains blocked until counsel-locked v1.0 + broker COI minimums.
