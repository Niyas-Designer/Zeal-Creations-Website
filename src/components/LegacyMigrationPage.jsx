import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  DEFAULT_BRANDS,
  deleteStoragePath,
  loadCatalogue,
  saveCatalogue,
  uploadProductImage,
} from "../services/catalogStorage";

const MANIFEST_URL =
  "/legacy-migration/manifest.json";

const ANALYZE_ENDPOINT =
  import.meta.env
    .VITE_CATALOG_ANALYZE_ENDPOINT
    ?.trim() ||
  "/api/catalog-analyze";

const MAX_IMAGE_DIMENSION =
  1200;

const IMAGE_QUALITY =
  0.78;

const fixedCategories = [
  {
    value: "men",
    label: "Men",
  },
  {
    value: "women",
    label: "Women",
  },
  {
    value: "boys",
    label: "Boys",
  },
  {
    value: "girls",
    label: "Girls",
  },
  {
    value: "infants",
    label: "Infants",
  },
];

const fixedCollections = [
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
    value:
      "special-wash-styles",
    label:
      "Special Wash Styles",
  },
];

function sleep(ms) {
  return new Promise(
    (resolve) =>
      window.setTimeout(
        resolve,
        ms,
      ),
  );
}

function blobToDataUrl(
  blob,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            reader.result,
          );

      reader.onerror =
        reject;

      reader.readAsDataURL(
        blob,
      );
    },
  );
}

function loadImage(
  source,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image();

      image.onload =
        () =>
          resolve(
            image,
          );

      image.onerror =
        () =>
          reject(
            new Error(
              "Unable to decode legacy image.",
            ),
          );

      image.src =
        source;
    },
  );
}

function canvasToBlob(
  canvas,
) {
  return new Promise(
    (resolve) => {
      canvas.toBlob(
        resolve,
        "image/webp",
        IMAGE_QUALITY,
      );
    },
  );
}

async function prepareLegacyImage(
  sourceUrl,
) {
  const response =
    await fetch(
      sourceUrl,
    );

  if (!response.ok) {
    throw new Error(
      `Legacy image load failed (${response.status}).`,
    );
  }

  const sourceBlob =
    await response.blob();

  const sourceDataUrl =
    await blobToDataUrl(
      sourceBlob,
    );

  const image =
    await loadImage(
      sourceDataUrl,
    );

  let width =
    image.naturalWidth;

  let height =
    image.naturalHeight;

  const largest =
    Math.max(
      width,
      height,
    );

  if (
    largest >
    MAX_IMAGE_DIMENSION
  ) {
    const scale =
      MAX_IMAGE_DIMENSION /
      largest;

    width =
      Math.round(
        width *
          scale,
      );

    height =
      Math.round(
        height *
          scale,
      );
  }

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    width;

  canvas.height =
    height;

  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Unable to prepare migration image.",
    );
  }

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  const blob =
    await canvasToBlob(
      canvas,
    );

  if (!blob) {
    throw new Error(
      "Unable to compress legacy image.",
    );
  }

  const dataUrl =
    await blobToDataUrl(
      blob,
    );

  return {
    blob,
    dataUrl,
    width,
    height,
  };
}

function normalizeChoice(
  value,
  options,
) {
  const target =
    String(
      value || "",
    )
      .trim()
      .toLowerCase();

  if (!target) {
    return "";
  }

  return (
    options.find(
      (option) =>
        option.value.toLowerCase() ===
          target ||
        option.label.toLowerCase() ===
          target,
    )?.value || ""
  );
}

function normalizeBrand(
  value,
  brands,
) {
  const target =
    String(
      value || "",
    )
      .trim()
      .toLowerCase();

  if (!target) {
    return "";
  }

  return (
    brands.find(
      (brand) =>
        String(
          brand,
        )
          .trim()
          .toLowerCase() ===
        target,
    ) || ""
  );
}

function labelForChoice(
  value,
  options,
) {
  return (
    options.find(
      (option) =>
        option.value ===
        value,
    )?.label || ""
  );
}

function buildFallbackName({
  brand,
  category,
  collection,
  sourceFolder,
}) {
  const parts = [
    brand,
    labelForChoice(
      category,
      fixedCategories,
    ),
    labelForChoice(
      collection,
      fixedCollections,
    ),
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(
      " ",
    );
  }

  return `${sourceFolder} Product`;
}

function buildFallbackDescription({
  brand,
  category,
  collection,
}) {
  const parts = [];

  if (brand) {
    parts.push(
      brand,
    );
  }

  const categoryLabel =
    labelForChoice(
      category,
      fixedCategories,
    );

  const collectionLabel =
    labelForChoice(
      collection,
      fixedCollections,
    );

  if (categoryLabel) {
    parts.push(
      categoryLabel,
    );
  }

  if (collectionLabel) {
    parts.push(
      collectionLabel,
    );
  }

  if (!parts.length) {
    return "Legacy ZEAL catalogue product migrated for review.";
  }

  return `${parts.join(
    " ",
  )} migrated from the legacy ZEAL catalogue for review.`;
}

async function analyzeLegacyProduct({
  item,
  imageDataUrl,
  brands,
}) {
  let lastError;

  for (
    let attempt = 1;
    attempt <= 3;
    attempt += 1
  ) {
    try {
      const response =
        await fetch(
          ANALYZE_ENDPOINT,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                images: [
                  {
                    name:
                      `${item.sourceFolder} - ${item.sourceFile}`,

                    dataUrl:
                      imageDataUrl,
                  },
                ],

                allowedBrands:
                  brands,

                allowedCategories:
                  fixedCategories,

                allowedCollections:
                  fixedCollections,
              }),
          },
        );

      const raw =
        await response.text();

      let payload;

      try {
        payload =
          JSON.parse(
            raw,
          );
      } catch {
        payload = {
          error:
            raw ||
            "Invalid AI response.",
        };
      }

      if (
        response.ok
      ) {
        return payload;
      }

      const message =
        payload?.error ||
        `AI analysis failed (${response.status}).`;

      if (
        response.status ===
          429 ||
        response.status >=
          500
      ) {
        throw new Error(
          message,
        );
      }

      throw new Error(
        message,
      );
    } catch (error) {
      lastError =
        error;

      if (
        attempt <
        3
      ) {
        await sleep(
          attempt *
            2500,
        );
      }
    }
  }

  throw (
    lastError ||
    new Error(
      "AI analysis failed.",
    )
  );
}

function formatPercent(
  value,
  total,
) {
  if (!total) {
    return 0;
  }

  return Math.round(
    (value / total) *
      100,
  );
}

function StatCard({
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8179]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#171717]">
        {value}
      </p>

      {detail && (
        <p className="mt-2 text-xs leading-5 text-[#817970]">
          {detail}
        </p>
      )}

    </div>
  );
}

function LegacyMigrationPage() {
  const stopRequestedRef =
    useRef(false);

  const [
    manifest,
    setManifest,
  ] = useState(null);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    brands,
    setBrands,
  ] = useState(
    DEFAULT_BRANDS,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    currentItem,
    setCurrentItem,
  ] = useState(null);

  const [
    succeededThisRun,
    setSucceededThisRun,
  ] = useState(0);

  const [
    skippedThisRun,
    setSkippedThisRun,
  ] = useState(0);

  const [
    failedItems,
    setFailedItems,
  ] = useState([]);

  const [
    status,
    setStatus,
  ] = useState(
    "Loading migration data...",
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const loadMigrationState =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setErrorMessage(
          "",
        );

        try {
          const [
            manifestResponse,
            catalogue,
          ] =
            await Promise.all([
              fetch(
                MANIFEST_URL,
                {
                  cache:
                    "no-store",
                },
              ),

              loadCatalogue(),
            ]);

          if (
            !manifestResponse.ok
          ) {
            throw new Error(
              `Manifest load failed (${manifestResponse.status}).`,
            );
          }

          const manifestData =
            await manifestResponse.json();

          if (
            !Array.isArray(
              manifestData?.products,
            )
          ) {
            throw new Error(
              "Legacy migration manifest is invalid.",
            );
          }

          setManifest(
            manifestData,
          );

          setProducts(
            Array.isArray(
              catalogue?.products,
            )
              ? catalogue.products
              : [],
          );

          setBrands(
            Array.isArray(
              catalogue?.brands,
            ) &&
              catalogue.brands.length
              ? catalogue.brands
              : DEFAULT_BRANDS,
          );

          setStatus(
            "Migration system ready",
          );
        } catch (error) {
          console.error(
            error,
          );

          setErrorMessage(
            error?.message ||
              "Unable to load migration system.",
          );

          setStatus(
            "Migration setup failed",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadMigrationState();
  }, [
    loadMigrationState,
  ]);

  const legacyIds =
    useMemo(
      () =>
        new Set(
          products
            .filter(
              (product) =>
                product?.legacySourceId ||
                String(
                  product?.id ||
                    "",
                ).startsWith(
                  "legacy-",
                ),
            )
            .map(
              (product) =>
                product.legacySourceId ||
                product.id,
            ),
        ),
      [
        products,
      ],
    );

  const total =
    manifest?.products
      ?.length || 0;

  const migratedCount =
    useMemo(() => {
      if (
        !manifest?.products
      ) {
        return 0;
      }

      return manifest.products.filter(
        (item) =>
          legacyIds.has(
            item.id,
          ),
      ).length;
    }, [
      manifest,
      legacyIds,
    ]);

  const pendingCount =
    Math.max(
      0,
      total -
        migratedCount,
    );

  const progress =
    formatPercent(
      migratedCount,
      total,
    );

  const runMigration =
    async () => {
      if (
        running ||
        !manifest?.products
          ?.length
      ) {
        return;
      }

      stopRequestedRef.current =
        false;

      setRunning(
        true,
      );

      setSucceededThisRun(
        0,
      );

      setSkippedThisRun(
        0,
      );

      setFailedItems(
        [],
      );

      setErrorMessage(
        "",
      );

      setStatus(
        "Migration running...",
      );

      let workingProducts =
        [...products];

      const existingIds =
        new Set(
          workingProducts
            .filter(
              (product) =>
                product?.legacySourceId ||
                String(
                  product?.id ||
                    "",
                ).startsWith(
                  "legacy-",
                ),
            )
            .map(
              (product) =>
                product.legacySourceId ||
                product.id,
            ),
        );

      try {
        for (
          let index = 0;
          index <
          manifest.products.length;
          index += 1
        ) {
          if (
            stopRequestedRef.current
          ) {
            setStatus(
              "Migration stopped safely",
            );

            break;
          }

          const item =
            manifest.products[
              index
            ];

          if (
            existingIds.has(
              item.id,
            )
          ) {
            setSkippedThisRun(
              (current) =>
                current + 1,
            );

            continue;
          }

          setCurrentItem({
            ...item,
            index:
              index + 1,
          });

          let uploadedPath =
            "";

          try {
            setStatus(
              `Preparing ${index + 1} of ${total}: ${item.sourceFolder} / ${item.sourceFile}`,
            );

            const prepared =
              await prepareLegacyImage(
                item.sourceUrl,
              );

            setStatus(
              `AI analysing ${index + 1} of ${total}: ${item.sourceFile}`,
            );

            const analysis =
              await analyzeLegacyProduct({
                item,
                imageDataUrl:
                  prepared.dataUrl,
                brands,
              });

            const brand =
              normalizeBrand(
                analysis?.brand,
                brands,
              ) ||
              normalizeBrand(
                item.brandHint,
                brands,
              );

            const category =
              normalizeChoice(
                analysis?.category,
                fixedCategories,
              ) ||
              normalizeChoice(
                item.categoryHint,
                fixedCategories,
              );

            const collection =
              normalizeChoice(
                analysis?.collection,
                fixedCollections,
              ) ||
              normalizeChoice(
                item.collectionHint,
                fixedCollections,
              );

            const productName =
              String(
                analysis?.productName ||
                  "",
              ).trim() ||
              buildFallbackName({
                brand,
                category,
                collection,
                sourceFolder:
                  item.sourceFolder,
              });

            const description =
              String(
                analysis?.description ||
                  "",
              ).trim() ||
              buildFallbackDescription({
                brand,
                category,
                collection,
              });

            setStatus(
              `Uploading ${index + 1} of ${total}: ${item.sourceFile}`,
            );

            const imageId =
              `${item.id}-image-1`;

            const uploaded =
              await uploadProductImage({
                productId:
                  item.id,

                imageId,

                blob:
                  prepared.blob,

                fileName:
                  item.sourceFile,
              });

            uploadedPath =
              uploaded.storagePath;

            const now =
              new Date().toISOString();

            const productData = {
              id:
                item.id,

              styleCode:
                `LEGACY-${String(
                  index + 1,
                ).padStart(
                  3,
                  "0",
                )}`,

              productName,

              brand,

              category,

              collection,

              productType:
                collection,

              description,

              trending:
                false,

              published:
                false,

              images: [
                {
                  id:
                    imageId,

                  name:
                    item.sourceFile,

                  url:
                    uploaded.url,

                  storagePath:
                    uploaded.storagePath,

                  isCover:
                    true,

                  compressedSize:
                    prepared.blob
                      .size,

                  width:
                    prepared.width,

                  height:
                    prepared.height,
                },
              ],

              sortOrder:
                workingProducts.length,

              createdAt:
                now,

              updatedAt:
                now,

              migrationStatus:
                "migrated",

              reviewStatus:
                "pending",

              legacySourceId:
                item.id,

              legacySourceFolder:
                item.sourceFolder,

              legacySourceFile:
                item.sourceFile,

              legacySourceUrl:
                item.sourceUrl,

              migratedAt:
                now,
            };

            const next =
              [
                ...workingProducts,
                productData,
              ];

            setStatus(
              `Saving ${index + 1} of ${total} to Firebase catalogue`,
            );

            const saved =
              await saveCatalogue(
                next,
              );

            workingProducts =
              saved;

            existingIds.add(
              item.id,
            );

            setProducts(
              saved,
            );

            setSucceededThisRun(
              (current) =>
                current + 1,
            );

            uploadedPath =
              "";

            await sleep(
              600,
            );
          } catch (error) {
            console.error(
              `Migration failed for ${item.sourceFile}:`,
              error,
            );

            if (
              uploadedPath
            ) {
              try {
                await deleteStoragePath(
                  uploadedPath,
                );
              } catch (
                cleanupError
              ) {
                console.error(
                  "Migration cleanup failed:",
                  cleanupError,
                );
              }
            }

            setFailedItems(
              (current) => [
                ...current,
                {
                  id:
                    item.id,

                  folder:
                    item.sourceFolder,

                  file:
                    item.sourceFile,

                  error:
                    error?.message ||
                    "Migration failed.",
                },
              ],
            );

            await sleep(
              1200,
            );
          }
        }

        if (
          !stopRequestedRef.current
        ) {
          setStatus(
            "Migration run complete",
          );
        }
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Migration stopped because of an unexpected error.",
        );

        setStatus(
          "Migration error",
        );
      } finally {
        setRunning(
          false,
        );

        setCurrentItem(
          null,
        );

        await loadMigrationState();
      }
    };

  const stopMigration =
    () => {
      stopRequestedRef.current =
        true;

      setStatus(
        "Stop requested — finishing current product safely...",
      );
    };

  return (
    <main className="min-h-screen bg-[#f4f2ef] px-5 py-10 text-[#171717]">

      <div className="mx-auto max-w-[1500px]">

        <div className="flex flex-col justify-between gap-6 border-b border-[#dcd7d1] pb-8 lg:flex-row lg:items-end">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
              ZEAL
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Legacy Catalogue Migration
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#716a63]">
              Convert the 173 legacy product images into the new Firebase catalogue system.
              Migrated products are saved as unpublished drafts for manual review.
            </p>

          </div>

          <Link
            to="/catalog"
            className="inline-flex w-fit border border-[#171717] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-[#171717] hover:text-white"
          >
            Back to Catalogue
          </Link>

        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            label="Total Legacy"
            value={total}
            detail="Expected source images"
          />

          <StatCard
            label="Migrated"
            value={migratedCount}
            detail={`${progress}% complete`}
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            detail="Still waiting"
          />

          <StatCard
            label="Success This Run"
            value={succeededThisRun}
            detail="Saved to Firebase"
          />

          <StatCard
            label="Failed This Run"
            value={failedItems.length}
            detail="Can be retried"
          />

        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b837b]">
                Migration Status
              </p>

              <p className="mt-2 text-lg font-semibold">
                {loading
                  ? "Loading..."
                  : status}
              </p>

              <p className="mt-2 text-sm text-[#817970]">
                Already migrated products are automatically skipped, so the process is safe to resume.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                disabled={
                  loading ||
                  running ||
                  pendingCount ===
                    0
                }
                onClick={
                  runMigration
                }
                className="bg-[#171717] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#db3627] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {migratedCount >
                0
                  ? "Resume Migration"
                  : "Start Migration"}
              </button>

              <button
                type="button"
                disabled={
                  !running
                }
                onClick={
                  stopMigration
                }
                className="border border-[#171717] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Stop Safely
              </button>

              <button
                type="button"
                disabled={
                  running
                }
                onClick={() =>
                  void loadMigrationState()
                }
                className="border border-[#d4cec8] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#514c46] transition hover:border-[#171717]"
              >
                Refresh
              </button>

            </div>

          </div>

          <div className="mt-8">

            <div className="flex items-center justify-between gap-4 text-xs text-[#716a63]">

              <span>
                {migratedCount} / {total}
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#ebe7e2]">

              <div
                className="h-full bg-[#171717] transition-[width] duration-300"
                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>

          </div>

          {currentItem && (
            <div className="mt-8 rounded-xl border border-[#e5e0db] bg-[#faf9f7] p-5">

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#db3627]">
                Current Product
              </p>

              <p className="mt-2 text-sm font-semibold">
                {currentItem.index} / {total}
              </p>

              <p className="mt-1 text-sm text-[#716a63]">
                {currentItem.sourceFolder} / {currentItem.sourceFile}
              </p>

            </div>
          )}

        </div>

        {failedItems.length >
          0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center justify-between gap-5">

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#db3627]">
                  Failed Products
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {failedItems.length} need retry
                </h2>

              </div>

            </div>

            <div className="mt-6 divide-y divide-[#ece8e3]">

              {failedItems.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="py-4"
                  >

                    <p className="text-sm font-semibold">
                      {item.folder} / {item.file}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      {item.error}
                    </p>

                  </div>
                ),
              )}

            </div>

          </div>
        )}

        <div className="mt-8 rounded-2xl border border-[#ded8d2] bg-[#fffaf5] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a2a]">
            Safety
          </p>

          <p className="mt-3 text-sm leading-7 text-[#6d6259]">
            Migration does not delete the original legacy files. Every migrated product is created with
            published=false and reviewStatus=pending, so nothing goes live until you review and publish it from Catalogue Management.
          </p>

        </div>

      </div>

    </main>
  );
}

export default LegacyMigrationPage;