import store from './store.js';
import { initLayout, money, imgSrc, categoryLabel, stars } from './layout.js';
import { renderMonthCalendar, formatLongDate, monthLabel } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('trips');
  const id = new URLSearchParams(location.search).get('id') || 'trip-1';
  const t = store.getTripById(id);
  const root = document.getElementById('trip-detail');
  if (!t) {
    root.innerHTML = `<div class="empty-state"><strong>Trip not found</strong><p><a href="trips.html">Back to catalog</a></p></div>`;
    return;
  }
  const op = store.getOperatorById(t.operatorId);
  const boat = store.getBoatById(t.boatId);
  const marina = store.getMarinaById(t.marinaId);
  const per = t.pricePer ? ` / ${t.pricePer}` : ' private day';
  const reviews = store.getReviews().filter((r) => r.tripId === t.id || r.operatorId === t.operatorId).slice(0, 3);
  const captainIds = store.getTripCaptainIds(t);
  const captains = captainIds.map((cid) => store.getOperatorById(cid)).filter(Boolean);

  let selectedCaptainId = captainIds[0] || t.operatorId;
  let selectedDate = '';
  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();

  function tripTotal(party = 4) {
    if (t.pricePer === 'person') return t.basePrice * party;
    if (t.pricePer === 'ski') return t.basePrice * Math.max(1, Math.ceil(party / 2));
    return t.basePrice;
  }

  function depositFor(party = 4) {
    return Math.round(tripTotal(party) * (t.depositPercent / 100));
  }

  function statusFor(iso) {
    const st = store.getDateStatus(selectedCaptainId, iso);
    if (st === 'available') return 'available';
    if (st === 'blocked' || st === 'booked' || st === 'past') return st;
    return 'unavailable';
  }

  function bookHref() {
    let href = `book.html?trip=${t.id}`;
    if (selectedCaptainId) href += `&captain=${selectedCaptainId}`;
    if (selectedDate) href += `&date=${selectedDate}`;
    return href;
  }

  function syncCtas() {
    const label = selectedDate ? 'Hold this date' : 'Reserve this trip';
    ['trip-reserve-cta', 'trip-hold-cta'].forEach((cid) => {
      const a = document.getElementById(cid);
      if (!a) return;
      a.href = bookHref();
      a.textContent = label;
    });
  }

  function renderPriceCard() {
    const el = document.getElementById('trip-date-price');
    if (!el) return;
    if (!selectedDate) {
      el.innerHTML = `<p class="muted" style="margin:0">Select an open date to see your hold amount.</p>`;
      syncCtas();
      return;
    }
    const cap = store.getOperatorById(selectedCaptainId);
    el.innerHTML = `
      <div class="cal-price-line"><span>Selected</span><strong>${formatLongDate(selectedDate)}</strong></div>
      <div class="cal-price-line"><span>Captain</span><strong>${cap?.name || '—'}</strong></div>
      <div class="cal-price-line"><span>Trip total</span><strong class="cal-price-accent">${money(tripTotal())}${t.pricePer ? ' · est.' : ''}</strong></div>
      <div class="cal-price-line"><span>Deposit hold (${t.depositPercent}%)</span><strong>${money(depositFor())}</strong></div>
      <p class="muted" style="font-size:0.78rem;margin:0.75rem 0 0">Private whole-boat day. Balance dockside / before departure. Weather Red = deposit credit.</p>`;
    syncCtas();
  }

  function renderCaptainPick() {
    const box = document.getElementById('trip-captain-pick');
    if (!box) return;
    if (captains.length <= 1) {
      box.innerHTML = '';
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="card-kicker">Choose your captain</div>
      <div class="captain-pick" role="listbox" aria-label="Captains for this trip">
        ${captains.map((c) => `
          <button type="button" class="captain-pick-btn${c.id === selectedCaptainId ? ' is-selected' : ''}"
            data-captain="${c.id}" role="option" aria-selected="${c.id === selectedCaptainId}">
            <img src="${imgSrc(c.avatar)}" alt="" width="40" height="40">
            <span>
              <strong>${c.name}</strong>
              <em>${c.rating} ★ · ${c.uscgLicense || 'USCG'}</em>
            </span>
          </button>`).join('')}
      </div>`;
  }

  function renderCal() {
    const mount = document.getElementById('trip-cal-mount');
    const labelEl = document.getElementById('trip-cal-label');
    if (labelEl) labelEl.textContent = monthLabel(viewYear, viewMonth);
    if (!mount) return;
    renderMonthCalendar({
      mount,
      year: viewYear,
      monthIndex: viewMonth,
      statusFor,
      selected: selectedDate,
      ariaLabel: `Open dates for ${store.getOperatorById(selectedCaptainId)?.name || 'captain'}`,
      onSelect: (iso, status) => {
        if (status !== 'available') return;
        selectedDate = iso;
        renderCal();
        renderPriceCard();
      },
    });
  }

  root.innerHTML = `
    <div class="detail-hero">
      <div class="detail-media" style="--hue:200;min-height:320px">
        <img src="${imgSrc(t.image)}" alt="">
      </div>
      <div>
        <div class="eyebrow">${categoryLabel(t.category)} · ${t.cxTier === 'premier' ? 'Premier CX' : 'Network'}</div>
        <h1>${t.title}</h1>
        <p class="hero-lead" style="margin-top:0.5rem">${t.subtitle}</p>
        <p>${t.description}</p>
        <div class="card" style="margin:1rem 0;padding:1rem;border-color:rgba(196,165,116,0.28)">
          <div class="card-kicker">Guest experience promise</div>
          <p style="margin:0;color:var(--cream)">${t.experiencePromise || store.getCx().promise}</p>
        </div>
        <div class="stat-grid" style="grid-template-columns:repeat(2,1fr);margin:1rem 0">
          <div class="stat"><div class="label">From</div><div class="value" style="font-size:1.6rem">${money(t.basePrice)}</div><div class="muted" style="font-size:0.75rem">${per}</div></div>
          <div class="stat"><div class="label">Duration</div><div class="value" style="font-size:1.6rem">${t.durationHours}h</div><div class="muted" style="font-size:0.75rem">up to ${t.maxParty} guests</div></div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" id="trip-reserve-cta" href="book.html?trip=${t.id}">Reserve this trip</a>
          <a class="btn btn-ghost" href="captain.html?id=${op?.id}">Meet ${op?.name?.split(' ').slice(-1)[0] || 'captain'}</a>
        </div>
      </div>
    </div>

    <section class="cal-panel" aria-labelledby="avail-heading" style="margin-top:2.25rem">
      <div class="section-title" style="text-align:left;margin-bottom:1rem">
        <h2 id="avail-heading">Select your date</h2>
        <p>Private whole-boat day · live open dates for the captain stewarding this trip.</p>
      </div>
      <div id="trip-captain-pick" class="cal-captain-block"></div>
      <div class="cal-layout">
        <div class="card cal-card">
          <div class="cal-toolbar">
            <button type="button" class="btn btn-ghost btn-sm" id="trip-cal-prev" aria-label="Previous month">‹</button>
            <strong id="trip-cal-label" class="cal-month-label"></strong>
            <button type="button" class="btn btn-ghost btn-sm" id="trip-cal-next" aria-label="Next month">›</button>
          </div>
          <div id="trip-cal-mount"></div>
          <div class="cal-legend" aria-hidden="true">
            <span><i class="cal-dot cal-dot--available"></i> Available</span>
            <span><i class="cal-dot cal-dot--blocked"></i> Unavailable</span>
            <span><i class="cal-dot cal-dot--selected"></i> Selected</span>
          </div>
        </div>
        <div class="card cal-price-card">
          <div class="card-kicker">Your hold</div>
          <div id="trip-date-price"></div>
          <div class="hero-actions" style="margin-top:1.25rem">
            <a class="btn btn-primary" id="trip-hold-cta" href="book.html?trip=${t.id}">Continue to reserve</a>
          </div>
        </div>
      </div>
    </section>

    <div class="grid-3" style="margin-top:2rem">
      <div class="card">
        <div class="card-kicker">Captain steward</div>
        <h3>${op?.name || ''}</h3>
        <p>${op?.stewardship || op?.bio || ''}</p>
        <p class="muted" style="font-size:0.82rem">${op?.rating} ★ · ${op?.uscgLicense}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Vessel</div>
        <h3>${boat?.name || ''}</h3>
        <p>${boat?.lengthFeet}' ${boat?.type} · ${boat?.engines}</p>
        <p class="muted" style="font-size:0.82rem">${(boat?.features || []).slice(0, 4).join(' · ')}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Marina</div>
        <h3>${marina?.name || ''}</h3>
        <p>${marina?.address || ''}</p>
        <p class="muted" style="font-size:0.82rem">${marina?.notes || ''}</p>
      </div>
    </div>
    <div class="check-grid" style="margin-top:1.5rem">
      <div class="card">
        <h3>Included</h3>
        <ul class="check-list">${(t.includes || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Plan ahead</h3>
        <ul class="check-list">
          ${(t.excludes || []).map((x) => `<li>${x}</li>`).join('')}
          <li>Deposit ${t.depositPercent}% holds your date</li>
          <li>${t.requiresCert ? 'Dive certification required' : 'Waiver required before dock'}</li>
        </ul>
      </div>
    </div>
    ${reviews.length ? `<div style="margin-top:2rem"><div class="section-title" style="text-align:left"><h2>Guest voices</h2></div><div class="card-grid">${reviews.map((r) => `<article class="card review-card"><div class="stars">${stars(r.rating)}</div><p style="color:var(--cream)">“${r.text}”</p><p class="muted" style="margin:0;font-size:0.8rem">${r.guest}</p></article>`).join('')}</div></div>` : ''}
  `;

  document.getElementById('trip-cal-prev').addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderCal();
  });
  document.getElementById('trip-cal-next').addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderCal();
  });
  document.getElementById('trip-captain-pick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-captain]');
    if (!btn) return;
    selectedCaptainId = btn.dataset.captain;
    selectedDate = '';
    renderCaptainPick();
    renderCal();
    renderPriceCard();
  });

  renderCaptainPick();
  renderCal();
  renderPriceCard();
});
