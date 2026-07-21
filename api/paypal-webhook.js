// Vercel serverless function: receives PayPal subscription webhooks and reacts to lapses.
// On a cancel / suspend / payment-failed / expired event it finds the matching city in the
// "Sole Frame — Territory Registry" Notion database (matched on the "PayPal Subscription ID"
// property), flips that city's Status to Open, notes the lapse, and emails Bryan to revoke the
// client's Notion access. Renewal payments bump the "Paid Through" date.
//
// IMPORTANT: the Notion API cannot remove a guest's access to a page — sharing is UI-only. So this
// function reopens the market automatically, but the actual "remove the guest from the tracker"
// click stays a manual step. The lapse email is the prompt to do it.
//
// Env vars required (Vercel → Project → Settings → Environment Variables):
//   NOTION_TOKEN          — internal connection secret; the connection must be shared with the
//                           Territory Registry (open the DB in Notion → ••• → Connections → add it)
//   NOTION_REGISTRY_DB_ID — the registry database id (default below is Bryan's existing DB)
//   PAYPAL_CLIENT_ID      — from the PayPal app (developer.paypal.com → Apps & Credentials)
//   PAYPAL_SECRET         — from the same PayPal app
//   PAYPAL_WEBHOOK_ID     — the id PayPal assigns when you register this webhook URL
//   PAYPAL_ENV            — 'live' or 'sandbox' (default 'live')
//   RESEND_API_KEY        — optional; lapse email is skipped (not fatal) if unset
//   NOTIFY_EMAIL          — optional; where the lapse email goes (default below)
//   RESEND_FROM           — optional; defaults to Resend's test sender
//
// Each client's registry row must carry their PayPal Subscription ID (the "I-XXXX" id) in the
// "PayPal Subscription ID" property, or a lapse can't be matched to a city.

const DB_ID = process.env.NOTION_REGISTRY_DB_ID || 'b8002c3fcaa24c08bd20e85f2d16f723';
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_BASE = (process.env.PAYPAL_ENV || 'live') === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Sole Frame <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'mbe2011@gmail.com';

// Events that mean the seat is no longer being paid for.
const LAPSE_EVENTS = new Set([
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'BILLING.SUBSCRIPTION.EXPIRED',
  'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
]);
// A successful recurring charge — used only to advance the Paid Through date.
const RENEWAL_EVENTS = new Set(['PAYMENT.SALE.COMPLETED']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!NOTION_TOKEN || !PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PAYPAL_WEBHOOK_ID) {
    console.error('paypal-webhook: missing required env vars');
    return res.status(500).json({ error: 'Server not configured.' });
  }

  const event = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  try {
    const token = await paypalToken();

    // Never trust an unverified webhook — anyone could POST here otherwise.
    const verified = await verifySignature(req.headers, event, token);
    if (!verified) {
      console.error('paypal-webhook: signature verification failed', event.id);
      return res.status(400).json({ error: 'Invalid signature.' });
    }

    const type = event.event_type;

    if (LAPSE_EVENTS.has(type)) {
      const subId = event.resource && event.resource.id; // "I-XXXXXXXX" for subscription events
      await handleLapse(subId, type);
    } else if (RENEWAL_EVENTS.has(type)) {
      const subId = event.resource && event.resource.billing_agreement_id; // sale carries the sub id here
      await handleRenewal(subId);
    }
    // Any other event type is acknowledged and ignored.

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('paypal-webhook handler error', err);
    // 500 so PayPal retries — better a retry than a silently dropped lapse.
    return res.status(500).json({ error: 'Unexpected error.' });
  }
}

async function handleLapse(subId, type) {
  if (!subId) return;
  const row = await findRegistryRow(subId);
  if (!row) {
    console.error('paypal-webhook: no registry row for subscription', subId, `(${type})`);
    return;
  }

  const city = plain(row.properties.City && row.properties.City.title);
  const heldBy = plain(row.properties['Held by'] && row.properties['Held by'].rich_text) || 'unknown';
  const today = new Date().toISOString().slice(0, 10);
  const reason = type.replace('BILLING.SUBSCRIPTION.', '').toLowerCase();
  const priorNotes = plain(row.properties.Notes && row.properties.Notes.rich_text);
  const note = `LAPSED ${today} (${reason}) — market reopened; revoke ${heldBy}'s Notion access.`
    + (priorNotes ? `\n---\n${priorNotes}` : '');

  await notionPatch(`/v1/pages/${row.id}`, {
    properties: {
      Status: { select: { name: 'Open' } },
      Notes: { rich_text: [{ text: { content: note.slice(0, 2000) } }] },
    },
  });

  await emailLapse(city, heldBy, reason, row.url).catch((e) => console.error('lapse email error', e));
}

async function handleRenewal(subId) {
  if (!subId) return;
  const row = await findRegistryRow(subId);
  if (!row) return; // renewal for a sub we don't track — ignore quietly
  // Next month, roughly — this is a soft "paid at least through" marker, not an exact billing date.
  const through = new Date();
  through.setDate(through.getDate() + 31);
  await notionPatch(`/v1/pages/${row.id}`, {
    properties: { 'Paid Through': { date: { start: through.toISOString().slice(0, 10) } } },
  });
}

// ---- PayPal ----

async function paypalToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const r = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!r.ok) throw new Error(`PayPal token ${r.status}: ${await r.text()}`);
  return (await r.json()).access_token;
}

async function verifySignature(headers, event, token) {
  const r = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: event,
    }),
  });
  if (!r.ok) {
    console.error('verify-webhook-signature', r.status, await r.text());
    return false;
  }
  return (await r.json()).verification_status === 'SUCCESS';
}

// ---- Notion ----

async function findRegistryRow(subId) {
  const data = await notionPost(`/v1/databases/${DB_ID}/query`, {
    filter: { property: 'PayPal Subscription ID', rich_text: { equals: subId } },
    page_size: 1,
  });
  return data.results && data.results[0];
}

async function notionPost(path, body) {
  return notionFetch('POST', path, body);
}
async function notionPatch(path, body) {
  return notionFetch('PATCH', path, body);
}
async function notionFetch(method, path, body) {
  const r = await fetch(`https://api.notion.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Notion ${method} ${path} ${r.status}: ${await r.text()}`);
  return r.json();
}

// ---- email ----

async function emailLapse(city, heldBy, reason, notionUrl) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping lapse email.');
    return;
  }
  const subject = `⚠️ Seat lapsed: ${city || 'unknown city'} — revoke Notion access`;
  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p><strong>${escapeHtml(city || 'A city')}</strong> just lapsed (${escapeHtml(reason)}). The market
      has been reopened in the Territory Registry automatically.</p>
      <p><strong>Manual step still needed:</strong> remove <strong>${escapeHtml(heldBy)}</strong> from
      their Notion tracker (open the tracker → ••• → Connections/Share → remove the guest). The Notion
      API can't do this for you.</p>
      <p><a href="${escapeHtml(notionUrl || '')}">Open the registry row →</a></p>
    </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: RESEND_FROM, to: [NOTIFY_EMAIL], subject, html }),
  });
  if (!r.ok) console.error('Resend error', r.status, await r.text());
}

// ---- helpers ----

function plain(rich) {
  if (!Array.isArray(rich)) return '';
  return rich.map((t) => t.plain_text || (t.text && t.text.content) || '').join('');
}
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
