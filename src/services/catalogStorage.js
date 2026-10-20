import {
  deleteObject,
  getBytes,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "../lib/firebase";

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

export async function loadCatalogue() {
  const products =
    normalizeProducts(
      await readJson(
        CATALOG_PATH,
        [],
      ),
    );

  const storedBrands =
    await readJson(
      BRANDS_PATH,
      DEFAULT_BRANDS,
    );

  const brands =
    uniqueBrands(
      storedBrands,
    );

  return {
    products,
    brands,
  };
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

  return normalized;
}

/* =========================================================
   SAVE BRANDS
========================================================= */

export async function saveBrands(
  brands,
) {
  const normalized =
    uniqueBrands(
      brands,
    );

  await writeJson(
    BRANDS_PATH,
    normalized,
  );

  return normalized;
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