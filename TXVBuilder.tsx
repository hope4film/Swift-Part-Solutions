"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TxvBuilderBlock, TxvBuilderPrefill } from "../../types";

// ---------------------------------------------------------------------------
// Temperature & Refrigerant
// ---------------------------------------------------------------------------

const TEMPERATURE_OPTIONS: { value: string; label: string }[] = [
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "commercial_refrigeration", label: "Commercial Refrigeration (+50°F to -10°F)" },
  { value: "low_temp", label: "Low Temp (0°F to -40°F)" },
];

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

const TEMP_PRIORITY_REFRIGERANTS: Record<string, string[]> = {
  low_temp: ["R404A", "R507A", "R448A", "R449A", "R502", "R402A"],
  air_conditioning: ["R22", "R410A", "R454B", "R32", "R407C", "R134a"],
  commercial_refrigeration: [],
};

/** "R22" → "R-22", "R407C" → "R-407C", "R1234yf" → "R-1234yf" */
function formatRefrigerantName(code: string): string {
  return code.replace(/^R(\d)/, "R-$1");
}

// ---------------------------------------------------------------------------
// Equalizer & Body Styles
// ---------------------------------------------------------------------------

const BODY_STYLES = ["Q", "QE", "EQ", "EQE", "SQ", "SQE", "BQ", "BQE", "EBQ", "EBQE", "SBQ", "SBQE"];
const EXTERNAL_BODY_STYLES = BODY_STYLES.filter((c) => c.endsWith("E"));
const INTERNAL_BODY_STYLES = BODY_STYLES.filter((c) => !c.endsWith("E"));

const EQUALIZER_OPTIONS: { value: string; label: string }[] = [
  { value: "internal", label: "Internal equalized" },
  { value: "external", label: "External equalized" },
];

// ---------------------------------------------------------------------------
// Body Part Number Lookup (from Sporlan URI514 catalog)
// ---------------------------------------------------------------------------

const BODY_PART_NUMBERS: { bodyStyle: string; inlet: string; outlet: string; partNumber: string }[] = [
  // Q — Flare body, QC cartridge
  { bodyStyle: "Q", inlet: "1/4", outlet: "3/8", partNumber: "QBODY2X3F" },
  { bodyStyle: "Q", inlet: "1/4", outlet: "1/2", partNumber: "QBODY2X4F" },
  { bodyStyle: "Q", inlet: "3/8", outlet: "1/2", partNumber: "QBODY3X4F" },
  // QE — Flare body, external eq, QC cartridge
  { bodyStyle: "QE", inlet: "1/4", outlet: "3/8", partNumber: "QEBODY2X3F" },
  { bodyStyle: "QE", inlet: "1/4", outlet: "1/2", partNumber: "QEBODY2X4F" },
  { bodyStyle: "QE", inlet: "3/8", outlet: "1/2", partNumber: "QEBODY3X4F" },
  // BQ — Flare balanced port, BQC cartridge
  { bodyStyle: "BQ", inlet: "1/4", outlet: "1/2", partNumber: "BQBODY2X4F" },
  { bodyStyle: "BQ", inlet: "3/8", outlet: "1/2", partNumber: "BQBODY3X4F" },
  // BQE — Flare balanced port, external eq, BQC cartridge
  { bodyStyle: "BQE", inlet: "1/4", outlet: "1/2", partNumber: "BQEBODY2X4F" },
  { bodyStyle: "BQE", inlet: "3/8", outlet: "1/2", partNumber: "BQEBODY3X4F" },
  // SQ — ODF, QC cartridge
  { bodyStyle: "SQ", inlet: "3/8", outlet: "1/2", partNumber: "SQBODY3X4" },
  // SQE — ODF, external eq, QC cartridge
  { bodyStyle: "SQE", inlet: "1/4", outlet: "1/2", partNumber: "SQEBODY2X4" },
  { bodyStyle: "SQE", inlet: "3/8", outlet: "1/2", partNumber: "SQEBODY3X4" },
  // SBQ — ODF balanced port, BQC cartridge
  { bodyStyle: "SBQ", inlet: "3/8", outlet: "1/2", partNumber: "SBQBODY3X4" },
  // SBQE — ODF balanced port, external eq, BQC cartridge
  { bodyStyle: "SBQE", inlet: "3/8", outlet: "1/2", partNumber: "SBQEBODY3X4" },
  // EQ — ODF extended ends, QC cartridge
  { bodyStyle: "EQ", inlet: "1/4", outlet: "3/8", partNumber: "EQBODY2X3" },
  { bodyStyle: "EQ", inlet: "1/4", outlet: "1/2", partNumber: "EQBODY2X4" },
  { bodyStyle: "EQ", inlet: "3/8", outlet: "1/2", partNumber: "EQBODY3X4S" },
  { bodyStyle: "EQ", inlet: "3/8", outlet: "5/8", partNumber: "EQBODY3X5S" },
  { bodyStyle: "EQ", inlet: "1/2", outlet: "5/8", partNumber: "EQBODY4X5S" },
  // EQE — ODF extended ends, external eq, QC cartridge
  { bodyStyle: "EQE", inlet: "1/4", outlet: "3/8", partNumber: "EQEBODY2X3" },
  { bodyStyle: "EQE", inlet: "1/4", outlet: "1/2", partNumber: "EQEBODY2X4" },
  { bodyStyle: "EQE", inlet: "3/8", outlet: "1/2", partNumber: "EQEBODY3X4S" },
  { bodyStyle: "EQE", inlet: "3/8", outlet: "5/8", partNumber: "EQEBODY3X5S" },
  { bodyStyle: "EQE", inlet: "1/2", outlet: "5/8", partNumber: "EQEBODY4X5S" },
  { bodyStyle: "EQE", inlet: "1/2", outlet: "7/8", partNumber: "EQEBODY4X7S" },
  // EBQ — ODF extended ends, balanced port, BQC cartridge
  { bodyStyle: "EBQ", inlet: "1/4", outlet: "3/8", partNumber: "EBQBODY2X3" },
  { bodyStyle: "EBQ", inlet: "3/8", outlet: "1/2", partNumber: "EBQBODY3X4" },
  { bodyStyle: "EBQ", inlet: "3/8", outlet: "5/8", partNumber: "EBQBODY3X5S" },
  { bodyStyle: "EBQ", inlet: "1/2", outlet: "5/8", partNumber: "EBQBODY4X5" },
  // EBQE — ODF extended ends, balanced port, external eq, BQC cartridge
  { bodyStyle: "EBQE", inlet: "1/4", outlet: "3/8", partNumber: "EBQEBODY2X3" },
  { bodyStyle: "EBQE", inlet: "3/8", outlet: "1/2", partNumber: "EBQEBODY3X4" },
  { bodyStyle: "EBQE", inlet: "1/2", outlet: "5/8", partNumber: "EBQEBODY4X5S" },
  { bodyStyle: "EBQE", inlet: "1/2", outlet: "7/8", partNumber: "EBQEBODY4X7" },
];

const FRACTION_SORT: Record<string, number> = {
  "1/4": 0.25, "3/8": 0.375, "1/2": 0.5, "5/8": 0.625, "7/8": 0.875,
};

// ---------------------------------------------------------------------------
// Cartridge Data
// ---------------------------------------------------------------------------

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

function getBodyStyleFamily(bodyStyle: string): "Q" | "BQ" | "" {
  if (!bodyStyle) return "";
  if (["BQ", "BQE", "EBQ", "EBQE", "SBQ", "SBQE"].includes(bodyStyle)) return "BQ";
  return "Q";
}

type CartridgeRow = { code: string; color: string; capacities: Record<ChargeColumn, string> };

const Q_CARTRIDGES: CartridgeRow[] = [
  { code: "0", color: "RED", capacities: { J: "1/8 - 1/6", S: "1/8 - 1/6", V_D_N_O_T: "1/4 - 1/3", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "1", color: "YELLOW", capacities: { J: "1/4", S: "1/4", V_D_N_O_T: "1/2 - 3/4", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "2", color: "GREEN", capacities: { J: "1/2", S: "1/2", V_D_N_O_T: "1", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "3", color: "BLUE", capacities: { J: "1", S: "1", V_D_N_O_T: "1 - 1-1/2", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "4", color: "PINK", capacities: { J: "1-1/2", S: "1-1/2", V_D_N_O_T: "2 - 2-1/2", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "5", color: "BLACK", capacities: { J: "2", S: "2", V_D_N_O_T: "3", Z_R410A: "", Z_R32: "", Y: "" } },
  { code: "6", color: "WHITE", capacities: { J: "2-1/2 - 3", S: "3", V_D_N_O_T: "4 - 5", Z_R410A: "", Z_R32: "", Y: "" } },
];

const BQ_CARTRIDGES: CartridgeRow[] = [
  { code: "AAA", color: "RED", capacities: { J: "1/8 - 1/5", S: "1/8 - 1/5", V_D_N_O_T: "1/8 - 1/3", Z_R410A: "1/4 - 1/3", Z_R32: "1/3 - 1/2", Y: "1/3 - 1/2" } },
  { code: "AA", color: "YELLOW", capacities: { J: "1/4 - 1/3", S: "1/4 - 1/3", V_D_N_O_T: "1/2 - 2/3", Z_R410A: "1/2 - 3/4", Z_R32: "3/4 - 1", Y: "3/4 - 1" } },
  { code: "A", color: "BLUE", capacities: { J: "1/2 - 1", S: "1/2 - 1", V_D_N_O_T: "3/4 - 1-1/2", Z_R410A: "1 - 1-3/4", Z_R32: "1-1/2 - 2-1/2", Y: "1-1/2 - 2" } },
  { code: "B", color: "PINK", capacities: { J: "1-1/4 - 1-3/4", S: "1-1/4 - 2", V_D_N_O_T: "1-3/4 - 3", Z_R410A: "2 - 3-1/2", Z_R32: "3 - 4-1/2", Y: "2-1/2 - 4" } },
  { code: "C", color: "WHITE", capacities: { J: "2 - 3", S: "2-1/4 - 3", V_D_N_O_T: "3-1/4 - 5-1/2", Z_R410A: "4 - 6", Z_R32: "5 - 8-1/2", Y: "4-1/2 - 7" } },
];

const BQ_BP15_CARTRIDGES: CartridgeRow[] = [
  { code: "AA-BP15", color: "YELLOW", capacities: { J: "1/4 - 1/3", S: "1/4 - 1/3", V_D_N_O_T: "1/2 - 2/3", Z_R410A: "1/2 - 3/4", Z_R32: "3/4 - 1", Y: "3/4 - 1" } },
  { code: "A-BP15", color: "BLUE", capacities: { J: "1/2 - 1", S: "1/2 - 1", V_D_N_O_T: "3/4 - 1-1/2", Z_R410A: "1 - 1-3/4", Z_R32: "1-1/2 - 2-1/2", Y: "1-1/2 - 2" } },
  { code: "B-BP15", color: "PINK", capacities: { J: "1-1/4 - 1-3/4", S: "1-1/4 - 2", V_D_N_O_T: "1-3/4 - 3", Z_R410A: "2 - 3-1/2", Z_R32: "3 - 4-1/2", Y: "2-1/2 - 4" } },
  { code: "C-BP15", color: "WHITE", capacities: { J: "2 - 3", S: "2-1/4 - 3", V_D_N_O_T: "3-1/4 - 5-1/2", Z_R410A: "4 - 6", Z_R32: "5 - 8-1/2", Y: "4-1/2 - 7" } },
];

const CARTRIDGE_COLOR_CLASS: Record<string, string> = {
  RED: "bg-red-600",
  YELLOW: "bg-yellow-500",
  GREEN: "bg-green-600",
  BLUE: "bg-blue-600",
  PINK: "bg-pink-500",
  BLACK: "bg-gray-900",
  WHITE: "bg-gray-200 text-gray-900",
};

function resolveCartridgePN(family: "Q" | "BQ" | "", code: string): string {
  if (!family || !code) return "";
  if (family === "Q") return `QC${code}`;
  return `BQC${code}`;
}

// ---------------------------------------------------------------------------
// Power Element / Powerhead Data
// ---------------------------------------------------------------------------

const STANDARD_POWER_ELEMENTS = ["KT47", "KT43", "KT53", "KT83"];
const UNCOMMON_POWER_ELEMENTS = ["KT33", "KT45", "KT63", "KT85"];

type PowerheadSuffix = { suffix: string; mop?: number };

/** Suffixes by charge letter → temperature application (from Sporlan URI514 catalog). */
const POWERHEAD_SUFFIXES: Record<string, Partial<Record<string, PowerheadSuffix[]>>> = {
  J: {
    air_conditioning:        [{ suffix: "JCP60", mop: 50 }],
    commercial_refrigeration:[{ suffix: "JC" }],
  },
  V: {
    air_conditioning:        [{ suffix: "VCP100", mop: 90 }],
    commercial_refrigeration:[{ suffix: "VC" }],
    low_temp:                [{ suffix: "VZ" }, { suffix: "VZP40", mop: 30 }],
  },
  S: {
    air_conditioning:        [{ suffix: "SCP115", mop: 105 }],
    commercial_refrigeration:[{ suffix: "SC/PC" }],
    low_temp:                [{ suffix: "SZ" }, { suffix: "SZP", mop: 35 }],
  },
};

/** D charge (R-448A, R-449A) uses the same elements as V charge per the catalog. */
const CHARGE_ALIAS: Record<string, string> = { D: "V" };

/** Refrigerant-specific additional elements (NGA is only for R-407C and R-407F). */
const REFRIGERANT_EXTRA_SUFFIXES: Record<string, Partial<Record<string, PowerheadSuffix[]>>> = {
  R407C: { air_conditioning: [{ suffix: "NGA" }] },
  R407F: { air_conditioning: [{ suffix: "NGA" }] },
};

/** R-410A requires a heavier-construction element; KT43/KT47→KT45, KT83→KT85. */
const R410A_BASE_SWAP: Record<string, string> = {
  KT33: "KT33", KT43: "KT45", KT47: "KT45", KT53: "KT53", KT63: "KT63", KT83: "KT85", KT85: "KT85", KT45: "KT45",
};

const R410A_SUFFIXES: Partial<Record<string, PowerheadSuffix[]>> = {
  air_conditioning: [{ suffix: "ZGA" }, { suffix: "ZCP180", mop: 170 }],
};

type ResolvedPowerhead = { partNumber: string; mop?: number };

/** "KT43" → "KT-43" */
function formatElementBase(base: string): string {
  return base.replace(/^(KT)(\d+)$/, "$1-$2");
}

function resolvePowerheadPNs(base: string, refrigerant: string, chargeLetter: string, temperature: string): ResolvedPowerhead[] {
  if (!base || !chargeLetter || !temperature) return [];

  if (chargeLetter === "Z" && refrigerant === "R410A") {
    const swapped = R410A_BASE_SWAP[base] ?? base;
    const fmtBase = formatElementBase(swapped);
    const suffixes = R410A_SUFFIXES[temperature];
    if (!suffixes) return [];
    return suffixes.map((s) => ({ partNumber: `${fmtBase}-${s.suffix}`, mop: s.mop }));
  }
  if (chargeLetter === "Z") return [];

  const fmtBase = formatElementBase(base);
  const effectiveCharge = CHARGE_ALIAS[chargeLetter] ?? chargeLetter;
  const chargeSuffixes = POWERHEAD_SUFFIXES[effectiveCharge]?.[temperature] ?? [];
  const extraSuffixes = REFRIGERANT_EXTRA_SUFFIXES[refrigerant]?.[temperature] ?? [];
  const allSuffixes = [...chargeSuffixes, ...extraSuffixes];

  return allSuffixes.map((s) => ({ partNumber: `${fmtBase}-${s.suffix}`, mop: s.mop }));
}

// ---------------------------------------------------------------------------
// Tonnage
// ---------------------------------------------------------------------------

const TONNAGE_OPTIONS = ["0.5", "1", "1.5", "2", "3", "4", "5", "8"];

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

export interface TxvBuilderPayload {
  builder: "txv";
  temperature?: string;
  refrigerant?: string;
  body_style?: string;
  cartridge?: string;
  power_element?: string;
  tonnage?: string;
  equalizer?: string;
  inlet_size?: string;
  outlet_size?: string;
  oem_unit_model?: string;
  body_part_number?: string;
  cartridge_part_number?: string;
  powerhead_part_number?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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
  const [inletSize, setInletSize] = useState<string>(
    prefill.inlet_size ?? (prefill.temperature === "air_conditioning" ? "" : "3/8"),
  );
  const [outletSize, setOutletSize] = useState<string>(
    prefill.outlet_size ?? (prefill.temperature === "air_conditioning" ? "" : "1/2"),
  );
  const [tonnage, setTonnage] = useState<string>(prefill.tonnage ?? "");
  const [oemUnitModel, setOemUnitModel] = useState<string>(prefill.oem_unit_model ?? "");

  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [showUncommonPower, setShowUncommonPower] = useState(false);
  const [showUncommonCartridges, setShowUncommonCartridges] = useState(false);
  const [cartridgeDropdownOpen, setCartridgeDropdownOpen] = useState(false);
  const cartridgeDropdownRef = useRef<HTMLDivElement>(null);

  // --- Derived: charge ---------------------------------------------------

  const chargeLetter = useMemo(() => {
    return REFRIGERANT_OPTIONS.find((o) => o.refrigerant === refrigerant)?.charge ?? "";
  }, [refrigerant]);

  const refrigerantGroups = useMemo(() => {
    const groups = new Map<string, typeof REFRIGERANT_OPTIONS>();
    for (const o of REFRIGERANT_OPTIONS) {
      const list = groups.get(o.charge) ?? [];
      list.push(o);
      groups.set(o.charge, list);
    }
    const priority = temperature ? TEMP_PRIORITY_REFRIGERANTS[temperature] ?? [] : [];
    const prioritySet = new Set(priority);
    const entries = [...groups.entries()].map(([charge, options]) => ({
      charge,
      options,
      hasPriority: options.some((o) => prioritySet.has(o.refrigerant)),
    }));
    entries.sort((a, b) => (a.hasPriority === b.hasPriority ? 0 : a.hasPriority ? -1 : 1));
    return entries;
  }, [temperature]);

  const chargeColumn = useMemo(
    (): ChargeColumn | "" => getChargeColumn(refrigerant, chargeLetter),
    [refrigerant, chargeLetter],
  );

  // --- Derived: body style ------------------------------------------------

  const bodyStyleFamily = useMemo(() => getBodyStyleFamily(bodyStyle), [bodyStyle]);

  const bodyStylesVisible = useMemo(() => {
    if (equalizer === "external") return EXTERNAL_BODY_STYLES;
    if (equalizer === "internal") return INTERNAL_BODY_STYLES;
    return BODY_STYLES;
  }, [equalizer]);

  // --- Derived: inlet / outlet sizes for selected body --------------------

  const availableInletSizes = useMemo(() => {
    if (!bodyStyle) return [] as string[];
    const sizes = new Set(BODY_PART_NUMBERS.filter((e) => e.bodyStyle === bodyStyle).map((e) => e.inlet));
    return [...sizes].sort((a, b) => (FRACTION_SORT[a] ?? 0) - (FRACTION_SORT[b] ?? 0));
  }, [bodyStyle]);

  const availableOutletSizes = useMemo(() => {
    if (!bodyStyle) return [] as string[];
    const filtered = BODY_PART_NUMBERS.filter(
      (e) => e.bodyStyle === bodyStyle && (!inletSize || e.inlet === inletSize),
    );
    const sizes = new Set(filtered.map((e) => e.outlet));
    return [...sizes].sort((a, b) => (FRACTION_SORT[a] ?? 0) - (FRACTION_SORT[b] ?? 0));
  }, [bodyStyle, inletSize]);

  // --- Resolved body part number ------------------------------------------

  const bodyPartNumber = useMemo(() => {
    if (!bodyStyle || !inletSize || !outletSize) return "";
    return (
      BODY_PART_NUMBERS.find(
        (e) => e.bodyStyle === bodyStyle && e.inlet === inletSize && e.outlet === outletSize,
      )?.partNumber ?? ""
    );
  }, [bodyStyle, inletSize, outletSize]);

  // --- Cartridge options --------------------------------------------------

  const cartridgeOptionsWithCapacity = useMemo(() => {
    const mapRow = (c: CartridgeRow) => ({
      ...c,
      nominalCapacity: chargeColumn ? c.capacities[chargeColumn] || "—" : "—",
    });
    if (bodyStyleFamily === "Q") return Q_CARTRIDGES.map(mapRow);
    if (bodyStyleFamily === "BQ") {
      const base = BQ_CARTRIDGES.map(mapRow);
      if (showUncommonCartridges) return [...base, ...BQ_BP15_CARTRIDGES.map(mapRow)];
      return base;
    }
    return [];
  }, [bodyStyleFamily, chargeColumn, showUncommonCartridges]);

  const cartridgeEnabled = Boolean(chargeLetter && bodyStyle);

  const selectedCartridgeOption = useMemo(
    () => cartridgeOptionsWithCapacity.find((c) => c.code === cartridge),
    [cartridge, cartridgeOptionsWithCapacity],
  );

  const cartridgePartNumber = useMemo(
    () => resolveCartridgePN(bodyStyleFamily, cartridge),
    [bodyStyleFamily, cartridge],
  );

  // --- Power element options ----------------------------------------------

  const powerElementOptions = useMemo(() => {
    return showUncommonPower
      ? [...STANDARD_POWER_ELEMENTS, ...UNCOMMON_POWER_ELEMENTS]
      : STANDARD_POWER_ELEMENTS;
  }, [showUncommonPower]);

  const powerheadPartNumbers = useMemo(
    () => resolvePowerheadPNs(powerElement, refrigerant, chargeLetter, temperature),
    [powerElement, refrigerant, chargeLetter, temperature],
  );

  // --- Effects: keep selections valid -------------------------------------

  const setEqualizerAndClearBodyIfNeeded = useCallback(
    (value: string) => {
      setEqualizer(value);
      if (value === "external" && bodyStyle && !bodyStyle.endsWith("E")) setBodyStyle("");
      if (value === "internal" && bodyStyle && bodyStyle.endsWith("E")) setBodyStyle("");
    },
    [bodyStyle],
  );

  useEffect(() => {
    if (temperature === "air_conditioning") {
      setInletSize((prev) => (prev === "3/8" ? "" : prev));
      setOutletSize((prev) => (prev === "1/2" ? "" : prev));
    } else if (!inletSize && !outletSize) {
      setInletSize("3/8");
      setOutletSize("1/2");
    }
  }, [temperature]);

  useEffect(() => {
    if (!inletSize || availableInletSizes.length === 0) return;
    if (!availableInletSizes.includes(inletSize)) {
      setInletSize("");
      setOutletSize("");
    }
  }, [inletSize, availableInletSizes]);

  useEffect(() => {
    if (availableOutletSizes.length === 0) return;
    if (inletSize && (!outletSize || !availableOutletSizes.includes(outletSize))) {
      setOutletSize(availableOutletSizes[0]);
    } else if (outletSize && !availableOutletSizes.includes(outletSize)) {
      setOutletSize("");
    }
  }, [inletSize, availableOutletSizes]);

  useEffect(() => {
    if (!cartridge) return;
    if (!cartridgeOptionsWithCapacity.some((c) => c.code === cartridge)) setCartridge("");
  }, [bodyStyleFamily, cartridge, cartridgeOptionsWithCapacity]);

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

  // --- Submit -------------------------------------------------------------

  const filledCount = [refrigerant, bodyStyle, temperature, tonnage].filter(Boolean).length;
  const canSubmit = filledCount >= 2;

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
      inlet_size: inletSize || undefined,
      outlet_size: outletSize || undefined,
      oem_unit_model: oemUnitModel.trim() || undefined,
      body_part_number: bodyPartNumber || undefined,
      cartridge_part_number: cartridgePartNumber || undefined,
      powerhead_part_number: powerheadPartNumbers[0]?.partNumber || undefined,
    });
  }, [
    canSubmit, temperature, refrigerant, bodyStyle, cartridge, powerElement,
    tonnage, equalizer, inletSize, outletSize, oemUnitModel, bodyPartNumber,
    cartridgePartNumber, powerheadPartNumbers, onSubmit,
  ]);

  // --- Helpers ------------------------------------------------------------

  const isPrefilled = (key: keyof TxvBuilderPrefill) => prefill[key] != null && prefill[key] !== "";

  const inputBase =
    "mt-1 w-full rounded border border-[#2A2A2E] bg-[#1A1A1D] px-3 py-1.5 text-sm text-white focus:border-orange-400 focus:outline-none";
  const inputHighlight = "ring-1 ring-orange-400/60 border-orange-400/50";

  const powerElementLabel = (o: string) => {
    if (o === "KT47") return `${o} (recommended)`;
    if (o === "KT43") return `${o} (superseded — use if KT47 unavailable)`;
    return o;
  };

  // --- Render -------------------------------------------------------------

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
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        {/* Refrigerant */}
        <div className="block">
          <span className="text-gray-300">Refrigerant</span>
          <div
            className={`mt-1 rounded border p-2 ${
              isPrefilled("refrigerant") ? "border-orange-400/50 " + inputHighlight : "border-[#2A2A2E]"
            }`}
          >
            {refrigerantGroups.map((group) => (
              <div
                key={group.charge}
                className="flex items-start gap-2 py-1"
              >
                <span className="mt-1 w-5 shrink-0 text-center text-[10px] font-semibold text-gray-500">
                  {group.charge}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((o) => (
                    <button
                      key={o.refrigerant}
                      type="button"
                      onClick={() => setRefrigerant(o.refrigerant)}
                      className={`rounded border px-2 py-1 text-xs font-medium transition ${
                        refrigerant === o.refrigerant
                          ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                          : "border-[#2A2A2E] bg-[#2A2A2E] text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      {formatRefrigerantName(o.refrigerant)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equalizer */}
        <label className="block">
          <span className="text-gray-300">Equalizer</span>
          <select
            value={equalizer}
            onChange={(e) => setEqualizerAndClearBodyIfNeeded(e.target.value)}
            className={`${inputBase} ${isPrefilled("equalizer") ? inputHighlight : ""}`}
          >
            <option value="">Any — show all body styles</option>
            {EQUALIZER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        {/* Body style */}
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
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span>{code}</span>
              </button>
            ))}
          </div>
        </label>

        {/* Inlet / Outlet sizes */}
        {bodyStyle && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-gray-300">Inlet size</span>
              <select
                value={inletSize}
                onChange={(e) => setInletSize(e.target.value)}
                className={`${inputBase} ${isPrefilled("inlet_size") ? inputHighlight : ""}`}
              >
                <option value="">Select…</option>
                {availableInletSizes.map((s) => (
                  <option key={s} value={s}>{s}&quot;</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-300">Outlet size</span>
              <select
                value={outletSize}
                onChange={(e) => setOutletSize(e.target.value)}
                className={`${inputBase} ${isPrefilled("outlet_size") ? inputHighlight : ""}`}
                disabled={!inletSize}
              >
                <option value="">{inletSize ? "Select…" : "Select inlet first"}</option>
                {availableOutletSizes.map((s) => (
                  <option key={s} value={s}>{s}&quot;</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Cartridge */}
        <div className="block">
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
                      {cartridgePartNumber} ({selectedCartridgeOption.code}) — {selectedCartridgeOption.nominalCapacity} ton
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
                  ).map((c) => {
                    const pn = resolveCartridgePN(bodyStyleFamily, c.code);
                    return (
                      <li
                        key={c.code}
                        role="option"
                        aria-selected={cartridge === c.code}
                        className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#2A2A2E] ${cartridge === c.code ? "bg-orange-500/20" : ""}`}
                        onMouseDown={(e) => { e.preventDefault(); setCartridge(c.code); setCartridgeDropdownOpen(false); }}
                      >
                        <span
                          className={`h-5 w-5 shrink-0 rounded border border-[#2A2A2E] ${CARTRIDGE_COLOR_CLASS[c.color] ?? "bg-gray-600"}`}
                          title={c.color}
                        />
                        <span className="font-medium text-gray-200">{pn}</span>
                        <span className="text-xs text-gray-500">({c.code})</span>
                        <span className="text-gray-400">—</span>
                        <span className="text-gray-300">{c.nominalCapacity} ton</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {bodyStyleFamily && (
                <p className="mt-1 text-[10px] text-gray-500">
                  {bodyStyleFamily} cartridge
                  {refrigerant ? ` • Nominal capacity for ${refrigerant}` : " • Select refrigerant to see capacity"}
                </p>
              )}
              {refrigerant && cartridgeOptionsWithCapacity.filter((c) => c.nominalCapacity && c.nominalCapacity !== "—").length === 0 && (
                <p className="mt-1 text-[10px] text-amber-500">
                  No cartridge options for {refrigerant} with {bodyStyleFamily} body in this reference.
                </p>
              )}
              {bodyStyleFamily === "BQ" && (
                <button
                  type="button"
                  onClick={() => setShowUncommonCartridges((s) => !s)}
                  className="mt-1 text-[10px] text-orange-400 hover:underline"
                >
                  {showUncommonCartridges ? "− Hide BP15 bypass variants" : "+ Show BP15 bypass variants"}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Select refrigerant and body style first.</p>
          )}
        </div>

        {/* Power element */}
        <div className="block">
          <span className="text-gray-300">Power element</span>
          <select
            value={powerElement}
            onChange={(e) => setPowerElement(e.target.value)}
            className={`${inputBase} ${isPrefilled("power_element") ? inputHighlight : ""}`}
          >
            <option value="">Select…</option>
            {powerElementOptions.map((o) => (
              <option key={o} value={o}>{powerElementLabel(o)}</option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-gray-500">
            KT47 supersedes KT43 — same charge elements, wider body neck (larger wrench).
          </p>
          <button
            type="button"
            onClick={() => setShowUncommonPower((s) => !s)}
            className="mt-0.5 text-[10px] text-orange-400 hover:underline"
          >
            {showUncommonPower ? "− Hide uncommon sizes" : "+ Show uncommon sizes (KT33, KT45, KT63, KT85)"}
          </button>
        </div>

        {/* Resolved part numbers */}
        <div className="mt-3 rounded border border-[#2A2A2E] bg-[#111113] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-400">
            Resolved Part Numbers
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-sm">
            <span className="text-gray-500">Body:</span>
            <span className={bodyPartNumber ? "text-white" : "text-gray-600"}>{bodyPartNumber || "—"}</span>
            <span className="text-gray-500">Cartridge:</span>
            <span className={cartridgePartNumber ? "text-white" : "text-gray-600"}>{cartridgePartNumber || "—"}</span>
            <span className="text-gray-500">Powerhead:</span>
            <span className={powerheadPartNumbers.length ? "text-white" : "text-gray-600"}>
              {powerheadPartNumbers.length
                ? powerheadPartNumbers.map((p, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {p.partNumber}
                      {p.mop != null && <span className="ml-1 text-[10px] text-gray-400">(MOP {p.mop})</span>}
                    </span>
                  ))
                : "—"}
            </span>
          </div>
        </div>

        {/* More specs */}
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
                    <option key={t} value={t}>{t}</option>
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
