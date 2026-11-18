/* Formelsammlung Mechatronik: Größen, Formeln, Bereiche und der Löser.
   Intern wird alles in SI-Einheiten gerechnet, angezeigt wird in der gewählten Einheit. */
(function (global) {
  'use strict';
  const PI = Math.PI, W3 = Math.sqrt(3), g = 9.81;

  const OHM = [['Ω', 1], ['kΩ', 1e3], ['MΩ', 1e6], ['mΩ', 1e-3]];
  const WATT = [['W', 1], ['kW', 1e3], ['MW', 1e6]];
  const KW = [['kW', 1e3], ['W', 1], ['MW', 1e6]];
  const NEWTON = [['N', 1], ['kN', 1e3]];
  const NMM2 = [['N/mm²', 1e6], ['MPa', 1e6], ['GPa', 1e9]];
  const PROZ = [['%', 0.01], ['', 1]];
  const DREHZ = [['1/min', 1 / 60], ['1/s', 1]];
  const MM = [['mm', 1e-3], ['cm', 1e-2], ['m', 1]];
  const OHNE = [['', 1]];

  /* Größen: s = Symbol, n = Name, u = Einheiten [Anzeige, Faktor zu SI], p = Schnellwerte, neg = darf negativ sein */
  const V = {
    // Elektrotechnik
    U: { s: 'U', n: 'Spannung', u: [['V', 1], ['kV', 1e3], ['mV', 1e-3]], p: [['230 V', 230], ['400 V', 400], ['24 V', 24]] },
    I: { s: 'I', n: 'Strom', u: [['A', 1], ['mA', 1e-3], ['kA', 1e3]] },
    R: { s: 'R', n: 'Widerstand', u: OHM },
    P: { s: 'P', n: 'Wirkleistung', u: WATT },
    S: { s: 'S', n: 'Scheinleistung', u: [['VA', 1], ['kVA', 1e3]] },
    Qb: { s: 'Q', n: 'Blindleistung', u: [['var', 1], ['kvar', 1e3]] },
    cosphi: { s: 'cos φ', n: 'Leistungsfaktor', u: OHNE, p: [['ohmsche Last', 1], ['Motor typ.', 0.85]] },
    W: { s: 'W', n: 'Elektrische Arbeit', u: [['kWh', 3.6e6], ['Wh', 3600], ['J', 1]] },
    t: { s: 't', n: 'Zeit', u: [['s', 1], ['min', 60], ['h', 3600]] },
    k: { s: 'k', n: 'Strompreis', u: [['€/kWh', 1 / 3.6e6], ['ct/kWh', 1 / 3.6e8]], p: [['0,30 €', 0.30], ['0,25 €', 0.25]] },
    K: { s: 'K', n: 'Kosten', u: [['€', 1]] },
    R1: { s: 'R<sub>1</sub>', n: 'Widerstand 1', u: OHM },
    R2: { s: 'R<sub>2</sub>', n: 'Widerstand 2', u: OHM },
    Rr: { s: 'R<sub>r</sub>', n: 'Gesamt in Reihe', u: OHM },
    Rp: { s: 'R<sub>p</sub>', n: 'Gesamt parallel', u: OHM },
    Ue: { s: 'U<sub>e</sub>', n: 'Eingangsspannung', u: [['V', 1], ['mV', 1e-3]] },
    Ua: { s: 'U<sub>a</sub>', n: 'Ausgangsspannung an R₂', u: [['V', 1], ['mV', 1e-3]] },
    l: { s: 'l', n: 'Leitungslänge (einfach)', u: [['m', 1], ['km', 1e3]] },
    AL: { s: 'A', n: 'Leiterquerschnitt', u: [['mm²', 1e-6]], p: [['1,5', 1.5], ['2,5', 2.5], ['4', 4], ['6', 6], ['10', 10], ['16', 16]] },
    kappa: { s: 'κ', n: 'Leitfähigkeit', u: [['m/(Ω·mm²)', 1e6]], p: [['Kupfer 56', 56], ['Alu 35', 35]] },
    rho: { s: 'ρ', n: 'Spez. Widerstand', u: [['Ω·mm²/m', 1e-6]], p: [['Kupfer 0,0178', 0.0178], ['Alu 0,0286', 0.0286]] },
    RL: { s: 'R<sub>L</sub>', n: 'Widerstand eines Leiters', u: [['Ω', 1], ['mΩ', 1e-3]] },
    dU: { s: 'ΔU', n: 'Spannungsfall', u: [['V', 1]] },
    dUp: { s: 'Δu', n: 'Spannungsfall relativ', u: PROZ },
    PV: { s: 'P<sub>V</sub>', n: 'Verlustleistung Leitung', u: WATT },
    f: { s: 'f', n: 'Frequenz', u: [['Hz', 1], ['kHz', 1e3]], p: [['50 Hz', 50]] },
    L: { s: 'L', n: 'Induktivität', u: [['mH', 1e-3], ['H', 1], ['µH', 1e-6]] },
    C: { s: 'C', n: 'Kapazität', u: [['µF', 1e-6], ['nF', 1e-9], ['pF', 1e-12], ['F', 1]] },
    XL: { s: 'X<sub>L</sub>', n: 'Induktiver Blindwiderstand', u: OHM },
    XC: { s: 'X<sub>C</sub>', n: 'Kapazitiver Blindwiderstand', u: OHM },
    Z: { s: 'Z', n: 'Scheinwiderstand', u: OHM },
    Ustr: { s: 'U<sub>Str</sub>', n: 'Strangspannung (Stern)', u: [['V', 1]] },
    tauC: { s: 'τ<sub>C</sub>', n: 'Zeitkonstante RC', u: [['ms', 1e-3], ['s', 1], ['µs', 1e-6]] },
    tauL: { s: 'τ<sub>L</sub>', n: 'Zeitkonstante RL', u: [['ms', 1e-3], ['s', 1], ['µs', 1e-6]] },
    Qc: { s: 'Q', n: 'Ladung', u: [['mAs', 1e-3], ['As', 1], ['µAs', 1e-6]] },
    EC: { s: 'W<sub>C</sub>', n: 'Energie im Kondensator', u: [['J', 1], ['mJ', 1e-3]] },
    EL: { s: 'W<sub>L</sub>', n: 'Energie in der Spule', u: [['J', 1], ['mJ', 1e-3]] },

    // Mechanik
    m: { s: 'm', n: 'Masse', u: [['kg', 1], ['g', 1e-3], ['t', 1e3]] },
    a: { s: 'a', n: 'Beschleunigung', u: [['m/s²', 1]], neg: true },
    F: { s: 'F', n: 'Kraft', u: NEWTON },
    FG: { s: 'F<sub>G</sub>', n: 'Gewichtskraft', u: NEWTON },
    s: { s: 's', n: 'Weg', u: [['m', 1], ['mm', 1e-3], ['cm', 1e-2]] },
    v: { s: 'v', n: 'Geschwindigkeit', u: [['m/s', 1], ['m/min', 1 / 60], ['km/h', 1 / 3.6]] },
    Wm: { s: 'W', n: 'Arbeit', u: [['J', 1], ['kJ', 1e3], ['Nm', 1], ['kWh', 3.6e6]] },
    Pm: { s: 'P', n: 'Mechanische Leistung', u: WATT },
    h: { s: 'h', n: 'Höhe', u: [['m', 1], ['mm', 1e-3]] },
    Ekin: { s: 'E<sub>kin</sub>', n: 'Bewegungsenergie', u: [['J', 1], ['kJ', 1e3]] },
    Epot: { s: 'E<sub>pot</sub>', n: 'Lageenergie', u: [['J', 1], ['kJ', 1e3]] },
    mu: { s: 'μ', n: 'Reibungszahl', u: OHNE, p: [['Rollenbahn 0,05', 0.05], ['Stahl/Stahl 0,15', 0.15], ['Gurt/Gleittisch 0,3', 0.3]] },
    FN: { s: 'F<sub>N</sub>', n: 'Normalkraft', u: NEWTON },
    FR: { s: 'F<sub>R</sub>', n: 'Reibkraft', u: NEWTON },
    M: { s: 'M', n: 'Drehmoment', u: [['Nm', 1], ['kNm', 1e3]] },
    r: { s: 'r', n: 'Radius / Hebelarm', u: MM },
    d: { s: 'd', n: 'Durchmesser', u: MM },
    n: { s: 'n', n: 'Drehzahl', u: DREHZ, p: [['1450', 1450], ['2900', 2900], ['960', 960]] },
    omega: { s: 'ω', n: 'Winkelgeschwindigkeit', u: [['1/s', 1]] },
    n1: { s: 'n<sub>1</sub>', n: 'Drehzahl Antrieb', u: DREHZ, p: [['1450', 1450], ['2900', 2900]] },
    n2: { s: 'n<sub>2</sub>', n: 'Drehzahl Abtrieb', u: DREHZ },
    z1: { s: 'z<sub>1</sub>', n: 'Zähnezahl Antrieb', u: OHNE },
    z2: { s: 'z<sub>2</sub>', n: 'Zähnezahl Abtrieb', u: OHNE },
    d1: { s: 'd<sub>1</sub>', n: 'Scheibe Antrieb', u: MM },
    d2: { s: 'd<sub>2</sub>', n: 'Scheibe Abtrieb', u: MM },
    i: { s: 'i', n: 'Übersetzung', u: OHNE },
    M1: { s: 'M<sub>1</sub>', n: 'Drehmoment Antrieb', u: [['Nm', 1]] },
    M2: { s: 'M<sub>2</sub>', n: 'Drehmoment Abtrieb', u: [['Nm', 1], ['kNm', 1e3]] },
    eta: { s: 'η', n: 'Wirkungsgrad', u: PROZ, p: [['95 %', 95], ['90 %', 90], ['85 %', 85]] },

    // Motor
    Pzu: { s: 'P<sub>zu</sub>', n: 'Aufgenommene Leistung', u: KW },
    Pab: { s: 'P<sub>ab</sub>', n: 'Abgegebene Leistung', u: KW, p: [['0,75', 0.75], ['1,5', 1.5], ['4', 4], ['7,5', 7.5], ['11', 11]] },
    ns: { s: 'n<sub>s</sub>', n: 'Synchrondrehzahl', u: DREHZ },
    pp: { s: 'p', n: 'Polpaarzahl', u: OHNE, p: [['1', 1], ['2', 2], ['3', 3], ['4', 4]] },
    slip: { s: 's', n: 'Schlupf', u: PROZ, neg: true },

    // Zylinder
    pd: { s: 'p', n: 'Druck (Überdruck)', u: [['bar', 1e5], ['kPa', 1e3], ['MPa', 1e6], ['Pa', 1]], p: [['6 bar', 6], ['10 bar', 10], ['160 bar', 160]] },
    AK: { s: 'A', n: 'Kolbenfläche', u: [['cm²', 1e-4], ['mm²', 1e-6], ['m²', 1]] },
    dK: { s: 'd', n: 'Kolbendurchmesser', u: [['mm', 1e-3]], p: [['32', 32], ['40', 40], ['50', 50], ['63', 63], ['80', 80], ['100', 100]] },
    FK: { s: 'F', n: 'Kolbenkraft', u: NEWTON },
    QV: { s: 'Q', n: 'Volumenstrom', u: [['l/min', 1e-3 / 60], ['m³/h', 1 / 3600], ['m³/s', 1]] },
    vK: { s: 'v', n: 'Kolbengeschwindigkeit', u: [['m/s', 1], ['mm/s', 1e-3], ['m/min', 1 / 60]] },
    Phyd: { s: 'P', n: 'Hydraulische Leistung', u: KW },
    sH: { s: 's', n: 'Hub', u: [['mm', 1e-3]] },
    Vl: { s: 'V', n: 'Luftverbrauch je Hub', u: [['l', 1e-3]] },
    nH: { s: 'z', n: 'Hübe pro Minute', u: [['1/min', 1 / 60]] },
    QL: { s: 'Q<sub>L</sub>', n: 'Luftbedarf', u: [['l/min', 1e-3 / 60], ['m³/h', 1 / 3600]] },
    Sf: { s: 'S', n: 'Sicherheitszuschlag', u: OHNE, p: [['1,25', 1.25], ['1,5', 1.5], ['2', 2]] },

    // Festigkeit
    AS: { s: 'A', n: 'Querschnittsfläche', u: [['mm²', 1e-6], ['cm²', 1e-4]] },
    dS: { s: 'd', n: 'Durchmesser Stab/Bolzen', u: [['mm', 1e-3]] },
    sigma: { s: 'σ', n: 'Zug-/Druckspannung', u: NMM2 },
    tauS: { s: 'τ', n: 'Scherspannung', u: NMM2 },
    nS: { s: 'n', n: 'Anzahl Scherflächen', u: OHNE, p: [['einschnittig', 1], ['zweischnittig', 2]] },
    Re: { s: 'R<sub>e</sub>', n: 'Streckgrenze', u: NMM2, p: [['S235', 235], ['S355', 355], ['8.8', 640], ['10.9', 900]] },
    Sv: { s: 'ν', n: 'Sicherheitszahl', u: OHNE, p: [['1,5', 1.5], ['2', 2]] },
    szul: { s: 'σ<sub>zul</sub>', n: 'Zulässige Spannung', u: NMM2 },
    ausl: { s: 'σ/σ<sub>zul</sub>', n: 'Auslastung', u: PROZ },
    E: { s: 'E', n: 'Elastizitätsmodul', u: NMM2, p: [['Stahl 210000', 210000], ['Alu 70000', 70000]] },
    eps: { s: 'ε', n: 'Dehnung', u: PROZ, neg: true },
    l0: { s: 'l<sub>0</sub>', n: 'Ausgangslänge', u: [['mm', 1e-3], ['m', 1]] },
    dl: { s: 'Δl', n: 'Längenänderung', u: [['mm', 1e-3], ['µm', 1e-6]], neg: true },

    // Wärme
    Qw: { s: 'Q', n: 'Wärmemenge', u: [['kJ', 1e3], ['J', 1], ['kWh', 3.6e6]] },
    c: { s: 'c', n: 'Spez. Wärmekapazität', u: [['kJ/(kg·K)', 1e3]], p: [['Wasser 4,19', 4.19], ['Öl 1,9', 1.9], ['Alu 0,90', 0.90], ['Stahl 0,46', 0.46]] },
    dT: { s: 'ΔT', n: 'Temperaturdifferenz', u: [['K', 1]], neg: true },
    Pth: { s: 'P', n: 'Heizleistung', u: KW },
    alphaL: { s: 'α', n: 'Längenausdehnungskoeffizient', u: [['10⁻⁶/K', 1e-6]], p: [['Stahl 12', 12], ['Kupfer 17', 17], ['Alu 24', 24]] },
    R20: { s: 'R<sub>20</sub>', n: 'Widerstand bei 20 °C', u: OHM },
    RT: { s: 'R<sub>ϑ</sub>', n: 'Widerstand warm', u: OHM },
    alphaR: { s: 'α<sub>20</sub>', n: 'Temperaturbeiwert', u: [['1/K', 1]], p: [['Kupfer 0,0039', 0.0039], ['Alu 0,0040', 0.004]] },

    // Sensorik
    X: { s: 'x', n: 'Messwert', u: OHNE, neg: true },
    Xmin: { s: 'x<sub>min</sub>', n: 'Messbereich Anfang', u: OHNE, neg: true },
    Xmax: { s: 'x<sub>max</sub>', n: 'Messbereich Ende', u: OHNE, neg: true },
    Is: { s: 'I', n: 'Stromsignal 4…20 mA', u: [['mA', 1e-3]] },
    Us: { s: 'U', n: 'Spannungssignal 0…10 V', u: [['V', 1]], neg: true },
    D: { s: 'D', n: 'SPS-Analogwert (S7)', u: OHNE, neg: true },
    R0: { s: 'R<sub>0</sub>', n: 'Nennwiderstand bei 0 °C', u: [['Ω', 1]], p: [['PT100', 100], ['PT1000', 1000]] },
    Rpt: { s: 'R', n: 'Fühlerwiderstand', u: [['Ω', 1]] },
    Tpt: { s: 'ϑ', n: 'Temperatur', u: [['°C', 1]], neg: true },

    // Instandhaltung
    TB: { s: 'T<sub>B</sub>', n: 'Betriebszeit', u: [['h', 3600]] },
    nA: { s: 'n', n: 'Anzahl Ausfälle', u: OHNE },
    TR: { s: 'T<sub>R</sub>', n: 'Reparaturzeit gesamt', u: [['h', 3600], ['min', 60]] },
    MTBF: { s: 'MTBF', n: 'Mittlere Zeit zwischen Ausfällen', u: [['h', 3600]] },
    MTTR: { s: 'MTTR', n: 'Mittlere Reparaturdauer', u: [['h', 3600], ['min', 60]] },
    lam: { s: 'λ', n: 'Ausfallrate', u: [['1/h', 1 / 3600], ['1/1000 h', 1 / 3.6e6]] },
    Vf: { s: 'V', n: 'Verfügbarkeit', u: PROZ },
    Lf: { s: 'L', n: 'Leistungsgrad', u: PROZ },
    Qf: { s: 'Q', n: 'Qualitätsrate', u: PROZ },
    OEE: { s: 'OEE', n: 'Gesamtanlageneffektivität', u: PROZ },

    // Energiekosten
    tTag: { s: 't<sub>Tag</sub>', n: 'Laufzeit pro Tag', u: [['h', 3600]], p: [['8 h', 8], ['16 h', 16], ['24 h', 24]] },
    Tage: { s: 'N', n: 'Betriebstage pro Jahr', u: [['Tage', 1]], p: [['250', 250], ['365', 365]] },
    LF: { s: 'LF', n: 'Auslastung (Teillast)', u: PROZ, p: [['100 %', 100], ['75 %', 75], ['50 %', 50]] }
  };

  /* Formeln: y = f(x). Nach jeder anderen Größe wird numerisch aufgelöst. */
  const F = {};
  function fx(id, n, eq, y, x, f, info) { F[id] = { id, n, eq, y, x, f, info: info || '' }; }

  // Gleichstrom
  fx('ohm', 'Ohmsches Gesetz', 'U = R · I', 'U', ['R', 'I'], v => v.R * v.I);
  fx('p_ui', 'Leistung', 'P = U · I', 'P', ['U', 'I'], v => v.U * v.I);
  fx('p_ir', 'Leistung über Strom', 'P = I² · R', 'P', ['I', 'R'], v => v.I * v.I * v.R);
  fx('p_ur', 'Leistung über Spannung', 'P = U² / R', 'P', ['U', 'R'], v => v.U * v.U / v.R);
  fx('w_pt', 'Elektrische Arbeit', 'W = P · t', 'W', ['P', 't'], v => v.P * v.t);
  fx('kosten', 'Energiekosten', 'K = W · k', 'K', ['W', 'k'], v => v.W * v.k);
  // Widerstände
  fx('reihe', 'Reihenschaltung', 'R<sub>r</sub> = R<sub>1</sub> + R<sub>2</sub>', 'Rr', ['R1', 'R2'], v => v.R1 + v.R2);
  fx('parallel', 'Parallelschaltung', 'R<sub>p</sub> = R<sub>1</sub> · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', 'Rp', ['R1', 'R2'], v => v.R1 * v.R2 / (v.R1 + v.R2), 'Bei gleichen Widerständen: R<sub>p</sub> = R / Anzahl');
  fx('teiler', 'Unbelasteter Spannungsteiler', 'U<sub>a</sub> = U<sub>e</sub> · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', 'Ua', ['Ue', 'R1', 'R2'], v => v.Ue * v.R2 / (v.R1 + v.R2));
  // Leitung
  fx('r_leiter', 'Leiterwiderstand', 'R<sub>L</sub> = l / (κ · A)', 'RL', ['l', 'kappa', 'AL'], v => v.l / (v.kappa * v.AL));
  fx('kappa_rho', 'Leitfähigkeit', 'κ = 1 / ρ', 'kappa', ['rho'], v => 1 / v.rho);
  fx('du1', 'Spannungsfall Wechselstrom', 'ΔU = 2 · l · I · cos φ / (κ · A)', 'dU', ['l', 'I', 'cosphi', 'kappa', 'AL'], v => 2 * v.l * v.I * v.cosphi / (v.kappa * v.AL), 'Hin- und Rückleiter, deshalb Faktor 2.');
  fx('dup', 'Spannungsfall in Prozent', 'Δu = ΔU / U', 'dUp', ['dU', 'U'], v => v.dU / v.U, 'Übliche Richtwerte: 3 % bis 4 %, je nach Norm und Anlage.');
  fx('pv1', 'Leitungsverluste 1~', 'P<sub>V</sub> = 2 · I² · R<sub>L</sub>', 'PV', ['I', 'RL'], v => 2 * v.I * v.I * v.RL);
  // Wechselstrom
  fx('p1', 'Wirkleistung 1~', 'P = U · I · cos φ', 'P', ['U', 'I', 'cosphi'], v => v.U * v.I * v.cosphi);
  fx('s1', 'Scheinleistung 1~', 'S = U · I', 'S', ['U', 'I'], v => v.U * v.I);
  fx('q', 'Blindleistung', 'Q = √(S² − P²)', 'Qb', ['S', 'P'], v => Math.sqrt(v.S * v.S - v.P * v.P), 'Leistungsdreieck: S² = P² + Q²');
  fx('z', 'Scheinwiderstand', 'Z = U / I', 'Z', ['U', 'I'], v => v.U / v.I);
  fx('xl', 'Induktiver Blindwiderstand', 'X<sub>L</sub> = 2π · f · L', 'XL', ['f', 'L'], v => 2 * PI * v.f * v.L);
  fx('xc', 'Kapazitiver Blindwiderstand', 'X<sub>C</sub> = 1 / (2π · f · C)', 'XC', ['f', 'C'], v => 1 / (2 * PI * v.f * v.C));
  // Drehstrom
  fx('p3', 'Wirkleistung 3~', 'P = √3 · U · I · cos φ', 'P', ['U', 'I', 'cosphi'], v => W3 * v.U * v.I * v.cosphi, 'U ist die Außenleiterspannung (z. B. 400 V).');
  fx('s3', 'Scheinleistung 3~', 'S = √3 · U · I', 'S', ['U', 'I'], v => W3 * v.U * v.I);
  fx('ustr', 'Strangspannung Stern', 'U<sub>Str</sub> = U / √3', 'Ustr', ['U'], v => v.U / W3);
  // Kondensator & Spule
  fx('qc', 'Ladung', 'Q = C · U', 'Qc', ['C', 'U'], v => v.C * v.U);
  fx('wc', 'Energie Kondensator', 'W<sub>C</sub> = ½ · C · U²', 'EC', ['C', 'U'], v => 0.5 * v.C * v.U * v.U);
  fx('tauc', 'Zeitkonstante RC', 'τ<sub>C</sub> = R · C', 'tauC', ['R', 'C'], v => v.R * v.C, 'Nach 1 τ ca. 63 %, nach 5 τ praktisch voll geladen.');
  fx('taul', 'Zeitkonstante RL', 'τ<sub>L</sub> = L / R', 'tauL', ['L', 'R'], v => v.L / v.R);
  fx('wl', 'Energie Spule', 'W<sub>L</sub> = ½ · L · I²', 'EL', ['L', 'I'], v => 0.5 * v.L * v.I * v.I);
  // Mechanik
  fx('fma', 'Grundgesetz der Dynamik', 'F = m · a', 'F', ['m', 'a'], v => v.m * v.a);
  fx('fg', 'Gewichtskraft', 'F<sub>G</sub> = m · g', 'FG', ['m'], v => v.m * g, 'g = 9,81 m/s²');
  fx('vst', 'Geschwindigkeit', 'v = s / t', 'v', ['s', 't'], v => v.s / v.t);
  fx('wfs', 'Mechanische Arbeit', 'W = F · s', 'Wm', ['F', 's'], v => v.F * v.s);
  fx('pwt', 'Leistung aus Arbeit', 'P = W / t', 'Pm', ['Wm', 't'], v => v.Wm / v.t);
  fx('pfv', 'Leistung aus Kraft', 'P = F · v', 'Pm', ['F', 'v'], v => v.F * v.v);
  fx('ekin', 'Bewegungsenergie', 'E<sub>kin</sub> = ½ · m · v²', 'Ekin', ['m', 'v'], v => 0.5 * v.m * v.v * v.v);
  fx('epot', 'Lageenergie', 'E<sub>pot</sub> = m · g · h', 'Epot', ['m', 'h'], v => v.m * g * v.h);
  fx('fr', 'Reibkraft', 'F<sub>R</sub> = μ · F<sub>N</sub>', 'FR', ['mu', 'FN'], v => v.mu * v.FN);
  // Drehbewegung
  fx('mfr', 'Drehmoment', 'M = F · r', 'M', ['F', 'r'], v => v.F * v.r);
  fx('d2r', 'Durchmesser', 'd = 2 · r', 'd', ['r'], v => 2 * v.r);
  fx('omega', 'Winkelgeschwindigkeit', 'ω = 2π · n', 'omega', ['n'], v => 2 * PI * v.n);
  fx('pmw', 'Leistung Drehbewegung', 'P = M · ω', 'Pm', ['M', 'omega'], v => v.M * v.omega, 'Faustformel: M = 9550 · P[kW] / n[1/min]');
  fx('vpdn', 'Umfangsgeschwindigkeit', 'v = π · d · n', 'v', ['d', 'n'], v => PI * v.d * v.n);
  // Getriebe
  fx('i_n', 'Übersetzung aus Drehzahlen', 'i = n<sub>1</sub> / n<sub>2</sub>', 'i', ['n1', 'n2'], v => v.n1 / v.n2, 'i > 1: ins Langsame, i < 1: ins Schnelle');
  fx('i_z', 'Übersetzung Zahnräder', 'i = z<sub>2</sub> / z<sub>1</sub>', 'i', ['z1', 'z2'], v => v.z2 / v.z1);
  fx('i_d', 'Übersetzung Riementrieb', 'i = d<sub>2</sub> / d<sub>1</sub>', 'i', ['d1', 'd2'], v => v.d2 / v.d1);
  fx('m2', 'Abtriebsmoment', 'M<sub>2</sub> = M<sub>1</sub> · i · η', 'M2', ['M1', 'i', 'eta'], v => v.M1 * v.i * v.eta);
  fx('p_an', 'Antriebsleistung', 'P = M<sub>1</sub> · 2π · n<sub>1</sub>', 'Pm', ['M1', 'n1'], v => v.M1 * 2 * PI * v.n1);
  // Motor
  fx('pzu3', 'Aufgenommene Leistung 3~', 'P<sub>zu</sub> = √3 · U · I · cos φ', 'Pzu', ['U', 'I', 'cosphi'], v => W3 * v.U * v.I * v.cosphi);
  fx('pab', 'Wirkungsgrad', 'P<sub>ab</sub> = η · P<sub>zu</sub>', 'Pab', ['eta', 'Pzu'], v => v.eta * v.Pzu, 'Auf dem Typenschild steht immer P<sub>ab</sub> (Wellenleistung).');
  fx('m_mot', 'Drehmoment an der Welle', 'M = P<sub>ab</sub> / (2π · n)', 'M', ['Pab', 'n'], v => v.Pab / (2 * PI * v.n), 'Faustformel: M = 9550 · P[kW] / n[1/min]');
  fx('ns', 'Synchrondrehzahl', 'n<sub>s</sub> = f / p', 'ns', ['f', 'pp'], v => v.f / v.pp, '50 Hz: p = 1 → 3000, p = 2 → 1500, p = 3 → 1000 1/min');
  fx('slip', 'Schlupf', 's = (n<sub>s</sub> − n) / n<sub>s</sub>', 'slip', ['ns', 'n'], v => (v.ns - v.n) / v.ns);
  // Zylinder
  fx('ak', 'Kolbenfläche', 'A = π · d² / 4', 'AK', ['dK'], v => PI * v.dK * v.dK / 4);
  fx('fk', 'Kolbenkraft', 'F = p · A · η', 'FK', ['pd', 'AK', 'eta'], v => v.pd * v.AK * v.eta, 'Rückhub: Ringfläche ohne Kolbenstange einsetzen.');
  fx('qv', 'Volumenstrom', 'Q = A · v', 'QV', ['AK', 'vK'], v => v.AK * v.vK);
  fx('phyd', 'Hydraulische Leistung', 'P = p · Q', 'Phyd', ['pd', 'QV'], v => v.pd * v.QV);
  fx('vl', 'Luftverbrauch je Hub', 'V = A · s · (p + 1,013 bar) / 1,013 bar', 'Vl', ['AK', 'sH', 'pd'], v => v.AK * v.sH * (v.pd + 101300) / 101300, 'Angesaugte Luft, einfachwirkend. Doppeltwirkend ca. doppelt so viel.');
  fx('ql', 'Luftbedarf', 'Q<sub>L</sub> = V · z', 'QL', ['Vl', 'nH'], v => v.Vl * v.nH);
  // Festigkeit
  fx('as', 'Kreisquerschnitt', 'A = π · d² / 4', 'AS', ['dS'], v => PI * v.dS * v.dS / 4);
  fx('sig', 'Zug-/Druckspannung', 'σ = F / A', 'sigma', ['F', 'AS'], v => v.F / v.AS);
  fx('tau', 'Scherspannung', 'τ = F / (n · A)', 'tauS', ['F', 'nS', 'AS'], v => v.F / (v.nS * v.AS));
  fx('szul', 'Zulässige Spannung', 'σ<sub>zul</sub> = R<sub>e</sub> / ν', 'szul', ['Re', 'Sv'], v => v.Re / v.Sv);
  fx('ausl', 'Auslastung', 'Auslastung = σ / σ<sub>zul</sub>', 'ausl', ['sigma', 'szul'], v => v.sigma / v.szul, 'Über 100 % ist das Bauteil zu schwach.');
  fx('hooke', 'Hookesches Gesetz', 'σ = E · ε', 'sigma', ['E', 'eps'], v => v.E * v.eps, 'Gilt nur im elastischen Bereich (unter R<sub>e</sub>).');
  fx('eps', 'Dehnung', 'ε = Δl / l<sub>0</sub>', 'eps', ['dl', 'l0'], v => v.dl / v.l0);
  // Wärme
  fx('qmc', 'Wärmemenge', 'Q = m · c · ΔT', 'Qw', ['m', 'c', 'dT'], v => v.m * v.c * v.dT, '1 Liter Wasser ≈ 1 kg');
  fx('pqt', 'Heizleistung', 'P = Q / t', 'Pth', ['Qw', 't'], v => v.Qw / v.t);
  fx('dl', 'Längenausdehnung', 'Δl = α · l<sub>0</sub> · ΔT', 'dl', ['alphaL', 'l0', 'dT'], v => v.alphaL * v.l0 * v.dT);
  fx('rt', 'Widerstand bei Erwärmung', 'R<sub>ϑ</sub> = R<sub>20</sub> · (1 + α<sub>20</sub> · ΔT)', 'RT', ['R20', 'alphaR', 'dT'], v => v.R20 * (1 + v.alphaR * v.dT), 'So misst man die Wicklungserwärmung eines Motors (ΔT = ϑ − 20 °C).');
  // Sensorik
  fx('ma', 'Stromsignal 4…20 mA', 'x = x<sub>min</sub> + (I − 4 mA) / 16 mA · (x<sub>max</sub> − x<sub>min</sub>)', 'X', ['Xmin', 'Xmax', 'Is'], v => v.Xmin + (v.Is - 0.004) / 0.016 * (v.Xmax - v.Xmin), 'Unter ca. 3,6 mA: Drahtbruch. Deshalb Live Zero bei 4 mA.');
  fx('v10', 'Spannungssignal 0…10 V', 'x = x<sub>min</sub> + U / 10 V · (x<sub>max</sub> − x<sub>min</sub>)', 'X', ['Xmin', 'Xmax', 'Us'], v => v.Xmin + v.Us / 10 * (v.Xmax - v.Xmin));
  fx('s7', 'SPS-Analogwert (S7)', 'x = x<sub>min</sub> + D / 27648 · (x<sub>max</sub> − x<sub>min</sub>)', 'X', ['Xmin', 'Xmax', 'D'], v => v.Xmin + v.D / 27648 * (v.Xmax - v.Xmin), 'Siemens S7: Nennbereich 0 bis 27648 (bei 4…20 mA und 0…10 V).');
  fx('pt', 'Platin-Messwiderstand', 'R = R<sub>0</sub> · (1 + A · ϑ + B · ϑ²)', 'Rpt', ['R0', 'Tpt'], v => v.R0 * (1 + 3.9083e-3 * v.Tpt - 5.775e-7 * v.Tpt * v.Tpt), 'A = 3,9083·10⁻³, B = −5,775·10⁻⁷ (DIN EN 60751, für 0 bis 850 °C).');
  // Instandhaltung
  fx('mtbf', 'Mittlere Betriebszeit zwischen Ausfällen', 'MTBF = T<sub>B</sub> / n', 'MTBF', ['TB', 'nA'], v => v.TB / v.nA);
  fx('mttr', 'Mittlere Reparaturdauer', 'MTTR = T<sub>R</sub> / n', 'MTTR', ['TR', 'nA'], v => v.TR / v.nA);
  fx('lam', 'Ausfallrate', 'λ = 1 / MTBF', 'lam', ['MTBF'], v => 1 / v.MTBF);
  fx('verf', 'Technische Verfügbarkeit', 'V = MTBF / (MTBF + MTTR)', 'Vf', ['MTBF', 'MTTR'], v => v.MTBF / (v.MTBF + v.MTTR));
  fx('oee', 'Gesamtanlageneffektivität', 'OEE = V · L · Q', 'OEE', ['Vf', 'Lf', 'Qf'], v => v.Vf * v.Lf * v.Qf, 'Werte über 85 % gelten als Weltklasse.');
  // Kombinationen
  fx('fn_mg', 'Normalkraft auf waagerechtem Band', 'F<sub>N</sub> = m · g', 'FN', ['m'], v => v.m * g);
  fx('band_p', 'Leistung an der Trommel', 'P = F<sub>R</sub> · v', 'Pm', ['FR', 'v'], v => v.FR * v.v);
  fx('band_v', 'Bandgeschwindigkeit', 'v = π · d · n<sub>2</sub>', 'v', ['d', 'n2'], v => PI * v.d * v.n2);
  fx('band_m2', 'Drehmoment an der Trommel', 'M<sub>2</sub> = F<sub>R</sub> · d / 2', 'M2', ['FR', 'd'], v => v.FR * v.d / 2);
  fx('band_pab', 'Nötige Motorleistung', 'P<sub>ab</sub> = P / η', 'Pab', ['Pm', 'eta'], v => v.Pm / v.eta, 'Danach Motor mit Reserve wählen (nächste Normgröße).');
  fx('band_m1', 'Drehmoment am Motor', 'M<sub>1</sub> = P<sub>ab</sub> / (2π · n<sub>1</sub>)', 'M1', ['Pab', 'n1'], v => v.Pab / (2 * PI * v.n1));
  fx('du3', 'Spannungsfall Drehstrom', 'ΔU = √3 · l · I · cos φ / (κ · A)', 'dU', ['l', 'I', 'cosphi', 'kappa', 'AL'], v => W3 * v.l * v.I * v.cosphi / (v.kappa * v.AL));
  fx('pv3', 'Leitungsverluste 3~', 'P<sub>V</sub> = 3 · I² · l / (κ · A)', 'PV', ['I', 'l', 'kappa', 'AL'], v => 3 * v.I * v.I * v.l / (v.kappa * v.AL));
  fx('hz_f', 'Nötige Kraft zum Heben', 'F = m · g · S', 'FK', ['m', 'Sf'], v => v.m * g * v.Sf, 'Ergebnis-Durchmesser auf die nächste Normgröße aufrunden (32, 40, 50, 63, 80, 100 mm).');
  fx('er_w', 'Elektrische Energie', 'W = Q / η', 'W', ['Qw', 'eta'], v => v.Qw / v.eta);
  fx('er_p', 'Aufheizzeit', 'P = W / t', 'P', ['W', 't'], v => v.W / v.t);
  fx('ek_t', 'Laufzeit pro Jahr', 't = t<sub>Tag</sub> · N', 't', ['tTag', 'Tage'], v => v.tTag * v.Tage);
  fx('ek_w', 'Energie pro Jahr', 'W = P<sub>zu</sub> · LF · t', 'W', ['Pzu', 'LF', 't'], v => v.Pzu * v.LF * v.t, 'Vereinfachung: Wirkungsgrad bei Teillast wie bei Volllast.');

  /* Bereiche: jede Gruppe ist ein in sich stimmiges Gleichungssystem */
  const KAT = [
    { id: 'band', gruppe: 'praxis', n: 'Förderband auslegen', d: 'Von der Last auf dem Band bis zum Motor: Reibkraft, Leistung, Getriebeübersetzung und Drehmomente. Ohne Anfahrbeschleunigung.',
      f: ['fn_mg', 'fr', 'band_p', 'band_v', 'i_n', 'band_m2', 'band_pab', 'band_m1'], bsp: { m: 300, mu: 0.3, v: 0.5, d: 200, n1: 1400, eta: 85 }, e: { Pm: 'W', Pab: 'W' } },
    { id: 'zuleitung', gruppe: 'praxis', n: 'Motorzuleitung prüfen', d: 'Reicht der Querschnitt? Aus Typenschild und Leitungslänge folgen Strom, Spannungsfall und Leitungsverluste.',
      f: ['pab', 'pzu3', 'du3', 'dup', 'pv3'], bsp: { Pab: 7.5, eta: 88, cosphi: 0.84, U: 400, l: 60, AL: 2.5, kappa: 56 } },
    { id: 'hubzylinder', gruppe: 'praxis', n: 'Zylinder für eine Last', d: 'Welcher Kolbendurchmesser hebt die Last sicher, und wie viel Druckluft braucht das?',
      f: ['hz_f', 'fk', 'ak', 'vl', 'ql'], bsp: { m: 80, Sf: 1.5, pd: 6, eta: 90, sH: 300, nH: 10 } },
    { id: 'erwaermen', gruppe: 'praxis', n: 'Wasser oder Öl erwärmen', d: 'Wie lange dauert das Aufheizen und was kostet es? Für Boiler, Ölbehälter, Reinigungsbäder.',
      f: ['qmc', 'er_w', 'er_p', 'kosten'], bsp: { m: 80, c: 4.19, dT: 45, eta: 95, P: 2, k: 0.30 }, e: { P: 'kW', t: 'min', Qw: 'kWh' } },
    { id: 'energiekosten', gruppe: 'praxis', n: 'Energiekosten einer Maschine', d: 'Was kostet ein Motor im Jahr? Gut für Argumente bei Effizienzmotoren, Frequenzumrichtern oder Abschalten im Leerlauf.',
      f: ['pab', 'ek_t', 'ek_w', 'kosten'], bsp: { Pab: 11, eta: 91, LF: 75, tTag: 16, Tage: 250, k: 0.25 }, e: { t: 'h' } },

    { id: 'gleich', gruppe: 'grund', n: 'Gleichstrom & Ohm', d: 'Ohmsches Gesetz, Leistung, Arbeit und Energiekosten.',
      f: ['ohm', 'p_ui', 'p_ir', 'p_ur', 'w_pt', 'kosten'], bsp: { U: 24, R: 12, t: 8, k: 0.30 }, e: { t: 'h' } },
    { id: 'widerstand', gruppe: 'grund', n: 'Widerstandsschaltungen', d: 'Reihe, parallel und Spannungsteiler mit zwei Widerständen.',
      f: ['reihe', 'parallel', 'teiler'], bsp: { R1: 10, R2: 4.7, Ue: 24 }, e: { R1: 'kΩ', R2: 'kΩ', Rr: 'kΩ', Rp: 'kΩ' } },
    { id: 'leitung', gruppe: 'grund', n: 'Leitung & Spannungsfall', d: 'Leiterwiderstand und Spannungsfall bei Wechselstrom (Hin- und Rückleiter).',
      f: ['r_leiter', 'kappa_rho', 'du1', 'dup', 'pv1'], bsp: { l: 25, AL: 1.5, kappa: 56, I: 16, cosphi: 1, U: 230 } },
    { id: 'wechsel', gruppe: 'grund', n: 'Wechselstrom 1~', d: 'Wirk-, Schein- und Blindleistung, Blindwiderstände.',
      f: ['p1', 's1', 'q', 'z', 'xl', 'xc'], bsp: { U: 230, I: 4, cosphi: 0.8, f: 50 } },
    { id: 'dreh', gruppe: 'grund', n: 'Drehstrom 3~', d: 'Leistungen im Drehstromnetz, Stern- und Außenleiterspannung.',
      f: ['p3', 's3', 'q', 'ustr'], bsp: { U: 400, I: 16, cosphi: 0.85 }, e: { P: 'kW', S: 'kVA', Qb: 'kvar' } },
    { id: 'kond', gruppe: 'grund', n: 'Kondensator & Spule', d: 'Ladung, gespeicherte Energie, Zeitkonstanten und Blindwiderstände.',
      f: ['qc', 'wc', 'tauc', 'taul', 'wl', 'xl', 'xc'], bsp: { C: 470, U: 24, R: 1, f: 50 }, e: { R: 'kΩ' } },
    { id: 'motor', gruppe: 'grund', n: 'Drehstrommotor', d: 'Typenschild auswerten: Wirkungsgrad, Drehmoment, Synchrondrehzahl und Schlupf.',
      f: ['pzu3', 'pab', 'm_mot', 'ns', 'slip'], bsp: { Pab: 4, U: 400, I: 8.2, cosphi: 0.82, n: 1440, f: 50, pp: 2 } },
    { id: 'mech', gruppe: 'grund', n: 'Kraft & Bewegung', d: 'Kraft, Arbeit, Leistung, Energie und Reibung.',
      f: ['fma', 'fg', 'vst', 'wfs', 'pwt', 'pfv', 'ekin', 'epot', 'fr'], bsp: { m: 50, a: 2, s: 4, t: 2, h: 1.5 } },
    { id: 'drehbew', gruppe: 'grund', n: 'Drehbewegung', d: 'Drehmoment, Winkelgeschwindigkeit, Leistung und Umfangsgeschwindigkeit.',
      f: ['mfr', 'd2r', 'omega', 'pmw', 'vpdn', 'pfv'], bsp: { n: 1450, Pm: 4, d: 200 }, e: { Pm: 'kW' } },
    { id: 'getriebe', gruppe: 'grund', n: 'Getriebe & Riementrieb', d: 'Übersetzung über Drehzahlen, Zähnezahlen oder Scheibendurchmesser, Momente am Abtrieb.',
      f: ['i_n', 'i_z', 'i_d', 'm2', 'p_an'], bsp: { n1: 1450, z1: 18, z2: 54, M1: 26, eta: 95 }, e: { Pm: 'kW' } },
    { id: 'zylinder', gruppe: 'grund', n: 'Pneumatik & Hydraulik', d: 'Kolbenkraft, Volumenstrom, Leistung und Luftverbrauch von Zylindern.',
      f: ['ak', 'fk', 'qv', 'phyd', 'vl', 'ql'], bsp: { pd: 6, dK: 50, eta: 90, vK: 0.2, sH: 200, nH: 20 } },
    { id: 'festigkeit', gruppe: 'grund', n: 'Festigkeit', d: 'Zug, Druck, Abscherung, zulässige Spannung und Dehnung.',
      f: ['as', 'sig', 'tau', 'szul', 'ausl', 'hooke', 'eps'], bsp: { F: 10, dS: 12, nS: 1, Re: 235, Sv: 1.5, E: 210000, l0: 500 }, e: { F: 'kN' } },
    { id: 'waerme', gruppe: 'grund', n: 'Wärme & Temperatur', d: 'Wärmemenge, Heizleistung, Längenausdehnung und Widerstand bei Erwärmung.',
      f: ['qmc', 'pqt', 'dl', 'rt'], bsp: { m: 10, c: 4.19, dT: 50, Pth: 2, alphaL: 12, l0: 2000 }, e: { t: 'min' } },
    { id: 'sensor', gruppe: 'grund', n: 'Sensorik & SPS', d: 'Analogsignale skalieren (4…20 mA, 0…10 V, S7-Digits) und PT100/PT1000 umrechnen.',
      f: ['ma', 'v10', 's7', 'pt'], bsp: { Xmin: 0, Xmax: 10, Is: 12, R0: 100, Tpt: 80 } },
    { id: 'kennzahlen', gruppe: 'grund', n: 'Instandhaltungs-Kennzahlen', d: 'MTBF, MTTR, Ausfallrate, Verfügbarkeit und OEE.',
      f: ['mtbf', 'mttr', 'lam', 'verf', 'oee'], bsp: { TB: 2000, nA: 8, TR: 12, Lf: 90, Qf: 98 } }
  ];

  /* ---------- Erweiterung: weitere Bereiche ---------- */
  const A_ = [['A', 1], ['mA', 1e-3]];
  const VOLT = [['V', 1], ['kV', 1e3]];
  const NM = [['Nm', 1]];
  Object.assign(V, {
    RStr: { s: 'R<sub>Str</sub>', n: 'Strangwiderstand', u: OHM },
    IY: { s: 'I<sub>Y</sub>', n: 'Leiterstrom in Stern', u: A_ },
    ID: { s: 'I<sub>Δ</sub>', n: 'Leiterstrom in Dreieck', u: A_ },
    PY: { s: 'P<sub>Y</sub>', n: 'Leistung in Stern', u: KW },
    PD: { s: 'P<sub>Δ</sub>', n: 'Leistung in Dreieck', u: KW },
    cos1: { s: 'cos φ<sub>1</sub>', n: 'Leistungsfaktor vorher', u: OHNE, p: [['0,7', 0.7], ['0,8', 0.8]] },
    cos2: { s: 'cos φ<sub>2</sub>', n: 'Leistungsfaktor Ziel', u: OHNE, p: [['0,9', 0.9], ['0,95', 0.95]] },
    QC: { s: 'Q<sub>C</sub>', n: 'Nötige Kondensatorleistung', u: [['kvar', 1e3], ['var', 1]] },
    CD: { s: 'C<sub>Δ</sub>', n: 'Kapazität je Kondensator (Dreieck)', u: [['µF', 1e-6]] },
    f0: { s: 'f<sub>0</sub>', n: 'Resonanzfrequenz', u: [['Hz', 1], ['kHz', 1e3]] },
    U1: { s: 'U<sub>1</sub>', n: 'Primärspannung', u: VOLT, p: [['230', 230], ['400', 400]] },
    U2: { s: 'U<sub>2</sub>', n: 'Sekundärspannung', u: VOLT, p: [['24', 24], ['230', 230]] },
    N1: { s: 'N<sub>1</sub>', n: 'Windungen primär', u: OHNE },
    N2: { s: 'N<sub>2</sub>', n: 'Windungen sekundär', u: OHNE },
    I1: { s: 'I<sub>1</sub>', n: 'Strom primär', u: A_ },
    I2: { s: 'I<sub>2</sub>', n: 'Strom sekundär', u: A_ },
    ue: { s: 'ü', n: 'Übersetzungsverhältnis', u: OHNE },
    St: { s: 'S', n: 'Bemessungsleistung', u: [['VA', 1], ['kVA', 1e3]] },
    uk: { s: 'u<sub>k</sub>', n: 'Kurzschlussspannung', u: PROZ, p: [['4 %', 4], ['6 %', 6]] },
    Ik: { s: 'I<sub>k</sub>', n: 'Dauerkurzschlussstrom sekundär', u: [['A', 1], ['kA', 1e3]] },
    UB: { s: 'U<sub>B</sub>', n: 'Betriebsspannung', u: [['V', 1]], p: [['5 V', 5], ['12 V', 12], ['24 V', 24]] },
    UF: { s: 'U<sub>F</sub>', n: 'Durchlassspannung LED', u: [['V', 1]], p: [['rot 2,0', 2], ['grün 2,2', 2.2], ['weiß/blau 3,2', 3.2]] },
    IF: { s: 'I<sub>F</sub>', n: 'LED-Strom', u: [['mA', 1e-3], ['A', 1]], p: [['10 mA', 10], ['20 mA', 20]] },
    RV: { s: 'R<sub>V</sub>', n: 'Vorwiderstand', u: OHM },
    PRV: { s: 'P<sub>R</sub>', n: 'Verlustleistung Vorwiderstand', u: [['W', 1], ['mW', 1e-3]] },
    Uw: { s: 'U', n: 'Effektivwert Wechselspannung', u: [['V', 1]], p: [['230', 230], ['400', 400]] },
    Us_: { s: 'û', n: 'Scheitelwert', u: [['V', 1]] },
    Ud2: { s: 'U<sub>d,B2</sub>', n: 'Gleichspannung Brücke B2 (1~)', u: [['V', 1]] },
    Ud6: { s: 'U<sub>d,B6</sub>', n: 'Gleichspannung Brücke B6 (3~)', u: [['V', 1]] },
    U0: { s: 'U<sub>0</sub>', n: 'Spannung gegen Erde', u: [['V', 1]], p: [['230 V', 230]] },
    In: { s: 'I<sub>n</sub>', n: 'Nennstrom Schutzorgan', u: [['A', 1]], p: [['10', 10], ['13', 13], ['16', 16], ['20', 20], ['32', 32]] },
    kAus: { s: 'k', n: 'Faktor Abschaltstrom', u: OHNE, p: [['B: 5', 5], ['C: 10', 10]] },
    Ia: { s: 'I<sub>a</sub>', n: 'Abschaltstrom (unverzögert)', u: [['A', 1]] },
    Zsmax: { s: 'Z<sub>s,max</sub>', n: 'Max. zulässige Schleifenimpedanz', u: OHM },
    Zn: { s: 'Z<sub>V</sub>', n: 'Schleifenimpedanz an der Verteilung', u: OHM, p: [['0,3 Ω', 0.3], ['0,5 Ω', 0.5]] },
    Zs: { s: 'Z<sub>s</sub>', n: 'Schleifenimpedanz am Leitungsende', u: OHM },
    ausZ: { s: 'Z<sub>s</sub>/Z<sub>s,max</sub>', n: 'Ausnutzung', u: PROZ },
    uc: { s: 'u<sub>C</sub>(t)', n: 'Kondensatorspannung nach Zeit t', u: [['V', 1]] },
    tL: { s: 't', n: 'Ladezeit', u: [['ms', 1e-3], ['s', 1]] },
    rhoM: { s: 'ρ', n: 'Dichte', u: [['kg/dm³', 1e3], ['kg/m³', 1]], p: [['Wasser 1,0', 1], ['Öl 0,87', 0.87], ['Alu 2,7', 2.7], ['Stahl 7,85', 7.85]] },
    Vol: { s: 'V', n: 'Volumen', u: [['l (dm³)', 1e-3], ['cm³', 1e-6], ['m³', 1]] },
    F1: { s: 'F<sub>1</sub>', n: 'Kraft 1', u: NEWTON },
    F2: { s: 'F<sub>2</sub>', n: 'Kraft 2', u: NEWTON },
    l1: { s: 'l<sub>1</sub>', n: 'Hebelarm 1', u: MM },
    l2: { s: 'l<sub>2</sub>', n: 'Hebelarm 2', u: MM },
    nSeil: { s: 'n', n: 'Tragende Seilstränge', u: OHNE, p: [['2', 2], ['4', 4], ['6', 6]] },
    FZ: { s: 'F<sub>Z</sub>', n: 'Zugkraft am Seil', u: NEWTON },
    winkel: { s: 'α', n: 'Neigungswinkel', u: [['°', PI / 180]] },
    FH: { s: 'F<sub>H</sub>', n: 'Hangabtriebskraft', u: NEWTON },
    Fzug: { s: 'F<sub>Zug</sub>', n: 'Zugkraft aufwärts (mit Reibung)', u: NEWTON },
    cF: { s: 'c', n: 'Federrate', u: [['N/mm', 1e3]] },
    sF: { s: 's', n: 'Federweg', u: [['mm', 1e-3]] },
    FF: { s: 'F', n: 'Federkraft', u: NEWTON },
    v0: { s: 'v<sub>0</sub>', n: 'Anfangsgeschwindigkeit', u: [['m/s', 1], ['m/min', 1 / 60], ['km/h', 1 / 3.6]] },
    J: { s: 'J', n: 'Massenträgheitsmoment', u: [['kg·m²', 1]] },
    alphaW: { s: 'α', n: 'Winkelbeschleunigung', u: [['1/s²', 1]] },
    MB: { s: 'M<sub>B</sub>', n: 'Beschleunigungsmoment', u: NM },
    ta: { s: 't<sub>a</sub>', n: 'Hochlaufzeit', u: [['s', 1], ['ms', 1e-3]] },
    modul: { s: 'm', n: 'Modul', u: [['mm', 1e-3]], p: [['1', 1], ['1,5', 1.5], ['2', 2], ['3', 3]] },
    dz1: { s: 'd<sub>1</sub>', n: 'Teilkreis Rad 1', u: MM },
    dz2: { s: 'd<sub>2</sub>', n: 'Teilkreis Rad 2', u: MM },
    aA: { s: 'a', n: 'Achsabstand', u: MM },
    Ph: { s: 'P<sub>h</sub>', n: 'Spindelsteigung', u: [['mm', 1e-3]], p: [['5 mm', 5], ['10 mm', 10], ['20 mm', 20]] },
    vSp: { s: 'v', n: 'Vorschubgeschwindigkeit Spindel', u: [['mm/s', 1e-3], ['m/min', 1 / 60], ['m/s', 1]] },
    MSp: { s: 'M', n: 'Antriebsmoment Spindel', u: NM },
    FSp: { s: 'F', n: 'Vorschubkraft Spindel', u: NEWTON },
    lK: { s: 'l', n: 'Hebellänge (Kragarm)', u: MM },
    Mb: { s: 'M<sub>b</sub>', n: 'Biegemoment', u: NM },
    Wb: { s: 'W', n: 'Widerstandsmoment Biegung', u: [['mm³', 1e-9], ['cm³', 1e-6]] },
    sigb: { s: 'σ<sub>b</sub>', n: 'Biegespannung', u: NMM2 },
    Mt: { s: 'M<sub>t</sub>', n: 'Torsionsmoment', u: NM },
    Wp: { s: 'W<sub>p</sub>', n: 'Polares Widerstandsmoment', u: [['mm³', 1e-9], ['cm³', 1e-6]] },
    taut: { s: 'τ<sub>t</sub>', n: 'Torsionsspannung', u: NMM2 },
    Fp: { s: 'F', n: 'Kraft auf Auflagefläche', u: NEWTON },
    Ap: { s: 'A', n: 'Auflagefläche', u: [['mm²', 1e-6], ['cm²', 1e-4]] },
    pF: { s: 'p', n: 'Flächenpressung', u: NMM2 },
    vc: { s: 'v<sub>c</sub>', n: 'Schnittgeschwindigkeit', u: [['m/min', 1 / 60]], p: [['Stahl HSS 25', 25], ['Alu HSS 60', 60], ['Stahl HM 150', 150]] },
    dW: { s: 'd', n: 'Werkzeug-/Werkstückdurchmesser', u: [['mm', 1e-3]] },
    fV: { s: 'f', n: 'Vorschub je Umdrehung', u: [['mm', 1e-3]], p: [['0,1', 0.1], ['0,15', 0.15], ['0,2', 0.2]] },
    vf: { s: 'v<sub>f</sub>', n: 'Vorschubgeschwindigkeit', u: [['mm/min', 1e-3 / 60]] },
    Lh: { s: 'L', n: 'Vorschubweg', u: [['mm', 1e-3]] },
    th: { s: 't<sub>h</sub>', n: 'Hauptnutzungszeit', u: [['min', 60], ['s', 1]] },
    DG: { s: 'D', n: 'Gewinde-Nenndurchmesser', u: [['mm', 1e-3]], p: [['M5', 5], ['M6', 6], ['M8', 8], ['M10', 10], ['M12', 12]] },
    PG: { s: 'P', n: 'Gewindesteigung', u: [['mm', 1e-3]], p: [['0,8', 0.8], ['1', 1], ['1,25', 1.25], ['1,5', 1.5], ['1,75', 1.75]] },
    dKL: { s: 'd<sub>K</sub>', n: 'Kernlochbohrer', u: [['mm', 1e-3]] },
    Vg: { s: 'V<sub>g</sub>', n: 'Fördervolumen pro Umdrehung', u: [['cm³', 1e-6]] },
    etaV: { s: 'η<sub>vol</sub>', n: 'Volumetrischer Wirkungsgrad', u: PROZ, p: [['95 %', 95]] },
    etaGes: { s: 'η<sub>ges</sub>', n: 'Gesamtwirkungsgrad Pumpe', u: PROZ, p: [['85 %', 85]] },
    PAn: { s: 'P<sub>An</sub>', n: 'Antriebsleistung Pumpe', u: KW },
    dR: { s: 'd<sub>R</sub>', n: 'Rohr-Innendurchmesser', u: [['mm', 1e-3]] },
    vR: { s: 'v', n: 'Strömungsgeschwindigkeit', u: [['m/s', 1]] },
    p1: { s: 'p<sub>1</sub>', n: 'Druck 1 (absolut)', u: [['bar', 1e5]] },
    V1: { s: 'V<sub>1</sub>', n: 'Volumen 1', u: [['l', 1e-3], ['m³', 1]] },
    p2: { s: 'p<sub>2</sub>', n: 'Druck 2 (absolut)', u: [['bar', 1e5]], p: [['Umgebung 1,013', 1.013]] },
    V2: { s: 'V<sub>2</sub>', n: 'Volumen 2', u: [['l', 1e-3], ['m³', 1]] },
    zImp: { s: 'z', n: 'Impulse pro Umdrehung', u: OHNE, p: [['100', 100], ['500', 500], ['1024', 1024], ['2048', 2048]] },
    fEnc: { s: 'f', n: 'Impulsfrequenz', u: [['Hz', 1], ['kHz', 1e3]] },
    dRad: { s: 'd', n: 'Messrad-Durchmesser', u: [['mm', 1e-3]] },
    sImp: { s: 'Δs', n: 'Weg pro Impuls', u: [['mm', 1e-3], ['µm', 1e-6]] },
    wS: { s: 'w', n: 'Sollwert', u: OHNE, neg: true },
    xI: { s: 'x', n: 'Istwert', u: OHNE, neg: true },
    eR: { s: 'e', n: 'Regelabweichung', u: OHNE, neg: true },
    Kp: { s: 'K<sub>P</sub>', n: 'Proportionalbeiwert', u: OHNE },
    yP: { s: 'y', n: 'Stellgröße (P-Anteil)', u: OHNE, neg: true },
    xInf: { s: 'x<sub>∞</sub>', n: 'Endwert nach Sprung', u: OHNE, neg: true },
    T1: { s: 'T', n: 'Zeitkonstante Strecke', u: [['s', 1], ['min', 60]] },
    tSp: { s: 't', n: 'Zeit seit dem Sprung', u: [['s', 1], ['min', 60]] },
    xt: { s: 'x(t)', n: 'Wert zur Zeit t', u: OHNE, neg: true },
    Cdyn: { s: 'C', n: 'Dynamische Tragzahl', u: [['kN', 1e3], ['N', 1]] },
    Plag: { s: 'P', n: 'Äquivalente Lagerbelastung', u: [['kN', 1e3], ['N', 1]] },
    pExp: { s: 'p', n: 'Lebensdauerexponent', u: OHNE, p: [['Kugellager 3', 3], ['Rollenlager 10/3', 10 / 3]] },
    L10: { s: 'L<sub>10</sub>', n: 'Lebensdauer in Mio. Umdrehungen', u: OHNE },
    L10h: { s: 'L<sub>10h</sub>', n: 'Lebensdauer in Betriebsstunden', u: [['h', 3600]] },
    eta1: { s: 'η<sub>alt</sub>', n: 'Wirkungsgrad alter Motor', u: PROZ, p: [['IE1 ca. 87,6 %', 87.6]] },
    eta2: { s: 'η<sub>neu</sub>', n: 'Wirkungsgrad neuer Motor', u: PROZ, p: [['IE3 ca. 91,4 %', 91.4], ['IE4 ca. 93,3 %', 93.3]] },
    Walt: { s: 'W<sub>alt</sub>', n: 'Energie alter Motor pro Jahr', u: [['kWh', 3.6e6]] },
    Wneu: { s: 'W<sub>neu</sub>', n: 'Energie neuer Motor pro Jahr', u: [['kWh', 3.6e6]] },
    dK: { s: 'ΔK', n: 'Ersparnis pro Jahr', u: [['€', 1]] },
    Inv: { s: 'K<sub>M</sub>', n: 'Mehrpreis neuer Motor', u: [['€', 1]] },
    tA: { s: 't<sub>A</sub>', n: 'Amortisationszeit', u: [['Jahre', 1], ['Monate', 1 / 12]] }
  });

  // Elektro
  fx('y_i', 'Leiterstrom Stern', 'I<sub>Y</sub> = U / (√3 · R<sub>Str</sub>)', 'IY', ['U', 'RStr'], v => v.U / (W3 * v.RStr));
  fx('d_i', 'Leiterstrom Dreieck', 'I<sub>Δ</sub> = √3 · U / R<sub>Str</sub>', 'ID', ['U', 'RStr'], v => W3 * v.U / v.RStr, 'Im Dreieck fließt der dreifache Leiterstrom wie in Stern.');
  fx('y_p', 'Leistung Stern', 'P<sub>Y</sub> = U² / R<sub>Str</sub>', 'PY', ['U', 'RStr'], v => v.U * v.U / v.RStr);
  fx('d_p', 'Leistung Dreieck', 'P<sub>Δ</sub> = 3 · U² / R<sub>Str</sub>', 'PD', ['U', 'RStr'], v => 3 * v.U * v.U / v.RStr, 'Gleiche Widerstände in Dreieck: dreifache Leistung wie in Stern.');
  fx('komp_q', 'Kompensationsleistung', 'Q<sub>C</sub> = P · (tan φ<sub>1</sub> − tan φ<sub>2</sub>)', 'QC', ['P', 'cos1', 'cos2'], v => v.P * (Math.tan(Math.acos(v.cos1)) - Math.tan(Math.acos(v.cos2))));
  fx('komp_c', 'Kondensator in Dreieck', 'C<sub>Δ</sub> = Q<sub>C</sub> / (3 · U² · 2π · f)', 'CD', ['QC', 'U', 'f'], v => v.QC / (3 * v.U * v.U * 2 * PI * v.f), 'In Stern geschaltet braucht man die dreifache Kapazität.');
  fx('rlc_z', 'Scheinwiderstand Reihenschwingkreis', 'Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²)', 'Z', ['R', 'XL', 'XC'], v => Math.sqrt(v.R * v.R + (v.XL - v.XC) ** 2), 'Bei Resonanz ist X<sub>L</sub> = X<sub>C</sub> und Z = R.');
  fx('rlc_cos', 'Leistungsfaktor RLC', 'cos φ = R / Z', 'cosphi', ['R', 'Z'], v => v.R / v.Z);
  fx('f0', 'Resonanzfrequenz', 'f<sub>0</sub> = 1 / (2π · √(L · C))', 'f0', ['L', 'C'], v => 1 / (2 * PI * Math.sqrt(v.L * v.C)));
  fx('tr_u', 'Spannungsübersetzung', 'ü = U<sub>1</sub> / U<sub>2</sub>', 'ue', ['U1', 'U2'], v => v.U1 / v.U2);
  fx('tr_n', 'Windungsverhältnis', 'ü = N<sub>1</sub> / N<sub>2</sub>', 'ue', ['N1', 'N2'], v => v.N1 / v.N2);
  fx('tr_i', 'Stromübersetzung', 'I<sub>1</sub> = I<sub>2</sub> / ü', 'I1', ['I2', 'ue'], v => v.I2 / v.ue, 'Idealer Transformator ohne Verluste.');
  fx('tr_s', 'Bemessungsleistung', 'S = U<sub>2</sub> · I<sub>2</sub>', 'St', ['U2', 'I2'], v => v.U2 * v.I2);
  fx('tr_ik', 'Kurzschlussstrom', 'I<sub>k</sub> = I<sub>2</sub> / u<sub>k</sub>', 'Ik', ['I2', 'uk'], v => v.I2 / v.uk, 'Mit I<sub>2</sub> als Bemessungsstrom und starrem Netz.');
  fx('led', 'LED-Vorwiderstand', 'R<sub>V</sub> = (U<sub>B</sub> − U<sub>F</sub>) / I<sub>F</sub>', 'RV', ['UB', 'UF', 'IF'], v => (v.UB - v.UF) / v.IF, 'Nächsten größeren Normwert (E12) nehmen.');
  fx('led_p', 'Verlustleistung Vorwiderstand', 'P<sub>R</sub> = (U<sub>B</sub> − U<sub>F</sub>) · I<sub>F</sub>', 'PRV', ['UB', 'UF', 'IF'], v => (v.UB - v.UF) * v.IF);
  fx('scheitel', 'Scheitelwert', 'û = √2 · U', 'Us_', ['Uw'], v => Math.SQRT2 * v.Uw);
  fx('b2', 'Brückengleichrichter B2', 'U<sub>d</sub> = 0,9 · U', 'Ud2', ['Uw'], v => 0.9 * v.Uw, 'Mittelwert ohne Glättung. Mit Glättungskondensator nahe û.');
  fx('b6', 'Drehstrombrücke B6', 'U<sub>d</sub> = 1,35 · U', 'Ud6', ['Uw'], v => 1.35 * v.Uw, 'U ist hier die Außenleiterspannung (400 V → 540 V).');
  fx('abs_ia', 'Abschaltstrom', 'I<sub>a</sub> = k · I<sub>n</sub>', 'Ia', ['kAus', 'In'], v => v.kAus * v.In, 'LS-Schalter B: 5 · I<sub>n</sub>, C: 10 · I<sub>n</sub> (sicher unverzögert)');
  fx('abs_zs', 'Abschaltbedingung', 'Z<sub>s,max</sub> = U<sub>0</sub> / I<sub>a</sub>', 'Zsmax', ['U0', 'Ia'], v => v.U0 / v.Ia, 'Bedingung: Z<sub>s</sub> · I<sub>a</sub> ≤ U<sub>0</sub>');
  fx('abs_zl', 'Schleifenimpedanz am Ende', 'Z<sub>s</sub> = Z<sub>V</sub> + 2 · l / (κ · A)', 'Zs', ['Zn', 'l', 'kappa', 'AL'], v => v.Zn + 2 * v.l / (v.kappa * v.AL), 'Rechenwert. Leitererwärmung erhöht den Widerstand, deshalb Reserve lassen. Die Messung ersetzt die Rechnung nicht.');
  fx('abs_aus', 'Ausnutzung', 'Ausnutzung = Z<sub>s</sub> / Z<sub>s,max</sub>', 'ausZ', ['Zs', 'Zsmax'], v => v.Zs / v.Zsmax, 'Über 100 %: Abschaltbedingung nicht erfüllt.');
  fx('ladung', 'Ladekurve Kondensator', 'u<sub>C</sub>(t) = U · (1 − e<sup>−t/τ</sup>)', 'uc', ['U', 'tL', 'tauC'], v => v.U * (1 - Math.exp(-v.tL / v.tauC)));
  // Mechanik
  fx('dichte', 'Masse aus Volumen', 'm = ρ · V', 'm', ['rhoM', 'Vol'], v => v.rhoM * v.Vol);
  fx('hebel', 'Hebelgesetz', 'F<sub>1</sub> · l<sub>1</sub> = F<sub>2</sub> · l<sub>2</sub>', 'F2', ['F1', 'l1', 'l2'], v => v.F1 * v.l1 / v.l2);
  fx('flaschenzug', 'Flaschenzug', 'F<sub>Z</sub> = F<sub>G</sub> / (n · η)', 'FZ', ['FG', 'nSeil', 'eta'], v => v.FG / (v.nSeil * v.eta));
  fx('hang', 'Hangabtriebskraft', 'F<sub>H</sub> = F<sub>G</sub> · sin α', 'FH', ['FG', 'winkel'], v => v.FG * Math.sin(v.winkel));
  fx('hang_n', 'Normalkraft schiefe Ebene', 'F<sub>N</sub> = F<sub>G</sub> · cos α', 'FN', ['FG', 'winkel'], v => v.FG * Math.cos(v.winkel));
  fx('hang_zug', 'Zugkraft aufwärts', 'F<sub>Zug</sub> = F<sub>H</sub> + F<sub>R</sub>', 'Fzug', ['FH', 'FR'], v => v.FH + v.FR);
  fx('feder', 'Federkraft', 'F = c · s', 'FF', ['cF', 'sF'], v => v.cF * v.sF);
  fx('bes_v', 'Geschwindigkeit nach Zeit t', 'v = v<sub>0</sub> + a · t', 'v', ['v0', 'a', 't'], v => v.v0 + v.a * v.t);
  fx('bes_s', 'Weg bei Beschleunigung', 's = v<sub>0</sub> · t + ½ · a · t²', 's', ['v0', 'a', 't'], v => v.v0 * v.t + 0.5 * v.a * v.t * v.t);
  fx('j_zyl', 'Trägheit Vollzylinder', 'J = m · d² / 8', 'J', ['m', 'd'], v => v.m * v.d * v.d / 8, 'Für volle Walzen, Scheiben und Trommeln.');
  fx('alpha_w', 'Winkelbeschleunigung', 'α = ω / t<sub>a</sub>', 'alphaW', ['omega', 'ta'], v => v.omega / v.ta);
  fx('mb', 'Beschleunigungsmoment', 'M<sub>B</sub> = J · α', 'MB', ['J', 'alphaW'], v => v.J * v.alphaW, 'Kommt beim Anfahren zum Lastmoment dazu.');
  fx('zr_d1', 'Teilkreis Rad 1', 'd<sub>1</sub> = m · z<sub>1</sub>', 'dz1', ['modul', 'z1'], v => v.modul * v.z1);
  fx('zr_d2', 'Teilkreis Rad 2', 'd<sub>2</sub> = m · z<sub>2</sub>', 'dz2', ['modul', 'z2'], v => v.modul * v.z2);
  fx('zr_a', 'Achsabstand', 'a = m · (z<sub>1</sub> + z<sub>2</sub>) / 2', 'aA', ['modul', 'z1', 'z2'], v => v.modul * (v.z1 + v.z2) / 2);
  fx('sp_v', 'Vorschub Gewindespindel', 'v = P<sub>h</sub> · n', 'vSp', ['Ph', 'n'], v => v.Ph * v.n);
  fx('sp_f', 'Vorschubkraft Spindel', 'F = 2π · M · η / P<sub>h</sub>', 'FSp', ['MSp', 'eta', 'Ph'], v => 2 * PI * v.MSp * v.eta / v.Ph, 'η Kugelgewindetrieb ca. 90 %, Trapezgewinde ca. 30 bis 50 %.');
  fx('mb_f', 'Biegemoment Kragarm', 'M<sub>b</sub> = F · l', 'Mb', ['F', 'lK'], v => v.F * v.lK);
  fx('wb', 'Widerstandsmoment Rundstab', 'W = π · d³ / 32', 'Wb', ['dS'], v => PI * v.dS ** 3 / 32);
  fx('sigb', 'Biegespannung', 'σ<sub>b</sub> = M<sub>b</sub> / W', 'sigb', ['Mb', 'Wb'], v => v.Mb / v.Wb);
  fx('wp', 'Polares Widerstandsmoment Rundstab', 'W<sub>p</sub> = π · d³ / 16', 'Wp', ['dS'], v => PI * v.dS ** 3 / 16);
  fx('taut', 'Torsionsspannung', 'τ<sub>t</sub> = M<sub>t</sub> / W<sub>p</sub>', 'taut', ['Mt', 'Wp'], v => v.Mt / v.Wp);
  fx('pres', 'Flächenpressung', 'p = F / A', 'pF', ['Fp', 'Ap'], v => v.Fp / v.Ap);
  // Werkstatt
  fx('vc', 'Schnittgeschwindigkeit', 'v<sub>c</sub> = π · d · n', 'vc', ['dW', 'n'], v => PI * v.dW * v.n, 'Richtwerte für v<sub>c</sub> stehen im Tabellenbuch oder beim Werkzeughersteller.');
  fx('vf', 'Vorschubgeschwindigkeit', 'v<sub>f</sub> = f · n', 'vf', ['fV', 'n'], v => v.fV * v.n);
  fx('th', 'Hauptnutzungszeit', 't<sub>h</sub> = L / v<sub>f</sub>', 'th', ['Lh', 'vf'], v => v.Lh / v.vf);
  fx('kernloch', 'Kernlochbohrer (metrisch)', 'd<sub>K</sub> = D − P', 'dKL', ['DG', 'PG'], v => v.DG - v.PG, 'M6 → 5,0 · M8 → 6,8 · M10 → 8,5 · M12 → 10,2');
  // Fluid
  fx('pumpe_q', 'Förderstrom Pumpe', 'Q = V<sub>g</sub> · n · η<sub>vol</sub>', 'QV', ['Vg', 'n', 'etaV'], v => v.Vg * v.n * v.etaV);
  fx('pumpe_p', 'Antriebsleistung Pumpe', 'P<sub>An</sub> = p · Q / η<sub>ges</sub>', 'PAn', ['pd', 'QV', 'etaGes'], v => v.pd * v.QV / v.etaGes);
  fx('rohr_v', 'Strömungsgeschwindigkeit', 'v = Q / (π · d<sub>R</sub>² / 4)', 'vR', ['QV', 'dR'], v => v.QV / (PI * v.dR * v.dR / 4), 'Richtwerte Hydraulik: Saugleitung 0,5 bis 1,5 m/s, Druckleitung 3 bis 6 m/s.');
  fx('boyle', 'Boyle-Mariotte', 'p<sub>1</sub> · V<sub>1</sub> = p<sub>2</sub> · V<sub>2</sub>', 'V2', ['p1', 'V1', 'p2'], v => v.p1 * v.V1 / v.p2, 'Absolutdrücke einsetzen: Überdruck + 1 bar. Temperatur gleichbleibend.');
  // Automatisierung
  fx('enc_f', 'Impulsfrequenz Drehgeber', 'f = n · z', 'fEnc', ['n', 'zImp'], v => v.n * v.zImp, 'Muss zur Eingangsfrequenz der Zählerkarte passen.');
  fx('enc_s', 'Auflösung Messrad', 'Δs = π · d / z', 'sImp', ['dRad', 'zImp'], v => PI * v.dRad / v.zImp, 'Mit 4-fach-Auswertung (A/B-Flanken) wird Δs viermal feiner.');
  fx('reg_e', 'Regelabweichung', 'e = w − x', 'eR', ['wS', 'xI'], v => v.wS - v.xI);
  fx('reg_p', 'P-Regler', 'y = K<sub>P</sub> · e', 'yP', ['Kp', 'eR'], v => v.Kp * v.eR, 'Ein reiner P-Regler behält eine bleibende Regelabweichung.');
  fx('pt1', 'PT1-Strecke (Sprungantwort)', 'x(t) = x<sub>∞</sub> · (1 − e<sup>−t/T</sup>)', 'xt', ['xInf', 'tSp', 'T1'], v => v.xInf * (1 - Math.exp(-v.tSp / v.T1)), 'Nach 1 T: 63 %, nach 3 T: 95 %, nach 5 T: 99 %.');
  // Lager & Wirtschaftlichkeit
  fx('l10', 'Nominelle Lebensdauer', 'L<sub>10</sub> = (C / P)<sup>p</sup>', 'L10', ['Cdyn', 'Plag', 'pExp'], v => Math.pow(v.Cdyn / v.Plag, v.pExp), '90 % der Lager erreichen mindestens diese Lebensdauer.');
  fx('l10h', 'Lebensdauer in Stunden', 'L<sub>10h</sub> = L<sub>10</sub> · 10⁶ / (60 · n)', 'L10h', ['L10', 'n'], v => v.L10 * 1e6 / v.n);
  fx('eff_alt', 'Energie alter Motor', 'W<sub>alt</sub> = P<sub>ab</sub> · LF · t / η<sub>alt</sub>', 'Walt', ['Pab', 'LF', 't', 'eta1'], v => v.Pab * v.LF * v.t / v.eta1);
  fx('eff_neu', 'Energie neuer Motor', 'W<sub>neu</sub> = P<sub>ab</sub> · LF · t / η<sub>neu</sub>', 'Wneu', ['Pab', 'LF', 't', 'eta2'], v => v.Pab * v.LF * v.t / v.eta2);
  fx('eff_dk', 'Ersparnis pro Jahr', 'ΔK = (W<sub>alt</sub> − W<sub>neu</sub>) · k', 'dK', ['Walt', 'Wneu', 'k'], v => (v.Walt - v.Wneu) * v.k);
  fx('eff_ta', 'Amortisationszeit', 't<sub>A</sub> = K<sub>M</sub> / ΔK', 'tA', ['Inv', 'dK'], v => v.Inv / v.dK);

  // bestehende Bereiche ergänzen
  const kz = id => KAT.find(k => k.id === id);
  kz('kond').f.push('ladung'); kz('kond').bsp.tL = 470;
  kz('mech').f.push('dichte');
  kz('erwaermen').f.unshift('dichte'); delete kz('erwaermen').bsp.m; Object.assign(kz('erwaermen').bsp, { rhoM: 1, Vol: 80 });
  kz('sensor').f.push('enc_f', 'enc_s'); Object.assign(kz('sensor').bsp, { zImp: 1024, n: 600, dRad: 100 });
  kz('sensor').d = 'Analogsignale skalieren (4…20 mA, 0…10 V, S7-Digits), PT100/PT1000 und Drehgeber.';

  KAT.push(
    { id: 'abschaltung', gruppe: 'praxis', n: 'Abschaltbedingung prüfen', d: 'Löst der Leitungsschutzschalter am Leitungsende schnell genug aus? Schleifenimpedanz aus Leitungslänge und Querschnitt.',
      f: ['abs_ia', 'abs_zs', 'abs_zl', 'abs_aus', 'kappa_rho'], bsp: { U0: 230, In: 16, kAus: 5, Zn: 0.4, l: 30, AL: 1.5, kappa: 56 } },
    { id: 'effizienz', gruppe: 'praxis', n: 'Lohnt sich ein Effizienzmotor?', d: 'Alter gegen neuen Motor: Ersparnis pro Jahr und nach wie vielen Jahren sich der Mehrpreis rechnet.',
      f: ['ek_t', 'eff_alt', 'eff_neu', 'eff_dk', 'eff_ta'], bsp: { Pab: 11, LF: 75, tTag: 16, Tage: 250, eta1: 87.6, eta2: 91.4, k: 0.25, Inv: 600 }, e: { t: 'h' } },
    { id: 'sterndreieck', gruppe: 'grund', n: 'Stern & Dreieck', d: 'Gleiche Widerstände in Stern und in Dreieck: Ströme und Leistungen im Vergleich.',
      f: ['y_i', 'd_i', 'y_p', 'd_p', 'ustr'], bsp: { U: 400, RStr: 50 } },
    { id: 'kompensation', gruppe: 'grund', n: 'Blindstromkompensation', d: 'Wie viel Kondensatorleistung hebt den cos φ auf den Zielwert?',
      f: ['komp_q', 'komp_c'], bsp: { P: 50, cos1: 0.7, cos2: 0.95, U: 400, f: 50 }, e: { P: 'kW' } },
    { id: 'rlc', gruppe: 'grund', n: 'Schwingkreis & RLC', d: 'Reihenschaltung aus R, L und C: Scheinwiderstand, Strom, Leistungsfaktor und Resonanz.',
      f: ['xl', 'xc', 'rlc_z', 'z', 'rlc_cos', 'f0'], bsp: { R: 100, L: 500, C: 20, f: 50, U: 230 } },
    { id: 'trafo', gruppe: 'grund', n: 'Transformator', d: 'Übersetzung von Spannung, Strom und Windungen, Bemessungsleistung und Kurzschlussstrom.',
      f: ['tr_u', 'tr_n', 'tr_i', 'tr_s', 'tr_ik'], bsp: { U1: 400, U2: 24, I2: 10, uk: 4, N1: 800 } },
    { id: 'halbleiter', gruppe: 'grund', n: 'LED & Gleichrichter', d: 'Vorwiderstand für LEDs, Scheitelwert und Gleichrichter B2 und B6.',
      f: ['led', 'led_p', 'scheitel', 'b2', 'b6'], bsp: { UB: 24, UF: 2, IF: 20, Uw: 230 } },
    { id: 'hebel', gruppe: 'grund', n: 'Hebel, Flaschenzug, Feder', d: 'Hebelgesetz, Flaschenzug, schiefe Ebene mit Reibung und Federkraft.',
      f: ['hebel', 'fg', 'flaschenzug', 'hang', 'hang_n', 'fr', 'hang_zug', 'feder'], bsp: { F1: 100, l1: 500, l2: 50, m: 200, nSeil: 4, eta: 90, winkel: 15, mu: 0.15, cF: 20, sF: 15 } },
    { id: 'beschleunigt', gruppe: 'grund', n: 'Beschleunigte Bewegung', d: 'Gleichmäßig beschleunigt: Geschwindigkeit und Weg nach einer Zeit.',
      f: ['bes_v', 'bes_s', 'fma'], bsp: { v0: 0, a: 0.5, t: 4, m: 100 } },
    { id: 'hochlauf', gruppe: 'grund', n: 'Massenträgheit & Hochlauf', d: 'Welches Moment braucht eine Walze, um in der Hochlaufzeit auf Drehzahl zu kommen?',
      f: ['j_zyl', 'omega', 'alpha_w', 'mb'], bsp: { m: 50, d: 300, n: 1450, ta: 2 } },
    { id: 'zahnrad', gruppe: 'grund', n: 'Zahnrad & Gewindespindel', d: 'Teilkreise, Achsabstand und Übersetzung, dazu Vorschub und Kraft einer Gewindespindel.',
      f: ['zr_d1', 'zr_d2', 'zr_a', 'i_z', 'sp_v', 'sp_f'], bsp: { modul: 2, z1: 20, z2: 60, Ph: 5, n: 600, MSp: 2, eta: 90 } },
    { id: 'biegung', gruppe: 'grund', n: 'Biegung, Torsion, Pressung', d: 'Rundstab auf Biegung und Torsion, Flächenpressung.',
      f: ['mb_f', 'wb', 'sigb', 'wp', 'taut', 'pres'], bsp: { F: 2, lK: 200, dS: 30, Mt: 100, Fp: 5000, Ap: 50 }, e: { F: 'kN' } },
    { id: 'zerspanung', gruppe: 'grund', n: 'Zerspanung & Gewinde', d: 'Drehzahl aus Schnittgeschwindigkeit, Vorschub, Hauptzeit und Kernlochbohrer.',
      f: ['vc', 'vf', 'th', 'kernloch'], bsp: { vc: 25, dW: 10, fV: 0.15, Lh: 30, DG: 10, PG: 1.5 } },
    { id: 'pumpe', gruppe: 'grund', n: 'Hydraulikpumpe & Druckluft', d: 'Förderstrom und Antriebsleistung einer Pumpe, Strömung in der Leitung, Boyle-Mariotte.',
      f: ['pumpe_q', 'pumpe_p', 'rohr_v', 'boyle'], bsp: { Vg: 16, n: 1450, etaV: 95, pd: 160, etaGes: 85, dR: 12, p1: 8, V1: 50, p2: 1.013 } },
    { id: 'regelung', gruppe: 'grund', n: 'Regelungstechnik', d: 'Regelabweichung, P-Regler und Sprungantwort einer PT1-Strecke.',
      f: ['reg_e', 'reg_p', 'pt1'], bsp: { wS: 60, xI: 55, Kp: 2, xInf: 80, T1: 10, tSp: 10 } },
    { id: 'lager', gruppe: 'grund', n: 'Wälzlager-Lebensdauer', d: 'Nominelle Lebensdauer L10 in Umdrehungen und Betriebsstunden.',
      f: ['l10', 'l10h'], bsp: { Cdyn: 30, Plag: 3, pExp: 3, n: 1450 } }
  );

  /* ---------- Erweiterung 2: Passungen, Schrauben, PID, Digitaltechnik ---------- */
  const UM = [['µm', 1e-6], ['mm', 1e-3]];
  const MASS = [['mm', 1e-3]];
  const ZEIT = [['s', 1], ['min', 60], ['ms', 1e-3]];
  Object.assign(V, {
    // Passungen
    NmP: { s: 'N', n: 'Nennmaß', u: MASS, st: 7, p: [['10', 10], ['25', 25], ['40', 40], ['60', 60]] },
    ESb: { s: 'ES', n: 'Oberes Abmaß Bohrung', u: UM, neg: true, st: 6 },
    EIb: { s: 'EI', n: 'Unteres Abmaß Bohrung', u: UM, neg: true, st: 6 },
    esW: { s: 'es', n: 'Oberes Abmaß Welle', u: UM, neg: true, st: 6 },
    eiW: { s: 'ei', n: 'Unteres Abmaß Welle', u: UM, neg: true, st: 6 },
    GoB: { s: 'G<sub>oB</sub>', n: 'Höchstmaß Bohrung', u: MASS, st: 7 },
    GuB: { s: 'G<sub>uB</sub>', n: 'Mindestmaß Bohrung', u: MASS, st: 7 },
    GoW: { s: 'G<sub>oW</sub>', n: 'Höchstmaß Welle', u: MASS, st: 7 },
    GuW: { s: 'G<sub>uW</sub>', n: 'Mindestmaß Welle', u: MASS, st: 7 },
    TB: { s: 'T<sub>B</sub>', n: 'Maßtoleranz Bohrung', u: UM, st: 6 },
    TW: { s: 'T<sub>W</sub>', n: 'Maßtoleranz Welle', u: UM, st: 6 },
    Smax: { s: 'P<sub>SH</sub>', n: 'Höchstspiel (negativ = Übermaß)', u: UM, neg: true, st: 6 },
    Smin: { s: 'P<sub>SM</sub>', n: 'Mindestspiel (negativ = Übermaß)', u: UM, neg: true, st: 6 },

    // Schrauben
    d2S: { s: 'd<sub>2</sub>', n: 'Flankendurchmesser', u: MASS },
    d3S: { s: 'd<sub>3</sub>', n: 'Kerndurchmesser', u: MASS },
    AsS: { s: 'A<sub>S</sub>', n: 'Spannungsquerschnitt', u: [['mm²', 1e-6]] },
    nuS: { s: 'ν', n: 'Ausnutzung der Streckgrenze', u: PROZ, p: [['90 % (VDI 2230)', 90]] },
    muG: { s: 'μ<sub>G</sub>', n: 'Reibungszahl Gewinde', u: OHNE, p: [['geölt 0,12', 0.12], ['MoS₂ 0,08', 0.08], ['trocken 0,14', 0.14]] },
    muK: { s: 'μ<sub>K</sub>', n: 'Reibungszahl Kopfauflage', u: OHNE, p: [['geölt 0,12', 0.12], ['MoS₂ 0,08', 0.08], ['trocken 0,14', 0.14]] },
    FM: { s: 'F<sub>M</sub>', n: 'Zulässige Montagevorspannkraft', u: [['kN', 1e3], ['N', 1]] },
    SW: { s: 'd<sub>w</sub>', n: 'Kopfauflage außen (≈ Schlüsselweite)', u: MASS, p: [['M6: 10', 10], ['M8: 13', 13], ['M10: 16', 16], ['M12: 18', 18], ['M16: 24', 24]] },
    dhS: { s: 'd<sub>h</sub>', n: 'Durchgangsbohrung', u: MASS, p: [['M6: 6,6', 6.6], ['M8: 9', 9], ['M10: 11', 11], ['M12: 13,5', 13.5], ['M16: 17,5', 17.5]] },
    DKm: { s: 'D<sub>Km</sub>', n: 'Mittlerer Reibdurchmesser Kopf', u: MASS },
    MA: { s: 'M<sub>A</sub>', n: 'Anzugsmoment', u: [['Nm', 1]] },

    // PID-Regler
    Tn: { s: 'T<sub>n</sub>', n: 'Nachstellzeit', u: ZEIT },
    Tv: { s: 'T<sub>v</sub>', n: 'Vorhaltezeit', u: ZEIT },
    KI: { s: 'K<sub>I</sub>', n: 'Integrierbeiwert', u: [['1/s', 1], ['1/min', 1 / 60]] },
    KD: { s: 'K<sub>D</sub>', n: 'Differenzierbeiwert', u: ZEIT },
    eInt: { s: '∫e dt', n: 'Aufsummierte Regelabweichung', u: [['s', 1], ['min', 60]], neg: true },
    eDot: { s: 'de/dt', n: 'Änderung der Regelabweichung', u: [['1/s', 1], ['1/min', 1 / 60]], neg: true },
    yI: { s: 'y<sub>I</sub>', n: 'I-Anteil', u: OHNE, neg: true },
    yD: { s: 'y<sub>D</sub>', n: 'D-Anteil', u: OHNE, neg: true },
    yPID: { s: 'y', n: 'Stellgröße PID gesamt', u: OHNE, neg: true },
    Kkr: { s: 'K<sub>krit</sub>', n: 'Kritische Verstärkung (Dauerschwingung)', u: OHNE },
    Tkr: { s: 'T<sub>krit</sub>', n: 'Periodendauer der Dauerschwingung', u: ZEIT },
    Ks: { s: 'K<sub>S</sub>', n: 'Streckenverstärkung (Δx / Δy)', u: OHNE },
    Tu: { s: 'T<sub>u</sub>', n: 'Verzugszeit (Wendetangente)', u: ZEIT },
    Tg: { s: 'T<sub>g</sub>', n: 'Ausgleichszeit (Wendetangente)', u: ZEIT },
    rTu: { s: 'T<sub>u</sub>/T<sub>g</sub>', n: 'Regelbarkeit (< 0,1 gut, > 0,3 schwierig)', u: OHNE },
    KpP: { s: 'K<sub>P</sub> (P)', n: 'Einstellung P-Regler', u: OHNE },
    KpPI: { s: 'K<sub>P</sub> (PI)', n: 'Einstellung PI-Regler', u: OHNE },
    TnPI: { s: 'T<sub>n</sub> (PI)', n: 'Nachstellzeit PI-Regler', u: ZEIT },
    KpPID: { s: 'K<sub>P</sub> (PID)', n: 'Einstellung PID-Regler', u: OHNE },
    TnPID: { s: 'T<sub>n</sub> (PID)', n: 'Nachstellzeit PID-Regler', u: ZEIT },
    TvPID: { s: 'T<sub>v</sub> (PID)', n: 'Vorhaltezeit PID-Regler', u: ZEIT },

    // Digitaltechnik
    nBit: { s: 'n', n: 'Auflösung', u: [['bit', 1]], p: [['8', 8], ['12', 12], ['15 (S7)', 15], ['16', 16]] },
    Zst: { s: 'Z', n: 'Anzahl Stufen', u: OHNE },
    UFS: { s: 'U<sub>FS</sub>', n: 'Messbereich (Endwert)', u: [['V', 1], ['mV', 1e-3]], p: [['10 V', 10], ['5 V', 5], ['3,3 V', 3.3]] },
    LSB: { s: 'U<sub>LSB</sub>', n: 'Kleinster Schritt (1 LSB)', u: [['mV', 1e-3], ['V', 1], ['µV', 1e-6]] },
    qF: { s: 'q', n: 'Max. Quantisierungsfehler', u: [['mV', 1e-3], ['V', 1], ['µV', 1e-6]] },
    fMax: { s: 'f<sub>max</sub>', n: 'Höchste Signalfrequenz', u: [['Hz', 1], ['kHz', 1e3]] },
    fAmin: { s: 'f<sub>A,min</sub>', n: 'Mindest-Abtastrate (Nyquist)', u: [['Hz', 1], ['kHz', 1e3]] },
    fAbt: { s: 'f<sub>A</sub>', n: 'Gewählte Abtastrate', u: [['Hz', 1], ['kHz', 1e3]] },
    nKan: { s: 'k', n: 'Anzahl Kanäle', u: OHNE },
    DR: { s: 'D', n: 'Datenrate', u: [['kbit/s', 1e3], ['bit/s', 1], ['Mbit/s', 1e6]] },
    Baud: { s: 'B', n: 'Baudrate', u: [['Bd', 1], ['kBd', 1e3]], p: [['9600', 9600], ['19200', 19200], ['115200', 115200]] },
    bitsZ: { s: 'b', n: 'Bits pro Zeichen', u: OHNE, p: [['8N1 = 10', 10], ['8E1 = 11', 11]] },
    nByte: { s: 'N', n: 'Anzahl Zeichen (Bytes)', u: OHNE },
    tUe: { s: 't<sub>Ü</sub>', n: 'Übertragungszeit', u: [['ms', 1e-3], ['s', 1]] }
  });
  V.Re.p = [['S235', 235], ['S355', 355], ['8.8', 640], ['10.9', 940], ['12.9', 1100]];

  // Passungen
  fx('pa_gob', 'Höchstmaß Bohrung', 'G<sub>oB</sub> = N + ES', 'GoB', ['NmP', 'ESb'], v => v.NmP + v.ESb);
  fx('pa_gub', 'Mindestmaß Bohrung', 'G<sub>uB</sub> = N + EI', 'GuB', ['NmP', 'EIb'], v => v.NmP + v.EIb);
  fx('pa_gow', 'Höchstmaß Welle', 'G<sub>oW</sub> = N + es', 'GoW', ['NmP', 'esW'], v => v.NmP + v.esW);
  fx('pa_guw', 'Mindestmaß Welle', 'G<sub>uW</sub> = N + ei', 'GuW', ['NmP', 'eiW'], v => v.NmP + v.eiW);
  fx('pa_tb', 'Toleranz Bohrung', 'T<sub>B</sub> = ES − EI', 'TB', ['ESb', 'EIb'], v => v.ESb - v.EIb);
  fx('pa_tw', 'Toleranz Welle', 'T<sub>W</sub> = es − ei', 'TW', ['esW', 'eiW'], v => v.esW - v.eiW);
  fx('pa_sh', 'Höchstspiel', 'P<sub>SH</sub> = ES − ei', 'Smax', ['ESb', 'eiW'], v => v.ESb - v.eiW, 'Negativ heißt Übermaß. Beide positiv: Spielpassung, beide negativ: Übermaßpassung, sonst Übergangspassung.');
  fx('pa_sm', 'Mindestspiel', 'P<sub>SM</sub> = EI − es', 'Smin', ['EIb', 'esW'], v => v.EIb - v.esW, 'Die ISO-Abmaße für H7, g6 usw. liefert der Passungsrechner unter „Tabellen“.');

  // Schrauben
  fx('s_d2', 'Flankendurchmesser', 'd<sub>2</sub> = d − 0,6495 · P', 'd2S', ['DG', 'PG'], v => v.DG - 0.649519 * v.PG, 'Metrisches ISO-Gewinde.');
  fx('s_d3', 'Kerndurchmesser', 'd<sub>3</sub> = d − 1,2269 · P', 'd3S', ['DG', 'PG'], v => v.DG - 1.226869 * v.PG);
  fx('s_as', 'Spannungsquerschnitt', 'A<sub>S</sub> = π/4 · ((d<sub>2</sub> + d<sub>3</sub>) / 2)²', 'AsS', ['d2S', 'd3S'], v => PI / 4 * Math.pow((v.d2S + v.d3S) / 2, 2));
  fx('s_fm', 'Zulässige Montagevorspannkraft', 'F<sub>M</sub> = A<sub>S</sub> · ν · R<sub>p0,2</sub> / √(1 + 3 · [1,5 · d<sub>2</sub>/d<sub>S</sub> · (P/(π · d<sub>2</sub>) + 1,155 · μ<sub>G</sub>)]²)', 'FM',
    ['AsS', 'nuS', 'Re', 'd2S', 'd3S', 'PG', 'muG'], v => {
      const dS = (v.d2S + v.d3S) / 2;
      const k = 1.5 * v.d2S / dS * (v.PG / (PI * v.d2S) + 1.155 * v.muG);
      return v.AsS * v.nuS * v.Re / Math.sqrt(1 + 3 * k * k);
    }, 'Nach VDI 2230: Zug und Torsion beim Anziehen zusammen, d<sub>S</sub> = (d<sub>2</sub> + d<sub>3</sub>)/2, R<sub>p0,2</sub> = Streckgrenze der Festigkeitsklasse.');
  fx('s_dkm', 'Reibdurchmesser Kopfauflage', 'D<sub>Km</sub> = (d<sub>w</sub> + d<sub>h</sub>) / 2', 'DKm', ['SW', 'dhS'], v => (v.SW + v.dhS) / 2);
  fx('s_ma', 'Anzugsmoment', 'M<sub>A</sub> = F<sub>M</sub> · (0,16 · P + 0,58 · d<sub>2</sub> · μ<sub>G</sub> + D<sub>Km</sub>/2 · μ<sub>K</sub>)', 'MA',
    ['FM', 'PG', 'd2S', 'muG', 'DKm', 'muK'], v => v.FM * (0.16 * v.PG + 0.58 * v.d2S * v.muG + v.DKm / 2 * v.muK),
    'Richtwert. Herstellerangaben und Tabellen nach VDI 2230 haben Vorrang. Fertige Werte M3 bis M30 unter „Tabellen“.');

  // PID
  fx('pid_ki', 'Integrierbeiwert', 'K<sub>I</sub> = K<sub>P</sub> / T<sub>n</sub>', 'KI', ['Kp', 'Tn'], v => v.Kp / v.Tn);
  fx('pid_kd', 'Differenzierbeiwert', 'K<sub>D</sub> = K<sub>P</sub> · T<sub>v</sub>', 'KD', ['Kp', 'Tv'], v => v.Kp * v.Tv);
  fx('pid_yi', 'I-Anteil', 'y<sub>I</sub> = K<sub>I</sub> · ∫e dt', 'yI', ['KI', 'eInt'], v => v.KI * v.eInt, 'Der I-Anteil wächst, solange eine Regelabweichung da ist, und beseitigt sie dadurch ganz.');
  fx('pid_yd', 'D-Anteil', 'y<sub>D</sub> = K<sub>D</sub> · de/dt', 'yD', ['KD', 'eDot'], v => v.KD * v.eDot, 'Der D-Anteil reagiert auf schnelle Änderungen und dämpft das Überschwingen.');
  fx('pid_y', 'PID-Regler (Parallelform)', 'y = K<sub>P</sub> · e + K<sub>I</sub> · ∫e dt + K<sub>D</sub> · de/dt', 'yPID', ['yP', 'yI', 'yD'], v => v.yP + v.yI + v.yD,
    'Gleichwertig: y = K<sub>P</sub> · (e + 1/T<sub>n</sub> · ∫e dt + T<sub>v</sub> · de/dt).');
  // Ziegler-Nichols Schwingversuch
  fx('zn_p', 'P-Regler (Schwingversuch)', 'K<sub>P</sub> = 0,5 · K<sub>krit</sub>', 'KpP', ['Kkr'], v => 0.5 * v.Kkr, 'Nur P-Anteil, K<sub>P</sub> erhöhen, bis der Kreis gleichmäßig schwingt. Das ist K<sub>krit</sub>, die Periode ist T<sub>krit</sub>.');
  fx('zn_pi_k', 'PI-Regler (Schwingversuch)', 'K<sub>P</sub> = 0,45 · K<sub>krit</sub>', 'KpPI', ['Kkr'], v => 0.45 * v.Kkr);
  fx('zn_pi_t', 'PI-Nachstellzeit (Schwingversuch)', 'T<sub>n</sub> = 0,85 · T<sub>krit</sub>', 'TnPI', ['Tkr'], v => 0.85 * v.Tkr);
  fx('zn_pid_k', 'PID-Regler (Schwingversuch)', 'K<sub>P</sub> = 0,6 · K<sub>krit</sub>', 'KpPID', ['Kkr'], v => 0.6 * v.Kkr);
  fx('zn_pid_n', 'PID-Nachstellzeit (Schwingversuch)', 'T<sub>n</sub> = 0,5 · T<sub>krit</sub>', 'TnPID', ['Tkr'], v => 0.5 * v.Tkr);
  fx('zn_pid_v', 'PID-Vorhaltezeit (Schwingversuch)', 'T<sub>v</sub> = 0,125 · T<sub>krit</sub>', 'TvPID', ['Tkr'], v => 0.125 * v.Tkr);
  // Ziegler-Nichols Sprungantwort
  fx('wt_r', 'Regelbarkeit der Strecke', 'T<sub>u</sub> / T<sub>g</sub>', 'rTu', ['Tu', 'Tg'], v => v.Tu / v.Tg, 'Unter 0,1 gut regelbar, 0,1 bis 0,3 noch regelbar, über 0,3 schwierig.');
  fx('wt_p', 'P-Regler (Sprungantwort)', 'K<sub>P</sub> = T<sub>g</sub> / (K<sub>S</sub> · T<sub>u</sub>)', 'KpP', ['Tg', 'Ks', 'Tu'], v => v.Tg / (v.Ks * v.Tu), 'Sprung auf die Strecke geben, Wendetangente anlegen, T<sub>u</sub> und T<sub>g</sub> ablesen.');
  fx('wt_pi_k', 'PI-Regler (Sprungantwort)', 'K<sub>P</sub> = 0,9 · T<sub>g</sub> / (K<sub>S</sub> · T<sub>u</sub>)', 'KpPI', ['Tg', 'Ks', 'Tu'], v => 0.9 * v.Tg / (v.Ks * v.Tu));
  fx('wt_pi_t', 'PI-Nachstellzeit (Sprungantwort)', 'T<sub>n</sub> = 3,33 · T<sub>u</sub>', 'TnPI', ['Tu'], v => 3.33 * v.Tu);
  fx('wt_pid_k', 'PID-Regler (Sprungantwort)', 'K<sub>P</sub> = 1,2 · T<sub>g</sub> / (K<sub>S</sub> · T<sub>u</sub>)', 'KpPID', ['Tg', 'Ks', 'Tu'], v => 1.2 * v.Tg / (v.Ks * v.Tu));
  fx('wt_pid_n', 'PID-Nachstellzeit (Sprungantwort)', 'T<sub>n</sub> = 2 · T<sub>u</sub>', 'TnPID', ['Tu'], v => 2 * v.Tu);
  fx('wt_pid_v', 'PID-Vorhaltezeit (Sprungantwort)', 'T<sub>v</sub> = 0,5 · T<sub>u</sub>', 'TvPID', ['Tu'], v => 0.5 * v.Tu);

  // Digitaltechnik
  fx('dg_z', 'Anzahl Stufen', 'Z = 2<sup>n</sup>', 'Zst', ['nBit'], v => Math.pow(2, v.nBit), 'Ein S7-Analogwert hat 15 bit plus Vorzeichen, Nennbereich 0 bis 27648.');
  fx('dg_lsb', 'Auflösung eines Wandlers', 'U<sub>LSB</sub> = U<sub>FS</sub> / 2<sup>n</sup>', 'LSB', ['UFS', 'nBit'], v => v.UFS / Math.pow(2, v.nBit));
  fx('dg_q', 'Quantisierungsfehler', 'q = U<sub>LSB</sub> / 2', 'qF', ['LSB'], v => v.LSB / 2);
  fx('dg_nyq', 'Abtasttheorem (Nyquist)', 'f<sub>A,min</sub> = 2 · f<sub>max</sub>', 'fAmin', ['fMax'], v => 2 * v.fMax, 'In der Praxis lieber 5 bis 10 mal so schnell abtasten.');
  fx('dg_dr', 'Datenrate', 'D = n · f<sub>A</sub> · k', 'DR', ['nBit', 'fAbt', 'nKan'], v => v.nBit * v.fAbt * v.nKan);
  fx('dg_ser', 'Übertragungszeit seriell', 't<sub>Ü</sub> = N · b / B', 'tUe', ['nByte', 'bitsZ', 'Baud'], v => v.nByte * v.bitsZ / v.Baud, '8N1 heißt 1 Startbit, 8 Datenbits, 1 Stoppbit, also 10 Bit pro Zeichen.');

  KAT.push(
    { id: 'passung', gruppe: 'grund', n: 'Passungen & Toleranzen', d: 'Grenzmaße, Toleranzen, Höchst- und Mindestspiel. Die ISO-Abmaße holst du dir im Passungsrechner unter „Tabellen“.',
      f: ['pa_gob', 'pa_gub', 'pa_gow', 'pa_guw', 'pa_tb', 'pa_tw', 'pa_sh', 'pa_sm'], bsp: { NmP: 30, ESb: 21, EIb: 0, esW: -7, eiW: -20 } },
    { id: 'schraube', gruppe: 'grund', n: 'Schraubenverbindung', d: 'Gewindemaße, Spannungsquerschnitt, zulässige Vorspannkraft und Anzugsmoment nach VDI 2230.',
      f: ['s_d2', 's_d3', 's_as', 's_fm', 's_dkm', 's_ma'], bsp: { DG: 10, PG: 1.5, Re: 640, nuS: 90, muG: 0.12, muK: 0.12, SW: 16, dhS: 11 } },
    { id: 'pid', gruppe: 'grund', n: 'PID-Regler', d: 'P-, I- und D-Anteil einzeln und zusammen. KI und KD aus Nachstell- und Vorhaltezeit.',
      f: ['reg_e', 'reg_p', 'pid_ki', 'pid_kd', 'pid_yi', 'pid_yd', 'pid_y'], bsp: { wS: 60, xI: 55, Kp: 2, Tn: 10, Tv: 1, eInt: 20, eDot: -0.5 } },
    { id: 'zn', gruppe: 'grund', n: 'Regler einstellen (Ziegler-Nichols)', d: 'Startwerte für P-, PI- und PID-Regler aus dem Schwingversuch.',
      f: ['zn_p', 'zn_pi_k', 'zn_pi_t', 'zn_pid_k', 'zn_pid_n', 'zn_pid_v'], bsp: { Kkr: 8, Tkr: 20 } },
    { id: 'wende', gruppe: 'grund', n: 'Regler einstellen (Sprungantwort)', d: 'Startwerte nach Ziegler-Nichols aus Verzugszeit, Ausgleichszeit und Streckenverstärkung.',
      f: ['wt_r', 'wt_p', 'wt_pi_k', 'wt_pi_t', 'wt_pid_k', 'wt_pid_n', 'wt_pid_v'], bsp: { Ks: 2, Tu: 5, Tg: 60 } },
    { id: 'digital', gruppe: 'grund', n: 'Digitaltechnik & Wandler', d: 'Auflösung von A/D-Wandlern, Quantisierung, Abtastrate, Datenrate und serielle Übertragung. Zahlensysteme unter „Tabellen“.',
      f: ['dg_z', 'dg_lsb', 'dg_q', 'dg_nyq', 'dg_dr', 'dg_ser'], bsp: { nBit: 12, UFS: 10, fMax: 1000, fAbt: 5000, nKan: 4, Baud: 9600, bitsZ: 10, nByte: 100 } }
  );
  const REIHE = ['band', 'zuleitung', 'abschaltung', 'hubzylinder', 'erwaermen', 'energiekosten', 'effizienz',
    'gleich', 'widerstand', 'leitung', 'wechsel', 'dreh', 'sterndreieck', 'kompensation', 'kond', 'rlc', 'trafo', 'halbleiter', 'motor',
    'mech', 'beschleunigt', 'hebel', 'drehbew', 'hochlauf', 'getriebe', 'zahnrad', 'festigkeit', 'biegung', 'zerspanung', 'passung', 'schraube',
    'zylinder', 'pumpe', 'waerme', 'sensor', 'digital', 'regelung', 'pid', 'zn', 'wende', 'kennzahlen', 'lager'];
  KAT.sort((a, b) => REIHE.indexOf(a.id) - REIHE.indexOf(b.id));

  /* ---------- Löser ---------- */
  const RASTER = [];
  for (let e = -15; e <= 15.0001; e += 0.05) RASTER.push(Math.pow(10, e));
  const PUNKTE_POS = [0].concat(RASTER);
  const PUNKTE_NEG = RASTER.map(x => -x).reverse().concat(PUNKTE_POS);

  function loese(f, ziel, w) {
    if (ziel === f.y) { const r = f.f(w); return isFinite(r) ? r : null; }
    const y = w[f.y];
    const o = Object.assign({}, w);
    const gfn = t => { o[ziel] = t; return f.f(o) - y; };
    const punkte = V[ziel].neg ? PUNKTE_NEG : PUNKTE_POS;
    let best = null, pt = null, pg = null;
    const nimm = x => { if (best === null || Math.abs(x) < Math.abs(best)) best = x; };
    for (const t of punkte) {
      const gv = gfn(t);
      if (!isFinite(gv)) { pt = null; continue; }
      if (gv === 0) nimm(t);
      else if (pt !== null && pg !== 0 && (pg < 0) !== (gv < 0)) {
        let a = pt, b = t, ga = pg;
        for (let k = 0; k < 200; k++) {
          const mitte = (a + b) / 2;
          if (mitte === a || mitte === b) break;
          const gm = gfn(mitte);
          if (!isFinite(gm)) break;
          if ((gm < 0) === (ga < 0)) { a = mitte; ga = gm; } else b = mitte;
        }
        const x = (a + b) / 2, gx = gfn(x);
        // Polstelle aussortieren: an einer echten Nullstelle ist der Rest kleiner als an den Rändern
        if (isFinite(gx) && Math.abs(gx) < Math.min(Math.abs(pg), Math.abs(gv))) nimm(x);
      }
      pt = t; pg = gv;
    }
    return best;
  }

  function rechne(formelIds, bekannt) {
    const w = Object.assign({}, bekannt);
    const quelle = {}, schritte = [];
    const formeln = formelIds.map(id => F[id]);
    let neu = true;
    while (neu) {
      neu = false;
      for (const f of formeln) {
        const alle = [f.y].concat(f.x);
        const offen = alle.filter(v => !(v in w));
        if (offen.length !== 1) continue;
        const ziel = offen[0];
        const r = loese(f, ziel, w);
        if (r === null) continue;
        w[ziel] = r;
        quelle[ziel] = f.id;
        schritte.push({ v: ziel, f: f.id, aus: alle.filter(v => v !== ziel) });
        neu = true;
      }
    }
    const konflikte = [];
    for (const f of formeln) {
      const alle = [f.y].concat(f.x);
      if (!alle.every(v => v in w)) continue;
      const soll = f.f(w), ist = w[f.y];
      const rel = Math.abs(soll - ist) / Math.max(Math.abs(soll), Math.abs(ist), 1e-12);
      if (rel > 2e-3) konflikte.push({ f: f.id, soll, ist });
    }
    return { w, quelle, schritte, konflikte };
  }

  /* Welche fehlende Größe schaltet am meisten frei? (nur Struktur, ohne Zahlen) */
  function tipps(formelIds, bekanntListe) {
    const formeln = formelIds.map(id => F[id]);
    const alleVars = [...new Set(formeln.flatMap(f => [f.y].concat(f.x)))];
    const ausbreiten = start => {
      const k = new Set(start); let neu = true;
      while (neu) {
        neu = false;
        for (const f of formeln) {
          const offen = [f.y].concat(f.x).filter(v => !k.has(v));
          if (offen.length === 1) { k.add(offen[0]); neu = true; }
        }
      }
      return k;
    };
    const jetzt = ausbreiten(bekanntListe);
    const fehlt = alleVars.filter(v => !jetzt.has(v));
    return fehlt.map(v => ({ v, mehr: ausbreiten([...jetzt, v]).size - jetzt.size - 1 }))
      .filter(x => x.mehr > 0).sort((a, b) => b.mehr - a.mehr);
  }

  function variablen(kat) {
    return [...new Set(kat.f.flatMap(id => [F[id].y].concat(F[id].x)))];
  }

  global.FORMEL = { V, F, KAT, rechne, tipps, variablen, loese };
})(typeof window !== 'undefined' ? window : globalThis);
