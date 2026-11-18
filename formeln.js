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
