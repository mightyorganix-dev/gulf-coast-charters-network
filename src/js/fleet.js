import store from './store.js';
import { initLayout, imgSrc } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('fleet');
  const boats = store.getBoats();
  document.getElementById('fleet-grid').innerHTML = boats.map((b) => {
    const op = store.getOperatorById(b.operatorId);
    const marina = store.getMarinaById(b.marinaId);
    return `
      <article class="card listing-card">
        <div class="listing-media" style="--hue:210"><img class="listing-photo" src="${imgSrc(b.image)}" alt=""></div>
        <div class="card-kicker">${b.type} · ${b.lengthFeet}' · capacity ${b.capacity}</div>
        <h3>${b.name}</h3>
        <p>${op?.name || ''} · ${marina?.name || ''}</p>
        <p class="muted" style="font-size:0.8rem">${b.engines}</p>
        <p style="font-size:0.82rem">${(b.features || []).join(' · ')}</p>
        <a class="card-link" href="captain.html?id=${b.operatorId}">Captain profile</a>
      </article>`;
  }).join('');
});
