import store from './store.js';
import { initLayout, money, tripCard, captainCard, stars } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('home');
  const stats = store.fleetStats();
  const el = document.getElementById('fleet-stats');
  if (el) {
    el.innerHTML = [
      ['Items', stats.items],
      ['Resources', stats.resources],
      ['Channels', stats.channels],
      ['Marinas', stats.marinas],
      ['Avg captain ★', stats.rating],
      ['Guest promise', 'Premier CX'],
    ].map(([label, value]) => `
      <div class="market-stat">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
      </div>`).join('');
  }

  const popular = store.getTrips().filter((t) => t.popular).slice(0, 8);
  const popEl = document.getElementById('popular-trips');
  if (popEl) popEl.innerHTML = popular.map(tripCard).join('');

  const adventures = store.filterTrips({ group: 'adventures' }).slice(0, 4);
  const advEl = document.getElementById('adventure-trips');
  if (advEl) advEl.innerHTML = adventures.map(tripCard).join('');

  const water = store.filterTrips({ group: 'watersports' }).slice(0, 4);
  const waterEl = document.getElementById('watersport-trips');
  if (waterEl) waterEl.innerHTML = water.map(tripCard).join('');

  const priv = store.filterTrips({ category: 'private' }).slice(0, 4);
  const privEl = document.getElementById('private-trips');
  if (privEl) privEl.innerHTML = priv.map(tripCard).join('');

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
