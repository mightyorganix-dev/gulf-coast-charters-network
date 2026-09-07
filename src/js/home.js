import store from './store.js';
import { initLayout, money, tripCard, captainCard, stars } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('home');
  const stats = store.fleetStats();
  const el = document.getElementById('fleet-stats');
  if (el) {
    el.innerHTML = [
      ['Operators', stats.operators],
      ['Vessels', stats.boats],
      ['Trip products', stats.trips],
      ['Marinas', stats.marinas],
      ['Avg captain ★', stats.rating],
      ['Guest promise', 'Once-in-a-lifetime'],
    ].map(([label, value]) => `
      <div class="market-stat">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
      </div>`).join('');
  }
  const featured = store.getTrips().filter((t) => t.popular).slice(0, 6);
  document.getElementById('featured-trips').innerHTML = featured.map(tripCard).join('');
  const caps = store.getOperators().sort((a, b) => b.rating - a.rating).slice(0, 3);
  document.getElementById('featured-captains').innerHTML = caps.map(captainCard).join('');
  const reviews = store.getReviews().slice(0, 3);
  document.getElementById('home-reviews').innerHTML = reviews.map((r) => `
    <article class="card review-card">
      <div class="stars">${stars(r.rating)}</div>
      <p style="color:var(--cream);font-size:1.02rem">“${r.text}”</p>
      <p class="muted" style="margin:0;font-size:0.82rem">${r.guest} · <span style="color:var(--teal-soft)">${r.highlight || ''}</span></p>
    </article>`).join('');
});
