import { EMPTY_MASTERS, productMasterValue } from "../services/catalogMasters.js";

/* =========================================================
   PRODUCT TYPE GROUPS (public Products page only)
   The admin keeps its detailed types; the public filter shows
   broad groups so visitors never face dozens of sub-types.
========================================================= */
export const PRODUCT_TYPE_GROUPS = [
  "T-Shirt", "Polo", "Shirt", "Hoodie", "Sweatshirt", "Pants", "Shorts",
  "Jacket", "Dress", "Skirt", "Top", "Sets", "Baby Wear",
];

const wordsOf = (value) => ` ${String(value || "")
  .toLowerCase()
  .replace(/short[\s-]+sleeves?/g, " ") // "short sleeve" is a sleeve, not Shorts
  .replace(/[^a-z0-9]+/g, " ")
  .trim()} `;

function groupOf(value) {
  const text = wordsOf(value);
  if (text.trim() === "") return "";
  const has = (pattern) => pattern.test(text);
  const tee = has(/\bt ?shirts?\b|\btees?\b|\btank\b/);

  if (has(/\bsets?\b|\bco ?ords?\b|\b[23] piece\b|\bthree piece\b/)) return "Sets";
  if (has(/\bpolos?\b/)) return "Polo";
  if (has(/\bhood(?:ie|ies|ed|y)?\b/)) return "Hoodie";
  if (has(/\bsweat ?shirts?\b|\bsweaters?\b|\bpullovers?\b/)) return "Sweatshirt";
  if (!tee && has(/\bhigh ?necks?\b|\bmock ?necks?\b|\bturtle ?necks?\b/)) return "Sweatshirt";
  if (has(/\bjackets?\b/)) return "Jacket";
  // Shorts first: "Cargo Shorts" and "Track Shorts" must not be read as Pants.
  if (has(/\bshorts?\b|\bbermudas?\b/)) return "Shorts";
  if (has(/\btrack ?pants?\b|\btrack ?suits?\b|\bjoggers?\b|\btrousers?\b|\bpants?\b|\bjeans?\b|\bcargos?\b|\bleggings?\b|\bbottoms?\b|\blowers?\b|\bpyjamas?\b/)) return "Pants";
  if (has(/\bskirts?\b/)) return "Skirt";
  if (has(/\bdress(?:es)?\b/)) return "Dress";
  if (has(/\bromper(?:s)?\b|\bbodysuits?\b|\bsleepsuits?\b|\bdungarees?\b|\bonesies?\b/)) return "Baby Wear";
  if (tee) return "T-Shirt";
  if (has(/\bshirts?\b/)) return "Shirt";
  if (has(/\btops?\b/)) return "Top";
  return "";
}

const optionLabel = (list, value) => (list || []).find((option) => option.value === value)?.label || "";

// First recognised group of the stored value, then of its master label.
export function productTypeGroup(...values) {
  for (const value of values) {
    const group = groupOf(value);
    if (group) return group;
  }
  return "";
}

// Public-gallery normalization only; persisted product records and masters stay intact.
export function normalizeProductType(product, masters = EMPTY_MASTERS) {
  const value = productMasterValue(product, "productTypes", masters);
  return productTypeGroup(value, optionLabel(masters.productTypes, value)) || value;
}

export function normalizeProductTypeOptions(options) {
  const seen = new Set();
  const grouped = options.flatMap((option) => {
    const group = productTypeGroup(option.value, option.label);
    const value = group || option.value;
    const key = String(value).toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...option, value, label: group || option.label }];
  });
  const rank = (option) => {
    const index = PRODUCT_TYPE_GROUPS.indexOf(option.value);
    return index === -1 ? PRODUCT_TYPE_GROUPS.length : index;
  };
  return grouped.map((option, index) => ({ option, index }))
    .sort((a, b) => rank(a.option) - rank(b.option) || a.index - b.index)
    .map(({ option }) => option);
}

/* =========================================================
   PRODUCT TYPES FOR THE PUBLIC FILTER
   A product can contain more than one garment ("Hoodie and Jogger Set"
   is a Hoodie, Pants and a Set), so it belongs to every type it
   contains. Selecting a type therefore shows every product that
   genuinely includes that garment, whatever the stored type string is.
   Types are read from the product name first; the stored type is only
   a fallback. Descriptions are never used.
========================================================= */
export const PRODUCT_TYPE_SECTIONS = [
  ["Top", ["T-Shirt", "Polo", "Shirt", "Hoodie", "Sweatshirt", "Jacket", "Top"]],
  ["Bottom", ["Pants", "Shorts"]],
  ["Sets", ["Sets", "Jumpsuit"]],
];
const TYPE_ORDER = PRODUCT_TYPE_SECTIONS.flatMap(([, list]) => list);
export const typeSection = (type) => PRODUCT_TYPE_SECTIONS.find(([, list]) => list.includes(type))?.[0] || "";
export const typeRank = (type) => {
  const index = TYPE_ORDER.indexOf(type);
  return index === -1 ? TYPE_ORDER.length : index;
};

function garmentsIn(value) {
  // Collapse compound names first so one garment is never counted twice.
  const text = wordsOf(value)
    .replace(/\bpolo (?:t ?shirts?|shirts?)\b/g, " polo ")
    .replace(/\bhood(?:ed|ie|ies)? sweat ?shirts?\b/g, " hoodie ")
    .replace(/\btank tops?\b/g, " tank ");
  const has = (pattern) => pattern.test(text);
  const bare = text.replace(/\bt ?shirts?\b|\bsweat ?shirts?\b/g, " "); // what is left once tees/sweatshirts are removed
  const found = [];
  const hoodie = has(/\bhood(?:ie|ies|ed|y)?\b/);
  const tee = has(/\bt ?shirts?\b|\btees?\b|\btank\b/);

  if (tee) found.push("T-Shirt");
  if (has(/\bpolos?\b/)) found.push("Polo");
  if (/\bshirts?\b/.test(bare)) found.push("Shirt");
  if (hoodie) found.push("Hoodie");
  if (has(/\bsweat ?shirts?\b|\bsweaters?\b/) || (!hoodie && has(/\bpullovers?\b/)) || (!tee && has(/\bhigh ?necks?\b|\bmock ?necks?\b|\bturtle ?necks?\b/))) found.push("Sweatshirt");
  if (has(/\bjackets?\b/)) found.push("Jacket");
  if (has(/\btops?\b/)) found.push("Top");
  if (has(/\bshorts?\b|\bbermudas?\b/)) found.push("Shorts");
  if (has(/\bjoggers?\b|\btrack ?pants?\b|\btrousers?\b|\bpants?\b|\bjeans?\b|\bcargos?\b|\bleggings?\b|\bbottoms?\b|\bpyjamas?\b/)) found.push("Pants");
  if (has(/\bjumpsuits?\b/)) found.push("Jumpsuit");
  return { found, isSet: has(/\bsets?\b|\bco ?ords?\b|\b[23] piece\b|\bthree piece\b/) };
}

export function productTypesOf(product, masters = EMPTY_MASTERS) {
  const stored = productMasterValue(product, "productTypes", masters);
  const storedGroup = productTypeGroup(stored, optionLabel(masters.productTypes, stored));
  const { found, isSet } = garmentsIn(product?.productName);
  const types = new Set(found);
  if (!found.length && storedGroup && storedGroup !== "Sets") types.add(storedGroup);
  if (isSet || storedGroup === "Sets") types.add("Sets");
  if (!types.size && stored) types.add(stored);
  return [...types].sort((a, b) => typeRank(a) - typeRank(b));
}

// Label shown on the product card: a set is "Set", otherwise the main garment.
export const displayType = (types) => (types.includes("Sets") ? "Set" : types[0] || "");

/* =========================================================
   CATEGORY CANONICALIZATION
   Whole-value aliases only, so "Women" can never fall into "Men"
   and "Infant Boys" is never merged into "Boys".
========================================================= */
export const CATEGORY_ORDER = ["Men", "Women", "Boys", "Girls", "Infant Boys", "Infant Girls", "Baby Boy", "Baby Girl", "Infants", "Unisex"];
const categoryAliases = new Map([
  ...["men", "mens", "man", "male", "gents"].map((v) => [v, "Men"]),
  ...["women", "womens", "woman", "ladies", "female"].map((v) => [v, "Women"]),
  ...["boy", "boys"].map((v) => [v, "Boys"]),
  ...["girl", "girls"].map((v) => [v, "Girls"]),
  ...["infant boy", "infant boys"].map((v) => [v, "Infant Boys"]),
  ...["infant girl", "infant girls"].map((v) => [v, "Infant Girls"]),
  ["baby boy", "Baby Boy"], ["baby girl", "Baby Girl"],
  ["infant", "Infants"], ["infants", "Infants"],
  ["unisex", "Unisex"],
]);
const categoryKey = (value) => String(value || "").toLowerCase().replace(/[^a-z]+/g, " ").trim();
const canonicalCategory = (...values) => {
  for (const value of values) {
    const match = categoryAliases.get(categoryKey(value));
    if (match) return match;
  }
  return "";
};

// Brands that sell one gender only. Their products can only ever be filed there.
const BOYS_ONLY_BRAND = /^codez/;
const brandKey = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
export const isBoysOnlyBrand = (product) =>
  [product?.brand, product?.legacySourceFolder, product?.sourceFolder].some((value) => BOYS_ONLY_BRAND.test(brandKey(value)));

export function normalizeCategory(product, masters = EMPTY_MASTERS) {
  // CodeZ is a boys-only brand: always Boys, never Girls (or anything else).
  if (isBoysOnlyBrand(product)) return "Boys";
  const value = productMasterValue(product, "categories", masters);
  return canonicalCategory(value, optionLabel(masters.categories, value)) || value;
}

export function normalizeCategoryOptions(options) {
  const seen = new Set();
  const grouped = options.flatMap((option) => {
    const canonical = canonicalCategory(option.value, option.label);
    const value = canonical || option.value;
    const key = String(value).toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...option, value, label: canonical || option.label }];
  });
  const rank = (option) => {
    const index = CATEGORY_ORDER.indexOf(option.value);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return grouped.map((option, index) => ({ option, index }))
    .sort((a, b) => rank(a.option) - rank(b.option) || a.index - b.index)
    .map(({ option }) => option);
}

const colorText = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// Match specific colors first; the existing intentional color-family aliases remain.
const colorAliases = [
  ["Navy Blue", ["navy blue", "navy"]],
  ["Black", ["black"]],
  ["White", ["off white", "white", "cream"]],
  ["Blue", ["blue", "teal"]],
  ["Green", ["green", "olive"]],
  ["Grey", ["grey", "gray", "charcoal"]],
  ["Red", ["red", "maroon", "burgundy"]],
  ["Brown", ["brown", "tan", "beige"]],
];
const exactColors = new Map(colorAliases.flatMap(([canonical, aliases]) => aliases.map((alias) => [alias, canonical])));

function detectColor(value) {
  const text = colorText(value);
  return colorAliases.find(([, aliases]) => aliases.some((alias) =>
    new RegExp(`(?:^|\\s)${alias.replaceAll(" ", "\\s+")}(?=\\s|$)`).test(text),
  ))?.[0] || "";
}

export function normalizeColor(product) {
  const explicit = product?.color || product?.colour || "";
  const exact = exactColors.get(colorText(explicit));
  if (exact) return exact;
  // Structured color first, then the product's own name/style code. Free-text
  // description and collection are never used: "also available in blue" must not
  // file a black product under Blue.
  for (const source of [explicit, product?.productName, product?.styleCode]) {
    const detected = detectColor(source);
    if (detected) return detected;
  }
  return "";
}
