/**
 * Madhura Mavericks War Room – data API (read-only)
 * Reads the KNPL-7 registration sheet and returns only cricket data
 * (no phone numbers, house names or sub-community).
 *
 * Setup (one time):
 *  1. script.google.com → New project → paste this file.
 *  2. Project Settings → Script properties → add  ACCESS_CODE = <your private code>
 *  3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 *  4. Copy the Web app URL into the War Room (Setup & Data → Connect data).
 */
const SHEET_ID = '1yLTJPg-2sh2xjuF8jVH6imyHxF99tVRmd8RvdStvZpw';
const LEAGUES = ['SPL-6','SPL-7','SPL-8','CBL-4','CBL-5','CBL-6','NPL-3','NPL-4','NPL-5','KNPL-4','KNPL-5','KNPL-6','YPL-14','YPL-15','YPL-16'];

function doGet(e) {
  const code = (e && e.parameter && e.parameter.code) || '';
  const expected = PropertiesService.getScriptProperties().getProperty('ACCESS_CODE');
  if (!expected || code !== expected) return json_({ ok: false, error: 'bad_code' });

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const reg = ss.getSheetByName('Registrations').getDataRange().getValues();
  const head = reg[0].map(String);
  const col = name => head.indexOf(name);
  const c = {
    id: col('Reg ID'), name: col('Player Name'), district: col('District'), qual: col('Qualifying Seasons Played'),
    status: col('Status'), rating: col('Skill Rating'), cat: col('Category'), pref: col('Preferred Team'),
    legacy: col('KNPL Legacy Seasons'), owner: col('Owner Franchise')
  };
  const teamCols = LEAGUES.map(L => col(L + ' Team'));

  const ps = ss.getSheetByName('Player Stats').getDataRange().getValues();
  const ph = ps[0].map(String), pc = n => ph.indexOf(n);
  const s = {
    id: pc('KNPL ID'), type: pc('BAT / BOWL TYPE (CricHeroes)'), mvp: pc('TOTAL MVP POINTS'), mvpM: pc('TOTAL MVP MATCHES'),
    m: pc('TOTAL MATCHES'), runs: pc('TOTAL RUNS'), avg: pc('BATTING AVERAGE'), hs: pc('HIGHEST SCORE'), f4: pc('TOTAL FOURS'),
    s6: pc('TOTAL SIXES'), f50: pc("NUMBER OF 50's"), h100: pc("NUMBER OF 100's"), wk: pc('TOTAL WICKETS'), ov: pc('TOTAL OVERS BOWLED'), ct: pc('TOTAL CATCHES')
  };
  const stats = {};
  ps.slice(1).forEach(r => {
    const id = String(r[s.id] || '').trim(); if (!id) return;
    stats[id] = { type: r[s.type], mvp: r[s.mvp], mvpM: r[s.mvpM], m: r[s.m], runs: r[s.runs], avg: r[s.avg], hs: r[s.hs], f4: r[s.f4],
      s6: r[s.s6], f50: r[s.f50], h100: r[s.h100], wk: r[s.wk], ov: String(r[s.ov]), ct: r[s.ct] };
  });

  const players = reg.slice(1).filter(r => /^KNPL7-/.test(String(r[c.id]))).map(r => {
    const leagues = {}; LEAGUES.forEach((L, k) => { const v = teamCols[k] >= 0 ? String(r[teamCols[k]] || '').trim() : ''; if (v) leagues[L] = v; });
    const id = String(r[c.id]).trim();
    return { id, name: String(r[c.name] || '').trim(), district: String(r[c.district] || '').trim(), leagues,
      qual: String(r[c.qual] || ''), regStatus: String(r[c.status] || ''), rating: r[c.rating], cat: String(r[c.cat] || ''),
      prefTeam: String(r[c.pref] || ''), legacy: String(r[c.legacy] || ''), ownerOf: String(r[c.owner] || ''), stats: stats[id] || null };
  });
  return json_({ ok: true, at: new Date().toISOString(), players });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
