// ─── Data (ported from TXVBuilder.tsx) ───

const TEMPERATURE_OPTIONS = [
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "commercial_refrigeration", label: "Commercial Refrigeration (+50\u00B0F to -10\u00B0F)" },
  { value: "low_temp", label: "Low Temp (0\u00B0F to -40\u00B0F)" },
];

const REFRIGERANT_OPTIONS = [
  { charge: "J", refrigerant: "R1234yf", label: "R-1234yf (J)" },
  { charge: "J", refrigerant: "R134a",   label: "R-134a (J)" },
  { charge: "J", refrigerant: "R513A",   label: "R-513A (J)" },
  { charge: "J", refrigerant: "R401A",   label: "R-401A (J)" },
  { charge: "J", refrigerant: "R409A",   label: "R-409A (J)" },
  { charge: "V", refrigerant: "R22",     label: "R-22 (V)" },
  { charge: "V", refrigerant: "R407A",   label: "R-407A (V)" },
  { charge: "V", refrigerant: "R407C",   label: "R-407C (V)" },
  { charge: "V", refrigerant: "R407F",   label: "R-407F (V)" },
  { charge: "V", refrigerant: "R454C",   label: "R-454C (V)" },
  { charge: "V", refrigerant: "R455A",   label: "R-455A (V)" },
  { charge: "D", refrigerant: "R448A",   label: "R-448A (D)" },
  { charge: "D", refrigerant: "R449A",   label: "R-449A (D)" },
  { charge: "S", refrigerant: "R404A",   label: "R-404A (S)" },
  { charge: "S", refrigerant: "R502",    label: "R-502 (S)" },
  { charge: "S", refrigerant: "R507A",   label: "R-507A (S)" },
  { charge: "S", refrigerant: "R402A",   label: "R-402A (S)" },
  { charge: "T", refrigerant: "R454A",   label: "R-454A (T)" },
  { charge: "Z", refrigerant: "R410A",   label: "R-410A (Z)" },
  { charge: "Z", refrigerant: "R32",     label: "R-32 (Z)" },
  { charge: "Y", refrigerant: "R454B",   label: "R-454B (Y)" },
];

const ALL_BODY_STYLES  = ["Q","QE","EQ","EQE","SQ","SQE","BQ","BQE","EBQ","EBQE","SBQ","SBQE"];
const EXTERNAL_STYLES  = ALL_BODY_STYLES.filter(s => s.endsWith("E"));
const INTERNAL_STYLES  = ALL_BODY_STYLES.filter(s => !s.endsWith("E"));

const STANDARD_POWER_ELEMENTS = ["KT47","KT43","KT53","KT83"];
const UNCOMMON_POWER_ELEMENTS = ["KT33","KT45","KT63","KT85"];

const TONNAGE_OPTIONS = ["0.5","1","1.5","2","3","4","5","8"];

const TEMP_PRIORITY_REFRIGERANTS = {
  low_temp:                 ["R404A","R507A","R448A","R449A","R502","R402A"],
  air_conditioning:         ["R22","R410A","R454B","R32","R407C","R134a"],
  commercial_refrigeration: [],
};

// ─── Body Part Number Lookup (from Sporlan URI514 catalog) ───

const BODY_PART_NUMBERS = [
  { bodyStyle: "Q",    inlet: "1/4", outlet: "3/8", partNumber: "QBODY2X3F" },
  { bodyStyle: "Q",    inlet: "1/4", outlet: "1/2", partNumber: "QBODY2X4F" },
  { bodyStyle: "Q",    inlet: "3/8", outlet: "1/2", partNumber: "QBODY3X4F" },
  { bodyStyle: "QE",   inlet: "1/4", outlet: "3/8", partNumber: "QEBODY2X3F" },
  { bodyStyle: "QE",   inlet: "1/4", outlet: "1/2", partNumber: "QEBODY2X4F" },
  { bodyStyle: "QE",   inlet: "3/8", outlet: "1/2", partNumber: "QEBODY3X4F" },
  { bodyStyle: "BQ",   inlet: "1/4", outlet: "1/2", partNumber: "BQBODY2X4F" },
  { bodyStyle: "BQ",   inlet: "3/8", outlet: "1/2", partNumber: "BQBODY3X4F" },
  { bodyStyle: "BQE",  inlet: "1/4", outlet: "1/2", partNumber: "BQEBODY2X4F" },
  { bodyStyle: "BQE",  inlet: "3/8", outlet: "1/2", partNumber: "BQEBODY3X4F" },
  { bodyStyle: "SQ",   inlet: "3/8", outlet: "1/2", partNumber: "SQBODY3X4" },
  { bodyStyle: "SQE",  inlet: "1/4", outlet: "1/2", partNumber: "SQEBODY2X4" },
  { bodyStyle: "SQE",  inlet: "3/8", outlet: "1/2", partNumber: "SQEBODY3X4" },
  { bodyStyle: "SBQ",  inlet: "3/8", outlet: "1/2", partNumber: "SBQBODY3X4" },
  { bodyStyle: "SBQE", inlet: "3/8", outlet: "1/2", partNumber: "SBQEBODY3X4" },
  { bodyStyle: "EQ",   inlet: "1/4", outlet: "3/8", partNumber: "EQBODY2X3" },
  { bodyStyle: "EQ",   inlet: "1/4", outlet: "1/2", partNumber: "EQBODY2X4" },
  { bodyStyle: "EQ",   inlet: "3/8", outlet: "1/2", partNumber: "EQBODY3X4S" },
  { bodyStyle: "EQ",   inlet: "3/8", outlet: "5/8", partNumber: "EQBODY3X5S" },
  { bodyStyle: "EQ",   inlet: "1/2", outlet: "5/8", partNumber: "EQBODY4X5S" },
  { bodyStyle: "EQE",  inlet: "1/4", outlet: "3/8", partNumber: "EQEBODY2X3" },
  { bodyStyle: "EQE",  inlet: "1/4", outlet: "1/2", partNumber: "EQEBODY2X4" },
  { bodyStyle: "EQE",  inlet: "3/8", outlet: "1/2", partNumber: "EQEBODY3X4S" },
  { bodyStyle: "EQE",  inlet: "3/8", outlet: "5/8", partNumber: "EQEBODY3X5S" },
  { bodyStyle: "EQE",  inlet: "1/2", outlet: "5/8", partNumber: "EQEBODY4X5S" },
  { bodyStyle: "EQE",  inlet: "1/2", outlet: "7/8", partNumber: "EQEBODY4X7S" },
  { bodyStyle: "EBQ",  inlet: "1/4", outlet: "3/8", partNumber: "EBQBODY2X3" },
  { bodyStyle: "EBQ",  inlet: "3/8", outlet: "1/2", partNumber: "EBQBODY3X4" },
  { bodyStyle: "EBQ",  inlet: "3/8", outlet: "5/8", partNumber: "EBQBODY3X5S" },
  { bodyStyle: "EBQ",  inlet: "1/2", outlet: "5/8", partNumber: "EBQBODY4X5" },
  { bodyStyle: "EBQE", inlet: "1/4", outlet: "3/8", partNumber: "EBQEBODY2X3" },
  { bodyStyle: "EBQE", inlet: "3/8", outlet: "1/2", partNumber: "EBQEBODY3X4" },
  { bodyStyle: "EBQE", inlet: "1/2", outlet: "5/8", partNumber: "EBQEBODY4X5S" },
  { bodyStyle: "EBQE", inlet: "1/2", outlet: "7/8", partNumber: "EBQEBODY4X7" },
];

const FRACTION_SORT = {
  "1/4": 0.25, "3/8": 0.375, "1/2": 0.5, "5/8": 0.625, "7/8": 0.875,
};

// ─── Cartridge Data ───

const Q_CARTRIDGES = [
  { code:"0",color:"RED",    capacities:{ J:"1/8 - 1/6",     S:"1/8 - 1/6", V_D_N_O_T:"1/4 - 1/3",       Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"1",color:"YELLOW", capacities:{ J:"1/4",           S:"1/4",       V_D_N_O_T:"1/2 - 3/4",       Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"2",color:"GREEN",  capacities:{ J:"1/2",           S:"1/2",       V_D_N_O_T:"1",               Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"3",color:"BLUE",   capacities:{ J:"1",             S:"1",         V_D_N_O_T:"1 - 1-1/2",       Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"4",color:"PINK",   capacities:{ J:"1-1/2",         S:"1-1/2",     V_D_N_O_T:"2 - 2-1/2",       Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"5",color:"BLACK",  capacities:{ J:"2",             S:"2",         V_D_N_O_T:"3",               Z_R410A:"",           Z_R32:"",              Y:"" }},
  { code:"6",color:"WHITE",  capacities:{ J:"2-1/2 - 3",     S:"3",         V_D_N_O_T:"4 - 5",           Z_R410A:"",           Z_R32:"",              Y:"" }},
];

const BQ_CARTRIDGES = [
  { code:"AAA",color:"RED",    capacities:{ J:"1/8 - 1/5",     S:"1/8 - 1/5",     V_D_N_O_T:"1/8 - 1/3",     Z_R410A:"1/4 - 1/3",   Z_R32:"1/3 - 1/2",     Y:"1/3 - 1/2" }},
  { code:"AA", color:"YELLOW", capacities:{ J:"1/4 - 1/3",     S:"1/4 - 1/3",     V_D_N_O_T:"1/2 - 2/3",     Z_R410A:"1/2 - 3/4",   Z_R32:"3/4 - 1",       Y:"3/4 - 1" }},
  { code:"A",  color:"BLUE",   capacities:{ J:"1/2 - 1",       S:"1/2 - 1",       V_D_N_O_T:"3/4 - 1-1/2",   Z_R410A:"1 - 1-3/4",   Z_R32:"1-1/2 - 2-1/2", Y:"1-1/2 - 2" }},
  { code:"B",  color:"PINK",   capacities:{ J:"1-1/4 - 1-3/4", S:"1-1/4 - 2",     V_D_N_O_T:"1-3/4 - 3",     Z_R410A:"2 - 3-1/2",   Z_R32:"3 - 4-1/2",     Y:"2-1/2 - 4" }},
  { code:"C",  color:"WHITE",  capacities:{ J:"2 - 3",         S:"2-1/4 - 3",     V_D_N_O_T:"3-1/4 - 5-1/2", Z_R410A:"4 - 6",       Z_R32:"5 - 8-1/2",     Y:"4-1/2 - 7" }},
];

const BQ_BP15_CARTRIDGES = [
  { code:"AA-BP15",color:"YELLOW", capacities:{ J:"1/4 - 1/3",     S:"1/4 - 1/3",     V_D_N_O_T:"1/2 - 2/3",     Z_R410A:"1/2 - 3/4",   Z_R32:"3/4 - 1",       Y:"3/4 - 1" }},
  { code:"A-BP15", color:"BLUE",   capacities:{ J:"1/2 - 1",       S:"1/2 - 1",       V_D_N_O_T:"3/4 - 1-1/2",   Z_R410A:"1 - 1-3/4",   Z_R32:"1-1/2 - 2-1/2", Y:"1-1/2 - 2" }},
  { code:"B-BP15", color:"PINK",   capacities:{ J:"1-1/4 - 1-3/4", S:"1-1/4 - 2",     V_D_N_O_T:"1-3/4 - 3",     Z_R410A:"2 - 3-1/2",   Z_R32:"3 - 4-1/2",     Y:"2-1/2 - 4" }},
  { code:"C-BP15", color:"WHITE",  capacities:{ J:"2 - 3",         S:"2-1/4 - 3",     V_D_N_O_T:"3-1/4 - 5-1/2", Z_R410A:"4 - 6",       Z_R32:"5 - 8-1/2",     Y:"4-1/2 - 7" }},
];

const COLOR_BG = {
  RED:    "background:#dc2626",
  YELLOW: "background:#eab308",
  GREEN:  "background:#16a34a",
  BLUE:   "background:#2563eb",
  PINK:   "background:#ec4899",
  BLACK:  "background:#111827",
  WHITE:  "background:#e5e7eb",
};

// ─── Powerhead Data ───

const POWERHEAD_SUFFIXES = {
  J:   { air_conditioning: "JCP60",  commercial_refrigeration: "JC",    low_temp: "JZ" },
  V:   { air_conditioning: "VCP100", commercial_refrigeration: "VC",    low_temp: "VZ" },
  NGA: { air_conditioning: "NGA" },
  D:   { commercial_refrigeration: "DC" },
  S:   { air_conditioning: "SCP115", commercial_refrigeration: "SC/PC", low_temp: "SZ" },
};

const R410A_BASE_SWAP = {
  KT33: "KT33", KT43: "KT45", KT47: "KT45", KT53: "KT53",
  KT63: "KT63", KT83: "KT85", KT85: "KT85", KT45: "KT45",
};

const R410A_SUFFIXES = {
  air_conditioning: "ZGA",
};

// ─── State ───

let state = {
  temperature:        "",
  refrigerant:        "",
  equalizer:          "",
  bodyStyle:          "",
  inletSize:          "",
  outletSize:         "",
  cartridge:          "",
  powerElement:       "",
  tonnage:            "",
  oemUnitModel:       "",
  moreSpecs:          false,
  cartridgeOpen:      false,
  showUncommonPower:  false,
  showBP15:           false,
};

// ─── DOM refs ───

const $temperature        = document.getElementById("temperature");
const $refrigerant        = document.getElementById("refrigerant");
const $equalizer          = document.getElementById("equalizer");
const $bodyGrid           = document.getElementById("body-style-grid");
const $inletOutletSection = document.getElementById("inlet-outlet-section");
const $inletSize          = document.getElementById("inlet-size");
const $outletSize         = document.getElementById("outlet-size");
const $cartridgeBtn       = document.getElementById("cartridge-btn");
const $cartridgeBtnTxt    = document.getElementById("cartridge-btn-text");
const $cartridgeList      = document.getElementById("cartridge-list");
const $cartridgePH        = document.getElementById("cartridge-placeholder");
const $cartridgeHint      = document.getElementById("cartridge-family-hint");
const $cartridgeNoMatch   = document.getElementById("cartridge-no-match");
const $bp15Toggle         = document.getElementById("bp15-toggle");
const $powerElement       = document.getElementById("power-element");
const $uncommonPowerToggle = document.getElementById("uncommon-power-toggle");
const $resolvedBody       = document.getElementById("resolved-body");
const $resolvedCartridge  = document.getElementById("resolved-cartridge");
const $resolvedPowerhead  = document.getElementById("resolved-powerhead");
const $moreToggle         = document.getElementById("more-specs-toggle");
const $moreSection        = document.getElementById("more-specs");
const $tonnage            = document.getElementById("tonnage");
const $oemUnitModel       = document.getElementById("oem-unit-model");
const $submitBtn          = document.getElementById("submit-btn");
const $resultOutput       = document.getElementById("result-output");

// ─── Helpers ───

function getChargeLetter(refrig) {
  const opt = REFRIGERANT_OPTIONS.find(o => o.refrigerant === refrig);
  return opt ? opt.charge : "";
}

function getChargeColumn(refrig, charge) {
  if (!refrig) return "";
  if (refrig === "R410A") return "Z_R410A";
  if (refrig === "R32")   return "Z_R32";
  if (refrig === "R454B") return "Y";
  if (charge === "J") return "J";
  if (charge === "S") return "S";
  if (["V","D","N","O","T"].includes(charge)) return "V_D_N_O_T";
  return "";
}

function getBodyFamily(bs) {
  if (!bs) return "";
  if (["BQ","BQE","EBQ","EBQE","SBQ","SBQE"].includes(bs)) return "BQ";
  return "Q";
}

function sortedRefrigerants(temp) {
  const priority = temp ? (TEMP_PRIORITY_REFRIGERANTS[temp] || []) : [];
  if (!priority.length) return REFRIGERANT_OPTIONS;
  const set = new Set(priority);
  return [
    ...REFRIGERANT_OPTIONS.filter(o => set.has(o.refrigerant)),
    ...REFRIGERANT_OPTIONS.filter(o => !set.has(o.refrigerant)),
  ];
}

function visibleBodyStyles(eq) {
  if (eq === "external") return EXTERNAL_STYLES;
  if (eq === "internal") return INTERNAL_STYLES;
  return ALL_BODY_STYLES;
}

function resolveCartridgePN(family, code) {
  if (!family || !code) return "";
  if (family === "Q") return "QC" + code;
  return "BQC" + code;
}

function getPowerheadChargeGroup(refrig, charge) {
  if (refrig === "R407C") return "NGA";
  return charge;
}

function resolvePowerheadPN(base, refrig, charge, temp) {
  if (!base || !charge || !temp) return "";

  if (charge === "Z" && refrig === "R410A") {
    const swapped = R410A_BASE_SWAP[base] || base;
    const suffix = R410A_SUFFIXES[temp];
    return suffix ? (swapped + suffix) : "";
  }
  if (charge === "Z") return "";

  const group = getPowerheadChargeGroup(refrig, charge);
  const suffixes = POWERHEAD_SUFFIXES[group];
  if (!suffixes) return "";
  const suffix = suffixes[temp];
  return suffix ? (base + suffix) : "";
}

function getAvailableInletSizes(bs) {
  if (!bs) return [];
  const sizes = new Set(BODY_PART_NUMBERS.filter(e => e.bodyStyle === bs).map(e => e.inlet));
  return [...sizes].sort((a, b) => (FRACTION_SORT[a] || 0) - (FRACTION_SORT[b] || 0));
}

function getAvailableOutletSizes(bs, inlet) {
  if (!bs) return [];
  const filtered = BODY_PART_NUMBERS.filter(
    e => e.bodyStyle === bs && (!inlet || e.inlet === inlet)
  );
  const sizes = new Set(filtered.map(e => e.outlet));
  return [...sizes].sort((a, b) => (FRACTION_SORT[a] || 0) - (FRACTION_SORT[b] || 0));
}

function resolveBodyPartNumber(bs, inlet, outlet) {
  if (!bs || !inlet || !outlet) return "";
  const entry = BODY_PART_NUMBERS.find(
    e => e.bodyStyle === bs && e.inlet === inlet && e.outlet === outlet
  );
  return entry ? entry.partNumber : "";
}

function getCartridgeOptions() {
  const family = getBodyFamily(state.bodyStyle);
  const charge = getChargeLetter(state.refrigerant);
  const col    = getChargeColumn(state.refrigerant, charge);

  function mapRow(c) {
    return { ...c, nominalCapacity: col ? (c.capacities[col] || "\u2014") : "\u2014" };
  }

  if (family === "Q") return Q_CARTRIDGES.map(mapRow);
  if (family === "BQ") {
    const base = BQ_CARTRIDGES.map(mapRow);
    if (state.showBP15) return [...base, ...BQ_BP15_CARTRIDGES.map(mapRow)];
    return base;
  }
  return [];
}

function filledCount() {
  return [state.refrigerant, state.bodyStyle, state.temperature, state.tonnage].filter(Boolean).length;
}

function powerElementLabel(o) {
  if (o === "KT47") return o + " (recommended)";
  if (o === "KT43") return o + " (superseded \u2014 use if KT47 unavailable)";
  return o;
}

// ─── Renderers ───

function populateSelect(el, options, placeholder) {
  el.innerHTML = '<option value="">' + placeholder + '</option>' +
    options.map(o => {
      const val   = typeof o === "string" ? o : (o.value || o.refrigerant || o);
      const label = typeof o === "string" ? o : (o.label || o);
      return '<option value="' + val + '">' + label + '</option>';
    }).join("");
}

function renderTemperature() {
  populateSelect($temperature, TEMPERATURE_OPTIONS, "Select\u2026");
  $temperature.value = state.temperature;
}

function renderRefrigerant() {
  const sorted = sortedRefrigerants(state.temperature);
  const placeholder = state.temperature ? "Select\u2026" : "Select temperature first";
  populateSelect($refrigerant, sorted, placeholder);
  $refrigerant.value = state.refrigerant;
}

function renderBodyStyles() {
  const styles = visibleBodyStyles(state.equalizer);
  $bodyGrid.innerHTML = styles.map(code => {
    const active = state.bodyStyle === code;
    const cls = active
      ? "border-orange-400 bg-orange-500/20 text-white"
      : "border-[#2A2A2E] bg-[#2A2A2E] text-gray-300 hover:bg-[#333]";
    return '<button type="button" data-body="' + code + '" class="flex items-center gap-1.5 rounded border px-2 py-1.5 text-xs transition ' + cls + '">' +
      '<img src="/body_styles/' + code + '.PNG" alt="' + code + '" class="h-[72px] w-[72px] shrink-0 object-contain" onerror="this.style.display=\'none\'" />' +
      '<span>' + code + '</span>' +
    '</button>';
  }).join("");
}

function renderInletOutlet() {
  if (!state.bodyStyle) {
    $inletOutletSection.classList.add("hidden");
    return;
  }
  $inletOutletSection.classList.remove("hidden");

  const inletSizes = getAvailableInletSizes(state.bodyStyle);
  populateSelect($inletSize, inletSizes.map(s => ({ value: s, label: s + '"' })), "Select\u2026");
  $inletSize.value = state.inletSize;

  if (state.inletSize) {
    $outletSize.disabled = false;
    const outletSizes = getAvailableOutletSizes(state.bodyStyle, state.inletSize);
    populateSelect($outletSize, outletSizes.map(s => ({ value: s, label: s + '"' })), "Select\u2026");
    $outletSize.value = state.outletSize;
  } else {
    $outletSize.disabled = true;
    $outletSize.innerHTML = '<option value="">Select inlet first</option>';
  }
}

function renderCartridge() {
  const charge  = getChargeLetter(state.refrigerant);
  const enabled = Boolean(charge && state.bodyStyle);
  const family  = getBodyFamily(state.bodyStyle);

  $cartridgeNoMatch.classList.add("hidden");
  $cartridgeHint.classList.add("hidden");
  $bp15Toggle.classList.add("hidden");

  if (!enabled) {
    $cartridgePH.classList.remove("hidden");
    $cartridgeBtn.classList.add("hidden");
    $cartridgeList.classList.add("hidden");
    return;
  }

  $cartridgePH.classList.add("hidden");
  $cartridgeBtn.classList.remove("hidden");
  $cartridgeBtn.classList.add("flex");

  const options = getCartridgeOptions();
  const visible = state.refrigerant
    ? options.filter(c => c.nominalCapacity && c.nominalCapacity !== "\u2014")
    : options;

  $cartridgeHint.classList.remove("hidden");
  $cartridgeHint.textContent = state.refrigerant
    ? family + " cartridge \u2022 Nominal capacity for " + state.refrigerant
    : family + " cartridge \u2022 Select refrigerant to see capacity";

  if (state.refrigerant && visible.length === 0) {
    $cartridgeNoMatch.classList.remove("hidden");
    $cartridgeNoMatch.textContent = "No cartridge options for " + state.refrigerant + " with " + family + " body in this reference.";
  }

  if (family === "BQ") {
    $bp15Toggle.classList.remove("hidden");
    $bp15Toggle.textContent = state.showBP15
      ? "\u2212 Hide BP15 bypass variants"
      : "+ Show BP15 bypass variants";
  }

  const selected = options.find(c => c.code === state.cartridge);
  const cartPN   = resolveCartridgePN(family, state.cartridge);
  if (selected) {
    $cartridgeBtnTxt.innerHTML =
      '<span style="' + (COLOR_BG[selected.color] || '') + ';width:20px;height:20px;border-radius:4px;display:inline-block;vertical-align:middle;border:1px solid #2A2A2E" class="shrink-0"></span> ' +
      '<span>' + cartPN + ' (' + selected.code + ') \u2014 ' + selected.nominalCapacity + ' ton</span>';
    $cartridgeBtnTxt.classList.remove("text-gray-500");
    $cartridgeBtnTxt.classList.add("text-white");
  } else {
    $cartridgeBtnTxt.innerHTML = "Select capacity code\u2026";
    $cartridgeBtnTxt.classList.add("text-gray-500");
    $cartridgeBtnTxt.classList.remove("text-white");
  }

  $cartridgeList.innerHTML = visible.map(c => {
    const pn = resolveCartridgePN(family, c.code);
    const activeCls = state.cartridge === c.code ? "bg-orange-500/20" : "";
    return '<li role="option" data-cartridge="' + c.code + '" class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#2A2A2E] ' + activeCls + '">' +
      '<span style="' + (COLOR_BG[c.color] || '') + ';width:20px;height:20px;border-radius:4px;display:inline-block;border:1px solid #2A2A2E" title="' + c.color + '"></span>' +
      '<span class="font-medium text-gray-200">' + pn + '</span>' +
      '<span class="text-xs text-gray-500">(' + c.code + ')</span>' +
      '<span class="text-gray-400">\u2014</span>' +
      '<span class="text-gray-300">' + c.nominalCapacity + ' ton</span>' +
    '</li>';
  }).join("");
}

function renderPowerElement() {
  const options = state.showUncommonPower
    ? [...STANDARD_POWER_ELEMENTS, ...UNCOMMON_POWER_ELEMENTS]
    : STANDARD_POWER_ELEMENTS;

  $powerElement.innerHTML = '<option value="">Select\u2026</option>' +
    options.map(o => '<option value="' + o + '">' + powerElementLabel(o) + '</option>').join("");
  $powerElement.value = state.powerElement;

  $uncommonPowerToggle.textContent = state.showUncommonPower
    ? "\u2212 Hide uncommon sizes"
    : "+ Show uncommon sizes (KT33, KT45, KT63, KT85)";
}

function renderResolvedPartNumbers() {
  const bodyPN       = resolveBodyPartNumber(state.bodyStyle, state.inletSize, state.outletSize);
  const family       = getBodyFamily(state.bodyStyle);
  const cartridgePN  = resolveCartridgePN(family, state.cartridge);
  const charge       = getChargeLetter(state.refrigerant);
  const powerheadPN  = resolvePowerheadPN(state.powerElement, state.refrigerant, charge, state.temperature);

  $resolvedBody.textContent      = bodyPN      || "\u2014";
  $resolvedBody.className        = bodyPN      ? "text-white" : "text-gray-600";
  $resolvedCartridge.textContent  = cartridgePN || "\u2014";
  $resolvedCartridge.className    = cartridgePN ? "text-white" : "text-gray-600";
  $resolvedPowerhead.textContent  = powerheadPN || "\u2014";
  $resolvedPowerhead.className    = powerheadPN ? "text-white" : "text-gray-600";
}

function renderSubmitBtn() {
  const count = filledCount();
  if (count >= 2) {
    $submitBtn.disabled = false;
    $submitBtn.textContent = "Use this configuration";
  } else {
    $submitBtn.disabled = true;
    $submitBtn.textContent = "Select at least 2: refrigerant, body style, temperature, or tonnage";
  }
}

function renderAll() {
  renderRefrigerant();
  renderBodyStyles();
  renderInletOutlet();
  renderCartridge();
  renderPowerElement();
  renderResolvedPartNumbers();
  renderSubmitBtn();
}

// ─── Validation: keep selections valid ───

function validateInletOutlet() {
  if (state.inletSize) {
    const available = getAvailableInletSizes(state.bodyStyle);
    if (!available.includes(state.inletSize)) {
      state.inletSize = "";
      state.outletSize = "";
    }
  }
  if (state.outletSize) {
    const available = getAvailableOutletSizes(state.bodyStyle, state.inletSize);
    if (!available.includes(state.outletSize)) {
      state.outletSize = "";
    }
  }
}

function validateCartridge() {
  if (state.cartridge) {
    const options = getCartridgeOptions();
    if (!options.some(c => c.code === state.cartridge)) {
      state.cartridge = "";
    }
  }
}

// ─── Init static dropdowns ───

renderTemperature();
populateSelect($tonnage, TONNAGE_OPTIONS, "\u2014");
renderAll();

// ─── Event Listeners ───

$temperature.addEventListener("change", () => {
  state.temperature = $temperature.value;
  renderAll();
});

$refrigerant.addEventListener("change", () => {
  state.refrigerant = $refrigerant.value;
  validateCartridge();
  renderAll();
});

$equalizer.addEventListener("change", () => {
  state.equalizer = $equalizer.value;
  const visible = visibleBodyStyles(state.equalizer);
  if (state.bodyStyle && !visible.includes(state.bodyStyle)) {
    state.bodyStyle = "";
    state.inletSize = "";
    state.outletSize = "";
    state.cartridge = "";
  }
  renderAll();
});

$bodyGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-body]");
  if (!btn) return;
  state.bodyStyle = btn.dataset.body;
  state.inletSize = "";
  state.outletSize = "";
  validateCartridge();
  renderAll();
});

$inletSize.addEventListener("change", () => {
  state.inletSize = $inletSize.value;
  state.outletSize = "";
  renderInletOutlet();
  renderResolvedPartNumbers();
});

$outletSize.addEventListener("change", () => {
  state.outletSize = $outletSize.value;
  renderResolvedPartNumbers();
});

// Cartridge dropdown toggle
$cartridgeBtn.addEventListener("click", () => {
  state.cartridgeOpen = !state.cartridgeOpen;
  if (state.cartridgeOpen) {
    $cartridgeList.classList.remove("hidden");
    $cartridgeList.style.width = $cartridgeBtn.offsetWidth + "px";
  } else {
    $cartridgeList.classList.add("hidden");
  }
  const arrow = $cartridgeBtn.querySelector("span:last-child");
  arrow.textContent = state.cartridgeOpen ? "\u25B4" : "\u25BE";
});

$cartridgeList.addEventListener("click", (e) => {
  const li = e.target.closest("[data-cartridge]");
  if (!li) return;
  state.cartridge = li.dataset.cartridge;
  state.cartridgeOpen = false;
  $cartridgeList.classList.add("hidden");
  const arrow = $cartridgeBtn.querySelector("span:last-child");
  arrow.textContent = "\u25BE";
  renderCartridge();
  renderResolvedPartNumbers();
});

document.addEventListener("mousedown", (e) => {
  if (state.cartridgeOpen &&
      !$cartridgeBtn.contains(e.target) &&
      !$cartridgeList.contains(e.target)) {
    state.cartridgeOpen = false;
    $cartridgeList.classList.add("hidden");
    const arrow = $cartridgeBtn.querySelector("span:last-child");
    arrow.textContent = "\u25BE";
  }
});

$bp15Toggle.addEventListener("click", () => {
  state.showBP15 = !state.showBP15;
  validateCartridge();
  renderCartridge();
  renderResolvedPartNumbers();
});

$powerElement.addEventListener("change", () => {
  state.powerElement = $powerElement.value;
  renderResolvedPartNumbers();
});

$uncommonPowerToggle.addEventListener("click", () => {
  state.showUncommonPower = !state.showUncommonPower;
  renderPowerElement();
});

$tonnage.addEventListener("change", () => {
  state.tonnage = $tonnage.value;
  renderSubmitBtn();
});

$oemUnitModel.addEventListener("input", () => {
  state.oemUnitModel = $oemUnitModel.value;
});

$moreToggle.addEventListener("click", () => {
  state.moreSpecs = !state.moreSpecs;
  $moreSection.classList.toggle("hidden", !state.moreSpecs);
  $moreToggle.textContent = state.moreSpecs ? "\u2212 Less" : "+ More specs";
});

// Submit
$submitBtn.addEventListener("click", () => {
  if (filledCount() < 2) return;

  const family      = getBodyFamily(state.bodyStyle);
  const charge      = getChargeLetter(state.refrigerant);
  const bodyPN      = resolveBodyPartNumber(state.bodyStyle, state.inletSize, state.outletSize);
  const cartridgePN = resolveCartridgePN(family, state.cartridge);
  const powerheadPN = resolvePowerheadPN(state.powerElement, state.refrigerant, charge, state.temperature);

  const payload = {
    builder:                "txv",
    temperature:            state.temperature    || undefined,
    refrigerant:            state.refrigerant    || undefined,
    body_style:             state.bodyStyle      || undefined,
    cartridge:              state.cartridge      || undefined,
    power_element:          state.powerElement   || undefined,
    tonnage:                state.tonnage        || undefined,
    equalizer:              state.equalizer      || undefined,
    inlet_size:             state.inletSize      || undefined,
    outlet_size:            state.outletSize     || undefined,
    oem_unit_model:         state.oemUnitModel.trim() || undefined,
    body_part_number:       bodyPN               || undefined,
    cartridge_part_number:  cartridgePN          || undefined,
    powerhead_part_number:  powerheadPN          || undefined,
  };

  console.log("TXV Builder payload:", payload);

  const lines = Object.entries(payload)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => '<div><span class="text-gray-400">' + k.replace(/_/g, " ") + ':</span> <span class="text-white font-medium">' + v + '</span></div>');

  $resultOutput.innerHTML =
    '<p class="font-semibold text-accent mb-2">Your TXV Configuration</p>' +
    lines.join("") +
    '<p class="text-gray-400 mt-3 text-xs">Resolved: Body <span class="font-mono text-white">' + (bodyPN || "\u2014") + '</span> · Cartridge <span class="font-mono text-white">' + (cartridgePN || "\u2014") + '</span> · Powerhead <span class="font-mono text-white">' + (powerheadPN || "\u2014") + '</span></p>';
  $resultOutput.classList.remove("hidden");
  $resultOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
