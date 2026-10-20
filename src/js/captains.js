import store from './store.js';
import { initLayout, captainCard } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('captains');
  const list = store.getOperators().filter((o) => o.status === 'active');
  document.getElementById('captains-grid').innerHTML = list.map(captainCard).join('');
});
