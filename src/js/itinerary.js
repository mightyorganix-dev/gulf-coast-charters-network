import store from './store.js';
import { initLayout, money, imgSrc } from './layout.js';

function weatherCopy(status) {
  if (status === 'yellow') return { cls: 'weather-yellow', title: 'Yellow caution', body: 'Seas or wind under watch. Your captain will make a final morning call. Deposit protected if we go Red.' };
  if (status === 'red') return { cls: 'weather-red', title: 'Red weather hold', body: 'We will not risk your day. Deposit transfers as credit to a new date — reply with preferred windows.' };
  return { cls: 'weather-green', title: 'Green light', body: 'Conditions look favorable. Arrive 30 minutes early with waiver complete. This is the boarding pass to a rare day.' };
}

function render(id) {
  const b = store.getBookingById(id);
  const ticket = document.getElementById('ticket-card');
  const missing = document.getElementById('not-found-card');
  if (!b) {
    ticket.classList.add('hidden');
    missing.classList.remove('hidden');
    return;
  }
  missing.classList.add('hidden');
  ticket.classList.remove('hidden');
  const trip = store.getTripById(b.tripId);
  const op = store.getOperatorById(b.operatorId);
  const boat = store.getBoatById(b.boatId);
  const marina = store.getMarinaById(trip?.marinaId);
  const w = weatherCopy(b.weatherStatus);
  document.getElementById('pass-ref-id').textContent = `REF #${b.id}`;
  document.getElementById('pass-trip-title').textContent = trip?.title || 'Charter';
  document.getElementById('pass-trip-subtitle').textContent = trip?.subtitle || '';
  document.getElementById('pass-date').textContent = b.tripDate;
  document.getElementById('pass-time').textContent = b.startTime;
  document.getElementById('pass-captain').textContent = op?.name || '';
  document.getElementById('pass-vessel').textContent = boat?.name || '';
  document.getElementById('pass-marina-name').textContent = marina?.name || '';
  document.getElementById('pass-marina-address').textContent = marina?.address || '';
  document.getElementById('pass-gps-link').href = `https://maps.google.com/?q=${encodeURIComponent(marina?.address || 'Orange Beach AL')}`;
  document.getElementById('pass-weather-banner').className = `weather-banner ${w.cls}`;
  document.getElementById('pass-weather-banner').innerHTML = `<div><strong>${w.title}</strong><div>${w.body}</div></div>`;
  document.getElementById('pass-guest').textContent = b.customerName;
  document.getElementById('pass-party').textContent = `Party of ${b.partySize}`;
  document.getElementById('pass-deposit').textContent = `${money(b.depositPaid)} hold · ${money(b.totalAmount)} trip`;
  document.getElementById('pass-waiver').textContent = b.waiverSigned ? 'Signed' : 'Pending — complete before dock';
  document.getElementById('pass-promise').textContent = trip?.experiencePromise || store.getCx().promise;
  document.getElementById('pass-checklist').innerHTML = [
    'Photo ID matching guest lead name',
    'Sunscreen, polarized sunglasses, light layer',
    trip?.requiresCert ? 'Dive certification card (physical or digital)' : 'Signed waiver (this hold counts if completed in booking)',
    'Soft cooler for fillets / keepsakes (leave in vehicle until return)',
    'Water & light snacks — no glass on most vessels',
    'Arrive 30 minutes early; park in charter lot',
  ].map((x) => `<li>${x}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  const params = new URLSearchParams(location.search);
  const initial = params.get('id') || '';
  if (initial) {
    document.getElementById('lookup-input').value = initial;
    render(initial);
  }
  document.getElementById('lookup-btn').addEventListener('click', () => {
    const id = document.getElementById('lookup-input').value.trim();
    if (id) {
      history.replaceState(null, '', `itinerary.html?id=${encodeURIComponent(id)}`);
      render(id);
    }
  });
});
