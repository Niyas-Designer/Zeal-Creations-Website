import {
  deleteObject,
  getBytes,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "../lib/firebase";

import { bootstrapMasters, MASTER_GROUPS, normalizeMasters, productMasterValue } from "./catalogMasters.js";

const MASTERS_PATH = "catalogue/config/masters.json";

const CATALOG_PATH =
  "catalogue/data/catalog.json";

const BRANDS_PATH =
  "catalogue/config/brands.json";

export const DEFAULT_BRANDS = [
  "HRX",
  "Slazenger",
  "M&H",
  "Roadster",
  "K&K",
  "Ardeur",
  "Ardeur Zeal in you",
  "Ardeur Streetz",
  "Alpha Tribe",
  "Budha Jeans",
  "Metronaut",
  "Neonomat",
];

function uniqueBrands(
  brands,
) {
  const seen =
    new Set();

  return (
    Array.isArray(brands)
      ? brands
      : []
  )
    .map((brand) =>
      String(
        brand || "",
      ).trim(),
    )
    .filter(Boolean)
    .filter((brand) => {
      const key =
        brand.toLowerCase();

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    });
}

function normalizeProducts(
  products,
) {
  if (
    !Array.isArray(products)
  ) {
    return [];
  }

  return [...products]
    .sort(
      (a, b) =>
        (
          a.sortOrder ??
          Number.MAX_SAFE_INTEGER
        ) -
        (
          b.sortOrder ??
          Number.MAX_SAFE_INTEGER
        ),
    )
    .map(
      (
        product,
        index,
      ) => ({
        ...product,

        sortOrder:
          index,
      }),
    );
}

async function readJson(
  path,
  fallback,
) {
  try {
    const bytes =
      await getBytes(
        ref(
          storage,
          path,
        ),
      );

    const text =
      new TextDecoder().decode(
        bytes,
      );

    return JSON.parse(
      text,
    );
  } catch (error) {
    if (
      error?.code ===
      "storage/object-not-found"
    ) {
      return fallback;
    }

    throw error;
  }
}

async function writeJson(
  path,
  value,
) {
  const body =
    JSON.stringify(
      value,
      null,
      2,
    );

  const blob =
    new Blob(
      [body],
      {
        type:
          "application/json",
      },
    );

  await uploadBytes(
    ref(
      storage,
      path,
    ),
    blob,
    {
      contentType:
        "application/json",

      cacheControl:
        "no-cache",
    },
  );
}

/* =========================================================
   LOAD CATALOGUE
========================================================= */

const CACHE_KEY = `zeal:catalogue:v2:${storage.app?.options?.storageBucket || "default"}`;
let cachedCatalogue;
let inFlight;
let revision = 0;
const listeners = new Set();

export function getCachedCatalogue() {
  if (cachedCatalogue) return cachedCatalogue;
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem(CACHE_KEY) || "null");
    if (saved && Array.isArray(saved.products) && saved.masters && Number.isFinite(saved.fetchedAt)) {
      cachedCatalogue = { ...saved, masters: normalizeMasters(saved.masters) };
    }
  } catch { /* Storage is optional, including private browsing and quota limits. */ }
  return cachedCatalogue || null;
}

export function subscribeCatalogue(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function cacheCatalogue(data) {
  const previous = getCachedCatalogue();
  const unchanged = previous && JSON.stringify([previous.products, previous.masters]) === JSON.stringify([data.products, data.masters]);
  cachedCatalogue = unchanged ? { ...data, products: previous.products, masters: previous.masters, brands: previous.brands } : data;
  try { globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify(cachedCatalogue)); } catch { /* Keep the memory cache. */ }
  listeners.forEach((listener) => listener(cachedCatalogue));
  return cachedCatalogue;
}

export async function loadCatalogue({ maxAge = 0 } = {}) {
  const cached = getCachedCatalogue();
  if (cached && maxAge > 0 && Date.now() - cached.fetchedAt < maxAge) return cached;
  if (inFlight) return inFlight;
  const startingRevision = revision;
  const request = (async () => {
    const [rawProducts, { storedMasters, storedBrands }] = await Promise.all([
      readJson(CATALOG_PATH, []),
      readJson(MASTERS_PATH, null).then(async (storedMasters) => ({
        storedMasters,
        storedBrands: storedMasters ? [] : await readJson(BRANDS_PATH, DEFAULT_BRANDS),
      })),
    ]);
    if (!Array.isArray(rawProducts)) throw new Error("Invalid catalogue data; no data was changed.");
    if (storedMasters && !MASTER_GROUPS.every(({ key }) => Array.isArray(storedMasters[key]))) {
      throw new Error("Invalid catalogue master configuration; no data was changed.");
    }
    const products = normalizeProducts(rawProducts);
    const masters = storedMasters ? normalizeMasters(storedMasters) : bootstrapMasters(products, uniqueBrands(storedBrands));
    const data = { products, masters, brands: masters.brands.map((option) => option.value), fetchedAt: Date.now() };
    if (startingRevision !== revision) return getCachedCatalogue() || data;
    return cacheCatalogue(data);
  })();
  inFlight = request;
  try { return await request; } finally { if (inFlight === request) inFlight = null; }
}

// Each operation reads Firebase first, and writes only config, never products/images.
let masterWrite = Promise.resolve();
export function updateCatalogueMaster(operation) {
  const request = masterWrite.then(() => mutateCatalogueMaster(operation));
  masterWrite = request.catch(() => {});
  return request;
}

async function mutateCatalogueMaster({ key, action, value, label }) {
  if (!MASTER_GROUPS.some((group) => group.key === key)) throw new Error("Unknown master group.");
  if (!["create", "rename", "delete"].includes(action)) throw new Error("Unknown master action.");
  const data = await loadCatalogue();
  const options = data.masters[key];
  const clean = String(label || "").trim();
  const target = options.find((option) => option.value === value);
  if (action !== "create" && !target) throw new Error("This value no longer exists. Refresh and try again.");
  if (action !== "delete") {
    if (!clean) throw new Error("Enter a name.");
    if (options.some((option) => option.value !== target?.value &&
      [option.label, option.value].some((text) => text.toLowerCase() === clean.toLowerCase()))) {
      throw new Error("This value already exists.");
    }
  }
  if (action === "delete") {
    const usedBy = data.products.filter((product) => productMasterValue(product, key, data.masters) === value).length;
    if (usedBy) throw new Error(`This value is currently used by ${usedBy} products. Update those products before deleting it.`);
  }
  const nextOptions = action === "create" ? [...options, { value: clean, label: clean }]
    : action === "rename" ? options.map((option) => option.value === value ? { ...option, label: clean } : option)
    : options.filter((option) => option.value !== value);
  const masters = normalizeMasters({ ...data.masters, [key]: nextOptions });
  await writeJson(MASTERS_PATH, masters);
  revision += 1;
  return cacheCatalogue({ ...data, masters, brands: masters.brands.map((option) => option.value), fetchedAt: Date.now() });
}

/* =========================================================
   SAVE CATALOGUE
========================================================= */

export async function saveCatalogue(
  products,
) {
  const normalized =
    normalizeProducts(
      products,
    );

  await writeJson(
    CATALOG_PATH,
    normalized,
  );

  revision += 1;
  const cached = getCachedCatalogue();
  if (cached) cacheCatalogue({ ...cached, products: normalized, fetchedAt: 0 });
  return normalized;
}

/* =========================================================
   SAVE BRANDS
========================================================= */

export async function saveBrands(brands) {
  const data = await loadCatalogue();
  const masters = normalizeMasters({ ...data.masters, brands });
  const removed = data.masters.brands.filter((option) => !masters.brands.some((next) => next.value === option.value));
  if (removed.some((option) => data.products.some((product) => productMasterValue(product, "brands", data.masters) === option.value))) {
    throw new Error("A removed brand is still used by catalogue products.");
  }
  await writeJson(MASTERS_PATH, masters);
  revision += 1;
  cacheCatalogue({ ...data, masters, brands: masters.brands.map((option) => option.value), fetchedAt: Date.now() });
  return masters.brands.map((option) => option.value);
}

/* =========================================================
   PRODUCT IMAGE UPLOAD
========================================================= */

export async function uploadProductImage({
  productId,
  imageId,
  blob,
  fileName,
}) {
  const safeBaseName =
    String(
      fileName ||
        "product-image",
    )
      .replace(
        /\.[^.]+$/,
        "",
      )
      .replace(
        /[^a-zA-Z0-9-_]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(
        0,
        50,
      );

  const safeImageId =
    String(
      imageId ||
        Date.now(),
    )
      .replace(
        /[^a-zA-Z0-9-_]+/g,
        "-",
      )
      .slice(
        0,
        80,
      );

  const storagePath =
    `catalogue/products/${productId}/${safeBaseName || "image"}-${safeImageId}.webp`;

  const imageRef =
    ref(
      storage,
      storagePath,
    );

  await uploadBytes(
    imageRef,
    blob,
    {
      contentType:
        blob.type ||
        "image/webp",

      cacheControl:
        "public,max-age=31536000,immutable",
    },
  );

  const url =
    await getDownloadURL(
      imageRef,
    );

  return {
    storagePath,
    url,
  };
}

/* =========================================================
   DELETE SINGLE STORAGE FILE
========================================================= */

export async function deleteStoragePath(
  storagePath,
) {
  if (!storagePath) {
    return;
  }

  try {
    await deleteObject(
      ref(
        storage,
        storagePath,
      ),
    );
  } catch (error) {
    if (
      error?.code !==
      "storage/object-not-found"
    ) {
      throw error;
    }
  }
}

/* =========================================================
   DELETE PRODUCT IMAGES
========================================================= */

export async function deleteProductImages(
  product,
) {
  const paths =
    (
      product?.images ||
      []
    )
      .map(
        (image) =>
          image?.storagePath,
      )
      .filter(Boolean);

  await Promise.all(
    paths.map(
      deleteStoragePath,
    ),
  );
}