// Compatibility defaults for existing catalogue records. Both pages read the
// persisted master configuration; these seeds are used only until it exists.
const approvedCollections = [
  "Winter",
  "Autumn",
  "Summer",
  "Core",
];

const approvedProductTypes = [
  "T-Shirt",
  "Polo T-Shirt",
  "Full Sleeve T-Shirt",
  "Tank Top",
  "Shirt",
  "Hoodie",
  "Zipper Hoodie",
  "Sweatshirt",
  "Jacket",
  "Track Pant",
  "Jogger",
  "Trouser",
  "Cargo Pant",
  "Legging",
  "Shorts",
  "Skirt",
  "Dress",
  "Top",
  "Co-ord Set",
  "T-Shirt & Track Pant Set",
  "Hoodie & Track Pant Set",
  "Top & Bottom Set",
  "2 Piece Set",
  "3 Piece Set",
  "Romper",
  "Bodysuit",
  "Sleepsuit",
  "Dungaree",
  "Infant Set",
  "Baby Set",
];

const approvedCategories = [
  "Men",
  "Womens",
  "Boys",
  "Girls",
  "Infant Boys",
  "Infant Girls",
  "Baby Boy",
  "Baby Girl",
  "Unisex",
];

const legacyProductTypes = [
  {
    value: "t-shirts",
    label: "T-Shirts",
  },
  {
    value: "polo-t-shirts",
    label: "Polo T-Shirts",
  },
  {
    value: "shirts",
    label: "Shirts",
  },
  {
    value: "hoodies",
    label: "Hoodies",
  },
  {
    value: "sweatshirts",
    label: "Sweatshirts",
  },
  {
    value: "track-pants",
    label: "Track Pants",
  },
  {
    value: "joggers",
    label: "Joggers",
  },
  {
    value: "shorts",
    label: "Shorts",
  },
  {
    value: "co-ord-sets",
    label: "Co-ord Sets",
  },
  {
    value: "dresses-tops",
    label: "Dresses & Tops",
  },
  {
    value: "kids-sets",
    label: "Kids Sets",
  },
  {
    value: "infant-sets",
    label: "Infant Sets",
  },
  {
    value: "special-wash-styles",
    label: "Special Wash Styles",
  },
];

function normalCategory(value) {
  const raw = String(value || "").trim();
  // Whole-word matching only: "women" must never fall into "men", and
  // free-text such as "Kids" is not guessed into a gender.
  const key = raw.toLowerCase().replace(/[^a-z]+/g, " ").trim();
  const has = (pattern) => pattern.test(key);

  if (has(/\bbaby\b.*\bgirls?\b/)) return "Baby Girl";
  if (has(/\bbaby\b.*\bboys?\b/)) return "Baby Boy";
  if (has(/\binfants?\b.*\bgirls?\b/)) return "Infant Girls";
  if (has(/\binfants?\b.*\bboys?\b/)) return "Infant Boys";
  if (key === "infants" || key === "infant") return "Infants";
  if (has(/\bunisex\b/)) return "Unisex";
  if (has(/\b(women|womens|woman|ladies|female)\b/)) return "Women";
  if (has(/\b(girl|girls)\b/)) return "Girls";
  if (has(/\b(boy|boys)\b/)) return "Boys";
  if (has(/\b(men|mens|man|male|gents)\b/)) return "Men";

  return approvedCategories.includes(raw) ? raw : "Unisex";
}

function normalWearStyle(
  product,
) {
  const explicit =
    String(
      product?.wearStyle ||
        "",
    )
      .trim()
      .toLowerCase();

  if (
    explicit.includes(
      "street",
    )
  ) {
    return "Street Wear";
  }

  if (
    explicit.includes(
      "casual",
    )
  ) {
    return "Casual Wear";
  }

  const folder =
    String(
      product?.legacySourceFolder ||
        "",
    )
      .trim()
      .toLowerCase();

  if (
    [
      "ardeur",
      "acid wash",
      "revisited",
    ].includes(
      folder,
    )
  ) {
    return "Street Wear";
  }

  const source = [
    product?.productName,
    product?.description,
  ]
    .map((value) =>
      String(
        value || "",
      ).toLowerCase(),
    )
    .join(" ");

  if (
    source.includes(
      "acid wash",
    ) ||
    source.includes(
      "acid-wash",
    )
  ) {
    return "Street Wear";
  }

  return "Casual Wear";
}

function normalType(product) {
  const raw = String(product?.productType || product?.collection || "").trim();

  // Garment type is inferred from the product's own type/collection/name only.
  // Free-text descriptions mention other garments ("pairs with joggers") and
  // would file the product under the wrong type.
  const text = ` ${[raw, product?.collection, product?.productName]
    .map((value) => String(value || "").toLowerCase())
    .join(" ")
    .replace(/short[\s-]+sleeves?/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
  const has = (pattern) => pattern.test(text);

  const isTee = has(/\bt ?shirts?\b|\btees?\b/);
  const isHoodie = has(/\bhood(?:ie|ies|ed)?\b/);
  const hasBottom = has(/\bjoggers?\b|\btrack ?pants?\b/);
  const isSet = has(/\bsets?\b/);

  if (isHoodie && hasBottom && isSet) return "Hoodie & Track Pant Set";
  if (isTee && hasBottom && isSet) return "T-Shirt & Track Pant Set";
  if (has(/\bco ?ord\b/)) return "Co-ord Set";
  if (has(/\b3 piece\b|\bthree piece\b/)) return "3 Piece Set";
  if (has(/\b2 piece\b|\bkids sets?\b/)) return "2 Piece Set";
  if (has(/\bfull sleeves?\b/) && isTee) return "Full Sleeve T-Shirt";
  if (has(/\bpolo\b/)) return "Polo T-Shirt";
  if (has(/\btank\b/)) return "Tank Top";
  if (has(/\bzip(?:per)?\b/) && isHoodie) return "Zipper Hoodie";
  if (isHoodie) return "Hoodie";
  if (has(/\bsweat ?shirts?\b/)) return "Sweatshirt";
  if (has(/\bjackets?\b/)) return "Jacket";
  if (has(/\btrack ?pants?\b|\btrack ?suits?\b|\btracks\b/)) return "Track Pant";
  if (has(/\bjoggers?\b/)) return "Jogger";
  if (has(/\bjeans?\b|\btrousers?\b/)) return "Trouser";
  if (has(/\bcargos?\b/)) return "Cargo Pant";
  if (has(/\bleggings?\b/)) return "Legging";
  if (has(/\bshorts?\b/)) return "Shorts";
  if (has(/\bskirts?\b/)) return "Skirt";
  if (has(/\bdress(?:es)?\b/)) return "Dress";
  if (has(/\bromper(?:s)?\b/)) return "Romper";
  if (has(/\bbodysuits?\b/)) return "Bodysuit";
  if (has(/\bsleepsuits?\b/)) return "Sleepsuit";
  if (has(/\bdungarees?\b/)) return "Dungaree";
  if (has(/\binfants?\b/)) return "Infant Set";
  if (has(/\bbab(?:y|ies)\b/)) return "Baby Set";
  if (has(/\bshirts?\b/) && !isTee) return "Shirt";
  if (has(/\btops?\b/)) return "Top";
  if (isTee) return "T-Shirt";

  return approvedProductTypes.includes(raw) ? raw : "T-Shirt";
}

function normalCollection(
  product,
) {
  const possible = [
    product?.season,
    product?.seasonCollection,
    product?.catalogCollection,
    product?.displayCollection,
    product?.collection,
  ];

  for (
    const value
    of possible
  ) {
    const clean =
      String(
        value || "",
      ).trim();

    const match =
      approvedCollections.find(
        (collection) =>
          collection.toLowerCase() ===
          clean.toLowerCase(),
      );

    if (match) {
      return match;
    }
  }

  return "Core";
}


export const MASTER_GROUPS = [
  { key: "categories", field: "category", title: "Categories", singular: "Category" },
  { key: "productTypes", field: "productType", title: "Product Types", singular: "Product Type" },
  { key: "collections", field: "collection", title: "Collections", singular: "Collection" },
  { key: "wearStyles", field: "wearStyle", title: "Wear Styles", singular: "Wear Style" },
  { key: "brands", field: "brand", title: "Brands", singular: "Brand" },
];

export const EMPTY_MASTERS = Object.fromEntries(MASTER_GROUPS.map(({ key }) => [key, []]));
const comparable = (value) => String(value || "").trim().toLowerCase();

export function normalizeOptions(options = []) {
  const seen = new Set();
  return options.map((option) => typeof option === "string"
    ? { value: option.trim(), label: option.trim() }
    : { value: String(option?.value || "").trim(), label: String(option?.label || option?.value || "").trim() })
    .filter((option) => {
      const key = comparable(option.value);
      if (!key || !option.label || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function normalizeMasters(masters) {
  return Object.fromEntries(MASTER_GROUPS.map(({ key }) => [key, normalizeOptions(masters?.[key])]));
}

// Read legacy garment collections without mutating any saved product records.
function legacyValue(product, key) {
  if (key === "brands") return product.brand || "";
  if (key === "categories") {
    const raw = String(product.category || "").trim();
    return /^(men|mens|man|male|gents|women|womens|woman|women['’]s|ladies|female|boys?|girls?|infants?|unisex|baby boy|baby girl|infant boys?|infant girls?)$/i.test(raw)
      ? normalCategory(raw) : raw;
  }
  if (key === "wearStyles") return product.wearStyle || normalWearStyle(product);
  if (key === "productTypes") {
    const raw = String(product.productType || "").trim();
    const legacy = legacyProductTypes.find((option) => comparable(option.value) === comparable(raw || product.collection));
    if (legacy) {
      const singular = {
        "t-shirts": "T-Shirt", "polo-t-shirts": "Polo T-Shirt", "shirts": "Shirt",
        "hoodies": "Hoodie", "sweatshirts": "Sweatshirt", "track-pants": "Track Pant",
        "joggers": "Jogger", "co-ord-sets": "Co-ord Set", "infant-sets": "Infant Set",
      };
      return singular[legacy.value] || legacy.label;
    }
    return raw || normalType(product);
  }
  const explicitSeason = product.season || product.seasonCollection || product.catalogCollection || product.displayCollection;
  if (explicitSeason) return explicitSeason;
  const raw = String(product.collection || "").trim();
  const garment = legacyProductTypes.some((option) => comparable(option.value) === comparable(raw) || comparable(option.label) === comparable(raw))
    || approvedProductTypes.some((value) => comparable(value) === comparable(raw))
    || (raw && comparable(raw) === comparable(product.productType));
  return raw && !garment ? raw : normalCollection(product);
}

export function productMasterValue(product, key, masters = EMPTY_MASTERS) {
  const field = MASTER_GROUPS.find((group) => group.key === key)?.field;
  const options = masters[key] || [];
  // Persisted option values are stable across renames.
  const direct = options.find((option) => comparable(option.value) === comparable(product[field]));
  if (direct) return direct.value;
  const raw = legacyValue(product, key);
  return options.find((option) => comparable(option.value) === comparable(raw) || comparable(option.label) === comparable(raw))?.value || raw;
}

// Only used before masters.json exists; once saved, Firebase config is authoritative.
export function bootstrapMasters(products, brands) {
  const seeds = {
    categories: ["Men", "Women", "Boys", "Girls", "Infants"],
    productTypes: approvedProductTypes,
    collections: approvedCollections,
    wearStyles: ["Casual Wear", "Street Wear", "Sportswear", "Activewear"],
    brands,
  };
  return Object.fromEntries(MASTER_GROUPS.map(({ key }) => [key,
    normalizeOptions([...seeds[key], ...products.map((product) => legacyValue(product, key)).filter(Boolean)]),
  ]));
}
