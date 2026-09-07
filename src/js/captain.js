import store from './store.js';
import { initLayout, imgSrc, tripCard, categoryLabel, stars } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('captains');
  const id = new URLSearchParams(location.search).get('id') || 'op-3';
  const o = store.getOperatorById(id);
  const root = document.getElementById('captain-detail');
  if (!o) {
    root.innerHTML = `<div class="empty-state"><strong>Captain not found</strong></div>`;
    return;
  }
  const marina = store.getMarinaById(o.marinaId);
  const boats = store.getBoats().filter((b) => b.operatorId === o.id);
  const trips = store.getTrips().filter((t) => t.operatorId === o.id);
  const reviews = store.getReviews().filter((r) => r.operatorId === o.id);
  root.innerHTML = `
    <div class="detail-hero">
      <div>
        <img src="${imgSrc(o.avatar)}" alt="" style="width:100%;max-width:320px;border-radius:24px;border:1px solid var(--line)">
      </div>
      <div>
        <div class="eyebrow">${o.tags?.slice(0, 3).join(' · ') || 'Network captain'}</div>
        <h1>${o.name}</h1>
        <p class="hero-lead" style="margin-top:0.35rem">${o.company}</p>
        <p>${o.bio}</p>
        <div class="card" style="margin:1rem 0">
          <div class="card-kicker">Stewardship standard</div>
          <p style="margin:0;color:var(--cream)">${o.stewardship}</p>
        </div>
        <p class="muted">${o.uscgLicense} · ${o.experienceYears} years · ${o.rating} ★ (${o.reviewCount} reviews)</p>
        <p class="muted" style="font-size:0.85rem">${marina?.name} · ${marina?.address}</p>
        <div class="hero-actions" style="margin-top:1rem">
          <a class="btn btn-primary" href="book.html?trip=${trips[0]?.id || ''}">Book with ${o.name.split(' ').pop()}</a>
          <a class="btn btn-ghost" href="captain-portal.html?captain=${o.id}">Captain portal</a>
        </div>
      </div>
    </div>
    <div style="margin-top:2.5rem">
      <div class="section-title" style="text-align:left"><h2>Vessels</h2></div>
      <div class="card-grid">${boats.map((b) => `
        <div class="card">
          <div class="listing-media" style="height:140px;margin:-1.35rem -1.35rem 1rem;border-radius:16px 16px 0 0"><img class="listing-photo" src="${imgSrc(b.image)}" alt=""></div>
          <h3>${b.name}</h3>
          <p>${b.lengthFeet}' ${b.type} · capacity ${b.capacity}</p>
          <p class="muted" style="font-size:0.8rem">${(b.features || []).join(' · ')}</p>
        </div>`).join('')}</div>
    </div>
    <div style="margin-top:2.5rem">
      <div class="section-title" style="text-align:left"><h2>Trips</h2></div>
      <div class="card-grid">${trips.map(tripCard).join('') || '<p class="muted">No active trip products.</p>'}</div>
    </div>
    ${reviews.length ? `<div style="margin-top:2.5rem"><div class="section-title" style="text-align:left"><h2>Guest reviews</h2></div><div class="card-grid">${reviews.map((r) => `<article class="card review-card"><div class="stars">${stars(r.rating)}</div><p style="color:var(--cream)">“${r.text}”</p><p class="muted" style="margin:0;font-size:0.8rem">${r.guest}</p></article>`).join('')}</div></div>` : ''}
  `;
});
