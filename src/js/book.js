import store from './store.js';
import { initLayout, money, categoryLabel } from './layout.js';
import { isStripeCheckoutReady } from './stripe-config.js';

let step = 1;
let selectedTripId = '';
let partySize = 4;
let hasSignature = false;
let drawing = false;

function trips() { return store.getTrips(); }

function selectedTrip() { return store.getTripById(selectedTripId); }

function depositAmount() {
  const t = selectedTrip();
  if (!t) return 0;
  let total = t.basePrice;
  if (t.pricePer === 'person') total = t.basePrice * partySize;
  if (t.pricePer === 'ski') total = t.basePrice * Math.max(1, Math.ceil(partySize / 2));
  return Math.round(total * (t.depositPercent / 100));
}

function totalAmount() {
  const t = selectedTrip();
  if (!t) return 0;
  if (t.pricePer === 'person') return t.basePrice * partySize;
  if (t.pricePer === 'ski') return t.basePrice * Math.max(1, Math.ceil(partySize / 2));
  return t.basePrice;
}

function renderTrips() {
  const pre = new URLSearchParams(location.search).get('trip');
  if (pre && !selectedTripId) selectedTripId = pre;
  if (!selectedTripId && trips()[0]) selectedTripId = trips().find((t) => t.popular)?.id || trips()[0].id;
  const box = document.getElementById('trip-select');
  box.innerHTML = trips().map((t) => `
    <button type="button" class="card select-card${t.id === selectedTripId ? ' is-selected' : ''}" data-trip="${t.id}">
      <div class="card-kicker">${categoryLabel(t.category)} · ${t.depositPercent}% deposit</div>
      <h3 style="font-size:1.2rem">${t.title}</h3>
      <p style="margin-bottom:0.4rem">${t.subtitle}</p>
      <strong style="color:var(--sand)">${money(t.basePrice)}${t.pricePer ? ' / ' + t.pricePer : ''}</strong>
      <p class="muted" style="font-size:0.75rem;margin:0.4rem 0 0">${t.experiencePromise || 'Premier guest care'}</p>
    </button>`).join('');
  box.querySelectorAll('[data-trip]').forEach((btn) => {
    btn.addEventListener('click', () => { selectedTripId = btn.dataset.trip; renderTrips(); renderSummary(); });
  });
}

function renderSummary() {
  const t = selectedTrip();
  const op = t ? store.getOperatorById(t.operatorId) : null;
  const el = document.getElementById('booking-summary');
  if (!t) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="card">
      <div class="card-kicker">Your hold</div>
      <h3>${t.title}</h3>
      <p>${op?.name} · ${store.getMarinaById(t.marinaId)?.name || ''}</p>
      <div class="deposit-line"><span>Deposit hold</span><span>${money(depositAmount())}</span></div>
      <p class="muted" style="font-size:0.8rem;margin:0.75rem 0 0">Trip total est. ${money(totalAmount())} · balance dockside / before departure. Weather Red = deposit credit.</p>
    </div>`;
  document.getElementById('party-display').textContent = partySize;
}

function go(n) {
  step = n;
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`step-${i}`)?.classList.toggle('hidden', i !== step);
    document.querySelector(`[data-step-pill="${i}"]`)?.classList.toggle('is-active', i === step);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validate(s) {
  if (s === 1 && !selectedTripId) { alert('Select a trip to continue.'); return false; }
  if (s === 2) {
    const d = document.getElementById('trip-date');
    if (!d.value) { alert('Choose a charter date.'); return false; }
    return true;
  }
  if (s === 3) {
    const name = document.getElementById('guest-name');
    const email = document.getElementById('guest-email');
    const phone = document.getElementById('guest-phone');
    if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
      alert('Guest name, email, and phone are required for captain SMS and itinerary.');
      return false;
    }
    return true;
  }
  if (s === 4) {
    if (!document.getElementById('waiver-check').checked || !hasSignature) {
      alert('Please accept the liability waiver and sign to continue.');
      return false;
    }
    return true;
  }
  return true;
}

function initPad() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = 132 * ratio;
  ctx.scale(ratio, ratio);
  ctx.strokeStyle = '#f3ebe0';
  ctx.lineWidth = 2;
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const start = (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
  const move = (e) => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasSignature = true; e.preventDefault(); };
  const end = () => { drawing = false; };
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
  document.getElementById('clear-sign').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  renderTrips();
  renderSummary();
  initPad();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  document.getElementById('trip-date').value = tomorrow;
  document.getElementById('party-minus').addEventListener('click', () => { partySize = Math.max(1, partySize - 1); renderSummary(); });
  document.getElementById('party-plus').addEventListener('click', () => {
    const max = selectedTrip()?.maxParty || 14;
    partySize = Math.min(max, partySize + 1);
    renderSummary();
  });
  if (!isStripeCheckoutReady()) {
    document.getElementById('stripe-note').textContent = 'Online deposits opening soon — your hold saves locally for captain follow-up. Stripe scaffolded (enabled: false).';
  }
  document.getElementById('next-1').addEventListener('click', () => { if (validate(1)) go(2); });
  document.getElementById('next-2').addEventListener('click', () => { if (validate(2)) go(3); });
  document.getElementById('next-3').addEventListener('click', () => { if (validate(3)) go(4); });
  document.getElementById('next-4').addEventListener('click', () => { if (validate(4)) { renderSummary(); go(5); } });
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.back))));
  document.getElementById('confirm-hold').addEventListener('click', () => {
    if (!validate(4)) { go(4); return; }
    const t = selectedTrip();
    const row = store.addBooking({
      tripId: t.id,
      operatorId: t.operatorId,
      boatId: t.boatId,
      customerName: document.getElementById('guest-name').value.trim(),
      customerEmail: document.getElementById('guest-email').value.trim(),
      customerPhone: document.getElementById('guest-phone').value.trim(),
      tripDate: document.getElementById('trip-date').value,
      startTime: document.getElementById('start-time').value,
      partySize,
      totalAmount: totalAmount(),
      depositPaid: depositAmount(),
      paymentStatus: 'deposit_hold',
      waiverSigned: true,
      weatherStatus: 'green',
      status: 'confirmed',
      notes: document.getElementById('guest-notes').value.trim(),
      certVerified: !t.requiresCert || !!document.getElementById('cert-number')?.value.trim(),
    });
    document.getElementById('book-result').innerHTML = `
      <div class="card" style="border-color:rgba(61,186,140,0.35)">
        <div class="card-kicker">Hold confirmed</div>
        <h2 style="margin:0 0 0.5rem">Reference ${row.id}</h2>
        <p>Your deposit hold is saved. Captains steward weather via Green/Yellow/Red. Save your keepsake itinerary — the boarding pass to a rare day.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="itinerary.html?id=${row.id}">Open itinerary pass</a>
          <a class="btn btn-ghost" href="trips.html">Browse more trips</a>
        </div>
      </div>`;
    go(5);
    document.getElementById('step-5-form')?.classList.add('hidden');
  });
});
