import store from './store.js';
import { initLayout, money, categoryLabel, imgSrc } from './layout.js';
import { isStripeCheckoutReady } from './stripe-config.js';
import { renderMonthCalendar, formatLongDate, monthLabel } from './calendar.js';

let step = 1;
let selectedTripId = '';
let selectedCaptainId = '';
let selectedDate = '';
let partySize = 4;
let hasSignature = false;
let drawing = false;
const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth();

function trips() { return store.getTrips(); }
function selectedTrip() { return store.getTripById(selectedTripId); }

function tripCaptains(trip) {
  return store.getTripCaptainIds(trip).map((id) => store.getOperatorById(id)).filter(Boolean);
}

function ensureCaptain() {
  const t = selectedTrip();
  if (!t) return;
  const ids = store.getTripCaptainIds(t);
  if (!ids.includes(selectedCaptainId)) selectedCaptainId = ids[0] || t.operatorId;
}

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

function statusFor(iso) {
  return store.getDateStatus(selectedCaptainId, iso);
}

function syncDateInput() {
  const input = document.getElementById('trip-date');
  if (input) input.value = selectedDate || '';
}

function renderDatePrice() {
  const el = document.getElementById('book-date-price');
  if (!el) return;
  const t = selectedTrip();
  const cap = store.getOperatorById(selectedCaptainId);
  if (!selectedDate) {
    el.innerHTML = `<p class="muted" style="margin:0">Tap an available date on the calendar.</p>`;
    return;
  }
  el.innerHTML = `
    <div class="cal-price-line"><span>Date</span><strong>${formatLongDate(selectedDate)}</strong></div>
    <div class="cal-price-line"><span>Captain</span><strong>${cap?.name || '—'}</strong></div>
    <div class="cal-price-line"><span>Trip total</span><strong class="cal-price-accent">${money(totalAmount())}</strong></div>
    <div class="cal-price-line"><span>Deposit (${t?.depositPercent || 0}%)</span><strong>${money(depositAmount())}</strong></div>`;
}

function renderBookCal() {
  const mount = document.getElementById('book-cal-mount');
  const labelEl = document.getElementById('book-cal-label');
  if (labelEl) labelEl.textContent = monthLabel(viewYear, viewMonth);
  if (!mount || !selectedCaptainId) return;
  renderMonthCalendar({
    mount,
    year: viewYear,
    monthIndex: viewMonth,
    statusFor,
    selected: selectedDate,
    ariaLabel: `Available charter dates`,
    onSelect: (iso, status) => {
      if (status !== 'available') return;
      selectedDate = iso;
      syncDateInput();
      renderBookCal();
      renderDatePrice();
      renderSummary();
    },
  });
}

function renderCaptainPick() {
  const box = document.getElementById('book-captain-pick');
  if (!box) return;
  const t = selectedTrip();
  const captains = tripCaptains(t);
  if (captains.length <= 1) {
    box.innerHTML = captains[0]
      ? `<p class="muted" style="font-size:0.85rem;margin:0 0 0.75rem">Captain · <strong style="color:var(--cream)">${captains[0].name}</strong></p>`
      : '';
    return;
  }
  box.innerHTML = `
    <div class="card-kicker">Choose your captain</div>
    <div class="captain-pick" role="listbox" aria-label="Captains for this trip">
      ${captains.map((c) => `
        <button type="button" class="captain-pick-btn${c.id === selectedCaptainId ? ' is-selected' : ''}"
          data-captain="${c.id}" role="option" aria-selected="${c.id === selectedCaptainId}">
          <img src="${imgSrc(c.avatar)}" alt="" width="40" height="40">
          <span><strong>${c.name}</strong><em>${c.rating} ★</em></span>
        </button>`).join('')}
    </div>`;
  box.querySelectorAll('[data-captain]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCaptainId = btn.dataset.captain;
      selectedDate = '';
      syncDateInput();
      renderCaptainPick();
      renderBookCal();
      renderDatePrice();
      renderSummary();
    });
  });
}

function renderTrips() {
  const params = new URLSearchParams(location.search);
  const pre = params.get('trip');
  if (pre && !selectedTripId) selectedTripId = pre;
  if (!selectedTripId && trips()[0]) selectedTripId = trips().find((t) => t.popular)?.id || trips()[0].id;
  ensureCaptain();
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
    btn.addEventListener('click', () => {
      selectedTripId = btn.dataset.trip;
      selectedDate = '';
      ensureCaptain();
      syncDateInput();
      renderTrips();
      renderCaptainPick();
      renderBookCal();
      renderDatePrice();
      renderSummary();
    });
  });
}

function renderSummary() {
  const t = selectedTrip();
  const op = t ? store.getOperatorById(selectedCaptainId || t.operatorId) : null;
  const el = document.getElementById('booking-summary');
  if (!t) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="card">
      <div class="card-kicker">Your hold</div>
      <h3>${t.title}</h3>
      <p>${op?.name || ''} · ${store.getMarinaById(t.marinaId)?.name || ''}</p>
      ${selectedDate ? `<p style="color:var(--cream);margin:0.35rem 0">${formatLongDate(selectedDate)}</p>` : ''}
      <div class="deposit-line"><span>Deposit hold</span><span>${money(depositAmount())}</span></div>
      <p class="muted" style="font-size:0.8rem;margin:0.75rem 0 0">Trip total est. ${money(totalAmount())} · balance dockside / before departure. Weather Red = deposit credit.</p>
    </div>`;
  const partyEl = document.getElementById('party-display');
  if (partyEl) partyEl.textContent = partySize;
}

function go(n) {
  step = n;
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`step-${i}`)?.classList.toggle('hidden', i !== step);
    document.querySelector(`[data-step-pill="${i}"]`)?.classList.toggle('is-active', i === step);
  }
  if (n === 2) {
    ensureCaptain();
    renderCaptainPick();
    renderBookCal();
    renderDatePrice();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validate(s) {
  if (s === 1 && !selectedTripId) { alert('Select a trip to continue.'); return false; }
  if (s === 2) {
    syncDateInput();
    if (!selectedDate) { alert('Choose an available charter date on the calendar.'); return false; }
    if (!store.isDateAvailable(selectedCaptainId, selectedDate)) {
      alert('That date is no longer available. Please choose another open date.');
      return false;
    }
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
  const params = new URLSearchParams(location.search);
  if (params.get('captain')) selectedCaptainId = params.get('captain');
  if (params.get('date')) {
    selectedDate = params.get('date');
    const d = new Date(selectedDate + 'T12:00:00');
    if (!Number.isNaN(d.getTime())) {
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
    }
  }

  renderTrips();
  ensureCaptain();
  // validate preselected date still open
  if (selectedDate && selectedCaptainId && !store.isDateAvailable(selectedCaptainId, selectedDate)) {
    selectedDate = '';
  }
  syncDateInput();
  renderCaptainPick();
  renderBookCal();
  renderDatePrice();
  renderSummary();
  initPad();

  document.getElementById('book-cal-prev')?.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderBookCal();
  });
  document.getElementById('book-cal-next')?.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderBookCal();
  });

  document.getElementById('party-minus').addEventListener('click', () => {
    partySize = Math.max(1, partySize - 1);
    renderDatePrice();
    renderSummary();
  });
  document.getElementById('party-plus').addEventListener('click', () => {
    const max = selectedTrip()?.maxParty || 14;
    partySize = Math.min(max, partySize + 1);
    renderDatePrice();
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

  // Deep-link: trip+date → jump to date step
  if (params.get('trip') && params.get('date') && selectedDate) {
    go(2);
  }

  document.getElementById('confirm-hold').addEventListener('click', () => {
    if (!validate(2)) { go(2); return; }
    if (!validate(4)) { go(4); return; }
    const t = selectedTrip();
    const boatId = t.boatId;
    const row = store.addBooking({
      tripId: t.id,
      operatorId: selectedCaptainId || t.operatorId,
      boatId,
      customerName: document.getElementById('guest-name').value.trim(),
      customerEmail: document.getElementById('guest-email').value.trim(),
      customerPhone: document.getElementById('guest-phone').value.trim(),
      tripDate: selectedDate,
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
        <p>${formatLongDate(selectedDate)} with ${store.getOperatorById(row.operatorId)?.name || 'your captain'}. Deposit hold saved. Captains steward weather via Green/Yellow/Red.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="itinerary.html?id=${row.id}">Open itinerary pass</a>
          <a class="btn btn-ghost" href="trips.html">Browse more trips</a>
        </div>
      </div>`;
    go(5);
    document.getElementById('step-5-form')?.classList.add('hidden');
  });
});
