/**
 * VALMEX – API de administrare pentru cererile primite (script SEPARAT de cel care salvează cererile).
 * Citește foaia Google Sheet în care scriptul existent salvează cererile și permite panoului să le afișeze
 * și să schimbe statusul. Nu modifică scriptul tău existent.
 *
 * INSTALARE
 * 1) script.google.com → Proiect nou. Lipește acest cod.
 * 2) Pune mai jos ID-ul Sheet-ului (partea dintre /d/ și /edit din URL-ul foii).
 * 3) Proiect → Setări → Proprietăți script → adaugă ADMIN_KEY = o parolă lungă, aleatoare (minim 24 de caractere).
 * 4) Deploy → Implementare nouă → Tip: Aplicație web → Execută ca: Eu → Acces: Oricine. Copiază adresa care se termină în /exec.
 * 5) În panou: Cereri primite → lipește adresa /exec și ADMIN_KEY.
 * Cheia nu se salvează în panou. Cine nu are cheia nu primește nimic. Dacă o crezi compromisă, schimb-o aici.
 */
const SHEET_ID = 'PUNE_AICI_ID_SHEET';
const SHEET_NAME = '';        // gol = prima foaie
const MAX_ROWS = 2000;
const STATUS_HEADER = 'Status';

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sheet_() { const ss = SpreadsheetApp.openById(SHEET_ID); return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0]; }
function statusCol_(sh) {
  const last = Math.max(1, sh.getLastColumn());
  const h = sh.getRange(1, 1, 1, last).getValues()[0].map(String);
  let i = h.indexOf(STATUS_HEADER);
  if (i < 0) { i = h.length; sh.getRange(1, i + 1).setValue(STATUS_HEADER); }
  return i + 1;
}
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
    if (!key || key.length < 12 || body.key !== key) return out_({ ok: false, error: 'unauthorized' });
    const sh = sheet_();
    if (body.action === 'list') {
      const sc = statusCol_(sh);
      const last = sh.getLastRow(), cols = sh.getLastColumn();
      if (last < 2) return out_({ ok: true, headers: sh.getRange(1, 1, 1, cols).getValues()[0].map(String), rows: [] });
      const first = Math.max(2, last - MAX_ROWS + 1);
      const headers = sh.getRange(1, 1, 1, cols).getValues()[0].map(String);
      const vals = sh.getRange(first, 1, last - first + 1, cols).getValues();
      const rows = vals.map(function (r, i) { return { row: first + i, cells: r.map(function (c) { return c instanceof Date ? c.toISOString() : String(c); }) }; });
      return out_({ ok: true, headers: headers, rows: rows });
    }
    if (body.action === 'status') {
      const row = parseInt(body.row, 10), val = String(body.value || '').slice(0, 40);
      if (!(row >= 2)) return out_({ ok: false, error: 'rând invalid' });
      sh.getRange(row, statusCol_(sh)).setValue(val);
      return out_({ ok: true });
    }
    return out_({ ok: false, error: 'acțiune necunoscută' });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}
