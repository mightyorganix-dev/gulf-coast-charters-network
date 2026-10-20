import store from './store.js';
import { initLayout, money } from './layout.js';
import { renderMonthCalendar, monthLabel, todayISO } from './calendar.js';

let currentId = 'op-3';
const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth();

function smsBody(status, booking) {
  const templates = store.getSmsTemplates();
  const base = templates[status] || templates.green;
  return base.replace('GCCN charter', `${booking.id} charter`);
}

function statusFor(iso) {
  return store.getDateStatus(currentId, iso);
}

function renderAvailCal() {
  const mount = document.getElementById('cap-cal-mount');
  const labelEl = document.getElementById('cap-cal-label');
  if (labelEl) labelEl.textContent = monthLabel(viewYear, viewMonth);
  if (!mount) return;
  renderMonthCalendar({
    mount,
    year: viewYear,
    monthIndex: viewMonth,
    statusFor,
    selected: '',
    editable: true,
    ariaLabel: 'Edit your availability',
    onSelect: (iso, status) => {
      if (status === 'past' || status === 'booked') return;
      store.toggleOperatorBlockedDate(currentId, iso);
      renderAvailCal();
      updateAvailStats();
    },
  });
}

function updateAvailStats() {
  const el = document.getElementById('cap-avail-stats');
  if (!el) return;
  const blocked = store.getOperatorAvailability(currentId).blockedDates || [];
  const upcoming = blocked.filter((d) => d >= todayISO()).length;
  el.textContent = `${upcoming} blocked day${upcoming === 1 ? '' : 's'} ahead · changes save to this browser (localStorage).`;
}

function load() {
  const select = document.getElementById('captain-select');
  currentId = select.value || currentId;
  const captain = store.getOperatorById(currentId);
  const boats = store.getBoats().filter((b) => b.operatorId === currentId);
  const bookings = store.getBookings().filter((b) => b.operatorId === currentId);
  document.getElementById('cap-name').textContent = captain?.name || '';
  document.getElementById('cap-license').textContent = captain?.uscgLicense || '';
  document.getElementById('cap-avatar').src = captain?.avatar || '';
  document.getElementById('cap-steward').textContent = captain?.stewardship || '';
  document.getElementById('cap-boat').textContent = boats.map((b) => `${b.name} (${b.lengthFeet}')`).join(' · ') || 'No vessel assigned';
  document.getElementById('total-charters-count').textContent = bookings.length;

  renderAvailCal();
  updateAvailStats();

  const container = document.getElementById('manifest-container');
  if (!bookings.length) {
    container.innerHTML = `<div class="empty-state"><strong>No manifests yet</strong><p>Upcoming guest holds for this captain will appear here.</p></div>`;
    return;
  }
  container.innerHTML = bookings.map((b) => {
    const trip = store.getTripById(b.tripId);
    const marina = store.getMarinaById(trip?.marinaId);
    const weatherBadge = b.weatherStatus === 'green'
      ? '<span class="badge badge-ok">Green Light</span>'
      : b.weatherStatus === 'yellow'
        ? '<span class="badge badge-warn">Yellow Caution</span>'
        : '<span class="badge badge-bad">Weather Red</span>';
    return `
      <article class="card" style="margin-bottom:1rem">
        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1rem">
          <div>
            <div class="actions" style="margin-bottom:0.5rem">
              <span class="muted" style="font-family:monospace;font-weight:700">Ref #${b.id}</span>
              ${weatherBadge}
              <span class="badge badge-info">${b.startTime}</span>
            </div>
            <h3 style="margin:0">${trip?.title || 'Charter'}</h3>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">${b.tripDate} · ${marina?.name || ''} · Party of ${b.partySize}</p>
          </div>
          <div class="call-btns" aria-label="Weather call">
            <span class="muted" style="font-size:0.65rem;align-self:center;padding:0 0.35rem;text-transform:uppercase;letter-spacing:0.06em">Call</span>
            <button type="button" class="${b.weatherStatus === 'green' ? 'active-green' : ''}" data-weather="${b.id}" data-status="green">Green</button>
            <button type="button" class="${b.weatherStatus === 'yellow' ? 'active-yellow' : ''}" data-weather="${b.id}" data-status="yellow">Yellow</button>
            <button type="button" class="${b.weatherStatus === 'red' ? 'active-red' : ''}" data-weather="${b.id}" data-status="red">Red</button>
          </div>
        </div>
        <div class="grid-3">
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Guest lead</div>
            <strong style="color:var(--cream)">${b.customerName}</strong>
            <div style="font-size:0.85rem">${b.customerPhone}</div>
            <div class="muted" style="font-size:0.8rem">${b.customerEmail}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Readiness</div>
            <div>${b.waiverSigned ? '<span class="badge badge-ok">Waiver signed</span>' : '<span class="badge badge-warn">Waiver pending</span>'}</div>
            <div style="margin-top:0.35rem">${b.certVerified ? '<span class="badge badge-ok">Cert verified</span>' : (trip?.requiresCert ? '<span class="badge badge-warn">Cert needed</span>' : '<span class="badge badge-info">No cert required</span>')}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Notes</div>
            <div style="font-size:0.85rem;color:var(--cream)">${b.notes || '—'}</div>
          </div>
        </div>
        <div class="row-between" style="border-top:1px solid var(--line);padding-top:1rem;margin-top:1rem">
          <span class="muted">Total ${money(b.totalAmount)} · Deposit <strong style="color:var(--ok)">${money(b.depositPaid)}</strong></span>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-sms="${b.id}">Guest SMS</button>
            <a class="btn btn-primary btn-sm" href="itinerary.html?id=${b.id}" target="_blank">Guest pass</a>
          </div>
        </div>
      </article>`;
  }).join('');

  container.querySelectorAll('[data-weather]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.updateWeatherStatus(btn.dataset.weather, btn.dataset.status);
      load();
    });
  });
  container.querySelectorAll('[data-sms]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const booking = store.getBookingById(btn.dataset.sms);
      const body = smsBody(booking.weatherStatus || 'green', booking);
      document.getElementById('sms-modal').classList.remove('hidden');
      document.getElementById('sms-to').textContent = `${booking.customerName} · ${booking.customerPhone}`;
      document.getElementById('sms-body').value = body;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  const select = document.getElementById('captain-select');
  const pre = new URLSearchParams(location.search).get('captain');
  select.innerHTML = store.getOperators().map((c) => `<option value="${c.id}" ${pre === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
  if (pre) currentId = pre;
  select.addEventListener('change', load);
  document.getElementById('cap-cal-prev')?.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderAvailCal();
  });
  document.getElementById('cap-cal-next')?.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderAvailCal();
  });
  document.getElementById('sms-close')?.addEventListener('click', () => document.getElementById('sms-modal').classList.add('hidden'));
  document.getElementById('sms-send')?.addEventListener('click', () => {
    document.getElementById('sms-modal').classList.add('hidden');
    alert('Simulated SMS queued to guest. In production this connects to your SMS provider.');
  });
  load();
});
