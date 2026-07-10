// Vercel serverless function: receives the intake form, creates a row in the
// "Sole Frame — Client Intake" Notion database, and emails a notification.
//
// Env vars required (set in Vercel → Project → Settings → Environment Variables):
//   NOTION_TOKEN        — internal connection secret (https://app.notion.com/developers/connections)
//   NOTION_INTAKE_DB_ID — the intake database id (default below is Bryan's existing DB)
//   RESEND_API_KEY      — from resend.com, for the "new submission" email (optional — email is
//                         skipped, not fatal, if this is unset)
//   NOTIFY_EMAIL        — where the notification goes (optional — defaults to NOTIFY_EMAIL_DEFAULT below)
//   RESEND_FROM         — optional; defaults to Resend's no-signup-needed test sender, which can
//                         only deliver to the email address your Resend account was created with
//                         until you verify a sending domain. Verify a domain to notify any address.
//
// The Notion connection must be shared with the intake database (open the DB in Notion →
// ••• menu → Connections → add your connection).

const DB_ID = process.env.NOTION_INTAKE_DB_ID || '11b5d869da1448eeabbd69570c4f52c7';
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Sole Frame <onboarding@resend.dev>';
const NOTIFY_EMAIL_DEFAULT = 'mbe2011@gmail.com';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || NOTIFY_EMAIL_DEFAULT;

// helpers to build Notion typed property values
const text = (v) => (v && String(v).trim() ? { rich_text: [{ text: { content: String(v).slice(0, 2000) } }] } : { rich_text: [] });
const title = (v) => ({ title: [{ text: { content: String(v || '').slice(0, 200) } }] });
const url = (v) => ({ url: v && String(v).trim() ? String(v).trim() : null });
const email = (v) => ({ email: v && String(v).trim() ? String(v).trim() : null });
const phone = (v) => ({ phone_number: v && String(v).trim() ? String(v).trim() : null });
const select = (name) => ({ select: name ? { name } : null });
const date = (iso) => ({ date: { start: iso } });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: 'Server not configured: NOTION_TOKEN missing.' });
  }

  const d = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // honeypot — bots fill the hidden "company" field; silently accept and drop
  if (d.company) return res.status(200).json({ ok: true });

  // minimal validation
  for (const f of ['photographerName', 'businessName', 'email', 'specialty', 'homeMarket']) {
    if (!d[f] || !String(d[f]).trim()) {
      return res.status(400).json({ error: `Missing required field: ${f}` });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Short lead-capture form only — the deep-intake fields (pillars, voice, credential, etc.)
  // are still valid Notion columns, filled in on the same row after the call, not sent here.
  const properties = {
    'Photographer Name': title(d.photographerName),
    'Business Name': text(d.businessName),
    'Email': email(d.email),
    'Phone': phone(d.phone),
    'Specialty': text(d.specialty),
    'Booking Link': url(d.bookingLink),
    'Home Market': text(d.homeMarket),
    'Notes': text(d.notes),
    'Onboarding Status': select('New'),
    'Signed Up': date(today),
  };

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: DB_ID }, properties, icon: { emoji: '📸' } }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Notion error', r.status, detail);
      return res.status(502).json({ error: 'Could not save submission.' });
    }

    const created = await r.json();
    // Notification is best-effort: a broken/missing email setup must never fail the submission,
    // since the row is already safely saved in Notion at this point.
    await notify(d, created.url).catch((err) => console.error('notify error', err));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('intake handler error', err);
    return res.status(500).json({ error: 'Unexpected error saving submission.' });
  }
}

async function notify(d, notionUrl) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping notification email.');
    return;
  }

  const subject = `New Sole Frame lead: ${d.photographerName} (${d.homeMarket || 'city n/a'}) — wants a call`;
  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p><strong>${escapeHtml(d.photographerName)}</strong> requested a call about ${escapeHtml(d.homeMarket)}.</p>
      <table cellpadding="4" style="border-collapse:collapse">
        <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(d.phone || '—')}</td></tr>
        <tr><td><strong>Business</strong></td><td>${escapeHtml(d.businessName)}</td></tr>
        <tr><td><strong>Specialty</strong></td><td>${escapeHtml(d.specialty)}</td></tr>
        <tr><td><strong>Home market</strong></td><td>${escapeHtml(d.homeMarket)}</td></tr>
        <tr><td><strong>Booking link</strong></td><td>${escapeHtml(d.bookingLink || '—')}</td></tr>
      </table>
      ${d.notes ? `<p><strong>Notes:</strong> ${escapeHtml(d.notes)}</p>` : ''}
      <p><a href="${notionUrl}">Open the row in Notion →</a></p>
      <p style="color:#666;font-size:13px">Next: reach out, have the call, mark the row "Contacted."
      The deep intake (pillars, voice, credential) happens on the call — use intake-questionnaire.md
      as the script, then fill it into this same row before invoicing.</p>
    </div>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [NOTIFY_EMAIL], subject, html }),
  });

  if (!r.ok) {
    console.error('Resend error', r.status, await r.text());
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
