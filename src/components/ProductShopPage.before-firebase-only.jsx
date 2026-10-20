import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  DEFAULT_BRANDS,
  loadCatalogue,
} from "../services/catalogStorage";

/* =========================================================
   LEGACY PRODUCT COLLECTIONS
========================================================= */

const collectionBanners = [
  {
    id: "ardeur",
    title: "Ardeur",
    brand: "Ardeur",
    folder: "Ardeur",
    images: [
      "0A0A0743.webp",
      "0A0A0756.webp",
      "0A0A9626.webp",
      "0A0A9635.webp",
      "0W2A0022.webp",
      "0W2A0032.webp",
      "0W2A0052.webp",
      "0W2A0066.webp",
      "0W2A9656.webp",
      "0W2A9668.webp",
      "0W2A9677.webp",
      "0W2A9686.webp",
      "0W2A9697.webp",
      "0W2A9707.webp",
      "0W2A9720.webp",
      "0W2A9730.webp",
      "0W2A9746.webp",
      "0W2A9755.webp",
      "0W2A9767.webp",
      "0W2A9773.webp",
      "0W2A9789.webp",
      "0W2A9798.webp",
      "0W2A9812.webp",
      "0W2A9823.webp",
      "0W2A9837.webp",
      "0W2A9838.webp",
      "0W2A9859.webp",
      "0W2A9868.webp",
      "0W2A9881.webp",
      "0W2A9890.webp",
      "0W2A9899.webp",
      "0W2A9910.webp",
      "0W2A9922.webp",
      "0W2A9932.webp",
      "0W2A9945.webp",
      "0W2A9968.webp",
      "0W2A9983.webp",
      "0W2A9987.webp",
    ],
  },

  {
    id: "codez",
    title: "Codez",
    brand: "Codez",
    folder: "Codez",
    images: Array.from(
      { length: 65 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },

  {
    id: "fervoro",
    title: "Fervoro",
    brand: "Fervoro",
    folder: "Fervoro",
    images: Array.from(
      { length: 20 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },

  {
    id: "girls-womens",
    title: "Girls & Womens",
    brand: "",
    folder: "Girls and Womens",
    images: Array.from(
      { length: 21 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },

  {
    id: "infants",
    title: "Infants",
    brand: "",
    folder: "infants",
    images: Array.from(
      { length: 12 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },

  {
    id: "acid-wash",
    title: "Acid Wash",
    brand: "",
    folder: "Acid wash",
    images: Array.from(
      { length: 10 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },

  {
    id: "revisited",
    title: "Revisited",
    brand: "",
    folder: "Revisited",
    images: Array.from(
      { length: 7 },
      (_, index) =>
        `${index + 1}.webp`,
    ),
  },
];

/* =========================================================
   HERO BANNERS
========================================================= */

const heroBanners = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `banner-${index + 1}`,
    file: `Banner ${index + 1}.jpg`,
    alt:
      `ZEAL product hero banner ${
        index + 1
      }`,
  }),
);

/* =========================================================
   PATH HELPERS
========================================================= */

const toWebp = (file) =>
  file.replace(
    /\.[^.]+$/,
    ".webp",
  );

const toOptimizedJpg = (file) =>
  file.replace(
    /\.[^.]+$/,
    ".jpg",
  );

const productImagePath = (
  folder,
  file,
) =>
  `/Product%20images/${encodeURIComponent(
    folder,
  )}/${encodeURIComponent(
    toWebp(file),
  )}`;

const bannerImagePath = (
  file,
) =>
  `/optimized/Product%20banners/${encodeURIComponent(
    toOptimizedJpg(file),
  )}`;

/* =========================================================
   LEGACY GALLERY
========================================================= */

const originalGalleryItems =
  collectionBanners.flatMap(
    (collection) =>
      collection.images.map(
        (file, index) => ({
          id:
            `${collection.id}-${file}`,

          brand:
            collection.brand ||
            "",

          label:
            collection.brand ||
            collection.title,

          lookNumber:
            index + 1,

          image:
            productImagePath(
              collection.folder,
              file,
            ),

          alt:
            `${
              collection.title
            } product image ${String(
              index + 1,
            ).padStart(
              2,
              "0",
            )}`,

          source:
            "original",

          trending:
            false,
        }),
      ),
  );

/* =========================================================
   FIREBASE PRODUCT HELPERS
========================================================= */

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    typeof image ===
    "string"
  ) {
    return image;
  }

  return (
    image.url ||
    image.src ||
    ""
  );
}

function getImageCandidates(
  product,
) {
  if (
    !Array.isArray(
      product?.images,
    ) ||
    product.images.length ===
      0
  ) {
    return [];
  }

  const cover =
    product.images.find(
      (image) =>
        image?.isCover ===
        true,
    );

  const ordered = cover
    ? [
        cover,
        ...product.images.filter(
          (image) =>
            image !== cover,
        ),
      ]
    : product.images;

  return ordered
    .map(getImageUrl)
    .filter(Boolean);
}

function getCoverImage(
  product,
) {
  return (
    getImageCandidates(
      product,
    )[0] || ""
  );
}

function convertFirebaseProductsToGalleryItems(
  products,
) {
  if (
    !Array.isArray(products)
  ) {
    return [];
  }

  return products
    .filter(
      (product) =>
        product &&
        product.published !==
          false &&
        Array.isArray(
          product.images,
        ) &&
        product.images.length >
          0,
    )
    .map(
      (
        product,
        index,
      ) => ({
        id:
          product.id ||
          `catalog-product-${index}`,

        brand:
          product.brand ||
          "",

        label:
          product.brand ||
          "ZEAL",

        image:
          getCoverImage(
            product,
          ),

        imageCandidates:
          getImageCandidates(
            product,
          ),

        alt:
          product.productName ||
          product.styleCode ||
          "ZEAL Product",

        source:
          "catalog",

        trending:
          product.trending ===
          true,

        sortOrder:
          typeof product.sortOrder ===
          "number"
            ? product.sortOrder
            : index,

        createdAt:
          product.createdAt ||
          "",

        product,
      }),
    );
}

function sortCatalogItems(
  items,
) {
  return [...items].sort(
    (a, b) => {
      if (
        a.trending &&
        !b.trending
      ) {
        return -1;
      }

      if (
        !a.trending &&
        b.trending
      ) {
        return 1;
      }

      const orderA =
        typeof a.sortOrder ===
        "number"
          ? a.sortOrder
          : Number.MAX_SAFE_INTEGER;

      const orderB =
        typeof b.sortOrder ===
        "number"
          ? b.sortOrder
          : Number.MAX_SAFE_INTEGER;

      if (
        orderA !== orderB
      ) {
        return (
          orderA - orderB
        );
      }

      const createdA =
        new Date(
          a.createdAt || 0,
        ).getTime();

      const createdB =
        new Date(
          b.createdAt || 0,
        ).getTime();

      return (
        createdB -
        createdA
      );
    },
  );
}

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon({
  direction = "right",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 ${
        direction === "left"
          ? "rotate-180"
          : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SearchIcon({
  className = "h-5 w-5",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={
        className
      }
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4 4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

const ProductImage =
  memo(function ProductImage({
    src,
    fallbackSources = [],
    alt,
    className = "",
    eager = false,
  }) {
    const sources =
      useMemo(() => {
        const unique = [];
        const seen =
          new Set();

        [
          src,
          ...fallbackSources,
        ].forEach(
          (value) => {
            const clean =
              String(
                value || "",
              );

            if (
              !clean ||
              seen.has(clean)
            ) {
              return;
            }

            seen.add(clean);
            unique.push(
              clean,
            );
          },
        );

        return unique;
      }, [
        src,
        fallbackSources,
      ]);

    const [
      sourceIndex,
      setSourceIndex,
    ] = useState(0);

    useEffect(() => {
      setSourceIndex(0);
    }, [src]);

    const currentSource =
      sources[
        sourceIndex
      ] || "";

    if (!currentSource) {
      return (
        <div className="flex h-full min-h-[160px] w-full items-center justify-center bg-[#f1efec] px-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#aaa39c]">
            Image unavailable
          </p>
        </div>
      );
    }

    return (
      <img
        key={
          currentSource
        }
        src={
          currentSource
        }
        alt={alt}
        loading={
          eager
            ? "eager"
            : "lazy"
        }
        decoding="async"
        fetchPriority={
          eager
            ? "high"
            : "auto"
        }
        onError={() =>
          setSourceIndex(
            (current) =>
              current + 1,
          )
        }
        className={
          className
        }
      />
    );
  });

/* =========================================================
   GALLERY GRID
========================================================= */

const GalleryGrid =
  memo(function GalleryGrid({
    items,
    activeBrand,
  }) {
    return (
      <div className="mt-9 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
        {items.map(
          (
            item,
            index,
          ) => {
            const clickable =
              item.source ===
                "catalog" &&
              item.product?.id;

            const card = (
              <>
                <ProductImage
                  src={
                    item.image
                  }
                  fallbackSources={
                    item.imageCandidates ||
                    []
                  }
                  alt={
                    item.alt
                  }
                  eager={
                    index <
                    8
                  }
                  className="block w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.012]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    {
                      item.label
                    }
                  </p>

                  {item.source ===
                    "catalog" && (
                    <>
                      <p className="mt-1 text-sm font-medium">
                        {
                          item
                            .product
                            ?.productName
                        }
                      </p>

                      {item
                        .product
                        ?.styleCode && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/75">
                          {
                            item
                              .product
                              .styleCode
                          }
                        </p>
                      )}
                    </>
                  )}
                </div>
              </>
            );

            if (
              clickable
            ) {
              return (
                <Link
                  key={
                    item.id
                  }
                  to={`/products/${encodeURIComponent(
                    item
                      .product
                      .id,
                  )}`}
                  state={{
                    product:
                      item.product,

                    fromProducts:
                      true,

                    activeBrand,
                  }}
                  className="group relative mb-3 block break-inside-avoid overflow-hidden rounded-[1rem] bg-[#eeeae5] sm:mb-4 sm:rounded-[1.25rem]"
                >
                  {card}
                </Link>
              );
            }

            return (
              <article
                key={
                  item.id
                }
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[1rem] bg-[#eeeae5] sm:mb-4 sm:rounded-[1.25rem]"
              >
                {card}
              </article>
            );
          },
        )}
      </div>
    );
  });

/* =========================================================
   PAGE
========================================================= */

function ProductShopPage() {
  const searchInputRef =
    useRef(null);

  const catalogueRequestRef =
    useRef(0);

  const [
    activeBanner,
    setActiveBanner,
  ] = useState(0);

  const [
    activeBrand,
    setActiveBrand,
  ] =
    useState("all");

  const [
    catalogProducts,
    setCatalogProducts,
  ] = useState([]);

  const [
    brands,
    setBrands,
  ] = useState(
    DEFAULT_BRANDS,
  );

  const [
    catalogueLoading,
    setCatalogueLoading,
  ] = useState(true);

  const [
    catalogueError,
    setCatalogueError,
  ] = useState("");

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  /* =======================================================
     LOAD FIREBASE CATALOGUE
  ======================================================= */

  const refreshCatalogue =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
        const requestId =
          catalogueRequestRef.current +
          1;

        catalogueRequestRef.current =
          requestId;

        if (!silent) {
          setCatalogueLoading(
            true,
          );
        }

        try {
          const data =
            await loadCatalogue();

          if (
            requestId !==
            catalogueRequestRef.current
          ) {
            return;
          }

          const nextProducts =
            Array.isArray(
              data?.products,
            )
              ? data.products
              : [];

          const nextBrands =
            Array.isArray(
              data?.brands,
            ) &&
            data.brands.length
              ? data.brands
              : DEFAULT_BRANDS;

          setCatalogProducts(
            nextProducts,
          );

          setBrands(
            nextBrands,
          );

          setCatalogueError(
            "",
          );
        } catch (error) {
          console.error(
            "Unable to load Firebase catalogue:",
            error,
          );

          if (
            requestId !==
            catalogueRequestRef.current
          ) {
            return;
          }

          setCatalogueError(
            error?.message ||
              "Unable to load live catalogue.",
          );
        } finally {
          if (
            requestId ===
              catalogueRequestRef.current &&
            !silent
          ) {
            setCatalogueLoading(
              false,
            );
          }
        }
      },
      [],
    );

  useEffect(() => {
    void refreshCatalogue();

    const handleFocus =
      () => {
        void refreshCatalogue({
          silent: true,
        });
      };

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void refreshCatalogue({
            silent: true,
          });
        }
      };

    window.addEventListener(
      "focus",
      handleFocus,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      catalogueRequestRef.current +=
        1;

      window.removeEventListener(
        "focus",
        handleFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [
    refreshCatalogue,
  ]);

  /* =======================================================
     HERO
  ======================================================= */

  const changeBanner =
    useCallback(
      (direction) => {
        setActiveBanner(
          (current) => {
            const next =
              current +
              direction;

            if (
              next < 0
            ) {
              return (
                heroBanners.length -
                1
              );
            }

            return (
              next %
              heroBanners.length
            );
          },
        );
      },
      [],
    );

  useEffect(() => {
    if (searchOpen) {
      return undefined;
    }

    const interval =
      window.setInterval(
        () => {
          if (
            !document.hidden
          ) {
            changeBanner(
              1,
            );
          }
        },
        7000,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, [
    changeBanner,
    searchOpen,
  ]);

  /* =======================================================
     SEARCH MODAL
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow =
      searchOpen
        ? "hidden"
        : "";

    if (searchOpen) {
      const frame =
        requestAnimationFrame(
          () =>
            searchInputRef.current?.focus(),
        );

      return () => {
        cancelAnimationFrame(
          frame,
        );

        document.body.style.overflow =
          "";
      };
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setSearchOpen(
            false,
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
  }, []);

  /* =======================================================
     FIREBASE PRODUCTS
  ======================================================= */

  const uploadedGalleryItems =
    useMemo(
      () =>
        convertFirebaseProductsToGalleryItems(
          catalogProducts,
        ),
      [
        catalogProducts,
      ],
    );

  /* =======================================================
     BRAND FILTERS
  ======================================================= */

  const brandFilters =
    useMemo(() => {
      const result = [];
      const seen =
        new Set();

      const addBrand =
        (brand) => {
          const clean =
            String(
              brand || "",
            ).trim();

          if (!clean) {
            return;
          }

          const key =
            clean.toLowerCase();

          if (
            seen.has(key)
          ) {
            return;
          }

          seen.add(key);

          result.push(
            clean,
          );
        };

      DEFAULT_BRANDS.forEach(
        addBrand,
      );

      brands.forEach(
        addBrand,
      );

      catalogProducts.forEach(
        (product) =>
          addBrand(
            product.brand,
          ),
      );

      return result;
    }, [
      brands,
      catalogProducts,
    ]);

  /* =======================================================
     VISIBLE GALLERY
  ======================================================= */

  const visibleItems =
    useMemo(() => {
      const brandKey =
        String(
          activeBrand,
        ).toLowerCase();

      const uploaded =
        activeBrand ===
        "all"
          ? uploadedGalleryItems
          : uploadedGalleryItems.filter(
              (item) =>
                String(
                  item.brand ||
                    "",
                ).toLowerCase() ===
                brandKey,
            );

      const originals =
        activeBrand ===
        "all"
          ? originalGalleryItems
          : originalGalleryItems.filter(
              (item) =>
                String(
                  item.brand ||
                    "",
                ).toLowerCase() ===
                brandKey,
            );

      return [
        ...sortCatalogItems(
          uploaded,
        ),

        ...originals,
      ];
    }, [
      activeBrand,
      uploadedGalleryItems,
    ]);

  const sortedCatalogItems =
    useMemo(
      () =>
        sortCatalogItems(
          uploadedGalleryItems,
        ),
      [
        uploadedGalleryItems,
      ],
    );

  /* =======================================================
     TRENDING
  ======================================================= */

  const trendingItems =
    useMemo(() => {
      const explicit =
        sortedCatalogItems.filter(
          (item) =>
            item.trending,
        );

      return (
        explicit.length
          ? explicit
          : sortedCatalogItems
      ).slice(
        0,
        8,
      );
    }, [
      sortedCatalogItems,
    ]);

  const trendingSearchTerms =
    useMemo(() => {
      const terms = [];
      const seen =
        new Set();

      const addTerm =
        (value) => {
          const clean =
            String(
              value || "",
            ).trim();

          if (!clean) {
            return;
          }

          const key =
            clean.toLowerCase();

          if (
            seen.has(key)
          ) {
            return;
          }

          seen.add(key);

          terms.push(
            clean,
          );
        };

      trendingItems.forEach(
        (item) => {
          addTerm(
            item.product
              ?.productName,
          );

          addTerm(
            item.product
              ?.collection ||
              item.product
                ?.productType,
          );

          addTerm(
            item.product
              ?.brand,
          );
        },
      );

      return terms.slice(
        0,
        8,
      );
    }, [
      trendingItems,
    ]);

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

  const searchResults =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return [];
      }

      return sortedCatalogItems.filter(
        (item) => {
          const product =
            item.product ||
            {};

          return [
            product.productName,
            product.styleCode,
            product.brand,
            product.productType,
            product.collection,
            product.category,
            product.description,
          ].some(
            (value) =>
              String(
                value || "",
              )
                .toLowerCase()
                .includes(
                  query,
                ),
          );
        },
      );
    }, [
      searchQuery,
      sortedCatalogItems,
    ]);

  const closeSearch =
    useCallback(() => {
      setSearchOpen(
        false,
      );

      setSearchQuery(
        "",
      );
    }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <main className="min-h-screen bg-white text-[#171717]">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="relative isolate overflow-hidden bg-[#111111]"
          aria-label="ZEAL product collection hero banner"
        >
          <div className="relative aspect-[1900/850] w-full bg-[#111111]">

            {heroBanners.map(
              (
                banner,
                index,
              ) => {
                const isActive =
                  index ===
                  activeBanner;

                return (
                  <div
                    key={
                      banner.id
                    }
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      isActive
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
                    <img
                      src={bannerImagePath(
                        banner.file,
                      )}
                      alt={
                        banner.alt
                      }
                      className="h-full w-full object-contain"
                      loading={
                        index ===
                        0
                          ? "eager"
                          : "lazy"
                      }
                      decoding="async"
                    />
                  </div>
                );
              },
            )}

            <button
              type="button"
              aria-label="Previous banner"
              onClick={() =>
                changeBanner(
                  -1,
                )
              }
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/50 bg-black/20 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-black"
            >
              <ArrowIcon direction="left" />
            </button>

            <button
              type="button"
              aria-label="Next banner"
              onClick={() =>
                changeBanner(
                  1,
                )
              }
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/50 bg-black/20 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-black"
            >
              <ArrowIcon />
            </button>

          </div>
        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto max-w-[1700px]">

            <div className="flex flex-col justify-between gap-7 border-b border-[#dedbd6] pb-8 lg:flex-row lg:items-end">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
                  Product Inspiration
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Explore the collection.
                </h1>

                {catalogueError && (
                  <button
                    type="button"
                    onClick={() =>
                      void refreshCatalogue()
                    }
                    className="mt-4 text-xs font-medium text-[#db3627] underline underline-offset-4"
                  >
                    Refresh live catalogue
                  </button>
                )}

              </div>

              <div className="text-right">

                <p className="text-sm text-[#716a63]">
                  {
                    visibleItems.length
                  }{" "}
                  products
                </p>

                {catalogueLoading && (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#aaa39c]">
                    Syncing catalogue
                  </p>
                )}

              </div>

            </div>

            {/* =============================================
                BRAND FILTERS
            ============================================= */}

            <div className="mt-7 flex items-center justify-between gap-4 border-b border-[#e4e0dc] pb-7">

              <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                <button
                  type="button"
                  onClick={() =>
                    setActiveBrand(
                      "all",
                    )
                  }
                  className={`shrink-0 border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                    activeBrand ===
                    "all"
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-[#d8d3cd] bg-white text-[#514c46] hover:border-[#171717]"
                  }`}
                >
                  All Brands
                </button>

                {brandFilters.map(
                  (brand) => (
                    <button
                      key={
                        brand
                      }
                      type="button"
                      onClick={() =>
                        setActiveBrand(
                          brand,
                        )
                      }
                      className={`shrink-0 border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                        String(
                          activeBrand,
                        ).toLowerCase() ===
                        String(
                          brand,
                        ).toLowerCase()
                          ? "border-[#171717] bg-[#171717] text-white"
                          : "border-[#d8d3cd] bg-white text-[#514c46] hover:border-[#171717]"
                      }`}
                    >
                      {brand}
                    </button>
                  ),
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    true,
                  )
                }
                className="flex h-[43px] shrink-0 items-center gap-2 border border-[#171717] px-5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:bg-[#171717] hover:text-white"
              >
                <SearchIcon />

                <span className="hidden sm:inline">
                  Search
                </span>
              </button>

            </div>

            {/* =============================================
                GALLERY
            ============================================= */}

            <GalleryGrid
              items={
                visibleItems
              }
              activeBrand={
                activeBrand
              }
            />

          </div>
        </section>

      </main>

      {/* ===================================================
          SEARCH OVERLAY
      =================================================== */}

      <div
        aria-hidden={
          !searchOpen
        }
        className={`fixed inset-0 z-[99999] overflow-y-auto bg-white text-[#171717] transition-opacity duration-150 ${
          searchOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >

        <div className="sticky top-0 z-40 border-b border-[#e4e0dc] bg-white">

          <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-5 py-5 sm:px-8 lg:px-10">

            <SearchIcon className="h-6 w-6 shrink-0" />

            <input
              ref={
                searchInputRef
              }
              type="text"
              value={
                searchQuery
              }
              onChange={(
                event,
              ) =>
                setSearchQuery(
                  event.target
                    .value,
                )
              }
              placeholder="What are you looking for?"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-2xl font-medium tracking-[-0.025em] outline-none placeholder:text-[#aaa39c] sm:text-3xl"
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery(
                    "",
                  );

                  searchInputRef.current?.focus();
                }}
                className="flex h-10 w-10 items-center justify-center text-[#817a73] hover:text-[#db3627]"
              >
                <CloseIcon />
              </button>
            )}

            <button
              type="button"
              aria-label="Close search"
              onClick={
                closeSearch
              }
              className="ml-1 flex h-12 w-12 items-center justify-center border border-[#dedbd6] transition-colors duration-150 hover:bg-[#171717] hover:text-white"
            >
              <CloseIcon />
            </button>

          </div>
        </div>

        <div className="mx-auto max-w-[1800px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          {/* ===============================================
              SEARCH RESULTS
          =============================================== */}

          {searchQuery.trim() && (
            <section>

              <div className="flex items-end justify-between gap-6 border-b border-[#e4e0dc] pb-6">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#db3627]">
                    Search Results
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                    “
                    {
                      searchQuery
                    }
                    ”
                  </h2>

                </div>

                <p className="text-sm text-[#817a73]">
                  {
                    searchResults.length
                  }{" "}
                  result
                  {searchResults.length ===
                  1
                    ? ""
                    : "s"}
                </p>

              </div>

              {searchResults.length >
              0 ? (
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

                  {searchResults.map(
                    (
                      item,
                      index,
                    ) => (
                      <Link
                        key={
                          item.id
                        }
                        to={`/products/${encodeURIComponent(
                          item
                            .product
                            .id,
                        )}`}
                        state={{
                          product:
                            item.product,

                          fromProducts:
                            true,

                          activeBrand,
                        }}
                        onClick={() => {
                          document.body.style.overflow =
                            "";

                          setSearchOpen(
                            false,
                          );
                        }}
                        className="group min-w-0 text-left"
                      >

                        <div className="aspect-[3/4] overflow-hidden bg-[#f1efec]">

                          <ProductImage
                            src={
                              item.image
                            }
                            fallbackSources={
                              item.imageCandidates ||
                              []
                            }
                            alt={
                              item.alt
                            }
                            eager={
                              index <
                              12
                            }
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />

                        </div>

                        <div className="pt-3">

                          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#db3627] sm:text-[10px]">
                            {
                              item.label
                            }
                          </p>

                          <h3 className="mt-1 truncate text-sm font-semibold">
                            {
                              item
                                .product
                                ?.productName
                            }
                          </h3>

                          {item
                            .product
                            ?.styleCode && (
                            <p className="mt-1 truncate text-[10px] uppercase tracking-[0.08em] text-[#817a73]">
                              {
                                item
                                  .product
                                  .styleCode
                              }
                            </p>
                          )}

                        </div>

                      </Link>
                    ),
                  )}

                </div>
              ) : (
                <div className="py-16">

                  <p className="text-2xl font-semibold">
                    No products found.
                  </p>

                  <p className="mt-2 text-sm text-[#817a73]">
                    Try another product name, style code or brand.
                  </p>

                </div>
              )}

            </section>
          )}

          {/* ===============================================
              TRENDING SEARCH TERMS
          =============================================== */}

          {trendingSearchTerms.length >
            0 && (
            <section
              className={
                searchQuery.trim()
                  ? "mt-16 border-t border-[#e4e0dc] pt-10"
                  : ""
              }
            >

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d5751]">
                Trending Searches
              </p>

              <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">

                {trendingSearchTerms.map(
                  (term) => (
                    <button
                      key={
                        term
                      }
                      type="button"
                      onClick={() => {
                        setSearchQuery(
                          term,
                        );

                        searchInputRef.current?.focus();
                      }}
                      className="border-b border-transparent pb-1 text-sm font-medium transition-colors duration-150 hover:border-[#171717]"
                    >
                      {term}
                    </button>
                  ),
                )}

              </div>

            </section>
          )}

          {/* ===============================================
              TRENDING PRODUCTS
          =============================================== */}

          {trendingItems.length >
            0 && (
            <section
              className={
                searchQuery.trim()
                  ? "mt-14"
                  : "mt-16"
              }
            >

              <div className="flex items-center justify-between gap-5">

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d5751]">
                  You Might Be Interested In
                </p>

                <span className="text-[10px] uppercase tracking-[0.12em] text-[#aaa39c]">
                  Trending
                </span>

              </div>

              <div className="mt-7 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                {trendingItems.map(
                  (
                    item,
                    index,
                  ) => (
                    <Link
                      key={
                        item.id
                      }
                      to={`/products/${encodeURIComponent(
                        item
                          .product
                          .id,
                      )}`}
                      state={{
                        product:
                          item.product,

                        fromProducts:
                          true,

                        activeBrand,
                      }}
                      onClick={() => {
                        document.body.style.overflow =
                          "";

                        setSearchOpen(
                          false,
                        );
                      }}
                      className="group w-[150px] shrink-0 text-left sm:w-[175px] lg:w-[195px]"
                    >

                      <div className="aspect-[3/4] overflow-hidden bg-[#f1efec]">

                        <ProductImage
                          src={
                            item.image
                          }
                          fallbackSources={
                            item.imageCandidates ||
                            []
                          }
                          alt={
                            item.alt
                          }
                          eager={
                            index <
                            6
                          }
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                      </div>

                      <div className="pt-3">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#db3627]">
                          {
                            item.label
                          }
                        </p>

                        <h3 className="mt-1 line-clamp-1 text-xs font-semibold sm:text-sm">
                          {item
                            .product
                            ?.productName ||
                            item.alt}
                        </h3>

                        {item
                          .product
                          ?.styleCode && (
                          <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[#817a73]">
                            {
                              item
                                .product
                                .styleCode
                            }
                          </p>
                        )}

                      </div>

                    </Link>
                  ),
                )}

              </div>

            </section>
          )}

          {!searchQuery.trim() &&
            trendingItems.length ===
              0 && (
              <div className="flex min-h-[60vh] items-center justify-center text-center">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#db3627]">
                    Search ZEAL
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                    What are you looking for?
                  </h2>

                </div>

              </div>
            )}

        </div>

      </div>
    </>
  );
}

export default ProductShopPage;