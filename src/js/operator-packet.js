import store from './store.js';
import { initLayout } from './layout.js';

/** Operator packet — application save only; binding e-sign gated until counsel locks terms. */

let step = 1;
let lastPacket = null;

function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function val(id) {
  const el = document.getElementById(id);
  return el ? String(el.value || '').trim() : '';
}

function checked(id) {
  return !!document.getElementById(id)?.checked;
}

function radio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function tripTypes() {
  const types = [...document.querySelectorAll('#ad-trip-types input[type="checkbox"]:checked')].map((el) => el.value);
  const other = val('ad-trip-other');
  if (types.includes('Other') && other) return types.map((t) => (t === 'Other' ? other : t));
  return types;
}

function syncNames() {
  const op = val('ic-operator-name');
  const vessel = val('ic-vessel');
  if (op && !val('ad-operator')) document.getElementById('ad-operator').value = op;
  if (vessel && !val('ad-vessel')) document.getElementById('ad-vessel').value = vessel;
  if (op && !val('co-operator')) document.getElementById('co-operator').value = op;
  if (vessel && !val('co-vessel')) document.getElementById('co-vessel').value = vessel;
  const sign = val('ic-op-sign');
  if (sign && !val('ad-op-sign')) document.getElementById('ad-op-sign').value = sign;
  if (sign && !val('co-op-sign')) document.getElementById('co-op-sign').value = sign;
  const d = val('ic-op-date') || todayISO();
  if (!val('ad-op-date')) document.getElementById('ad-op-date').value = d;
  if (!val('co-op-date')) document.getElementById('co-op-date').value = d;
  if (!val('ad-date')) document.getElementById('ad-date').value = d;
  if (!val('co-date')) document.getElementById('co-date').value = d;
}

function showStep(n) {
  step = n;
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step-${i}`)?.classList.toggle('hidden', i !== step);
    const pill = document.querySelector(`[data-step-pill="${i}"]`);
    if (!pill) continue;
    pill.classList.toggle('is-active', i === step);
    pill.classList.toggle('is-done', i < step);
  }
  if (step === 2 || step === 3) syncNames();
  if (step === 4) renderReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function collectPayload() {
  return {
    documentVersion: 'GCCN-Operator-Packet-01-03',
    kind: 'operator_application',
    status: 'submitted',
    statusLabel: 'Submitted / Under review',
    bindingEsign: false,
    clearToList: false,
    agreement: {
      effectiveDate: val('ic-effective'),
      networkEntity: val('ic-network-entity') || 'Gulf Coast Charters Network',
      operatorName: val('ic-operator-name'),
      vessel: val('ic-vessel'),
      primaryDock: val('ic-dock'),
      noticeDays: val('ic-notice-days'),
      liability: 'As set forth in Network terms provided with Network countersignature',
      acknowledgment: {
        typedName: val('ic-op-sign'),
        title: val('ic-op-title'),
        phone: val('ic-op-phone'),
        email: val('ic-op-email'),
        date: val('ic-op-date'),
      },
    },
    addendum: {
      date: val('ad-date'),
      listingId: val('ad-listing-id'),
      operator: val('ad-operator'),
      vessel: val('ad-vessel'),
      brand: radio('ad-brand'),
      tripTitle: val('ad-title'),
      tripTypes: tripTypes(),
      meetPoint: val('ad-meet'),
      durationHours: val('ad-duration'),
      maxGuests: val('ad-max'),
      season: val('ad-season'),
      included: val('ad-included'),
      excluded: val('ad-excluded'),
      listedPrice: val('ad-price'),
      networkFeePercent: val('ad-fee') || '12',
      taxes: radio('ad-tax'),
      taxNote: val('ad-tax-note'),
      depositPercent: val('ad-deposit') || '30',
      balanceWhen: val('ad-balance-when'),
      balanceDays: val('ad-balance-days'),
      balanceMethod: val('ad-balance-method'),
      cancel: {
        earlyDays: val('ad-cx-early-days'),
        earlyPct: val('ad-cx-early-pct'),
        midFrom: val('ad-cx-mid-from'),
        midTo: val('ad-cx-mid-to'),
        midPct: val('ad-cx-mid-pct'),
        lateDays: val('ad-cx-late-days'),
        latePct: val('ad-cx-late-pct'),
      },
      weather: {
        yellowRebook: checked('ad-yel-rebook'),
        yellowDays: val('ad-yel-days'),
        yellowCredit: checked('ad-yel-credit'),
        redRefund: checked('ad-red-refund'),
        redRebook: checked('ad-red-rebook'),
        redDays: val('ad-red-days'),
      },
      acknowledgment: {
        typedName: val('ad-op-sign'),
        date: val('ad-op-date'),
      },
    },
    compliance: {
      operator: val('co-operator'),
      vessel: val('co-vessel'),
      date: val('co-date'),
      credentials: {
        uscg: checked('co-uscg'),
        uscgId: val('co-uscg-id'),
        uscgExp: val('co-uscg-exp'),
        twic: checked('co-twic'),
        twicId: val('co-twic-id'),
        twicExp: val('co-twic-exp'),
        drugTesting: checked('co-drug'),
        businessLicense: checked('co-bizlic'),
      },
      vesselDocs: {
        registration: checked('co-reg'),
        capacity: checked('co-cap'),
        safetyGear: checked('co-gear'),
        marking: checked('co-mark'),
      },
      coi: {
        liability: checked('co-pi'),
        carrier: val('co-pi-carrier'),
        expires: val('co-pi-exp'),
        additionalInsured: checked('co-ai'),
        hull: checked('co-hull'),
        copyReady: checked('co-coi-copy'),
        brokerMinimum: val('co-broker-min'),
      },
      guestPaperwork: {
        waiverReady: checked('co-waiver'),
        emergency: checked('co-emergency'),
        spearExtras: checked('co-spear'),
      },
      acknowledgments: {
        suspend: checked('co-ack-suspend'),
        notify: checked('co-ack-notify'),
        hygiene: checked('co-ack-hygiene'),
      },
      acknowledgment: {
        typedName: val('co-op-sign'),
        date: val('co-op-date'),
      },
    },
  };
}

function renderReview() {
  const p = collectPayload();
  const rows = [
    ['Operator', p.agreement.operatorName || '—'],
    ['Vessel', p.agreement.vessel || '—'],
    ['Dock / waters', p.agreement.primaryDock || '—'],
    ['Contact', [p.agreement.acknowledgment.email, p.agreement.acknowledgment.phone].filter(Boolean).join(' · ') || '—'],
    ['Trip', p.addendum.tripTitle || '—'],
    ['Trip types', (p.addendum.tripTypes || []).join(', ') || '—'],
    ['Listed price', p.addendum.listedPrice ? `$${p.addendum.listedPrice}` : '—'],
    ['Network fee', `${p.addendum.networkFeePercent}%`],
    ['Deposit', `${p.addendum.depositPercent}%`],
    ['USCG on file', p.compliance.credentials.uscg ? `Yes · ${p.compliance.credentials.uscgId || 'ID pending'}` : 'Not checked'],
    ['COI affirmed', p.compliance.coi.liability ? 'Yes — under review' : 'Not checked'],
    ['Application status', 'Submitted / Under review (after save)'],
  ];
  document.getElementById('review-summary').innerHTML = rows
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`)
    .join('');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function validateStep(n) {
  if (n === 1) {
    if (!val('ic-operator-name')) {
      alert('Please enter Operator legal name / dba.');
      return false;
    }
    if (!val('ic-op-sign')) {
      alert('Please type your full name to acknowledge Form 01.');
      return false;
    }
  }
  if (n === 2) {
    if (!val('ad-title') && !val('ad-price')) {
      alert('Please add at least a trip title or listed price for the addendum.');
      return false;
    }
  }
  if (n === 3) {
    if (!checked('co-ack-suspend') || !checked('co-ack-notify') || !checked('co-ack-hygiene')) {
      alert('Please confirm all three compliance acknowledgments.');
      return false;
    }
    if (!val('co-op-sign')) {
      alert('Please type your full name on the compliance acknowledgment.');
      return false;
    }
  }
  return true;
}

function saveApplication() {
  if (!checked('rev-confirm')) {
    alert('Please confirm the review acknowledgment before saving.');
    return;
  }
  const payload = collectPayload();
  payload.submittedAt = new Date().toISOString();
  const row = store.addOperatorPacket(payload);
  lastPacket = row;
  try {
    localStorage.setItem('gccn_operator_packet_last', JSON.stringify(row));
  } catch (_) { /* ignore */ }

  const box = document.getElementById('submit-result');
  box.classList.remove('hidden');
  box.innerHTML = `<div class="card" style="border-color:rgba(61,186,140,0.35)">
    <div class="card-kicker">Application saved</div>
    <h3 style="margin:0 0 0.35rem">Reference ${escapeHtml(row.id)}</h3>
    <p style="margin:0">Status: <strong style="color:var(--sand)">Submitted / Under review</strong>. Network will review credentials and COI before any listing goes live. This save is not a binding e-sign and does not clear you to list.</p>
  </div>`;
  document.getElementById('submit-actions')?.classList.add('hidden');
  document.getElementById('download-actions')?.classList.remove('hidden');
}

function downloadJson() {
  const data = lastPacket || collectPayload();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${data.id || 'GCCN-operator-packet'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadPrintable() {
  const p = lastPacket || { ...collectPayload(), id: 'UNSAVED' };
  const a = p.agreement || {};
  const ad = p.addendum || {};
  const c = p.compliance || {};
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${p.id || 'Operator packet'}</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#122;line-height:1.45}
  h1{font-size:1.6rem;margin:0 0 .35rem} h2{font-size:1.15rem;margin:1.4rem 0 .4rem;border-bottom:1px solid #ccc;padding-bottom:.25rem}
  .meta{color:#555;font-size:.9rem;margin-bottom:1.25rem} .k{color:#666;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em}
  table{width:100%;border-collapse:collapse;margin:.5rem 0 1rem} td,th{border:1px solid #ddd;padding:.4rem .5rem;text-align:left;vertical-align:top;font-size:.92rem}
  .foot{margin-top:2rem;font-size:.8rem;color:#666}
  @media print{body{margin:0}}
</style></head><body>
<h1>Gulf Coast Charters Network — Operator Packet</h1>
<p class="meta">Reference ${escapeHtml(p.id || '—')} · Status: Submitted / Under review · Electronic acknowledgment (application) · Not binding until Network countersigns</p>
<h2>01 Participation</h2>
<table>
<tr><th>Operator</th><td>${escapeHtml(a.operatorName || '')}</td></tr>
<tr><th>Vessel</th><td>${escapeHtml(a.vessel || '')}</td></tr>
<tr><th>Dock</th><td>${escapeHtml(a.primaryDock || '')}</td></tr>
<tr><th>Effective</th><td>${escapeHtml(a.effectiveDate || '')}</td></tr>
<tr><th>Acknowledged by</th><td>${escapeHtml((a.acknowledgment || {}).typedName || '')} · ${(a.acknowledgment || {}).date || ''}</td></tr>
<tr><th>Fee model</th><td>~12% Network / ~88% Operator · Non-exclusive · Stripe deposits per addendum</td></tr>
<tr><th>Liability</th><td>As set forth in Network terms with countersignature</td></tr>
</table>
<h2>02 Trip Listing Addendum</h2>
<table>
<tr><th>Trip</th><td>${escapeHtml(ad.tripTitle || '')}</td></tr>
<tr><th>Types</th><td>${escapeHtml((ad.tripTypes || []).join(', '))}</td></tr>
<tr><th>Meet / duration / max</th><td>${escapeHtml(ad.meetPoint || '')} · ${escapeHtml(ad.durationHours || '')}h · ${escapeHtml(ad.maxGuests || '')} guests</td></tr>
<tr><th>Price / fee / deposit</th><td>$${escapeHtml(ad.listedPrice || '')} · ${escapeHtml(ad.networkFeePercent || '')}% · ${escapeHtml(ad.depositPercent || '')}% deposit</td></tr>
<tr><th>Included</th><td>${escapeHtml(ad.included || '')}</td></tr>
<tr><th>Excluded</th><td>${escapeHtml(ad.excluded || '')}</td></tr>
</table>
<h2>03 Compliance Checklist</h2>
<table>
<tr><th>USCG</th><td>${c.credentials?.uscg ? 'Affirmed' : '—'} ${escapeHtml(c.credentials?.uscgId || '')} exp ${escapeHtml(c.credentials?.uscgExp || '')}</td></tr>
<tr><th>COI</th><td>${c.coi?.liability ? 'Affirmed — under review' : '—'} ${escapeHtml(c.coi?.carrier || '')}</td></tr>
<tr><th>Acknowledgments</th><td>Suspend / notify / hygiene: ${c.acknowledgments?.suspend && c.acknowledgments?.notify && c.acknowledgments?.hygiene ? 'Yes' : 'Incomplete'}</td></tr>
<tr><th>Signed</th><td>${escapeHtml((c.acknowledgment || {}).typedName || '')} · ${escapeHtml((c.acknowledgment || {}).date || '')}</td></tr>
</table>
<p class="foot">Does not clear to list. Network does not certify vessel seaworthiness. Guest waivers, tax forms, and bank onboarding are out of scope for this packet.</p>
<script>window.onload=()=>window.print()<\/script>
</body></html>`;
  const w = window.open('', '_blank');
  if (!w) {
    alert('Allow pop-ups to open the printable summary.');
    return;
  }
  w.document.write(html);
  w.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  const t = todayISO();
  ['ic-effective', 'ic-op-date', 'ad-date', 'ad-op-date', 'co-date', 'co-op-date'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = t;
  });

  document.getElementById('next-1')?.addEventListener('click', () => {
    if (validateStep(1)) showStep(2);
  });
  document.getElementById('next-2')?.addEventListener('click', () => {
    if (validateStep(2)) showStep(3);
  });
  document.getElementById('next-3')?.addEventListener('click', () => {
    if (validateStep(3)) showStep(4);
  });
  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => showStep(Number(btn.dataset.back)));
  });
  document.getElementById('btn-save')?.addEventListener('click', saveApplication);
  document.getElementById('btn-json')?.addEventListener('click', downloadJson);
  document.getElementById('btn-print')?.addEventListener('click', downloadPrintable);
});
