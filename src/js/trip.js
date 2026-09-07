import store from './store.js';
import { initLayout, money, imgSrc, categoryLabel, stars } from './layout.js';

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
  const per = t.pricePer ? ` / ${t.pricePer}` : ' per trip';
  const reviews = store.getReviews().filter((r) => r.tripId === t.id || r.operatorId === t.operatorId).slice(0, 3);
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
          <a class="btn btn-primary" href="book.html?trip=${t.id}">Reserve this trip</a>
          <a class="btn btn-ghost" href="captain.html?id=${op?.id}">Meet ${op?.name?.split(' ').slice(-1)[0] || 'captain'}</a>
        </div>
      </div>
    </div>
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
});
