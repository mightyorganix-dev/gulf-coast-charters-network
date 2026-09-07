import store from './store.js';
import { initLayout, stars } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('reviews');
  document.getElementById('reviews-grid').innerHTML = store.getReviews().map((r) => {
    const op = store.getOperatorById(r.operatorId);
    const trip = store.getTripById(r.tripId);
    return `<article class="card review-card">
      <div class="stars">${stars(r.rating)}</div>
      <p style="color:var(--cream);font-size:1.05rem">“${r.text}”</p>
      <p class="muted" style="margin:0;font-size:0.82rem">${r.guest}</p>
      <p class="muted" style="margin:0.35rem 0 0;font-size:0.78rem">${trip?.title || ''} · ${op?.name || ''} · <span style="color:var(--teal-soft)">${r.highlight || ''}</span></p>
    </article>`;
  }).join('');
});
