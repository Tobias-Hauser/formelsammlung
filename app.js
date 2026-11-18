/* Formelsammlung Mechatronik: Oberfläche */
(function () {
  'use strict';
  const { V, F, KAT, rechne, tipps, variablen } = window.FORMEL;
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const ohneTags = s => s.replace(/<[^>]+>/g, '');
  const GRUPPEN = { praxis: 'Praxis-Aufgaben', grund: 'Grundlagen' };

  let katId = KAT[0].id;
  let eingaben = {};   // { katId: { var: 'Rohtext' } }
  let einheiten = {};  // { katId: { var: Einheiten-Index } }
  let letztes = null;  // letztes Rechenergebnis

  const kat = () => KAT.find(k => k.id === katId);
  const ein = () => (eingaben[katId] = eingaben[katId] || {});
  const einh = () => (einheiten[katId] = einheiten[katId] || {});

  function standardEinheit(v) {
    const e = (kat().e || {})[v];
    if (!e) return 0;
    const i = V[v].u.findIndex(u => u[0] === e);
    return i < 0 ? 0 : i;
  }
  const einheitIdx = v => (v in einh() ? einh()[v] : standardEinheit(v));
  const faktor = v => V[v].u[einheitIdx(v)][1];
  const einheitText = v => V[v].u[einheitIdx(v)][0];

  function zahl(roh) {
    if (roh === undefined || roh === null) return null;
    const s = String(roh).replace(/\s/g, '').replace(',', '.');
    if (s === '' || s === '-' || s === '.') return null;
    const x = Number(s);
    return isFinite(x) ? x : null;
  }
  function fmt(x) {
    if (x === 0) return '0';
    const a = Math.abs(x);
    if (a >= 1e9 || a < 1e-4) return x.toExponential(3).replace('.', ',');
    if (a >= 1000) return String(Math.round(x));
    return Number(x.toPrecision(4)).toLocaleString('de-DE', { useGrouping: false, maximumFractionDigits: 10 });
  }
  const roh = x => String(x).replace('.', ',');
  const mitEinheit = (wert, v) => { const u = einheitText(v); return fmt(wert / faktor(v)) + (u ? ' ' + u : ''); };

  /* ---------- Liste der Bereiche ---------- */
  function passt(k, q) {
    if (!q) return true;
    const text = [k.n, k.d].concat(k.f.flatMap(id => [F[id].n, ohneTags(F[id].eq)]))
      .concat(variablen(k).flatMap(v => [V[v].n, ohneTags(V[v].s)])).join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every(w => text.includes(w));
  }

  function renderListe() {
    const q = $('#suche').value.trim();
    const liste = $('#katListe'); liste.innerHTML = '';
    const wahl = $('#katWahl'); wahl.innerHTML = '';
    for (const gr of Object.keys(GRUPPEN)) {
      const ks = KAT.filter(k => k.gruppe === gr && passt(k, q));
      const og = el('optgroup'); og.label = GRUPPEN[gr];
      KAT.filter(k => k.gruppe === gr).forEach(k => { const o = el('option', '', k.n); o.value = k.id; og.appendChild(o); });
      wahl.appendChild(og);
      if (!ks.length) continue;
      liste.appendChild(el('h4', '', GRUPPEN[gr]));
      for (const k of ks) {
        const b = el('button', 'kat' + (k.id === katId ? ' aktiv' : ''), k.n); b.dataset.k = k.id;
        const anzahl = Object.keys(eingaben[k.id] || {}).length;
        if (anzahl) b.appendChild(el('span', 'zahl', String(anzahl)));
        b.onclick = () => oeffne(k.id);
        liste.appendChild(b);
      }
    }
    if (!liste.children.length) liste.appendChild(el('p', 'meta', 'Nichts gefunden.'));
    wahl.value = katId;
  }

  /* ---------- Bereich anzeigen ---------- */
  function oeffne(id) {
    katId = id;
    renderListe();
    renderKat();
    if (window.innerWidth < 800) $('.inhalt').scrollIntoView({ behavior: 'smooth' });
  }

  function renderKat() {
    const k = kat();
    $('#katGruppe').textContent = GRUPPEN[k.gruppe];
    $('#katTitel').textContent = k.n;
    $('#katText').textContent = k.d;

    const felder = $('#felder'); felder.innerHTML = '';
    for (const v of variablen(k)) {
      const def = V[v];
      const karte = el('div', 'feld'); karte.dataset.v = v;
      const lab = el('label', '', `<span class="sym">${def.s}</span><span class="name">${def.n}</span>`);
      lab.htmlFor = 'in-' + v;
      karte.appendChild(lab);

      const zeile = el('div', 'zeile');
      const inp = el('input'); inp.id = 'in-' + v; inp.inputMode = 'decimal'; inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.value = ein()[v] || '';
      inp.addEventListener('input', () => {
        if (inp.value.trim() === '') delete ein()[v]; else ein()[v] = inp.value;
        aktualisieren();
      });
      inp.addEventListener('focus', () => { if (karte.classList.contains('berechnet')) inp.select(); });
      inp.addEventListener('blur', () => aktualisieren());
      zeile.appendChild(inp);

      if (def.u.length > 1) {
        const sel = el('select', 'einheit'); sel.setAttribute('aria-label', 'Einheit ' + def.n);
        def.u.forEach((u, i) => { const o = el('option', '', u[0] || 'ohne'); o.value = i; sel.appendChild(o); });
        sel.value = einheitIdx(v);
        sel.addEventListener('change', () => { einh()[v] = Number(sel.value); aktualisieren(); });
        zeile.appendChild(sel);
      } else if (def.u[0][0]) {
        zeile.appendChild(el('span', 'einheit fest', def.u[0][0]));
      }
      karte.appendChild(zeile);
      karte.appendChild(el('div', 'herkunft'));

      if (def.p) {
        const chips = el('div', 'chips');
        for (const [txt, wert] of def.p) {
          const c = el('button', 'chip', txt); c.type = 'button';
          c.onclick = () => { ein()[v] = roh(wert); einh()[v] = 0; inp.value = roh(wert); const s = karte.querySelector('select'); if (s) s.value = 0; aktualisieren(); };
          chips.appendChild(c);
        }
        karte.appendChild(chips);
      }
      felder.appendChild(karte);
    }

    const fl = $('#formeln'); fl.innerHTML = '';
    for (const id of k.f) {
      const f = F[id];
      const li = el('li', '', `<span class="eq">${f.eq}</span><span class="fname">${f.n}</span>` + (f.info ? `<span class="info">${f.info}</span>` : ''));
      li.dataset.f = id;
      fl.appendChild(li);
    }
    aktualisieren();
  }

  /* ---------- Rechnen und Anzeige auffrischen ---------- */
  function aktualisieren() {
    const k = kat();
    const bekannt = {}; const ungueltig = new Set();
    for (const [v, r] of Object.entries(ein())) {
      const x = zahl(r);
      if (x === null) ungueltig.add(v); else bekannt[v] = x * faktor(v);
    }
    const r = rechne(k.f, bekannt);
    letztes = r;
    const aktiv = document.activeElement;

    document.querySelectorAll('#felder .feld').forEach(karte => {
      const v = karte.dataset.v;
      const inp = karte.querySelector('input');
      const her = karte.querySelector('.herkunft');
      const sel = karte.querySelector('select');
      if (sel) sel.value = einheitIdx(v);
      karte.classList.remove('eingegeben', 'berechnet', 'ungueltig');
      if (v in ein()) {
        karte.classList.add(ungueltig.has(v) ? 'ungueltig' : 'eingegeben');
        her.textContent = ungueltig.has(v) ? 'keine gültige Zahl' : 'eingegeben';
        if (aktiv !== inp) inp.value = ein()[v];
      } else if (v in r.w) {
        karte.classList.add('berechnet');
        her.innerHTML = 'berechnet: ' + F[r.quelle[v]].eq;
        if (aktiv !== inp) inp.value = fmt(r.w[v] / faktor(v));
      } else {
        her.textContent = '';
        if (aktiv !== inp) inp.value = '';
      }
    });

    // Rechenweg
    const rw = $('#rechenweg'); rw.innerHTML = '';
    if (!r.schritte.length) rw.appendChild(el('li', 'leer', 'Sobald genug Werte bekannt sind, steht hier Schritt für Schritt, wie gerechnet wurde.'));
    for (const s of r.schritte) {
      const f = F[s.f];
      const umgestellt = s.v !== f.y ? ` <span class="meta">(umgestellt nach ${V[s.v].s})</span>` : '';
      const mit = s.aus.map(a => `${V[a].s} = ${mitEinheit(r.w[a], a)}`).join(', ');
      rw.appendChild(el('li', '', `<div><span class="eq">${f.eq}</span>${umgestellt}</div>` +
        (mit ? `<div class="meta">mit ${mit}</div>` : '') +
        `<div class="erg">${V[s.v].s} = <b>${mitEinheit(r.w[s.v], s.v)}</b></div>`));
    }

    // Formeln markieren
    const benutzt = new Set(r.schritte.map(s => s.f));
    const konfl = new Set(r.konflikte.map(x => x.f));
    document.querySelectorAll('#formeln li').forEach(li => {
      li.classList.toggle('benutzt', benutzt.has(li.dataset.f));
      li.classList.toggle('konflikt', konfl.has(li.dataset.f));
    });

    // Widersprüche
    const kb = $('#konflikte'); kb.innerHTML = '';
    for (const c of r.konflikte) {
      const f = F[c.f];
      kb.appendChild(el('div', 'warnung', `<b>Widerspruch:</b> Nach <span class="eq">${f.eq}</span> müsste ${V[f.y].s} = ${mitEinheit(c.soll, f.y)} sein, es ist aber ${mitEinheit(c.ist, f.y)}. Einen der eingegebenen Werte leeren, dann wird er berechnet.`));
    }

    renderTipp(r);
    renderListeZahlen();
    speichern();
  }

  function renderTipp(r) {
    const k = kat(); const box = $('#tipp'); box.innerHTML = '';
    const alle = variablen(k);
    const offen = alle.filter(v => !(v in r.w));
    if (!Object.keys(ein()).length) {
      box.className = 'tipp';
      box.innerHTML = '<b>So geht\'s:</b> Trag in beliebige Felder ein, was du weißt. Alles, was sich daraus ergibt, wird sofort grün ausgefüllt. Die Reihenfolge ist egal, jede Formel wird auch umgestellt. Oder klick auf <b>Beispiel laden</b>.';
      return;
    }
    if (!offen.length) { box.className = 'tipp fertig'; box.innerHTML = '<b>Alles berechnet.</b> Ändere einen Wert und alles rechnet sich neu.'; return; }
    box.className = 'tipp';
    const t = tipps(k.f, Object.keys(r.w)).slice(0, 4);
    if (t.length) {
      box.appendChild(el('span', '', '<b>Noch offen: ' + offen.length + '.</b> Als Nächstes sinnvoll: '));
      for (const x of t) {
        const c = el('button', 'chip tipp-chip', `${V[x.v].s} ${V[x.v].n} <small>+${x.mehr} weitere</small>`);
        c.onclick = () => { const i = document.getElementById('in-' + x.v); i.focus(); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
        box.appendChild(c);
      }
    } else {
      const f = k.f.map(id => F[id]).find(f => [f.y].concat(f.x).filter(v => !(v in r.w)).length >= 2);
      const fehlt = f ? [f.y].concat(f.x).filter(v => !(v in r.w)).map(v => V[v].s) : [];
      box.innerHTML = `<b>Noch offen: ${offen.length}.</b> ` + (f ? `Für <span class="eq">${f.eq}</span> fehlen noch zwei Werte (${fehlt.join(', ')}). Gib einen davon an.` : 'Gib einen weiteren Wert an.');
    }
  }

  function renderListeZahlen() {
    document.querySelectorAll('#katListe .kat').forEach(b => {
      const k = KAT.find(x => x.id === b.dataset.k);
      if (!k) return;
      let z = b.querySelector('.zahl');
      const n = Object.keys(eingaben[k.id] || {}).length;
      if (n && !z) { z = el('span', 'zahl'); b.appendChild(z); }
      if (z) { if (n) z.textContent = n; else z.remove(); }
    });
  }

  /* ---------- Speichern, Link teilen ---------- */
  function speichern() {
    try { localStorage.setItem('formelsammlung', JSON.stringify({ katId, eingaben, einheiten })); } catch (e) { /* egal */ }
    const teile = [katId];
    for (const [v, r] of Object.entries(ein())) {
      const u = einheitIdx(v);
      teile.push(encodeURIComponent(v) + '=' + encodeURIComponent(r) + (u !== standardEinheit(v) ? '~' + u : ''));
    }
    history.replaceState(null, '', '#' + teile.join('&'));
  }

  function laden() {
    try {
      const s = JSON.parse(localStorage.getItem('formelsammlung') || 'null');
      if (s && KAT.some(k => k.id === s.katId)) { katId = s.katId; eingaben = s.eingaben || {}; einheiten = s.einheiten || {}; }
    } catch (e) { /* egal */ }
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const [id, ...rest] = location.hash.slice(1).split('&');
    if (!KAT.some(k => k.id === id)) return;
    katId = id;
    if (!rest.length) return;
    eingaben[id] = {}; einheiten[id] = {};
    for (const t of rest) {
      const [v, w] = t.split('=');
      if (!w) continue;
      const name = decodeURIComponent(v);
      if (!V[name]) continue;
      const [wert, u] = decodeURIComponent(w).split('~');
      eingaben[id][name] = wert;
      if (u !== undefined && V[name].u[Number(u)]) einheiten[id][name] = Number(u);
    }
  }

  function toast(text) {
    const t = $('#toast'); t.textContent = text; t.classList.add('zeigen');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('zeigen'), 2200);
  }

  /* ---------- Alle Formeln ---------- */
  function renderAlle() {
    const q = $('#sucheAlle').value.trim().toLowerCase();
    const box = $('#alleListe'); box.innerHTML = '';
    for (const gr of Object.keys(GRUPPEN)) {
      const ks = KAT.filter(k => k.gruppe === gr);
      let kopf = false;
      for (const k of ks) {
        const zeilen = k.f.map(id => F[id]).filter(f => !q ||
          (f.n + ' ' + ohneTags(f.eq) + ' ' + [f.y].concat(f.x).map(v => V[v].n).join(' ') + ' ' + k.n).toLowerCase().includes(q));
        if (!zeilen.length) continue;
        if (!kopf) { box.appendChild(el('h2', 'gruppen-titel', GRUPPEN[gr])); kopf = true; }
        const karte = el('div', 'karte alle-karte');
        const titel = el('div', 'alle-titel', `<h3>${k.n}</h3>`);
        const b = el('button', 'link nicht-drucken', 'im Rechner öffnen →');
        b.onclick = () => { zeigeView('rechner'); oeffne(k.id); window.scrollTo({ top: 0 }); };
        titel.appendChild(b);
        karte.appendChild(titel);
        const tab = el('table');
        for (const f of zeilen) tab.appendChild(el('tr', '', `<td class="eq">${f.eq}</td><td>${f.n}${f.info ? `<div class="info">${f.info}</div>` : ''}</td>`));
        karte.appendChild(tab);
        const leg = variablen(k).map(v => `${V[v].s} ${V[v].n}${V[v].u[0][0] ? ' [' + V[v].u[0][0] + ']' : ''}`).join(' · ');
        karte.appendChild(el('p', 'legende', leg));
        box.appendChild(karte);
      }
    }
    if (!box.children.length) box.appendChild(el('p', 'meta', 'Nichts gefunden.'));
  }

  function zeigeView(name) {
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('aktiv', b.dataset.view === name));
    $('#view-rechner').hidden = name !== 'rechner';
    $('#view-alle').hidden = name !== 'alle';
    if (name === 'alle') renderAlle();
  }

  /* ---------- Start ---------- */
  document.querySelectorAll('nav button').forEach(b => b.onclick = () => zeigeView(b.dataset.view));
  $('#suche').addEventListener('input', renderListe);
  $('#katWahl').addEventListener('change', e => oeffne(e.target.value));
  $('#sucheAlle').addEventListener('input', renderAlle);
  $('#drucken').onclick = () => window.print();
  $('#beispiel').onclick = () => {
    eingaben[katId] = {}; einheiten[katId] = {};
    for (const [v, x] of Object.entries(kat().bsp)) eingaben[katId][v] = roh(x);
    renderKat();
  };
  $('#leeren').onclick = () => { eingaben[katId] = {}; renderKat(); };
  $('#teilen').onclick = () => {
    const url = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link kopiert. Wer ihn öffnet, sieht genau diese Rechnung.'), () => toast(url));
    else toast(url);
  };

  laden();
  renderListe();
  renderKat();
})();
