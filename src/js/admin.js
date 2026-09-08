import store from './store.js';
import { initLayout, money, categoryLabel } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  const rev = store.revenueSnapshot();
  const stats = store.fleetStats();
  document.getElementById('admin-stats').innerHTML = [
    ['Manifests', rev.bookings],
    ['Gross pipeline', money(rev.gross)],
    ['Deposits held', money(rev.deposits)],
    ['Items', stats.items],
    ['Resources', stats.resources],
    ['Channels', stats.channels],
  ].map(([l, v]) => `<div class="stat"><div class="label">${l}</div><div class="value" style="font-size:1.55rem">${v}</div></div>`).join('');

  document.getElementById('admin-channels').innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Channel</th><th>Code</th><th>Status</th><th>Commission</th><th>Notes</th></tr></thead>
      <tbody>
        ${store.getChannels().map((c) => `<tr>
          <td>${c.name}</td>
          <td><code>${c.code}</code></td>
          <td>${c.status}</td>
          <td>${c.commissionPercent == null ? '—' : c.commissionPercent + '%'}</td>
          <td>${c.notes || ''}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;

  const bookings = store.getBookings();
  document.getElementById('admin-bookings').innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Ref</th><th>Guest</th><th>Item</th><th>Date</th><th>Channel</th><th>Weather</th><th>Deposit</th><th>Status</th></tr></thead>
      <tbody>
        ${bookings.map((b) => {
          const t = store.getItemById(b.tripId);
          const ch = store.getChannels().find((c) => c.id === (b.channelId || 'ch-direct'));
          return `<tr>
            <td><a href="itinerary.html?id=${b.id}">${b.id}</a></td>
            <td>${b.customerName}</td>
            <td>${t?.title || b.tripId}</td>
            <td>${b.tripDate}</td>
            <td>${ch?.code || 'direct_web'}</td>
            <td>${b.weatherStatus}</td>
            <td>${money(b.depositPaid)}</td>
            <td>${b.status}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`;

  document.getElementById('admin-items').innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th>Category</th><th>Duration</th><th>Capacity</th><th>From</th><th>Deposit %</th></tr></thead>
      <tbody>
        ${store.getItems().map((t) => `<tr>
          <td><a href="trip.html?id=${t.id}">${t.title}</a></td>
          <td>${categoryLabel(t.category)}</td>
          <td>${t.durationHours}h</td>
          <td>${t.maxParty}</td>
          <td>${money(t.basePrice)}${t.pricePer ? ' / ' + t.pricePer : ''}</td>
          <td>${t.depositPercent}%</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;

  document.getElementById('admin-operators').innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Company</th><th>Marina</th><th>★</th><th>Specialty</th></tr></thead>
      <tbody>
        ${store.getOperators().map((o) => {
          const m = store.getMarinaById(o.marinaId);
          return `<tr>
            <td><a href="captain.html?id=${o.id}">${o.name}</a></td>
            <td>${o.company}</td>
            <td>${m?.name || ''}</td>
            <td>${o.rating}</td>
            <td>${(o.specialty || []).map(categoryLabel).join(', ')}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`;

  document.getElementById('admin-boats').innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Vessel</th><th>Operator</th><th>Length</th><th>Capacity</th><th>Marina</th></tr></thead>
      <tbody>
        ${store.getBoats().map((b) => {
          const o = store.getOperatorById(b.operatorId);
          const m = store.getMarinaById(b.marinaId);
          return `<tr><td>${b.name}</td><td>${o?.name || ''}</td><td>${b.lengthFeet}'</td><td>${b.capacity}</td><td>${m?.name || ''}</td></tr>`;
        }).join('')}
      </tbody>
    </table></div>`;

  const apps = store.getApplications();
  document.getElementById('admin-apps').innerHTML = apps.length
    ? `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Marina</th><th>Status</th></tr></thead><tbody>
        ${apps.map((a) => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.company}</td><td>${a.marina}</td><td>${a.status}</td></tr>`).join('')}
      </tbody></table></div>`
    : `<p class="muted">No operator applications yet. <a href="operators.html">Join intake</a></p>`;
});
