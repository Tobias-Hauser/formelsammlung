/* Formelsammlung Mechatronik: Tabellen und Werkzeuge
   Passungsrechner (ISO 286), Zahlensysteme, Schrauben, Kabelbelastbarkeit, Werkstoffkennwerte.
   Alle Tabellenwerte sind Richtwerte, maßgeblich sind die jeweiligen Normen. */
(function () {
  'use strict';
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const de = (x, st) => Number(x).toLocaleString('de-DE', { maximumFractionDigits: st === undefined ? 2 : st, minimumFractionDigits: 0 });
  const vz = x => (x > 0 ? '+' : x < 0 ? '−' : '±') + Math.abs(x);
  const auswahl = (opts, wert) => {
    const s = el('select', 'wz-select');
    for (const o of opts) { const op = el('option', '', Array.isArray(o) ? o[1] : o); op.value = Array.isArray(o) ? o[0] : o; s.appendChild(op); }
    if (wert !== undefined) s.value = wert;
    return s;
  };
  const feld = (label, inhalt) => { const f = el('label', 'wz-feld', `<span>${label}</span>`); f.appendChild(inhalt); return f; };
  const lies = (k, d) => { try { const s = JSON.parse(localStorage.getItem('fs-wz') || '{}'); return k in s ? s[k] : d; } catch (e) { return d; } };
  const schreib = (k, v) => { try { const s = JSON.parse(localStorage.getItem('fs-wz') || '{}'); s[k] = v; localStorage.setItem('fs-wz', JSON.stringify(s)); } catch (e) { /* egal */ } };

  /* =====================================================================
     1. Passungsrechner nach ISO 286
     ===================================================================== */
  const GR = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500];
  const IT = {
    5: [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    6: [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7: [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8: [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9: [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
    10: [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
    11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
    12: [100, 120, 150, 180, 210, 250, 300, 350, 400, 460, 520, 570, 630]
  };
  // Grundabmaße Welle: es (oben) für d bis h, ei (unten) für k bis p
  const ES_W = {
    d: [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230],
    e: [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
    f: [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
    g: [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
    h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
  const EI_W = {
    k: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],
    m: [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
    n: [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
    p: [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68]
  };
  const FEIN = [3, 6, 10, 18, 30, 50, 65, 80, 100, 120, 140, 160, 180, 200, 225, 250, 280, 315, 355, 400, 450, 500];
  const EI_FEIN = {
    r: [10, 15, 19, 23, 28, 34, 41, 43, 51, 54, 63, 65, 68, 77, 80, 84, 94, 98, 108, 114, 126, 132],
    s: [14, 19, 23, 28, 35, 43, 53, 59, 71, 79, 92, 100, 108, 122, 130, 140, 158, 170, 190, 208, 232, 252]
  };
  const BOHRUNGEN = ['D9', 'D10', 'E8', 'E9', 'F7', 'F8', 'G6', 'G7', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'JS6', 'JS7', 'K6', 'K7', 'K8', 'M6', 'M7', 'M8', 'N6', 'N7', 'N8', 'P6', 'P7', 'R7', 'S7'];
  const WELLEN = ['d9', 'd10', 'e7', 'e8', 'e9', 'f6', 'f7', 'f8', 'g5', 'g6', 'h5', 'h6', 'h7', 'h8', 'h9', 'h11', 'js5', 'js6', 'js7', 'k5', 'k6', 'k7', 'm5', 'm6', 'n5', 'n6', 'p6', 'r6', 's6'];
  const PASSUNGEN = [
    ['H7', 's6', 'Übermaß: Pressverband, Lagerbuchsen und Zahnkränze einpressen, nur mit Presse oder Erwärmen fügbar.'],
    ['H7', 'r6', 'Übermaß: Buchsen, Kupplungsnaben, Zahnräder fest auf Wellen.'],
    ['H7', 'n6', 'Übergang mit meist Übermaß: Zahnräder, Kupplungen, Buchsen, mit Presse fügbar.'],
    ['H7', 'm6', 'Übergang: Riemenscheiben, Zahnräder mit Passfeder, Wälzlager-Innenring bei hoher Last.'],
    ['H7', 'k6', 'Übergang: Wälzlager-Innenring, Kupplungen, Riemenscheiben, mit Hammer fügbar.'],
    ['H7', 'js6', 'Übergang leicht: Naben, die öfter getauscht werden.'],
    ['H7', 'h6', 'Spiel nahe null: Zentrierungen, Stellringe, Teile mit Gleitsitz.'],
    ['H7', 'g6', 'Spiel eng: genaue Führungen, verschiebbare Räder, Kolben.'],
    ['H7', 'f7', 'Spiel: Gleitlager, Lagerstellen von Wellen.'],
    ['H8', 'f7', 'Spiel: Gleitlager allgemein, Kolben in Zylindern.'],
    ['H8', 'e8', 'Spiel reichlich: Lager mit mehreren Stellen, Hebellager.'],
    ['H8', 'h9', 'Spiel: Bolzen, Hebel, Teile ohne genaue Führung.'],
    ['H11', 'h11', 'Grob: Distanzbuchsen, Scharniere, Teile mit viel Spiel.'],
    ['G7', 'h6', 'Spiel eng nach System Einheitswelle: Gleitteile auf gezogenen Wellen.'],
    ['K7', 'h6', 'Übergang nach System Einheitswelle: Wälzlager-Außenring bei Punktlast.'],
    ['N7', 'h6', 'Übergang/Übermaß: Wälzlager-Außenring bei Umfangslast.']
  ];

  function bereich(N) { return GR.findIndex(x => N <= x); }
  function zerlege(t) { const m = /^([a-zA-Z]+)(\d+)$/.exec(t); return [m[1], Number(m[2])]; }

  function welle(tol, N) {
    const [b, g] = zerlege(tol), i = bereich(N), T = IT[g][i];
    let es, ei;
    if (b in ES_W) { es = ES_W[b][i]; ei = es - T; }
    else if (b === 'js') { es = T / 2; ei = -es; }
    else if (b in EI_W) { ei = b === 'k' && (g < 4 || g > 7) ? 0 : EI_W[b][i]; es = ei + T; }
    else { ei = EI_FEIN[b][FEIN.findIndex(x => N <= x)]; es = ei + T; }
    return { o: es, u: ei, T };
  }
  function bohrung(tol, N) {
    const [B, g] = zerlege(tol), b = B.toLowerCase(), i = bereich(N), T = IT[g][i];
    let ES, EI;
    if (b in ES_W) { EI = -ES_W[b][i]; ES = EI + T; }
    else if (b === 'js') { ES = T / 2; EI = -ES; }
    else {
      const ei = b in EI_W ? (b === 'k' && (g < 4 || g > 8) ? 0 : EI_W[b][i]) : EI_FEIN[b][FEIN.findIndex(x => N <= x)];
      const mitDelta = ('kmn'.includes(b) && g <= 8) || ('prs'.includes(b) && g <= 7);
      const delta = mitDelta && N > 3 ? IT[g][i] - IT[g - 1][i] : 0;
      ES = -ei + delta; EI = ES - T;
    }
    return { o: ES, u: EI, T };
  }

  function diagramm(N, bo, we, tb, tw) {
    const werte = [bo.o, bo.u, we.o, we.u, 0];
    let max = Math.max(...werte), min = Math.min(...werte);
    const pad = (max - min) * 0.15 || 10; max += pad; min -= pad;
    const H = 210, oben = 14, h = H - 2 * oben;
    const y = v => oben + (max - v) / (max - min) * h;
    const box = (x, o, u, cls, txt) => `<rect class="${cls}" x="${x}" y="${y(o)}" width="80" height="${Math.max(2, y(u) - y(o))}" rx="3"/>` +
      `<text class="wz-svg-t" x="${x + 40}" y="${(y(o) + y(u)) / 2 + 5}" text-anchor="middle">${txt}</text>` +
      `<text class="wz-svg-k" x="${x + 86}" y="${y(o) + 4}">${vz(o)}</text><text class="wz-svg-k" x="${x + 86}" y="${y(u) + 4}">${vz(u)}</text>`;
    return `<svg class="wz-svg" viewBox="0 0 340 ${H}" role="img" aria-label="Lage der Toleranzfelder">` +
      `<line class="wz-svg-null" x1="10" x2="330" y1="${y(0)}" y2="${y(0)}"/>` +
      `<text class="wz-svg-k" x="12" y="${y(0) - 5}">0</text>` +
      box(50, bo.o, bo.u, 'wz-svg-b', tb) + box(195, we.o, we.u, 'wz-svg-w', tw) +
      `</svg><p class="meta" style="margin:4px 0 0;text-align:center">Nulllinie = Nennmaß Ø ${de(N, 3)} mm, Abmaße in µm</p>`;
  }

  function passung(box) {
    let N = lies('pN', 30), tb = lies('pB', 'H7'), tw = lies('pW', 'g6');
    const nIn = el('input', 'wz-input'); nIn.inputMode = 'decimal'; nIn.value = String(N).replace('.', ',');
    const bSel = auswahl(BOHRUNGEN, tb), wSel = auswahl(WELLEN, tw);
    const form = el('div', 'wz-form');
    form.append(feld('Nennmaß in mm (bis 500)', nIn), feld('Bohrung', bSel), feld('Welle', wSel));
    const chips = el('div', 'chips wz-chips');
    for (const [b, w] of PASSUNGEN) {
      const c = el('button', 'chip', `${b}/${w}`); c.type = 'button';
      c.onclick = () => { bSel.value = b; wSel.value = w; neu(); };
      chips.appendChild(c);
    }
    const aus = el('div', 'wz-ergebnis');
    box.append(form, el('p', 'meta', 'Häufige Passungen:'), chips, aus);

    function neu() {
      N = Number(nIn.value.replace(',', '.')); tb = bSel.value; tw = wSel.value;
      aus.innerHTML = '';
      if (!(N > 0 && N <= 500)) { aus.appendChild(el('div', 'warnung', 'Bitte ein Nennmaß über 0 bis 500 mm eingeben.')); return; }
      schreib('pN', N); schreib('pB', tb); schreib('pW', tw);
      const bo = bohrung(tb, N), we = welle(tw, N);
      const Smax = bo.o - we.u, Smin = bo.u - we.o;
      let art, werte, kl;
      if (Smin >= 0) { art = 'Spielpassung'; kl = 'spiel'; werte = [['Höchstspiel P<sub>SH</sub>', Smax], ['Mindestspiel P<sub>SM</sub>', Smin]]; }
      else if (Smax <= 0) { art = 'Übermaßpassung'; kl = 'ueber'; werte = [['Höchstübermaß P<sub>ÜH</sub>', -Smin], ['Mindestübermaß P<sub>ÜM</sub>', -Smax]]; }
      else { art = 'Übergangspassung'; kl = 'ueberg'; werte = [['Höchstspiel P<sub>SH</sub>', Smax], ['Höchstübermaß P<sub>ÜH</sub>', -Smin]]; }
      const mm = x => (N + x / 1000).toFixed(3).replace('.', ',') + ' mm';
      const info = PASSUNGEN.find(p => p[0] === tb && p[1] === tw);
      const zeile = (name, t, w) => `<tr><th>${name} Ø ${de(N, 3)} ${t}</th><td>${vz(w.o)} µm</td><td>${vz(w.u)} µm</td><td>${mm(w.o)}</td><td>${mm(w.u)}</td><td>${w.T} µm</td></tr>`;
      const tab = `<div class="wz-scroll"><table class="wz-tab"><thead><tr><th></th><th>oberes Abmaß</th><th>unteres Abmaß</th><th>Höchstmaß</th><th>Mindestmaß</th><th>Toleranz</th></tr></thead>` +
        `<tbody>${zeile('Bohrung', tb, bo)}${zeile('Welle', tw, we)}</tbody></table></div>`;
      const art_ = el('div', 'wz-art ' + kl,
        `<b>${art}</b> ${werte.map(([n, x]) => `<span>${n} = <b>${x} µm</b></span>`).join('')}` + (info ? `<p>${info[2]}</p>` : ''));
      const g = el('div', 'wz-zwei');
      const links = el('div', '', tab); links.appendChild(art_);
      const ueber = el('button', 'sekundaer', 'Im Rechner weiterrechnen'); ueber.type = 'button';
      ueber.onclick = () => window.APP && window.APP.uebernehmen('passung', { NmP: N, ESb: bo.o, EIb: bo.u, esW: we.o, eiW: we.u });
      links.appendChild(ueber);
      g.append(links, el('div', 'wz-dia', diagramm(N, bo, we, tb, tw)));
      aus.appendChild(g);
    }
    nIn.addEventListener('input', neu); bSel.onchange = neu; wSel.onchange = neu;
    neu();
    box.appendChild(el('p', 'meta wz-quelle', 'Grundabmaße und Toleranzgrade nach DIN EN ISO 286-1/-2. Kontrolle im Tabellenbuch empfohlen.'));
  }

  /* =====================================================================
     2. Zahlensysteme
     ===================================================================== */
  function zahlen(box) {
    let breite = lies('zB', 16), format = lies('zF', 'dez');
    const inp = el('input', 'wz-input wz-gross'); inp.spellcheck = false; inp.autocomplete = 'off'; inp.value = lies('zW', '1234');
    const fSel = auswahl([['dez', 'Dezimal'], ['hex', 'Hexadezimal (16#)'], ['bin', 'Binär (2#)'], ['okt', 'Oktal (8#)'], ['bcd', 'BCD (als Hex geschrieben)'], ['real', 'REAL / Gleitkomma (32 bit)']], format);
    const bSel = auswahl([['8', '8 bit (BYTE, SINT)'], ['16', '16 bit (WORD, INT)'], ['32', '32 bit (DWORD, DINT, REAL)']], String(breite));
    const form = el('div', 'wz-form');
    form.append(feld('Wert', inp), feld('Eingabe ist', fSel), feld('Datenbreite', bSel));
    const warn = el('div'), bits = el('div', 'wz-bits'), aus = el('div', 'wz-scroll');
    box.append(form, el('p', 'meta', 'Präfixe wie 16#, 0x, 2# oder 0b werden erkannt. Unterstriche und Leerzeichen sind egal. Bits zum Umschalten anklicken.'), warn, bits, aus);

    const maske = () => (1n << BigInt(breite)) - 1n;
    let wert = 0n;

    function parse() {
      let s = inp.value.trim().replace(/[\s_']/g, '');
      let f = fSel.value;
      const pre = /^(16#|0x|2#|0b|8#|0o)/i.exec(s);
      if (pre) { const p = pre[1].toLowerCase(); f = p === '16#' || p === '0x' ? 'hex' : p === '2#' || p === '0b' ? 'bin' : 'okt'; s = s.slice(p.length); }
      if (s === '') return null;
      if (f === 'real') {
        const x = Number(s.replace(',', '.')); if (!isFinite(x)) return null;
        const dv = new DataView(new ArrayBuffer(4)); dv.setFloat32(0, x); return BigInt(dv.getUint32(0));
      }
      if (f === 'bcd') { if (!/^[0-9]+$/.test(s)) return null; return BigInt('0x' + s); }
      const re = { dez: /^-?[0-9]+$/, hex: /^[0-9a-f]+$/i, bin: /^[01]+$/, okt: /^[0-7]+$/ }[f];
      if (!re.test(s)) return null;
      const v = f === 'dez' ? BigInt(s) : BigInt({ hex: '0x', bin: '0b', okt: '0o' }[f] + s);
      return v;
    }
    function gruppe(s, n) { const r = []; for (let i = s.length; i > 0; i -= n) r.unshift(s.slice(Math.max(0, i - n), i)); return r.join('_'); }

    function zeigen() {
      warn.innerHTML = '';
      const B = BigInt(breite), m = maske();
      const u = wert & m;
      const signed = u >= (1n << (B - 1n)) ? u - (1n << B) : u;
      const hex = u.toString(16).toUpperCase().padStart(breite / 4, '0');
      const bin = u.toString(2).padStart(breite, '0');
      // BCD: jede Hex-Stelle muss 0..9 sein, dann ist es eine gültige BCD-Zahl
      const alsBcd = /^[0-9]+$/.test(hex) ? String(Number(hex)) : 'keine gültige BCD-Zahl';
      const dezStellen = u.toString();
      const bcdAusDez = dezStellen.length <= breite / 4 ? '16#' + dezStellen.padStart(breite / 4, '0') : 'passt nicht in ' + breite + ' bit';
      const gray = u ^ (u >> 1n);
      const bytes = []; for (let i = breite / 8 - 1; i >= 0; i--) bytes.push(Number((u >> BigInt(i * 8)) & 255n));
      const ascii = bytes.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '·').join('');
      const zeilen = [
        ['Dezimal ohne Vorzeichen', dezStellen, breite === 8 ? 'BYTE, USINT' : breite === 16 ? 'WORD, UINT' : 'DWORD, UDINT'],
        ['Dezimal mit Vorzeichen', signed.toString(), (breite === 8 ? 'SINT' : breite === 16 ? 'INT' : 'DINT') + ', Zweierkomplement'],
        ['Hexadezimal', '16#' + gruppe(hex, 4), '0x' + hex],
        ['Binär', '2#' + gruppe(bin, 4), ''],
        ['Oktal', '8#' + u.toString(8), ''],
        ['Bitmuster als BCD gelesen', alsBcd, 'z. B. Zifferneinsteller, Siemens S5TIME'],
        ['Dezimalwert als BCD', bcdAusDez, 'so muss der Wert für eine BCD-Anzeige aussehen'],
        ['Gray-Code', '2#' + gruppe(gray.toString(2).padStart(breite, '0'), 4), 'Absolutwertgeber'],
        ['Bytes (High zuerst)', bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '), 'Siemens: MW10 = MB10 (High) + MB11 (Low)'],
        ['ASCII', ascii, '']
      ];
      if (breite === 32) {
        const dv = new DataView(new ArrayBuffer(4)); dv.setUint32(0, Number(u));
        const f = dv.getFloat32(0);
        zeilen.splice(2, 0, ['REAL (IEEE 754)', isFinite(f) ? Number(f.toPrecision(8)).toLocaleString('de-DE', { maximumFractionDigits: 12, useGrouping: false }) : String(f), '1 bit Vorzeichen, 8 bit Exponent, 23 bit Mantisse']);
      }
      aus.innerHTML = `<table class="wz-tab wz-zahl"><tbody>${zeilen.map(z => `<tr><th>${z[0]}</th><td class="mono">${z[1]}</td><td class="meta">${z[2]}</td></tr>`).join('')}</tbody></table>`;

      bits.innerHTML = '';
      for (let reihe = breite / 8 - 1; reihe >= 0; reihe--) {
        const r = el('div', 'wz-byte');
        r.appendChild(el('span', 'wz-byte-n', 'Byte ' + (breite / 8 - 1 - reihe)));
        for (let i = 7; i >= 0; i--) {
          const nr = reihe * 8 + i;
          const an = ((u >> BigInt(nr)) & 1n) === 1n;
          const b = el('button', 'wz-bit' + (an ? ' an' : ''), `<small>${nr}</small>${an ? 1 : 0}`); b.type = 'button';
          b.title = 'Bit ' + nr + ' = ' + (1n << BigInt(nr)).toString();
          b.onclick = () => { wert = u ^ (1n << BigInt(nr)); schreibeEingabe(); zeigen(); };
          r.appendChild(b);
        }
        bits.appendChild(r);
      }
    }
    function schreibeEingabe() {
      const u = wert & maske(), B = BigInt(breite);
      const f = fSel.value;
      if (f === 'dez') inp.value = (u >= (1n << (B - 1n)) && inp.value.trim().startsWith('-') ? u - (1n << B) : u).toString();
      else if (f === 'hex') inp.value = u.toString(16).toUpperCase();
      else if (f === 'bin') inp.value = u.toString(2);
      else if (f === 'okt') inp.value = u.toString(8);
      else if (f === 'bcd') inp.value = u.toString(16).toUpperCase();
      else { const dv = new DataView(new ArrayBuffer(4)); dv.setUint32(0, Number(u)); inp.value = String(Number(dv.getFloat32(0).toPrecision(8))).replace('.', ','); }
      schreib('zW', inp.value);
    }
    function neu() {
      breite = Number(bSel.value); format = fSel.value;
      if (format === 'real' && breite !== 32) { breite = 32; bSel.value = '32'; }
      schreib('zB', breite); schreib('zF', format); schreib('zW', inp.value);
      const v = parse();
      if (v === null) { warn.innerHTML = '<div class="warnung">Keine gültige Zahl für dieses Format.</div>'; return; }
      const B = BigInt(breite);
      const min = -(1n << (B - 1n)), max = (1n << B) - 1n;
      wert = v < 0n ? v + (1n << B) : v;
      zeigen();
      if (v < min || v > max) warn.innerHTML = `<div class="warnung">Der Wert passt nicht in ${breite} bit (${min} bis ${max}). Angezeigt werden nur die unteren ${breite} bit.</div>`;
    }
    inp.addEventListener('input', neu); fSel.onchange = () => { if (fSel.value === 'real') bSel.value = '32'; neu(); }; bSel.onchange = neu;
    neu();
  }

  /* =====================================================================
     3. Schrauben: metrisches ISO-Regelgewinde
     ===================================================================== */
  // d, P, Durchgangsloch mittel (ISO 273), SW Sechskant (ISO 4017), SW Innensechskant (ISO 4762), Kopf-Ø Zylinderkopf
  const SCHRAUBEN = [
    [3, 0.5, 3.4, 5.5, 2.5, 5.5], [4, 0.7, 4.5, 7, 3, 7], [5, 0.8, 5.5, 8, 4, 8.5], [6, 1, 6.6, 10, 5, 10],
    [8, 1.25, 9, 13, 6, 13], [10, 1.5, 11, 16, 8, 16], [12, 1.75, 13.5, 18, 10, 18], [14, 2, 15.5, 21, 12, 21],
    [16, 2, 17.5, 24, 14, 24], [18, 2.5, 20, 27, 14, 27], [20, 2.5, 22, 30, 17, 30], [22, 2.5, 24, 34, 17, 33],
    [24, 3, 26, 36, 19, 36], [27, 3, 30, 41, 19, 40], [30, 3.5, 33, 46, 22, 45]
  ];
  const KLASSEN = { '8.8': d => (d <= 16 ? 640 : 660), '10.9': () => 940, '12.9': () => 1100, 'A2-70': () => 450, 'A4-80': () => 600 };
  const KLASSEN_TAB = [
    ['4.6', 400, 240, 'einfache Schrauben, kaum belastet'], ['5.6', 500, 300, ''], ['8.8', 800, 640, 'Standard im Maschinenbau (über M16: 830 / 660)'],
    ['10.9', 1040, 940, 'hochfest'], ['12.9', 1220, 1100, 'höchstfest, meist Zylinderkopf'], ['A2-70', 700, 450, 'Edelstahl V2A'], ['A4-80', 800, 600, 'Edelstahl V4A, säurebeständig']
  ];
  function schraubeRechnen(d, P, Rp, mu, dw, dh) {
    const d2 = d - 0.649519 * P, d3 = d - 1.226869 * P, dS = (d2 + d3) / 2, As = Math.PI / 4 * dS * dS;
    const k = 1.5 * d2 / dS * (P / (Math.PI * d2) + 1.155 * mu);
    const FM = As * 0.9 * Rp / Math.sqrt(1 + 3 * k * k);         // N (mm² · N/mm²)
    const MA = FM * (0.16 * P + 0.58 * d2 * mu + (dw + dh) / 4 * mu) / 1000;  // Nm
    return { d2, d3, As, FM, MA };
  }
  function schrauben(box) {
    const kSel = auswahl(Object.keys(KLASSEN), lies('sK', '8.8'));
    const mSel = auswahl([['0.08', '0,08 (MoS₂-Paste)'], ['0.10', '0,10 (gut geschmiert)'], ['0.12', '0,12 (leicht geölt, Standard)'], ['0.14', '0,14 (trocken, verzinkt)'], ['0.16', '0,16 (trocken, blank)']], lies('sM', '0.12'));
    const kopf = auswahl([['6k', 'Sechskantschraube'], ['zyl', 'Zylinderschraube (Innensechskant)']], lies('sH', '6k'));
    const form = el('div', 'wz-form');
    form.append(feld('Festigkeitsklasse', kSel), feld('Reibungszahl μ (Gewinde = Kopf)', mSel), feld('Kopfform', kopf));
    const aus = el('div', 'wz-scroll');
    box.append(form, aus);
    function neu() {
      schreib('sK', kSel.value); schreib('sM', mSel.value); schreib('sH', kopf.value);
      const mu = Number(mSel.value);
      let h = '<table class="wz-tab wz-schr"><thead><tr><th>Gewinde</th><th>P</th><th>d<sub>2</sub></th><th>d<sub>3</sub></th><th>A<sub>S</sub> mm²</th><th>Kernloch</th><th>Durchgangsloch</th><th>SW</th><th>SW Inbus</th><th>F<sub>M</sub> kN</th><th>M<sub>A</sub> Nm</th></tr></thead><tbody>';
      for (const [d, P, dh, sw, swi, dk] of SCHRAUBEN) {
        const dw = kopf.value === '6k' ? sw : dk;
        const r = schraubeRechnen(d, P, KLASSEN[kSel.value](d), mu, dw, dh);
        h += `<tr><th>M${d}</th><td>${de(P)}</td><td>${de(r.d2, 3)}</td><td>${de(r.d3, 3)}</td><td>${de(r.As, 1)}</td><td>${de(d - P, 2)}</td><td>${de(dh, 1)}</td><td>${de(sw, 1)}</td><td>${de(swi)}</td><td><b>${de(r.FM / 1000, 1)}</b></td><td><b>${de(r.MA, r.MA < 10 ? 1 : 0)}</b></td></tr>`;
      }
      aus.innerHTML = h + '</tbody></table>';
    }
    kSel.onchange = neu; mSel.onchange = neu; kopf.onchange = neu;
    neu();
    box.appendChild(el('p', 'meta wz-quelle', 'F<sub>M</sub> und M<sub>A</sub> nach VDI 2230 mit 90 % Ausnutzung der Streckgrenze. Kernloch = d − P, Durchgangsloch mittel nach ISO 273. Richtwerte, Herstellerangaben haben Vorrang. Eigene Werte im Rechner unter „Schraubenverbindung“.'));
    const kl = el('div', 'wz-scroll');
    kl.innerHTML = '<h3 class="wz-h3">Festigkeitsklassen</h3><table class="wz-tab"><thead><tr><th>Klasse</th><th>R<sub>m</sub> N/mm²</th><th>R<sub>e</sub> / R<sub>p0,2</sub> N/mm²</th><th></th></tr></thead><tbody>' +
      KLASSEN_TAB.map(k => `<tr><th>${k[0]}</th><td>${k[1]}</td><td>${k[2]}</td><td class="meta">${k[3]}</td></tr>`).join('') + '</tbody></table>' +
      '<p class="meta">Lesart bei 8.8: erste Zahl × 100 = Zugfestigkeit (800 N/mm²), erste × zweite Zahl × 10 = Streckgrenze (640 N/mm²).</p>';
    box.appendChild(kl);
  }

  /* =====================================================================
     4. Kabelbelastbarkeit (Kupfer, PVC 70 °C, 30 °C Umgebung)
     ===================================================================== */
  const QS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const IZ = {
    2: { A1: [15.5, 19.5, 26, 34, 46, 61, 80, 99, 119, 151, 182, 210], A2: [15.5, 18.5, 25, 32, 43, 57, 75, 92, 110, 139, 167, 192],
      B1: [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269], B2: [16.5, 23, 30, 38, 52, 69, 90, 111, 133, 168, 201, 232],
      C: [19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299], E: [22, 30, 40, 51, 70, 94, 119, 148, 180, 232, 282, 328] },
    3: { A1: [13.5, 18, 24, 31, 42, 56, 73, 89, 108, 136, 164, 188], A2: [13, 17.5, 23, 29, 39, 52, 68, 83, 99, 125, 150, 172],
      B1: [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239], B2: [15, 20, 27, 34, 46, 62, 80, 99, 118, 149, 179, 206],
      C: [17.5, 24, 32, 41, 57, 76, 96, 119, 144, 184, 223, 259], E: [18.5, 25, 34, 43, 60, 80, 101, 126, 153, 196, 238, 276] }
  };
  const VERLEGE = [
    ['A1', 'A1: Aderleitungen im Rohr in wärmegedämmter Wand'], ['A2', 'A2: Mantelleitung im Rohr in wärmegedämmter Wand'],
    ['B1', 'B1: Aderleitungen im Rohr auf oder in der Wand, im Kanal'], ['B2', 'B2: Mantelleitung im Rohr oder Kanal auf der Wand'],
    ['C', 'C: Mantelleitung direkt auf oder in der Wand'], ['E', 'E: Mantelleitung frei in Luft, z. B. auf gelochter Kabelpritsche']
  ];
  const TEMP = [[10, 1.22], [15, 1.17], [20, 1.12], [25, 1.06], [30, 1], [35, 0.94], [40, 0.87], [45, 0.79], [50, 0.71], [55, 0.61], [60, 0.5]];
  const HAEUF = [[1, 1], [2, 0.8], [3, 0.7], [4, 0.65], [5, 0.6], [6, 0.57], [7, 0.54], [8, 0.52], [9, 0.5], [12, 0.45], [16, 0.41], [20, 0.38]];
  const SICHERUNG = [6, 10, 13, 16, 20, 25, 32, 35, 40, 50, 63, 80, 100, 125, 160, 200, 250];

  function kabel(box) {
    const vSel = auswahl(VERLEGE, lies('kV', 'C'));
    const aSel = auswahl([['2', '2 belastete Adern (Wechselstrom 1~)'], ['3', '3 belastete Adern (Drehstrom 3~)']], lies('kA', '3'));
    const tSel = auswahl(TEMP.map(([t, f]) => [String(t), `${t} °C (Faktor ${de(f)})`]), lies('kT', '30'));
    const hSel = auswahl(HAEUF.map(([n, f]) => [String(n), `${n} ${n === 1 ? 'Stromkreis' : 'Stromkreise'} (Faktor ${de(f)})`]), lies('kH', '1'));
    const ib = el('input', 'wz-input'); ib.inputMode = 'decimal'; ib.placeholder = 'z. B. 14'; ib.value = lies('kI', '');
    const form = el('div', 'wz-form');
    form.append(feld('Verlegeart', vSel), feld('Belastete Adern', aSel), feld('Umgebungstemperatur', tSel), feld('Häufung (gebündelt)', hSel), feld('Betriebsstrom I<sub>b</sub> in A (optional)', ib));
    const aus = el('div');
    box.append(form, aus);
    function neu() {
      schreib('kV', vSel.value); schreib('kA', aSel.value); schreib('kT', tSel.value); schreib('kH', hSel.value); schreib('kI', ib.value);
      const fT = TEMP.find(t => String(t[0]) === tSel.value)[1], fH = HAEUF.find(h => String(h[0]) === hSel.value)[1];
      const Ib = Number(ib.value.replace(',', '.')) || 0;
      const reihe = IZ[aSel.value][vSel.value];
      let gewaehlt = -1;
      const zeilen = QS.map((q, i) => {
        const Iz = reihe[i] * fT * fH;
        const In = SICHERUNG.filter(s => s <= Iz).pop();
        if (Ib && gewaehlt < 0 && In !== undefined && In >= Ib) gewaehlt = i;
        return { q, Ir: reihe[i], Iz, In };
      });
      let h = '';
      if (Ib) {
        if (gewaehlt >= 0) {
          const z = zeilen[gewaehlt], In = SICHERUNG.find(s => s >= Ib && s <= z.Iz);
          h += `<div class="wz-art spiel"><b>Empfehlung für I<sub>b</sub> = ${de(Ib, 1)} A:</b> <span>mindestens <b>${de(z.q, 1)} mm²</b></span><span>Iz = ${de(z.Iz, 1)} A</span><span>Schutzorgan <b>${In} A</b></span>` +
            `<p>Bedingung I<sub>b</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub>: ${de(Ib, 1)} A ≤ ${In} A ≤ ${de(z.Iz, 1)} A erfüllt. Spannungsfall bei langen Leitungen extra prüfen (Rechner, „Leitung & Spannungsfall“).</p></div>`;
        } else h += '<div class="warnung">Selbst 120 mm² reichen bei diesen Bedingungen nicht. Parallel verlegen oder Verlegeart ändern.</div>';
      }
      h += `<p class="meta">Umrechnung: I<sub>z</sub> = I<sub>r</sub> · ${de(fT)} (Temperatur) · ${de(fH)} (Häufung) = I<sub>r</sub> · ${de(fT * fH, 3)}</p>`;
      h += '<div class="wz-scroll"><table class="wz-tab wz-kabel"><thead><tr><th>Querschnitt</th><th>I<sub>r</sub> Tabelle</th><th>I<sub>z</sub> umgerechnet</th><th>Größtes Schutzorgan I<sub>n</sub></th></tr></thead><tbody>' +
        zeilen.map((z, i) => `<tr class="${i === gewaehlt ? 'markiert' : ''}"><th>${de(z.q, 1)} mm²</th><td>${de(z.Ir, 1)} A</td><td><b>${de(z.Iz, 1)} A</b></td><td>${z.In === undefined ? '–' : z.In + ' A'}</td></tr>`).join('') + '</tbody></table></div>';
      aus.innerHTML = h;
    }
    [vSel, aSel, tSel, hSel].forEach(s => s.onchange = neu); ib.addEventListener('input', neu);
    neu();
    box.appendChild(el('p', 'meta wz-quelle', 'Kupferleiter mit PVC-Isolierung (70 °C), Bezugstemperatur 30 °C. Richtwerte nach DIN VDE 0298-4 und DIN VDE 0100-520, Häufungsfaktoren für gebündelte Leitungen auf einer Fläche. Bei LS-Schaltern und gG-Sicherungen gilt mit I<sub>n</sub> ≤ I<sub>z</sub> auch I<sub>2</sub> ≤ 1,45 · I<sub>z</sub>. Maßgeblich ist immer die aktuelle Norm.'));
  }

  /* =====================================================================
     5. Werkstoffkennwerte
     ===================================================================== */
  // Name, Gruppe, Dichte kg/dm³, E GPa, Re/Rp0,2, Rm, α 10⁻⁶/K, λ W/(m·K), c J/(kg·K), ρel Ω·mm²/m, Hinweis
  const WERKSTOFFE = [
    ['S235JR (1.0038)', 'Stahl', 7.85, 210, 235, 360, 12, 50, 460, 0.13, 'Baustahl, gut schweißbar'],
    ['S355J2 (1.0577)', 'Stahl', 7.85, 210, 355, 470, 12, 50, 460, 0.16, 'Baustahl höherfest'],
    ['C45 normalgeglüht (1.0503)', 'Stahl', 7.85, 210, 340, 620, 11.5, 45, 470, 0.16, 'Vergütungsstahl, Wellen, Bolzen'],
    ['42CrMo4 vergütet (1.7225)', 'Stahl', 7.85, 210, 750, 1000, 12, 42, 460, 0.19, 'hochfeste Wellen, Zahnräder (d 16 bis 40 mm)'],
    ['16MnCr5 (1.7131)', 'Stahl', 7.85, 210, 590, 800, 12, 44, 460, 0.18, 'Einsatzstahl, Zahnräder, Rp nach Einsatzhärten'],
    ['11SMnPb30 (1.0718)', 'Stahl', 7.85, 210, 300, 460, 12, 50, 460, 0.15, 'Automatenstahl, Drehteile'],
    ['X5CrNi18-10 (1.4301, V2A)', 'Edelstahl', 7.9, 200, 190, 500, 16, 15, 500, 0.73, 'rostfrei, nicht magnetisch'],
    ['X2CrNiMo17-12-2 (1.4404, V4A)', 'Edelstahl', 8.0, 200, 200, 500, 16, 15, 500, 0.75, 'säurebeständig, Lebensmittel'],
    ['EN-GJL-250 (Grauguss)', 'Gusseisen', 7.2, 110, null, 250, 10, 48, 460, 0.6, 'dämpft gut, spröde, Gehäuse'],
    ['EN-GJS-400-15 (Sphäroguss)', 'Gusseisen', 7.1, 169, 250, 400, 12.5, 36, 515, 0.5, 'zäh, Gehäuse, Naben'],
    ['EN AW-1050A (Al 99,5)', 'Aluminium', 2.7, 69, 20, 65, 23.5, 229, 900, 0.028, 'Reinaluminium weich, Stromschienen'],
    ['EN AW-5754 H111 (AlMg3)', 'Aluminium', 2.66, 70, 80, 190, 24, 130, 900, 0.05, 'Bleche, seewasserbeständig'],
    ['EN AW-6060 T6 (AlMgSi)', 'Aluminium', 2.7, 69, 150, 190, 23.4, 200, 900, 0.031, 'Strangpressprofile'],
    ['EN AW-6082 T6 (AlSi1MgMn)', 'Aluminium', 2.7, 70, 260, 310, 23.4, 170, 900, 0.038, 'Konstruktionsprofile, Frästeile'],
    ['EN AW-7075 T6 (AlZnMgCu)', 'Aluminium', 2.81, 72, 460, 530, 23.4, 130, 870, 0.052, 'hochfest, Flugzeugbau, Formen'],
    ['Cu-ETP (Elektrolytkupfer)', 'Kupfer', 8.93, 120, 180, 240, 17, 390, 385, 0.0172, 'Leitungen, Stromschienen'],
    ['CuZn39Pb3 (Messing)', 'Kupfer', 8.47, 96, 250, 430, 20.9, 110, 380, 0.065, 'Automatenmessing, Drehteile, Armaturen'],
    ['CuSn8 (Zinnbronze)', 'Kupfer', 8.8, 115, 260, 390, 18.5, 62, 380, 0.13, 'Gleitlager, Federn'],
    ['Titan Grade 2', 'Titan', 4.51, 105, 275, 345, 8.6, 16, 520, 0.56, 'korrosionsbeständig, Chemie'],
    ['Ti6Al4V (Grade 5)', 'Titan', 4.43, 114, 880, 950, 8.6, 6.7, 560, 1.7, 'hochfest, leicht, Medizintechnik'],
    ['PA6 (trocken)', 'Kunststoff', 1.14, 3, null, 80, 90, 0.25, 1700, null, 'Zahnräder, Rollen, nimmt Wasser auf'],
    ['POM-C', 'Kunststoff', 1.41, 2.8, null, 65, 110, 0.31, 1500, null, 'Gleitteile, maßhaltig, gut zerspanbar'],
    ['PE-HD', 'Kunststoff', 0.95, 1, null, 25, 200, 0.4, 1900, null, 'Gleitleisten, chemisch beständig'],
    ['PTFE', 'Kunststoff', 2.17, 0.5, null, 25, 130, 0.25, 1000, null, 'sehr geringe Reibung, bis 260 °C'],
    ['PVC-U', 'Kunststoff', 1.4, 3, null, 50, 80, 0.16, 1000, null, 'Rohre, Kabelkanäle'],
    ['PMMA (Acrylglas)', 'Kunststoff', 1.19, 3.2, null, 70, 70, 0.19, 1470, null, 'Abdeckungen, Schutzhauben'],
    ['PEEK', 'Kunststoff', 1.31, 3.6, null, 100, 50, 0.25, 1340, null, 'Hochleistung bis 250 °C']
  ];
  function werkstoffe(box) {
    const q = el('input', 'wz-input'); q.type = 'search'; q.placeholder = 'z. B. Alu, 1.4301, Gleitlager …';
    const gruppen = ['Alle'].concat([...new Set(WERKSTOFFE.map(w => w[1]))]);
    const gSel = auswahl(gruppen, lies('wG', 'Alle'));
    const form = el('div', 'wz-form');
    form.append(feld('Suchen', q), feld('Gruppe', gSel));
    const aus = el('div', 'wz-scroll');
    box.append(form, aus);
    const z = (x, st) => (x === null ? '–' : de(x, st));
    function neu() {
      schreib('wG', gSel.value);
      const s = q.value.trim().toLowerCase();
      const liste = WERKSTOFFE.filter(w => (gSel.value === 'Alle' || w[1] === gSel.value) && (!s || (w[0] + ' ' + w[1] + ' ' + w[10]).toLowerCase().includes(s)));
      aus.innerHTML = '<table class="wz-tab wz-werk"><thead><tr><th>Werkstoff</th><th>ρ<br><small>kg/dm³</small></th><th>E<br><small>GPa</small></th><th>R<sub>e</sub> / R<sub>p0,2</sub><br><small>N/mm²</small></th><th>R<sub>m</sub><br><small>N/mm²</small></th><th>α<br><small>10⁻⁶/K</small></th><th>λ<br><small>W/(m·K)</small></th><th>c<br><small>J/(kg·K)</small></th><th>ρ<sub>el</sub><br><small>Ω·mm²/m</small></th></tr></thead><tbody>' +
        (liste.length ? liste.map(w => `<tr><th>${w[0]}<div class="meta">${w[1]} · ${w[10]}</div></th><td>${z(w[2])}</td><td>${z(w[3], 1)}</td><td>${z(w[4])}</td><td>${z(w[5])}</td><td>${z(w[6], 1)}</td><td>${z(w[7], 2)}</td><td>${z(w[8])}</td><td>${z(w[9], 4)}</td></tr>`).join('')
          : '<tr><td colspan="9" class="meta">Nichts gefunden.</td></tr>') + '</tbody></table>';
    }
    q.addEventListener('input', neu); gSel.onchange = neu;
    neu();
    box.appendChild(el('p', 'meta wz-quelle', 'Typische Mindest- bzw. Richtwerte bei Raumtemperatur, je nach Halbzeug, Abmessung und Zustand verschieden. Kunststoffe: R<sub>m</sub> = Zugfestigkeit bzw. Streckspannung. Für die Auslegung gelten Datenblatt und Norm.'));
  }

  /* ---------- Rahmen ---------- */
  const LISTE = [
    { id: 'passung', n: 'Passungsrechner ISO 286', d: 'Abmaße, Grenzmaße und Spiel für H7/g6, H7/k6 und viele mehr, mit Toleranzfeld-Bild.', r: passung, s: 'passung toleranz iso 286 h7 g6 spiel übermaß bohrung welle abmaß' },
    { id: 'zahlen', n: 'Zahlensysteme', d: 'Dezimal, Hex, Binär, BCD, Gray-Code, Zweierkomplement und REAL, mit anklickbaren Bits.', r: zahlen, s: 'zahlensystem hex binär dual bcd gray zweierkomplement real float word int dint byte bit' },
    { id: 'schrauben', n: 'Schrauben M3 bis M30', d: 'Gewindemaße, Kernloch, Schlüsselweite, Vorspannkraft und Anzugsmoment je Festigkeitsklasse.', r: schrauben, s: 'schraube anzugsmoment vorspannkraft gewinde kernloch schlüsselweite festigkeitsklasse 8.8 10.9' },
    { id: 'kabel', n: 'Kabelbelastbarkeit', d: 'Strombelastbarkeit nach Verlegeart, Temperatur und Häufung, passende Sicherung und Querschnitt.', r: kabel, s: 'kabel leitung belastbarkeit querschnitt verlegeart sicherung ls schutzorgan häufung iz' },
    { id: 'werkstoffe', n: 'Werkstoffkennwerte', d: 'Dichte, E-Modul, Festigkeit, Ausdehnung, Wärmeleitung und elektrischer Widerstand.', r: werkstoffe, s: 'werkstoff material dichte e-modul festigkeit stahl alu kupfer kunststoff edelstahl' }
  ];
  let aktuell = lies('akt', 'passung');

  function zeige(id) {
    if (id && LISTE.some(w => w.id === id)) aktuell = id;
    schreib('akt', aktuell);
    const nav = document.getElementById('wzNav'), box = document.getElementById('werkzeug');
    nav.innerHTML = '';
    for (const w of LISTE) {
      const b = el('button', 'wz-tab-btn' + (w.id === aktuell ? ' aktiv' : ''), w.n); b.type = 'button';
      b.onclick = () => { zeige(w.id); if (window.APP) window.APP.hash('tab-' + w.id); };
      nav.appendChild(b);
    }
    const w = LISTE.find(x => x.id === aktuell);
    box.innerHTML = '';
    const kopf = el('div', 'kat-kopf', `<div><span class="gruppe">Tabellen & Werkzeuge</span><h2>${w.n}</h2><p class="meta">${w.d}</p></div>`);
    box.appendChild(kopf);
    const inhalt = el('div', 'wz-inhalt'); box.appendChild(inhalt);
    w.r(inhalt);
    return aktuell;
  }

  window.WERKZEUG = { liste: LISTE, zeige, aktuell: () => aktuell, bohrung, welle, schraubeRechnen };
})();
