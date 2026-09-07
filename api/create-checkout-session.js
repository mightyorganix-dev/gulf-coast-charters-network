/**
 * Vercel Node serverless — Stripe Checkout Session (buyer/seller retainer or booking hold).
 * Secret: STRIPE_SECRET_KEY in Vercel env. enabled:false on client until live.
 */
const ALLOWED_ORIGINS = [
  'https://gulfcoastcharters.example',
  'https://www.gulfcoastcharters.example',
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith('.vercel.app')) return true;
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return true;
  } catch { /* ignore */ }
  return false;
}

function corsHeaders(req) {
  const origin = req.headers.origin || '';
  const allow = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function send(res, status, data, extraHeaders = {}) {
  res.statusCode = status;
  Object.entries(extraHeaders).forEach(([k, v]) => res.setHeader(k, v));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return null; }
  }
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(req.body)) {
    try { return JSON.parse(req.body.toString('utf8') || '{}'); } catch { return null; }
  }
  return req.body;
}

module.exports = async function handler(req, res) {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    res.end();
    return;
  }
  if (req.method === 'GET') {
    send(res, 200, { ok: true, service: 'gulf-coast-charters-network-checkout' }, cors);
    return;
  }
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed' }, cors);
    return;
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || /REPLACE|YOUR_/i.test(secret)) {
    send(res, 500, { error: 'STRIPE_SECRET_KEY is not configured.' }, cors);
    return;
  }
  const body = parseBody(req);
  if (body == null) {
    send(res, 400, { error: 'Invalid JSON body.' }, cors);
    return;
  }
  const {
    customerEmail, customerName, amount, productName, successPath, cancelPath, siteOrigin: bodySiteOrigin, metadata = {},
  } = body;
  const deposit = Number(amount);
  if (!customerEmail || !Number.isFinite(deposit) || deposit <= 0) {
    send(res, 400, { error: 'customerEmail and positive amount required.' }, cors);
    return;
  }
  const amountCents = Math.round(deposit * 100);
  if (amountCents < 50) {
    send(res, 400, { error: 'Amount must be at least $0.50 USD.' }, cors);
    return;
  }
  const siteOrigin = (process.env.SITE_ORIGIN || bodySiteOrigin || (req.headers.origin ? String(req.headers.origin) : '') || '').replace(/\/$/, '');
  const success = successPath || '/itinerary.html';
  const cancel = cancelPath || '/book.html';
  const successUrl = siteOrigin
    ? `${siteOrigin}${success.startsWith('/') ? success : `/${success}`}?session_id={CHECKOUT_SESSION_ID}`
    : `${success}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = siteOrigin ? `${siteOrigin}${cancel.startsWith('/') ? cancel : `/${cancel}`}` : cancel;

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', successUrl);
  params.set('cancel_url', cancelUrl);
  params.set('customer_email', String(customerEmail));
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][unit_amount]', String(amountCents));
  params.set('line_items[0][price_data][product_data][name]', productName || 'Gulf Coast Charters Network deposit');
  params.set('line_items[0][price_data][product_data][description]', `Retainer / hold for ${customerName || 'client'}`);
  Object.entries(metadata || {}).forEach(([k, v]) => params.set(`metadata[${k}]`, String(v)));

  let stripeRes;
  try {
    stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  } catch (err) {
    send(res, 502, { error: 'Could not reach Stripe API.', details: String(err?.message || err) }, cors);
    return;
  }
  const session = await stripeRes.json().catch(() => ({}));
  if (!stripeRes.ok) {
    send(res, stripeRes.status >= 400 ? stripeRes.status : 502, { error: session?.error?.message || 'Stripe failed.' }, cors);
    return;
  }
  send(res, 200, { id: session.id, url: session.url }, cors);
};
