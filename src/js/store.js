import seed from '../data/seed.json';

const KEYS = {
  operators: 'gccn_operators',
  boats: 'gccn_boats',
  trips: 'gccn_trips',
  bookings: 'gccn_bookings',
  marinas: 'gccn_marinas',
  reviews: 'gccn_reviews',
  applications: 'gccn_applications',
  stats: 'gccn_stats',
  cx: 'gccn_cx',
  sms: 'gccn_sms',
  seed: 'gccn_seed_v2',
};

class CharterNetworkStore {
  constructor() {
    this.init();
  }

  init() {
    if (localStorage.getItem(KEYS.seed) !== '2') {
      localStorage.setItem(KEYS.operators, JSON.stringify(seed.operators));
      localStorage.setItem(KEYS.boats, JSON.stringify(seed.boats));
      localStorage.setItem(KEYS.trips, JSON.stringify(seed.trips));
      localStorage.setItem(KEYS.bookings, JSON.stringify(seed.bookings));
      localStorage.setItem(KEYS.marinas, JSON.stringify(seed.marinas));
      localStorage.setItem(KEYS.reviews, JSON.stringify(seed.reviews));
      localStorage.setItem(KEYS.applications, JSON.stringify(seed.operatorApplications || []));
      localStorage.setItem(KEYS.stats, JSON.stringify(seed.stats));
      localStorage.setItem(KEYS.cx, JSON.stringify(seed.cx));
      localStorage.setItem(KEYS.sms, JSON.stringify(seed.smsTemplates || {}));
      localStorage.setItem(KEYS.seed, '2');
    }
  }

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  }

  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  getOperators() { return this._get(KEYS.operators); }
  getOperatorById(id) {
    return this.getOperators().find((o) => String(o.id) === String(id) || o.slug === id);
  }
  getBoats() { return this._get(KEYS.boats); }
  getBoatById(id) { return this.getBoats().find((b) => String(b.id) === String(id)); }
  getTrips() { return this._get(KEYS.trips); }
  getTripById(id) { return this.getTrips().find((t) => String(t.id) === String(id)); }
  getBookings() { return this._get(KEYS.bookings); }
  getBookingById(id) {
    return this.getBookings().find((b) => String(b.id).toLowerCase() === String(id).toLowerCase());
  }
  getMarinas() { return this._get(KEYS.marinas); }
  getMarinaById(id) { return this.getMarinas().find((m) => String(m.id) === String(id)); }
  getReviews() { return this._get(KEYS.reviews); }
  getApplications() { return this._get(KEYS.applications); }
  getStats() {
    try { return JSON.parse(localStorage.getItem(KEYS.stats) || '{}'); }
    catch { return seed.stats; }
  }
  getCx() {
    try { return JSON.parse(localStorage.getItem(KEYS.cx) || '{}'); }
    catch { return seed.cx; }
  }
  getSmsTemplates() {
    try { return JSON.parse(localStorage.getItem(KEYS.sms) || '{}'); }
    catch { return seed.smsTemplates || {}; }
  }

  filterTrips({ category, marina, maxPrice, party, q } = {}) {
    return this.getTrips().filter((t) => {
      if (category && category !== 'all' && t.category !== category) return false;
      if (marina && marina !== 'all' && t.marinaId !== marina) return false;
      if (maxPrice && Number(t.basePrice) > Number(maxPrice)) return false;
      if (party && Number(t.maxParty) < Number(party)) return false;
      if (q) {
        const s = q.toLowerCase();
        const op = this.getOperatorById(t.operatorId);
        const blob = `${t.title} ${t.subtitle} ${t.category} ${t.description} ${op?.name || ''} ${op?.company || ''}`.toLowerCase();
        if (!blob.includes(s)) return false;
      }
      return true;
    });
  }

  addBooking(data) {
    const rows = this.getBookings();
    const id = 'GCCN-' + Math.floor(7800 + Math.random() * 1200);
    const row = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      weatherStatus: data.weatherStatus || 'green',
      status: data.status || 'confirmed',
      paymentStatus: data.paymentStatus || 'deposit_hold',
    };
    rows.unshift(row);
    this._set(KEYS.bookings, rows);
    return row;
  }

  updateBooking(id, updates) {
    const rows = this.getBookings();
    const i = rows.findIndex((b) => b.id === id);
    if (i < 0) return null;
    rows[i] = { ...rows[i], ...updates };
    this._set(KEYS.bookings, rows);
    return rows[i];
  }

  updateWeatherStatus(id, status) {
    return this.updateBooking(id, { weatherStatus: status, status: status === 'red' ? 'weather_hold' : 'confirmed' });
  }

  addApplication(data) {
    const rows = this.getApplications();
    const id = 'APP-' + Math.floor(1000 + Math.random() * 9000);
    const row = { ...data, id, createdAt: new Date().toISOString(), status: 'pending' };
    rows.unshift(row);
    this._set(KEYS.applications, rows);
    return row;
  }

  revenueSnapshot() {
    const res = this.getBookings().filter((b) => b.paymentStatus === 'deposit_hold' || b.status === 'confirmed');
    const gross = res.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const deposits = res.reduce((s, b) => s + (b.depositPaid || 0), 0);
    return { bookings: res.length, gross, deposits, avg: res.length ? Math.round(gross / res.length) : 0 };
  }

  fleetStats() {
    return {
      operators: this.getOperators().filter((o) => o.status === 'active').length,
      boats: this.getBoats().filter((b) => b.status === 'active').length,
      trips: this.getTrips().length,
      marinas: this.getMarinas().length,
      rating: (
        this.getOperators().reduce((s, o) => s + (o.rating || 0), 0) / Math.max(1, this.getOperators().length)
      ).toFixed(2),
    };
  }
}

window.gccnStore = new CharterNetworkStore();
export default window.gccnStore;
