"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TxvBuilderBlock, TxvBuilderPrefill } from "../../types";

// --- Data (from legacy HTML) ---

const TEMPERATURE_OPTIONS: { value: string; label: string }[] = [
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "commercial_refrigeration", label: "Commercial Refrigeration (+50°F to -10°F)" },
  { value: "low_temp", label: "Low Temp (0°F to -40°F)" },
];

// Charge letter + refrigerant; order and grouping match Sporlan conventions
const REFRIGERANT_OPTIONS: { charge: string; refrigerant: string; label: string }[] = [
  { charge: "J", refrigerant: "R1234yf", label: "R-1234yf (J)" },
  { charge: "J", refrigerant: "R134a", label: "R-134a (J)" },
  { charge: "J", refrigerant: "R513A", label: "R-513A (J)" },
  { charge: "J", refrigerant: "R401A", label: "R-401A (J)" },
  { charge: "J", refrigerant: "R409A", label: "R-409A (J)" },
  { charge: "V", refrigerant: "R22", label: "R-22 (V)" },
  { charge: "V", refrigerant: "R407A", label: "R-407A (V)" },
  { charge: "V", refrigerant: "R407C", label: "R-407C (V)" },
  { charge: "V", refrigerant: "R407F", label: "R-407F (V)" },
  { charge: "V", refrigerant: "R454C", label: "R-454C (V)" },
  { charge: "V", refrigerant: "R455A", label: "R-455A (V)" },
  { charge: "D", refrigerant: "R448A", label: "R-448A (D)" },
  { charge: "D", refrigerant: "R449A", label: "R-449A (D)" },
  { charge: "S", refrigerant: "R404A", label: "R-404A (S)" },
  { charge: "S", refrigerant: "R502", label: "R-502 (S)" },
  { charge: "S", refrigerant: "R507A", label: "R-507A (S)" },
  { charge: "S", refrigerant: "R402A", label: "R-402A (S)" },
  { charge: "T", refrigerant: "R454A", label: "R-454A (T)" },
  { charge: "Z", refrigerant: "R410A", label: "R-410A (Z)" },
  { charge: "Z", refrigerant: "R32", label: "R-32 (Z)" },
  { charge: "Y", refrigerant: "R454B", label: "R-454B (Y)" },
];

const BODY_STYLES = ["Q", "QE", "EQ", "EQE", "SQ", "SQE", "BQ", "BQE", "EBQ", "EBQE", "SBQ", "SBQE"];

// External equalized = "E" at end of body style (e.g. EBQE). Internal = no trailing E (e.g. EBQ).
const EXTERNAL_BODY_STYLES = BODY_STYLES.filter((code) => code.endsWith("E"));
const INTERNAL_BODY_STYLES = BODY_STYLES.filter((code) => !code.endsWith("E"));

const POWER_ELEMENT_OPTIONS = ["KT43", "KT47", "KT53", "KT83"];

const TONNAGE_OPTIONS = ["0.5", "1", "1.5", "2", "3", "4", "5", "8"];

const CONNECTION_SIZE_OPTIONS = ["1/4", "3/8", "1/2", "5/8"];

const EQUALIZER_OPTIONS: { value: string; label: string }[] = [
  { value: "internal", label: "Internal equalized" },
  { value: "external", label: "External equalized" },
];

// Temperature → refrigerants to prioritize first in dropdown
const TEMP_PRIORITY_REFRIGERANTS: Record<string, string[]> = {
  low_temp: ["R404A", "R507A", "R448A", "R449A", "R502", "R402A"],
  air_conditioning: ["R22", "R410A", "R454B", "R32", "R407C", "R134a"],
  commercial_refrigeration: [], // show all in list order
};

// --- Cartridge data (Sporlan reference: Q vs BQ body style, color code, nominal capacity by refrigerant) ---

/** Charge column key for capacity tables. V,D,N,O,T share one column. Z split by R410A vs R32. */
type ChargeColumn = "J" | "S" | "V_D_N_O_T" | "Z_R410A" | "Z_R32" | "Y";

function getChargeColumn(refrigerant: string, chargeLetter: string): ChargeColumn | "" {
  if (!refrigerant) return "";
  if (refrigerant === "R410A") return "Z_R410A";
  if (refrigerant === "R32") return "Z_R32";
  if (refrigerant === "R454B") return "Y";
  if (chargeLetter === "J") return "J";
  if (chargeLetter === "S") return "S";
  if (["V", "D", "N", "O", "T"].includes(chargeLetter)) return "V_D_N_O_T";
  return "";
}

/** Q family: Q, QE, EQ, EQE, SQ, SQE. BQ family: BQ, BQE, EBQ, EBQE, SBQ, SBQE. */
function getBodyStyleFamily(bodyStyle: string): "Q" | "BQ" | "" {
  if (!bodyStyle) return "";
  if (bodyStyle === "BQ" || bodyStyle === "BQE" || bodyStyle === "EBQ" || bodyStyle === "EBQE" || bodyStyle === "SBQ" || bodyStyle === "SBQE") return "BQ";
  return "Q";
}

// Q Cartridge: capacity code 0–6, nominal capacity by J / S / V,D,N,O,T (from Sporlan ref)
const Q_CARTRIDGES: { code: string; color: string; capacities: Record<ChargeColumn, string> }[] = [
  { code: "0", color: "RED", capacities: { J: "1/8 - 1/6", S: "1/8 - 1/6", V_D_N_O_T: "1/4 - 1/3", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "1", color: "YELLOW", capacities: { J: "1/4", S: "1/4", V_D_N_O_T: "1/2 - 3/4", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "2", color: "GREEN", capacities: { J: "1/2", S: "1/2", V_D_N_O_T: "1", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "3", color: "BLUE", capacities: { J: "1", S: "1", V_D_N_O_T: "1 - 1-1/2", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "4", color: "PINK", capacities: { J: "1-1/2", S: "1-1/2", V_D_N_O_T: "2 - 2-1/2", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "5", color: "BLACK", capacities: { J: "2", S: "2", V_D_N_O_T: "3", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "6", color: "WHITE", capacities: { J: "2-1/2 - 3", S: "3", V_D_N_O_T: "4 - 5", Z_R410A: "", Z_R32: "", Y: "" } },
];

// BQ Cartridge: capacity code AAA, AA, A, B, C; columns include Z(R410A), Z(R32), Y (from Sporlan ref)
const BQ_CARTRIDGES: { code: string; color: string; capacities: Record<ChargeColumn, string> }[] = [
  { code: "AAA", color: "RED", capacities: { J: "1/8 - 1/5", S: "1/8 - 1/5", V_D_N_O_T: "1/8 - 1/3", Z_R410A: "1/4 - 1/3", Z_R32: "1/3 - 1/2", Y: "1/3 - 1/2" } },
  { code: "AA", color: "YELLOW", capacities: { J: "1/4 - 1/3", S: "1/4 - 1/3", V_D_N_O_T: "1/2 - 2/3", Z_R410A: "1/2 - 3/4", Z_R32: "3/4 - 1", Y: "3/4 - 1" } },
  { code: "A", color: "BLUE", capacities: { J: "1/2 - 1", S: "1/2 - 1", V_D_N_O_T: "3/4 - 1-1/2", Z_R410A: "1 - 1-3/4", Z_R32: "1-1/2 - 2-1/2", Y: "1-1/2 - 2" } },
  { code: "B", color: "PINK", capacities: { J: "1-1/4 - 1-3/4", S: "1-1/4 - 2", V_D_N_O_T: "1-3/4 - 3", Z_R410A: "2 - 3-1/2", Z_R32: "3 - 4-1/2", Y: "2-1/2 - 4" } },
  { code: "C", color: "WHITE", capacities: { J: "2 - 3", S: "2-1/4 - 3", V_D_N_O_T: "3-1/4 - 5-1/2", Z_R410A: "4 - 6", Z_R32: "5 - 8-1/2", Y: "4-1/2 - 7" } },
];

// Color for chip/badge in UI (tailwind-safe)
const CARTRIDGE_COLOR_CLASS: Record<string, string> = {
  RED: "bg-red-600",
  YELLOW: "bg-yellow-500",
  GREEN: "bg-green-600",
  BLUE: "bg-blue-600",
  PINK: "bg-pink-500",
  BLACK: "bg-gray-900",
  WHITE: "bg-gray-200 text-gray-900",
};

export interface TxvBuilderPayload {
  builder: "txv";
  temperature?: string;
  refrigerant?: string;
  body_style?: string;
  cartridge?: string;
  power_element?: string;
  tonnage?: string;
  equalizer?: string;
  connection_size?: string;
  oem_unit_model?: string;
}

export default function TXVBuilder({
  block,
  onSubmit,
}: {
  block: TxvBuilderBlock;
  onSubmit: (payload: TxvBuilderPayload) => void;
}) {
  const prefill = block.prefill ?? {};
  const [temperature, setTemperature] = useState<string>(prefill.temperature ?? "");
  const [refrigerant, setRefrigerant] = useState<string>(prefill.refrigerant ?? "");
  const [bodyStyle, setBodyStyle] = useState<string>(prefill.body_style ?? "");
  const [cartridge, setCartridge] = useState<string>(prefill.cartridge ?? "");
  const [powerElement, setPowerElement] = useState<string>(prefill.power_element ?? "");
  const [equalizer, setEqualizer] = useState<string>(prefill.equalizer ?? "");
  const [tonnage, setTonnage] = useState<string>(prefill.tonnage ?? "");
  const [connectionSize, setConnectionSize] = useState<string>(prefill.connection_size ?? "");
  const [oemUnitModel, setOemUnitModel] = useState<string>(prefill.oem_unit_model ?? "");
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [cartridgeDropdownOpen, setCartridgeDropdownOpen] = useState(false);
  const cartridgeDropdownRef = useRef<HTMLDivElement>(null);

  const chargeLetter = useMemo(() => {
    const opt = REFRIGERANT_OPTIONS.find((o) => o.refrigerant === refrigerant);
    return opt?.charge ?? "";
  }, [refrigerant]);

  const refrigerantOptionsSorted = useMemo(() => {
    const priority = temperature ? TEMP_PRIORITY_REFRIGERANTS[temperature] ?? [] : [];
    if (priority.length === 0) return REFRIGERANT_OPTIONS;
    const set = new Set(priority);
    const first = REFRIGERANT_OPTIONS.filter((o) => set.has(o.refrigerant));
    const rest = REFRIGERANT_OPTIONS.filter((o) => !set.has(o.refrigerant));
    return [...first, ...rest];
  }, [temperature]);

  const chargeColumn = useMemo(
    (): ChargeColumn | "" => getChargeColumn(refrigerant, chargeLetter) as ChargeColumn | "",
    [refrigerant, chargeLetter],
  );

  const bodyStyleFamily = useMemo(() => getBodyStyleFamily(bodyStyle), [bodyStyle]);

  // Cartridge options for current body family (Q or BQ) with nominal capacity for selected refrigerant
  const cartridgeOptionsWithCapacity = useMemo(() => {
    if (bodyStyleFamily === "Q") {
      return Q_CARTRIDGES.map((c) => ({
        ...c,
        nominalCapacity: chargeColumn ? c.capacities[chargeColumn] || "—" : "—",
      }));
    }
    if (bodyStyleFamily === "BQ") {
      return BQ_CARTRIDGES.map((c) => ({
        ...c,
        nominalCapacity: chargeColumn ? c.capacities[chargeColumn] || "—" : "—",
      }));
    }
    return [];
  }, [bodyStyleFamily, chargeColumn]);

  const cartridgeEnabled = Boolean(chargeLetter && bodyStyle);

  // When body style or refrigerant changes, clear cartridge if it's no longer in the list (e.g. Q "3" → BQ has no "3")
  useEffect(() => {
    if (!cartridge) return;
    const valid = cartridgeOptionsWithCapacity.some((c) => c.code === cartridge);
    if (!valid) setCartridge("");
  }, [bodyStyleFamily, cartridge, cartridgeOptionsWithCapacity]);

  // Close cartridge dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cartridgeDropdownRef.current && !cartridgeDropdownRef.current.contains(e.target as Node)) {
        setCartridgeDropdownOpen(false);
      }
    };
    if (cartridgeDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [cartridgeDropdownOpen]);

  const selectedCartridgeOption = useMemo(
    () => cartridgeOptionsWithCapacity.find((c) => c.code === cartridge),
    [cartridge, cartridgeOptionsWithCapacity],
  );

  // Filter body styles by equalizer: external = names ending in "E", internal = no trailing "E"
  const bodyStylesVisible = useMemo(() => {
    if (equalizer === "external") return EXTERNAL_BODY_STYLES;
    if (equalizer === "internal") return INTERNAL_BODY_STYLES;
    return BODY_STYLES;
  }, [equalizer]);

  const setEqualizerAndClearBodyIfNeeded = useCallback((value: string) => {
    setEqualizer(value);
    if (value === "external" && bodyStyle && !bodyStyle.endsWith("E")) setBodyStyle("");
    if (value === "internal" && bodyStyle && bodyStyle.endsWith("E")) setBodyStyle("");
  }, [bodyStyle]);

  const filledCount = [refrigerant, bodyStyle, temperature, tonnage].filter(Boolean).length;
  const canSubmit = filledCount >= 2;

  const buildPreview = useCallback(() => {
    const body = bodyStyle || "";
    const charge = chargeLetter || "";
    const e = equalizer === "external" ? "E" : "";
    const cart = cartridge || "";
    if (!body && !charge && !cart) return "—";
    return `${body}${charge}${e}${cart ? "-" + cart : ""}` || "—";
  }, [bodyStyle, chargeLetter, equalizer, cartridge]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit({
      builder: "txv",
      temperature: temperature || undefined,
      refrigerant: refrigerant || undefined,
      body_style: bodyStyle || undefined,
      cartridge: cartridge || undefined,
      power_element: powerElement || undefined,
      tonnage: tonnage || undefined,
      equalizer: equalizer || undefined,
      connection_size: connectionSize || undefined,
      oem_unit_model: oemUnitModel.trim() || undefined,
    });
  }, [
    canSubmit,
    temperature,
    refrigerant,
    bodyStyle,
    cartridge,
    powerElement,
    tonnage,
    equalizer,
    connectionSize,
    oemUnitModel,
    onSubmit,
  ]);

  const isPrefilled = (key: keyof TxvBuilderPrefill) => prefill[key] != null && prefill[key] !== "";

  const inputBase =
    "mt-1 w-full rounded border border-[#2A2A2E] bg-[#1A1A1D] px-3 py-1.5 text-sm text-white focus:border-orange-400 focus:outline-none";
  const inputHighlight = "ring-1 ring-orange-400/60 border-orange-400/50";

  return (
    <div className="rounded-lg border border-[#2A2A2E] bg-[#1A1A1D] p-4 text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-400">
        TXV Builder
      </p>

      <div className="space-y-3">
        {/* Temperature */}
        <label className="block">
          <span className="text-gray-300">Temperature</span>
          <select
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className={`${inputBase} ${isPrefilled("temperature") ? inputHighlight : ""}`}
          >
            <option value="">Select…</option>
            {TEMPERATURE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Refrigerant / charge */}
        <label className="block">
          <span className="text-gray-300">Refrigerant / charge</span>
          <select
            value={refrigerant}
            onChange={(e) => setRefrigerant(e.target.value)}
            className={`${inputBase} ${isPrefilled("refrigerant") ? inputHighlight : ""}`}
          >
            <option value="">{temperature ? "Select…" : "Select temperature first"}</option>
            {refrigerantOptionsSorted.map((o) => (
              <option key={o.refrigerant} value={o.refrigerant}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Equalizer: internal vs external (E at end of body style) */}
        <label className="block">
          <span className="text-gray-300">Equalizer</span>
          <select
            value={equalizer}
            onChange={(e) => setEqualizerAndClearBodyIfNeeded(e.target.value)}
            className={`${inputBase} ${isPrefilled("equalizer") ? inputHighlight : ""}`}
          >
            <option value="">Any — show all body styles</option>
            {EQUALIZER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Body style (filtered by equalizer: internal = no trailing E, external = E at end) */}
        <label className="block">
          <span className="text-gray-300">Body style</span>
          <div
            className={`mt-1 flex flex-wrap gap-2 rounded border p-2 ${
              isPrefilled("body_style") ? "border-orange-400/50 " + inputHighlight : "border-[#2A2A2E]"
            }`}
          >
            {bodyStylesVisible.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setBodyStyle(code)}
                className={`flex items-center gap-1.5 rounded border px-2 py-1.5 text-xs transition ${
                  bodyStyle === code
                    ? "border-orange-400 bg-orange-500/20 text-white"
                    : "border-[#2A2A2E] bg-[#2A2A2E] text-gray-300 hover:bg-[#333]"
                }`}
              >
                <img
                  src={`/body_styles/${code}.PNG`}
                  alt={code}
                  className="h-[72px] w-[72px] shrink-0 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span>{code}</span>
              </button>
            ))}
          </div>
        </label>

        {/* Cartridge (Q vs BQ by body style; nominal capacity by selected refrigerant; color swatch per option) */}
        <label className="block">
          <span className="text-gray-300">Cartridge</span>
          {cartridgeEnabled ? (
            <div ref={cartridgeDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setCartridgeDropdownOpen((o) => !o)}
                className={`${inputBase} flex w-full items-center gap-2 text-left ${isPrefilled("cartridge") ? inputHighlight : ""}`}
              >
                {selectedCartridgeOption ? (
                  <>
                    <span
                      className={`h-5 w-5 shrink-0 rounded border border-[#2A2A2E] ${CARTRIDGE_COLOR_CLASS[selectedCartridgeOption.color] ?? "bg-gray-600"}`}
                      aria-hidden
                    />
                    <span className="truncate">
                      {selectedCartridgeOption.code} — {selectedCartridgeOption.nominalCapacity} ton
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Select capacity code…</span>
                )}
                <span className="ml-auto shrink-0 text-gray-400" aria-hidden>
                  {cartridgeDropdownOpen ? "▴" : "▾"}
                </span>
              </button>
              {cartridgeDropdownOpen && (
                <ul
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-[#2A2A2E] bg-[#1A1A1D] py-1 shadow-lg"
                  role="listbox"
                >
                  {(refrigerant
                    ? cartridgeOptionsWithCapacity.filter((c) => c.nominalCapacity && c.nominalCapacity !== "—")
                    : cartridgeOptionsWithCapacity
                  ).map((c) => (
                    <li
                      key={c.code}
                      role="option"
                      aria-selected={cartridge === c.code}
                      className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#2A2A2E] ${cartridge === c.code ? "bg-orange-500/20" : ""}`}
                      onClick={() => {
                        setCartridge(c.code);
                        setCartridgeDropdownOpen(false);
                      }}
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded border border-[#2A2A2E] ${CARTRIDGE_COLOR_CLASS[c.color] ?? "bg-gray-600"}`}
                        title={c.color}
                      />
                      <span className="font-medium text-gray-200">{c.code}</span>
                      <span className="text-gray-400">—</span>
                      <span className="text-gray-300">{c.nominalCapacity} ton</span>
                    </li>
                  ))}
                </ul>
              )}
              {bodyStyleFamily && (
                <p className="mt-1 text-[10px] text-gray-500">
                  {bodyStyleFamily} cartridge
                  {refrigerant ? ` • Nominal capacity for ${refrigerant}` : " • Select refrigerant to see capacity"}
                </p>
              )}
              {refrigerant && cartridgeOptionsWithCapacity.filter((c) => c.nominalCapacity && c.nominalCapacity !== "—").length === 0 && (
                <p className="mt-1 text-[10px] text-amber-500">No cartridge options for {refrigerant} with {bodyStyleFamily} body in this reference.</p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Select refrigerant and body style first.</p>
          )}
        </label>

        {/* Power element */}
        <label className="block">
          <span className="text-gray-300">Power element</span>
          <select
            value={powerElement}
            onChange={(e) => setPowerElement(e.target.value)}
            className={`${inputBase} ${isPrefilled("power_element") ? inputHighlight : ""}`}
          >
            <option value="">Select…</option>
            {POWER_ELEMENT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>

        {/* Part preview */}
        <div className="mt-3">
          <span className="font-semibold text-gray-300">Part preview:</span>
          <span className="ml-2 font-mono text-white">{buildPreview()}</span>
        </div>

        {/* + More Specs */}
        <div className="border-t border-[#2A2A2E] pt-3">
          <button
            type="button"
            onClick={() => setShowMoreSpecs((s) => !s)}
            className="text-xs text-orange-400 hover:underline"
          >
            {showMoreSpecs ? "− Less" : "+ More specs"}
          </button>
          {showMoreSpecs && (
            <div className="mt-2 space-y-2">
              <label className="block">
                <span className="text-gray-400">Tonnage / capacity</span>
                <select
                  value={tonnage}
                  onChange={(e) => setTonnage(e.target.value)}
                  className={`${inputBase} mt-0.5 ${isPrefilled("tonnage") ? inputHighlight : ""}`}
                >
                  <option value="">—</option>
                  {TONNAGE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-400">Connection size</span>
                <select
                  value={connectionSize}
                  onChange={(e) => setConnectionSize(e.target.value)}
                  className={`${inputBase} mt-0.5`}
                >
                  <option value="">—</option>
                  {CONNECTION_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-400">OEM unit model</span>
                <input
                  type="text"
                  value={oemUnitModel}
                  onChange={(e) => setOemUnitModel(e.target.value)}
                  placeholder="Optional"
                  className={`${inputBase} mt-0.5`}
                />
              </label>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-3 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canSubmit ? "Use this configuration" : "Select at least 2: refrigerant, body style, temperature, or tonnage"}
        </button>
      </div>
    </div>
  );
}
