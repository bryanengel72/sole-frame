// Vercel serverless function: receives the deep-intake form (onboarding.html) and writes
// pillars, voice anchors, session model, and GBP details into the SAME Notion row created by
// the short lead-capture form (api/intake.js), matched by email. This is the self-serve
// replacement for the operator manually transcribing a call into client-profile.md — send a
// paid client this link and their answers land directly in the row you build their profile from.
//
// Env vars: same as api/intake.js (NOTION_TOKEN, NOTION_INTAKE_DB_ID, RESEND_API_KEY,
// NOTIFY_EMAIL, RESEND_FROM). No new configuration needed if intake.js is already working.

const DB_ID = process.env.NOTION_INTAKE_DB_ID || '11b5d869da1448eeabbd69570c4f52c7';
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Sole Frame <onboarding@resend.dev>';
const NOTIFY_EMAIL_DEFAULT = 'mbe2011@gmail.com';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || NOTIFY_EMAIL_DEFAULT;

// Onboarding Status is a Notion select with these options, in pipeline order (ONBOARDING.md).
// A submission here only ever moves status FORWARD — never regresses a client who's already
// further along (e.g. re-submitting after "Live" must not knock them back to "Profile Built").
const STATUS_ORDER = ['New', 'Contacted', 'Invoice Sent', 'Paid', 'Profile Built', 'Skill Shipped', 'Live'];
const TARGET_STATUS = 'Profile Built';

const text = (v) => ({ rich_text: [{ text: { content: String(v).slice(0, 2000) } }] });
const title = (v) => ({ title: [{ text: { content: String(v || '').slice(0, 200) } }] });
const url = (v) => ({ url: String(v).trim() });
const multiSelect = (arr) => ({ multi_select: arr.map((name) => ({ name })) });
const select = (name) => ({ select: { name } });

// Only include a property if the field actually has a value — an update must never overwrite
// previously saved answers with blanks just because this submission left a field empty (someone
// filling the form in more than one sitting, or only updating one section later).
function setIfPresent(properties, key, value, builder) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    if (value.length) properties[key] = builder(value);
    return;
  }
  if (String(value).trim()) properties[key] = builder(String(value).trim());
}

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

  if (!d.email || !String(d.email).trim()) {
    return res.status(400).json({ error: 'Missing required field: email' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (!d.businessName || !String(d.businessName).trim()) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }

  const properties = {};
  setIfPresent(properties, 'Business Name', d.businessName, text);
  setIfPresent(properties, 'County', d.county, text);
  setIfPresent(properties, 'Metro', d.metro, text);
  setIfPresent(properties, 'Metro Shorthand', d.metroShorthand, text);
  setIfPresent(properties, 'Service-Area Cities', d.serviceAreaCities, text);
  setIfPresent(properties, 'Session Types', d.sessionTypes, multiSelect);
  setIfPresent(properties, 'Never Depict', d.neverDepict, text);
  setIfPresent(properties, 'Growth or Premium Angle', d.growthAngle, text);
  setIfPresent(properties, 'Credential', d.credential, text);
  setIfPresent(properties, 'Credential Meaning', d.credentialMeaning, text);
  setIfPresent(properties, 'Pillar 1', d.pillar1, text);
  setIfPresent(properties, 'Pillar 2', d.pillar2, text);
  setIfPresent(properties, 'Pillar 3', d.pillar3, text);
  setIfPresent(properties, 'Pillar 4', d.pillar4, text);
  setIfPresent(properties, 'Pillar 5', d.pillar5, text);
  setIfPresent(properties, 'Growth Priority Pillars', d.growthPriorityPillars, text);
  setIfPresent(properties, 'Audience Clusters', d.audienceClusters, text);
  setIfPresent(properties, 'Voice - Origin', d.voiceOrigin, text);
  setIfPresent(properties, 'Voice - Nervous Client Line', d.voiceNervousLine, text);
  setIfPresent(properties, 'Voice - Session Story', d.voiceSessionStory, text);
  setIfPresent(properties, 'Voice - Industry Opinion', d.voiceIndustryOpinion, text);
  setIfPresent(properties, 'Voice - Tone', d.voiceTone, text);
  setIfPresent(properties, 'GBP Listing URL', d.gbpListingUrl, url);
  setIfPresent(properties, 'GBP Primary Category', d.gbpPrimaryCategory, text);
  setIfPresent(properties, 'GBP Services', d.gbpServices, text);
  setIfPresent(properties, 'GBP Standing Offers', d.gbpStandingOffers, text);
  setIfPresent(properties, 'GBP Photo Categories', d.gbpPhotoCategories, text);
  setIfPresent(properties, 'GBP Attributes', d.gbpAttributes, text);

  try {
    const existing = await findRowByEmail(String(d.email).trim());

    if (existing) {
      const currentStatus = existing.properties?.['Onboarding Status']?.select?.name;
      const advanced = nextStatus(currentStatus);
      if (advanced) properties['Onboarding Status'] = select(advanced);

      const r = await fetch(`https://api.notion.com/v1/pages/${existing.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
      if (!r.ok) {
        const detail = await r.text();
        console.error('Notion update error', r.status, detail);
        return res.status(502).json({ error: 'Could not save your answers.' });
      }
      const updated = await r.json();
      await notify(d, updated.url, 'updated').catch((err) => console.error('notify error', err));
      return res.status(200).json({ ok: true });
    }

    // No matching row — this client never went through the short intake form. Create one now
    // so their deep answers aren't lost, using their name/business as the title.
    properties['Photographer Name'] = title(d.photographerName || d.businessName);
    properties['Business Name'] = text(d.businessName);
    properties['Email'] = { email: String(d.email).trim() };
    properties['Onboarding Status'] = select(TARGET_STATUS);
    properties['Signed Up'] = { date: { start: new Date().toISOString().slice(0, 10) } };

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
      console.error('Notion create error', r.status, detail);
      return res.status(502).json({ error: 'Could not save your answers.' });
    }
    const created = await r.json();
    await notify(d, created.url, 'created (no prior lead row found)').catch((err) => console.error('notify error', err));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('onboarding handler error', err);
    return res.status(500).json({ error: 'Unexpected error saving your answers.' });
  }
}

async function findRowByEmail(email) {
  const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'Email', email: { equals: email } },
      page_size: 1,
    }),
  });
  if (!r.ok) {
    const detail = await r.text();
    console.error('Notion query error', r.status, detail);
    throw new Error('Could not look up existing submission.');
  }
  const data = await r.json();
  return data.results && data.results[0] ? data.results[0] : null;
}

function nextStatus(current) {
  const targetIdx = STATUS_ORDER.indexOf(TARGET_STATUS);
  const currentIdx = STATUS_ORDER.indexOf(current);
  if (currentIdx === -1) return TARGET_STATUS; // blank or unrecognized — set it
  if (currentIdx >= targetIdx) return null; // already this far or further — don't touch it
  return TARGET_STATUS;
}

async function notify(d, notionUrl, action) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping notification email.');
    return;
  }

  const subject = `Deep intake ${action.startsWith('updated') ? 'updated' : 'received'}: ${d.businessName} — ready to build`;
  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p><strong>${escapeHtml(d.businessName)}</strong> (${escapeHtml(d.email)}) submitted the deep intake form.</p>
      <p style="color:#666;font-size:13px">Row was ${escapeHtml(action)}.</p>
      <p><a href="${notionUrl}">Open the row in Notion →</a></p>
      <p style="color:#666;font-size:13px">Next: read the row, fill client-profile.md, generate voice-persona.md and
      topic-bank.md (ONBOARDING.md Step 4), then create the Blog Tracker if not done yet.</p>
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
