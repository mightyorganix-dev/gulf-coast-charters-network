import { initLayout } from './layout.js';
document.addEventListener('DOMContentLoaded', () => {
  initLayout('contact');
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact-result').innerHTML = `<div class="notice-banner">Message saved for network concierge follow-up. For weather or same-day dock questions, use your itinerary pass SMS channel with your captain.</div>`;
    e.target.reset();
  });
});
