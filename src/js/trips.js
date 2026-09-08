import store from './store.js';
import { initLayout, tripCard } from './layout.js';

function render() {
  const category = document.getElementById('f-category').value;
  const group = document.getElementById('f-group').value;
  const marina = document.getElementById('f-marina').value;
  const maxPrice = document.getElementById('f-price').value;
  const party = document.getElementById('f-party').value;
  const q = document.getElementById('f-q').value.trim();
  const list = store.filterTrips({
    category: category === 'all' ? undefined : category,
    group: group === 'all' ? undefined : group,
    marina,
    maxPrice,
    party,
    q,
  });
  const grid = document.getElementById('trips-grid');
  document.getElementById('trips-count').textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
  grid.innerHTML = list.length
    ? list.map(tripCard).join('')
    : `<div class="empty-state"><strong>No trips match</strong><p>Widen filters — premier inventory is curated, not endless.</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('trips');
  const marinaSel = document.getElementById('f-marina');
  marinaSel.innerHTML = `<option value="all">All marinas</option>` +
    store.getMarinas().map((m) => `<option value="${m.id}">${m.name}</option>`).join('');
  const params = new URLSearchParams(location.search);
  if (params.get('category')) document.getElementById('f-category').value = params.get('category');
  if (params.get('group')) document.getElementById('f-group').value = params.get('group');
  ['f-category', 'f-group', 'f-marina', 'f-price', 'f-party', 'f-q'].forEach((id) => {
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();
});
