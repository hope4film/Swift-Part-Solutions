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

const POWER_ELEMENT_OPTIONS  = ["KT43","KT47","KT53","KT83"];
const TONNAGE_OPTIONS        = ["0.5","1","1.5","2","3","4","5","8"];
const CONNECTION_SIZE_OPTIONS = ["1/4","3/8","1/2","5/8"];

const TEMP_PRIORITY_REFRIGERANTS = {
  low_temp:                 ["R404A","R507A","R448A","R449A","R502","R402A"],
  air_conditioning:         ["R22","R410A","R454B","R32","R407C","R134a"],
  commercial_refrigeration: [],
};

// Q cartridges: capacity codes 0–6
const Q_CARTRIDGES = [
  { code:"0",color:"RED",    capacities:{ J:"1/8 - 1/6",     S:"1/8 - 1/6", V:"1/4 - 1/3",       Z410:"",  Z32:"",            Y:"" }},
  { code:"1",color:"YELLOW", capacities:{ J:"1/4",           S:"1/4",       V:"1/2 - 3/4",       Z410:"",  Z32:"",            Y:"" }},
  { code:"2",color:"GREEN",  capacities:{ J:"1/2",           S:"1/2",       V:"1",               Z410:"",  Z32:"",            Y:"" }},
  { code:"3",color:"BLUE",   capacities:{ J:"1",             S:"1",         V:"1 - 1-1/2",       Z410:"",  Z32:"",            Y:"" }},
  { code:"4",color:"PINK",   capacities:{ J:"1-1/2",         S:"1-1/2",     V:"2 - 2-1/2",       Z410:"",  Z32:"",            Y:"" }},
  { code:"5",color:"BLACK",  capacities:{ J:"2",             S:"2",         V:"3",               Z410:"",  Z32:"",            Y:"" }},
  { code:"6",color:"WHITE",  capacities:{ J:"2-1/2 - 3",     S:"3",         V:"4 - 5",           Z410:"",  Z32:"",            Y:"" }},
];

// BQ cartridges: capacity codes AAA, AA, A, B, C
const BQ_CARTRIDGES = [
  { code:"AAA",color:"RED",    capacities:{ J:"1/8 - 1/5",     S:"1/8 - 1/5",     V:"1/8 - 1/3",     Z410:"1/4 - 1/3",   Z32:"1/3 - 1/2",     Y:"1/3 - 1/2" }},
  { code:"AA", color:"YELLOW", capacities:{ J:"1/4 - 1/3",     S:"1/4 - 1/3",     V:"1/2 - 2/3",     Z410:"1/2 - 3/4",   Z32:"3/4 - 1",       Y:"3/4 - 1" }},
  { code:"A",  color:"BLUE",   capacities:{ J:"1/2 - 1",       S:"1/2 - 1",       V:"3/4 - 1-1/2",   Z410:"1 - 1-3/4",   Z32:"1-1/2 - 2-1/2", Y:"1-1/2 - 2" }},
  { code:"B",  color:"PINK",   capacities:{ J:"1-1/4 - 1-3/4", S:"1-1/4 - 2",     V:"1-3/4 - 3",     Z410:"2 - 3-1/2",   Z32:"3 - 4-1/2",     Y:"2-1/2 - 4" }},
  { code:"C",  color:"WHITE",  capacities:{ J:"2 - 3",         S:"2-1/4 - 3",     V:"3-1/4 - 5-1/2", Z410:"4 - 6",       Z32:"5 - 8-1/2",     Y:"4-1/2 - 7" }},
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

// ─── State ───

let state = {
  temperature:    "",
  refrigerant:    "",
  equalizer:      "",
  bodyStyle:      "",
  cartridge:      "",
  powerElement:   "",
  tonnage:        "",
  connectionSize: "",
  oemUnitModel:   "",
  moreSpecs:      false,
  cartridgeOpen:  false,
};

// ─── DOM refs ───

const $temperature     = document.getElementById("temperature");
const $refrigerant     = document.getElementById("refrigerant");
const $equalizer       = document.getElementById("equalizer");
const $bodyGrid        = document.getElementById("body-style-grid");
const $cartridgeBtn    = document.getElementById("cartridge-btn");
const $cartridgeBtnTxt = document.getElementById("cartridge-btn-text");
const $cartridgeList   = document.getElementById("cartridge-list");
const $cartridgePH     = document.getElementById("cartridge-placeholder");
const $cartridgeHint   = document.getElementById("cartridge-family-hint");
const $cartridgeNoMatch = document.getElementById("cartridge-no-match");
const $powerElement    = document.getElementById("power-element");
const $preview         = document.getElementById("part-preview");
const $moreToggle      = document.getElementById("more-specs-toggle");
const $moreSection     = document.getElementById("more-specs");
const $tonnage         = document.getElementById("tonnage");
const $connectionSize  = document.getElementById("connection-size");
const $oemUnitModel    = document.getElementById("oem-unit-model");
const $submitBtn       = document.getElementById("submit-btn");
const $resultOutput    = document.getElementById("result-output");

// ─── Helpers ───

function getChargeLetter(refrig) {
  const opt = REFRIGERANT_OPTIONS.find(o => o.refrigerant === refrig);
  return opt ? opt.charge : "";
}

function getChargeColumn(refrig, charge) {
  if (!refrig) return "";
  if (refrig === "R410A") return "Z410";
  if (refrig === "R32")   return "Z32";
  if (refrig === "R454B") return "Y";
  if (charge === "J") return "J";
  if (charge === "S") return "S";
  if (["V","D","N","O","T"].includes(charge)) return "V";
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

function getCartridgeOptions() {
  const family = getBodyFamily(state.bodyStyle);
  const charge = getChargeLetter(state.refrigerant);
  const col    = getChargeColumn(state.refrigerant, charge);
  const table  = family === "BQ" ? BQ_CARTRIDGES : family === "Q" ? Q_CARTRIDGES : [];
  return table.map(c => ({
    ...c,
    nominalCapacity: col ? (c.capacities[col] || "\u2014") : "\u2014",
  }));
}

function buildPreview() {
  const body   = state.bodyStyle || "";
  const charge = getChargeLetter(state.refrigerant) || "";
  const cart   = state.cartridge || "";
  if (!body && !charge && !cart) return "\u2014";
  return `${body}${charge}${cart ? "-" + cart : ""}` || "\u2014";
}

function filledCount() {
  return [state.refrigerant, state.bodyStyle, state.temperature, state.tonnage].filter(Boolean).length;
}

// ─── Renderers ───

function populateSelect(el, options, placeholder) {
  el.innerHTML = `<option value="">${placeholder}</option>` +
    options.map(o => {
      const val   = typeof o === "string" ? o : (o.value || o.refrigerant || o);
      const label = typeof o === "string" ? o : (o.label || o);
      return `<option value="${val}">${label}</option>`;
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
    return `<button type="button" data-body="${code}" class="flex items-center gap-1.5 rounded border px-2 py-1.5 text-xs transition ${cls}">
      <img src="/body_styles/${code}.PNG" alt="${code}" class="h-[72px] w-[72px] shrink-0 object-contain" onerror="this.style.display='none'" />
      <span>${code}</span>
    </button>`;
  }).join("");
}

function renderCartridge() {
  const charge  = getChargeLetter(state.refrigerant);
  const enabled = Boolean(charge && state.bodyStyle);

  $cartridgeNoMatch.classList.add("hidden");
  $cartridgeHint.classList.add("hidden");

  if (!enabled) {
    $cartridgePH.classList.remove("hidden");
    $cartridgeBtn.classList.add("hidden");
    $cartridgeList.classList.add("hidden");
    return;
  }

  $cartridgePH.classList.add("hidden");
  $cartridgeBtn.classList.remove("hidden");
  $cartridgeBtn.classList.add("flex");

  const family  = getBodyFamily(state.bodyStyle);
  const options = getCartridgeOptions();
  const visible = state.refrigerant
    ? options.filter(c => c.nominalCapacity && c.nominalCapacity !== "\u2014")
    : options;

  // Hint text
  $cartridgeHint.classList.remove("hidden");
  $cartridgeHint.textContent = state.refrigerant
    ? `${family} cartridge \u2022 Nominal capacity for ${state.refrigerant}`
    : `${family} cartridge \u2022 Select refrigerant to see capacity`;

  if (state.refrigerant && visible.length === 0) {
    $cartridgeNoMatch.classList.remove("hidden");
    $cartridgeNoMatch.textContent = `No cartridge options for ${state.refrigerant} with ${family} body in this reference.`;
  }

  // Button text
  const selected = options.find(c => c.code === state.cartridge);
  if (selected) {
    $cartridgeBtnTxt.innerHTML = `<span style="${COLOR_BG[selected.color] || ''};width:20px;height:20px;border-radius:4px;display:inline-block;vertical-align:middle;border:1px solid #2A2A2E" class="shrink-0"></span> <span>${selected.code} \u2014 ${selected.nominalCapacity} ton</span>`;
    $cartridgeBtnTxt.classList.remove("text-gray-500");
    $cartridgeBtnTxt.classList.add("text-white");
  } else {
    $cartridgeBtnTxt.innerHTML = "Select capacity code\u2026";
    $cartridgeBtnTxt.classList.add("text-gray-500");
    $cartridgeBtnTxt.classList.remove("text-white");
  }

  // List items
  $cartridgeList.innerHTML = visible.map(c => {
    const activeCls = state.cartridge === c.code ? "bg-orange-500/20" : "";
    return `<li role="option" data-cartridge="${c.code}" class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#2A2A2E] ${activeCls}">
      <span style="${COLOR_BG[c.color] || ''};width:20px;height:20px;border-radius:4px;display:inline-block;border:1px solid #2A2A2E" title="${c.color}"></span>
      <span class="font-medium text-gray-200">${c.code}</span>
      <span class="text-gray-400">\u2014</span>
      <span class="text-gray-300">${c.nominalCapacity} ton</span>
    </li>`;
  }).join("");
}

function renderPreview() {
  $preview.textContent = buildPreview();
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
  renderCartridge();
  renderPreview();
  renderSubmitBtn();
}

// ─── Init static dropdowns ───

renderTemperature();

populateSelect($powerElement, POWER_ELEMENT_OPTIONS, "Select\u2026");
populateSelect($tonnage, TONNAGE_OPTIONS, "\u2014");
populateSelect($connectionSize, CONNECTION_SIZE_OPTIONS, "\u2014");

renderAll();

// ─── Event Listeners ───

$temperature.addEventListener("change", () => {
  state.temperature = $temperature.value;
  renderAll();
});

$refrigerant.addEventListener("change", () => {
  state.refrigerant = $refrigerant.value;
  // Clear cartridge if it's no longer valid
  const options = getCartridgeOptions();
  if (state.cartridge && !options.some(c => c.code === state.cartridge)) {
    state.cartridge = "";
  }
  renderAll();
});

$equalizer.addEventListener("change", () => {
  state.equalizer = $equalizer.value;
  const visible = visibleBodyStyles(state.equalizer);
  if (state.bodyStyle && !visible.includes(state.bodyStyle)) {
    state.bodyStyle = "";
    state.cartridge = "";
  }
  renderAll();
});

$bodyGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-body]");
  if (!btn) return;
  state.bodyStyle = btn.dataset.body;
  // Clear cartridge if switching between Q/BQ family
  const options = getCartridgeOptions();
  if (state.cartridge && !options.some(c => c.code === state.cartridge)) {
    state.cartridge = "";
  }
  renderAll();
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
  renderPreview();
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

$powerElement.addEventListener("change", () => {
  state.powerElement = $powerElement.value;
});

$tonnage.addEventListener("change", () => {
  state.tonnage = $tonnage.value;
  renderSubmitBtn();
});

$connectionSize.addEventListener("change", () => {
  state.connectionSize = $connectionSize.value;
});

$oemUnitModel.addEventListener("input", () => {
  state.oemUnitModel = $oemUnitModel.value;
});

// More specs toggle
$moreToggle.addEventListener("click", () => {
  state.moreSpecs = !state.moreSpecs;
  $moreSection.classList.toggle("hidden", !state.moreSpecs);
  $moreToggle.textContent = state.moreSpecs ? "\u2212 Less" : "+ More specs";
});

// Submit
$submitBtn.addEventListener("click", () => {
  if (filledCount() < 2) return;

  const payload = {
    builder:         "txv",
    temperature:     state.temperature    || undefined,
    refrigerant:     state.refrigerant    || undefined,
    body_style:      state.bodyStyle      || undefined,
    cartridge:       state.cartridge      || undefined,
    power_element:   state.powerElement   || undefined,
    tonnage:         state.tonnage        || undefined,
    equalizer:       state.equalizer      || undefined,
    connection_size: state.connectionSize || undefined,
    oem_unit_model:  state.oemUnitModel.trim() || undefined,
  };

  console.log("TXV Builder payload:", payload);

  const lines = Object.entries(payload)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `<div><span class="text-gray-400">${k.replace(/_/g, " ")}:</span> <span class="text-white font-medium">${v}</span></div>`);

  $resultOutput.innerHTML =
    `<p class="font-semibold text-accent mb-2">Your TXV Configuration</p>` +
    lines.join("") +
    `<p class="text-gray-400 mt-3 text-xs">Part preview: <span class="font-mono text-white">${buildPreview()}</span></p>`;
  $resultOutput.classList.remove("hidden");
  $resultOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
