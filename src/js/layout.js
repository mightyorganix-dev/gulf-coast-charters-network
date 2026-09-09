import store from './store.js';

const PAGES = [
  { href: 'index.html', label: 'Home', key: 'home' },
  { href: 'trips.html', label: 'Trips', key: 'trips' },
  { href: 'fleet.html', label: 'Fleet', key: 'fleet' },
  { href: 'captains.html', label: 'Captains', key: 'captains' },
  { href: 'about.html', label: 'About', key: 'about' },
  { href: 'reviews.html', label: 'Reviews', key: 'reviews' },
  { href: 'contact.html', label: 'Contact', key: 'contact' },
];

const PORTAL_LINKS = [
  { href: 'book.html', label: 'Book' },
  { href: 'itinerary.html', label: 'Itinerary' },
  { href: 'captain-portal.html', label: 'Captain' },
  { href: 'operators.html', label: 'Join' },
  { href: 'admin.html', label: 'Admin' },
];

const LOGO = `<svg class="brand-svg" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><defs><linearGradient id="gccnGrad" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#0b1524"/><stop offset="1" stop-color="#1a8a7c"/></linearGradient></defs><rect x="2" y="2" width="36" height="36" rx="10" fill="url(#gccnGrad)"/><path d="M8 24c3.5-6 8-8 12-3.5s7 1.5 10-2.5" stroke="#f3ebe0" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M10 28c2.5-2.8 6-3.5 9-1.2" stroke="#3aa899" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="29" cy="12" r="2" fill="#c4a574"/></svg>`;

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
}

export function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US');
}

export function imgSrc(path) {
  if (!path) return '';
  if (/^(https?:|data:|\/|\.\/)/.test(path)) return path;
  return './' + path.replace(/^\.?\/?/, '');
}

export function categoryLabel(cat) {
  const map = {
    offshore: 'Offshore Fishing',
    inshore: 'Inshore Fishing',
    shared: 'Shared Fishing',
    party: 'Party Boat',
    spearfishing: 'Spearfishing',
    dolphin: 'Dolphin Cruise',
    sunset: 'Sunset Cruise',
    jetski: 'Jet Ski',
    watersports: 'Parasail & Tow',
    pontoon: 'Pontoon / Bay',
    private: 'Private Yacht',
  };
  return map[cat] || cat;
}

export function renderNav(active = '') {
  const page = currentPage();
  const navEl = document.getElementById('site-nav');
  if (!navEl) return;
  const guestLinks = PAGES.map((p) => {
    const isActive = page === p.href || active === p.key;
    return `<a href="${p.href}" class="nav-link${isActive ? ' is-active' : ''}">${p.label}</a>`;
  }).join('');
  navEl.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="brand" title="Gulf Coast Charters Network">
        <span class="brand-mark">${LOGO}</span>
        <span class="brand-text">
          <strong>Gulf Coast Charters</strong>
          <em>Network · AL Outdoor Hub</em>
        </span>
      </a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-panel" id="nav-panel">
        <div class="nav-links">${guestLinks}</div>
        <div class="nav-portals">
          ${PORTAL_LINKS.map((l) => `<a href="${l.href}" class="portal-chip">${l.label}</a>`).join('')}
        </div>
        <div class="nav-end">
          <a href="book.html" class="btn btn-primary nav-cta">Book a trip</a>
        </div>
      </div>
    </div>`;
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-panel');
  toggle?.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

export function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <strong>Gulf Coast Charters Network</strong>
          <p>Premier all-activities outdoor hub for the Alabama Gulf Coast — marina-style guest UX, owned inventory spine, once-in-a-lifetime guest care.</p>
          <p class="muted" style="font-size:0.8rem;margin-top:0.75rem">Gulf Shores 36542 · Orange Beach 36561<br/>Fort Morgan · Perdido</p>
        </div>
        <div class="footer-cols">
          <div>
            <h4>Experience</h4>
            <a href="trips.html?group=fishing">Fishing</a>
            <a href="trips.html?group=adventures">Adventures</a>
            <a href="trips.html?group=watersports">Watersports</a>
            <a href="trips.html?category=private">Private yacht</a>
            <a href="book.html">Book a hold</a>
            <a href="itinerary.html">Guest itinerary</a>
          </div>
          <div>
            <h4>Network</h4>
            <a href="captains.html">Captains</a>
            <a href="fleet.html">Fleet</a>
            <a href="operators.html">Join the Network</a>
            <a href="about.html">About</a>
            <a href="safety.html">Safety &amp; Weather</a>
            <a href="reviews.html">Reviews</a>
          </div>
          <div>
            <h4>Portals</h4>
            <a href="captain-portal.html">Captain Portal</a>
            <a href="operator-packet.html">Operator packet</a>
            <a href="admin.html">Network Admin</a>
            <a href="faq.html">FAQ</a>
            <a href="what-to-bring.html">What to Bring</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
      </div>
      <p class="footer-sister">
        <span class="footer-sister-label">Sister brand</span>
        <a href="https://mightyorganix-dev.github.io/gulf-coast-spearfishing/" rel="noopener noreferrer">Gulf Coast Spearfishing</a>
        <span class="footer-sister-note">Premier spear specialist — purpose-built vessels &amp; dive stewardship</span>
      </p>
      <div class="footer-bottom">
        <span>&copy; 2026 Gulf Coast Charters Network · Alabama Gulf Coast</span>
        <span class="notice-tag">Owned inventory · Direct web primary</span>
      </div>
    </div>`;
}

export function tripCard(t) {
  const op = store.getOperatorById(t.operatorId);
  const marina = store.getMarinaById(t.marinaId);
  const src = imgSrc(t.image);
  const per = t.pricePer ? ` / ${t.pricePer}` : ' / trip';
  return `
    <a class="card listing-card" href="trip.html?id=${encodeURIComponent(t.id)}">
      <div class="listing-media" style="--hue:195">${src ? `<img class="listing-photo" src="${src}" alt="">` : ''}</div>
      <div class="card-kicker">${categoryLabel(t.category)} · ${marina?.city || 'Gulf Coast'}</div>
      <h3>${t.title}</h3>
      <p>${t.subtitle}</p>
      <div class="meta-chips">
        <span>From ${money(t.basePrice)}${per}</span>
        <span>${t.durationHours}h</span>
        <span>Up to ${t.maxParty}</span>
      </div>
      <p class="muted" style="font-size:0.78rem;margin:0.55rem 0 0.5rem">${op?.name || ''}</p>
      <div class="row-between">
        <strong style="color:var(--sand)">${money(t.basePrice)}<span class="muted" style="font-weight:400">${per}</span></strong>
        <span class="card-link">View</span>
      </div>
    </a>`;
}

export function captainCard(o) {
  const marina = store.getMarinaById(o.marinaId);
  return `
    <a class="card" href="captain.html?id=${encodeURIComponent(o.id)}" style="display:flex;gap:1rem;align-items:flex-start">
      <img class="avatar" src="${imgSrc(o.avatar)}" alt="">
      <div>
        <div class="card-kicker">${(o.specialty || []).slice(0, 2).map(categoryLabel).join(' · ')}</div>
        <h3 style="font-size:1.25rem;margin:0 0 0.25rem">${o.name}</h3>
        <p style="margin:0 0 0.4rem;font-size:0.88rem">${o.company} · ${marina?.name || ''}</p>
        <p style="margin:0;font-size:0.82rem">${o.rating} ★ · ${o.reviewCount || 0} reviews · ${o.experienceYears} yrs</p>
        <span class="card-link" style="display:inline-block;margin-top:0.65rem">Captain profile</span>
      </div>
    </a>`;
}

export function stars(n) {
  const full = Math.round(Number(n) || 0);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}

export function initLayout(active = '') {
  void store;
  renderNav(active);
  renderFooter();
}
