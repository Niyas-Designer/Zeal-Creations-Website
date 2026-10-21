import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  DEFAULT_BRANDS,
  loadCatalogue,
} from "../services/catalogStorage";

/* =========================================================
   FILTER MASTER DATA
========================================================= */

const defaultBrands = DEFAULT_BRANDS;

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

const approvedColors = [
  {
    value: "Black",
    hex: "#263746",
  },
  {
    value: "White",
    hex: "#ffffff",
  },
  {
    value: "Blue",
    hex: "#1478d4",
  },
  {
    value: "Green",
    hex: "#54ad5a",
  },
  {
    value: "Navy Blue",
    hex: "#3d4a8a",
  },
  {
    value: "Grey",
    hex: "#9aa3a7",
  },
  {
    value: "Red",
    hex: "#d94858",
  },
  {
    value: "Brown",
    hex: "#7a5137",
  },
];

/* =========================================================
   HERO BANNERS
========================================================= */

const heroBanners = Array.from(
  {
    length: 8,
  },
  (_, index) => ({
    id: `banner-${index + 1}`,
    file: `Banner ${index + 1}.jpg`,
    alt: `ZEAL product banner ${index + 1}`,
  }),
);

const bannerImagePath = (file) =>
  `/optimized/Product%20banners/${encodeURIComponent(
    file.replace(
      /\.[^.]+$/,
      ".jpg",
    ),
  )}`;

/* =========================================================
   IMAGE HELPERS
========================================================= */

function imageUrl(image) {
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

function imageList(product) {
  if (
    !Array.isArray(
      product?.images,
    )
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
    .map(imageUrl)
    .filter(Boolean);
}

/* =========================================================
   PRODUCT NORMALISERS
========================================================= */

function normalCategory(value) {
  const raw =
    String(
      value || "",
    ).trim();

  const key =
    raw.toLowerCase();

  if (
    key.includes(
      "baby boy",
    )
  ) {
    return "Baby Boy";
  }

  if (
    key.includes(
      "baby girl",
    )
  ) {
    return "Baby Girl";
  }

  if (
    key.includes(
      "infant boy",
    )
  ) {
    return "Infant Boys";
  }

  if (
    key.includes(
      "infant girl",
    )
  ) {
    return "Infant Girls";
  }

  if (
    key === "infants" ||
    key === "infant"
  ) {
    return "Infant Boys";
  }

  if (
    key.includes(
      "women",
    ) ||
    key.includes(
      "womens",
    )
  ) {
    return "Womens";
  }

  if (
    key === "girls" ||
    key.includes(
      " girl",
    )
  ) {
    return "Girls";
  }

  if (
    key === "boys" ||
    key.includes(
      " boy",
    ) ||
    key.includes(
      "kid",
    )
  ) {
    return "Boys";
  }

  if (
    key.includes(
      "unisex",
    )
  ) {
    return "Unisex";
  }

  if (
    key.includes(
      "men",
    ) ||
    key === "male"
  ) {
    return "Men";
  }

  return approvedCategories.includes(
    raw,
  )
    ? raw
    : "Unisex";
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
  const raw =
    String(
      product?.productType ||
        product?.collection ||
        "",
    ).trim();

  const source = [
    raw,
    product?.collection,
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
      "hoodie",
    ) &&
    (
      source.includes(
        "jogger",
      ) ||
      source.includes(
        "track pant",
      )
    ) &&
    source.includes(
      "set",
    )
  ) {
    return "Hoodie & Track Pant Set";
  }

  if (
    (
      source.includes(
        "t-shirt",
      ) ||
      source.includes(
        "tshirt",
      ) ||
      source.includes(
        "tee",
      )
    ) &&
    (
      source.includes(
        "jogger",
      ) ||
      source.includes(
        "track pant",
      )
    ) &&
    source.includes(
      "set",
    )
  ) {
    return "T-Shirt & Track Pant Set";
  }

  if (
    source.includes(
      "co-ord",
    ) ||
    source.includes(
      "coord",
    )
  ) {
    return "Co-ord Set";
  }

  if (
    source.includes(
      "3 piece",
    )
  ) {
    return "3 Piece Set";
  }

  if (
    source.includes(
      "2 piece",
    ) ||
    source.includes(
      "kids-set",
    ) ||
    source.includes(
      "kids set",
    )
  ) {
    return "2 Piece Set";
  }

  if (
    source.includes(
      "full sleeve",
    ) &&
    (
      source.includes(
        "t-shirt",
      ) ||
      source.includes(
        "tshirt",
      )
    )
  ) {
    return "Full Sleeve T-Shirt";
  }

  if (
    source.includes(
      "polo",
    )
  ) {
    return "Polo T-Shirt";
  }

  if (
    source.includes(
      "tank",
    )
  ) {
    return "Tank Top";
  }

  if (
    source.includes(
      "zip",
    ) &&
    source.includes(
      "hood",
    )
  ) {
    return "Zipper Hoodie";
  }

  if (
    source.includes(
      "hood",
    )
  ) {
    return "Hoodie";
  }

  if (
    source.includes(
      "sweat",
    )
  ) {
    return "Sweatshirt";
  }

  if (
    source.includes(
      "jacket",
    )
  ) {
    return "Jacket";
  }

  if (
    source.includes(
      "track",
    )
  ) {
    return "Track Pant";
  }

  if (
    source.includes(
      "jog",
    )
  ) {
    return "Jogger";
  }

  if (
    source.includes(
      "jean",
    ) ||
    source.includes(
      "trouser",
    )
  ) {
    return "Trouser";
  }

  if (
    source.includes(
      "cargo",
    )
  ) {
    return "Cargo Pant";
  }

  if (
    source.includes(
      "legging",
    )
  ) {
    return "Legging";
  }

  if (
    source.includes(
      "short",
    )
  ) {
    return "Shorts";
  }

  if (
    source.includes(
      "skirt",
    )
  ) {
    return "Skirt";
  }

  if (
    source.includes(
      "dress",
    )
  ) {
    return "Dress";
  }

  if (
    source.includes(
      "romper",
    )
  ) {
    return "Romper";
  }

  if (
    source.includes(
      "bodysuit",
    )
  ) {
    return "Bodysuit";
  }

  if (
    source.includes(
      "sleepsuit",
    )
  ) {
    return "Sleepsuit";
  }

  if (
    source.includes(
      "dungaree",
    )
  ) {
    return "Dungaree";
  }

  if (
    source.includes(
      "infant",
    )
  ) {
    return "Infant Set";
  }

  if (
    source.includes(
      "baby",
    )
  ) {
    return "Baby Set";
  }

  if (
    source.includes(
      "shirt",
    ) &&
    !source.includes(
      "t-shirt",
    ) &&
    !source.includes(
      "tshirt",
    )
  ) {
    return "Shirt";
  }

  if (
    source.includes(
      "top",
    )
  ) {
    return "Top";
  }

  if (
    source.includes(
      "t-shirt",
    ) ||
    source.includes(
      "tshirt",
    ) ||
    source.includes(
      "tee",
    )
  ) {
    return "T-Shirt";
  }

  return approvedProductTypes.includes(
    raw,
  )
    ? raw
    : "T-Shirt";
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

function normalColor(product) {
  const explicit =
    String(
      product?.color ||
        product?.colour ||
        "",
    ).trim();

  if (explicit) {
    const match =
      approvedColors.find(
        (color) =>
          color.value.toLowerCase() ===
          explicit.toLowerCase(),
      );

    if (match) {
      return match.value;
    }
  }

  const source = [
    product?.productName,
    product?.description,
    product?.styleCode,
    product?.collection,
  ]
    .map((value) =>
      String(
        value || "",
      ).toLowerCase(),
    )
    .join(" ");

  const aliases = [
    [
      "Navy Blue",
      [
        "navy blue",
        "navy",
      ],
    ],
    [
      "Black",
      [
        "black",
      ],
    ],
    [
      "White",
      [
        "white",
        "off white",
        "off-white",
        "cream",
      ],
    ],
    [
      "Blue",
      [
        "blue",
        "teal",
      ],
    ],
    [
      "Green",
      [
        "green",
        "olive",
      ],
    ],
    [
      "Grey",
      [
        "grey",
        "gray",
        "charcoal",
      ],
    ],
    [
      "Red",
      [
        "red",
        "maroon",
        "burgundy",
      ],
    ],
    [
      "Brown",
      [
        "brown",
        "tan",
        "beige",
      ],
    ],
  ];

  for (
    const [
      name,
      terms,
    ] of aliases
  ) {
    if (
      terms.some(
        (term) =>
          source.includes(
            term,
          ),
      )
    ) {
      return name;
    }
  }

  return "";
}

/* =========================================================
   FIREBASE PRODUCTS
========================================================= */

function uploadedItems(
  products,
) {
  return products
    .filter(
      (product) =>
        product &&
        product.published ===
          true &&
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
      ) => {
        const images =
          imageList(
            product,
          );

        return {
          id:
            product.id ||
            `catalog-${index}`,

          source:
            "catalog",

          brand:
            product.brand ||
            "",

          label:
            product.brand ||
            "ZEAL",

          category:
            normalCategory(
              product.category,
            ),

          productType:
            normalType(
              product,
            ),

          wearStyle:
            normalWearStyle(
              product,
            ),

          collection:
            normalCollection(
              product,
            ),

          color:
            normalColor(
              product,
            ),

          productName:
            product.productName ||
            product.brand ||
            "Product",

          image:
            images[0] ||
            "",

          imageCandidates:
            images,

          alt:
            product.productName ||
            product.styleCode ||
            "ZEAL Product",

          trending:
            product.trending ===
            true,

          sortOrder:
            typeof product.sortOrder ===
            "number"
              ? product.sortOrder
              : index,

          product,
        };
      },
    )
    .sort(
      (a, b) => {
        if (
          a.trending !==
          b.trending
        ) {
          return a.trending
            ? -1
            : 1;
        }

        return (
          a.sortOrder -
          b.sortOrder
        );
      },
    );
}

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
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

function Chevron({
  left = false,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${
        left
          ? "rotate-180"
          : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

const ProductImage =
  memo(function ProductImage({
    src,
    fallback = [],
    alt,
    eager = false,
  }) {
    const sources =
      useMemo(
        () =>
          [
            src,
            ...fallback,
          ]
            .filter(Boolean)
            .filter(
              (
                value,
                index,
                array,
              ) =>
                array.indexOf(
                  value,
                ) ===
                index,
            ),
        [
          src,
          fallback,
        ],
      );

    const [
      sourceIndex,
      setSourceIndex,
    ] = useState(0);

    useEffect(() => {
      setSourceIndex(0);
    }, [src]);

    if (
      !sources[
        sourceIndex
      ]
    ) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#f1f1f1] text-[10px] uppercase text-[#999]">
          Image unavailable
        </div>
      );
    }

    return (
      <img
        src={
          sources[
            sourceIndex
          ]
        }
        alt={alt}
        loading={
          eager
            ? "eager"
            : "lazy"
        }
        decoding="async"
        onError={() =>
          setSourceIndex(
            (current) =>
              current + 1,
          )
        }
        className="h-full w-full object-cover"
      />
    );
  });

/* =========================================================
   FILTER GROUP
========================================================= */

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  visibleCount = 6,
  searchable = true,
  renderOption,
}) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    filterQuery,
    setFilterQuery,
  ] = useState("");

  const filteredOptions =
    useMemo(() => {
      const query =
        filterQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return options;
      }

      return options.filter(
        (option) =>
          String(
            option.label ||
              option.value ||
              "",
          )
            .toLowerCase()
            .includes(query),
      );
    }, [
      options,
      filterQuery,
    ]);

  const shownOptions =
    expanded ||
    filterQuery
      ? filteredOptions
      : filteredOptions.slice(
          0,
          visibleCount,
        );

  const remaining =
    Math.max(
      filteredOptions.length -
        visibleCount,
      0,
    );

  return (
    <section className="border-b border-[#e7e7e7] px-6 py-7">

      <div className="flex items-center justify-between gap-3">

        <h3 className="text-[14px] font-bold uppercase tracking-[.03em] text-[#2d3340]">
          {title}
        </h3>

        {searchable &&
          options.length >
            visibleCount && (
            <button
              type="button"
              aria-label={`Search ${title}`}
              onClick={() => {
                setSearchOpen(
                  (current) =>
                    !current,
                );

                if (
                  searchOpen
                ) {
                  setFilterQuery(
                    "",
                  );
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f6] text-[#697083] transition hover:bg-[#ececef]"
            >
              <SearchIcon />
            </button>
          )}

      </div>

      {searchOpen && (
        <div className="mt-4 flex items-center gap-2 border border-[#e2e2e2] bg-white px-3 py-2.5">

          <SearchIcon />

          <input
            autoFocus
            value={
              filterQuery
            }
            onChange={(
              event,
            ) =>
              setFilterQuery(
                event.target
                  .value,
              )
            }
            placeholder={`Search ${title.toLowerCase()}`}
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
          />

          {filterQuery && (
            <button
              type="button"
              onClick={() =>
                setFilterQuery(
                  "",
                )
              }
              className="text-[#999]"
            >
              ×
            </button>
          )}

        </div>
      )}

      <div className="mt-5 space-y-4">

        {shownOptions.map(
          (option) => {
            const checked =
              selected.includes(
                option.value,
              );

            return (
              <label
                key={
                  option.value
                }
                className="flex cursor-pointer items-center justify-between gap-4 text-[14px] text-[#535965]"
              >

                <span className="flex min-w-0 items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      checked
                    }
                    onChange={() =>
                      onToggle(
                        option.value,
                      )
                    }
                    className="h-[18px] w-[18px] shrink-0 accent-black"
                  />

                  {renderOption
                    ? renderOption(
                        option,
                      )
                    : (
                      <span className="truncate">
                        {
                          option.label
                        }
                      </span>
                    )}

                </span>

                <span className="shrink-0 text-[12px] text-[#9b9fa7]">
                  (
                  {
                    option.count
                  }
                  )
                </span>

              </label>
            );
          },
        )}

        {!filterQuery &&
          remaining >
            0 && (
            <button
              type="button"
              onClick={() =>
                setExpanded(
                  (current) =>
                    !current,
                )
              }
              className="pt-1 text-[14px] font-medium text-[#ff4264] transition hover:text-[#db294c]"
            >
              {expanded
                ? "Show less"
                : `+ ${remaining} more`}
            </button>
          )}

        {filterQuery &&
          shownOptions.length ===
            0 && (
            <p className="text-[12px] text-[#9b9fa7]">
              No matches found.
            </p>
          )}

      </div>

    </section>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  item,
  index,
  active,
  onChange,
}) {
  const images =
    item.imageCandidates
      ?.length
      ? item.imageCandidates
      : [
          item.image,
        ];

  const current =
    Math.min(
      active || 0,
      Math.max(
        0,
        images.length - 1,
      ),
    );

  const go = (
    event,
    direction,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onChange(
      item.id,
      (
        current +
        direction +
        images.length
      ) %
        images.length,
    );
  };

  const body = (
    <>
      <div className="group relative aspect-[.78] overflow-hidden bg-[#eee]">

        <ProductImage
          src={
            images[
              current
            ] ||
            item.image
          }
          fallback={
            images
          }
          alt={
            item.alt
          }
          eager={
            index <
            10
          }
        />

        {images.length >
          1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(
                event,
              ) =>
                go(
                  event,
                  -1,
                )
              }
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 opacity-0 shadow transition group-hover:opacity-100"
            >
              <Chevron left />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={(
                event,
              ) =>
                go(
                  event,
                  1,
                )
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 opacity-0 shadow transition group-hover:opacity-100"
            >
              <Chevron />
            </button>
          </>
        )}

      </div>

      <div className="px-1 pb-2 pt-4">

        <h3 className="text-[15px] font-bold uppercase text-[#2a303b]">
          {item.brand ||
            item.label ||
            "ZEAL"}
        </h3>

        <p className="mt-1 text-[12px] text-[#8a8f97]">
          {item.productType ||
            "T-Shirt"}{" "}
          ·{" "}
          {item.category ||
            "Lifestyle"}
        </p>

        <p className="mt-3 text-[12px] font-semibold text-[#686e78]">
          {item.product
            ?.styleCode ||
            item.productName}
        </p>

      </div>
    </>
  );

  if (
    item.product?.id
  ) {
    return (
      <Link
        to={`/products/${encodeURIComponent(
          item.product.id,
        )}`}
        state={{
          product:
            item.product,
          fromProducts:
            true,
        }}
        className="min-w-0"
      >
        {body}
      </Link>
    );
  }

  return (
    <article className="min-w-0">
      {body}
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ProductShopPage() {
  const [
    activeBanner,
    setActiveBanner,
  ] = useState(0);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    brands,
    setBrands,
  ] = useState(
    defaultBrands,
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
    query,
    setQuery,
  ] = useState("");

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    brandSel,
    setBrandSel,
  ] = useState([]);

  const [
    types,
    setTypes,
  ] = useState([]);

  const [
    wearStyles,
    setWearStyles,
  ] = useState([]);

  const [
    collectionsSel,
    setCollectionsSel,
  ] = useState([]);

  const [
    colors,
    setColors,
  ] = useState([]);

  const [
    activeImages,
    setActiveImages,
  ] = useState({});

  /* =======================================================
     FIREBASE LOAD
  ======================================================= */

  const refreshCatalogue =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
        if (!silent) {
          setCatalogueLoading(
            true,
          );
        }

        try {
          const data =
            await loadCatalogue();

          setProducts(
            Array.isArray(
              data?.products,
            )
              ? data.products
              : [],
          );

          setBrands(
            Array.isArray(
              data?.brands,
            ) &&
              data.brands.length
              ? data.brands
              : defaultBrands,
          );

          setCatalogueError(
            "",
          );
        } catch (error) {
          console.error(
            "Unable to load Firebase catalogue:",
            error,
          );

          setCatalogueError(
            error?.message ||
              "Unable to load live catalogue.",
          );
        } finally {
          if (!silent) {
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

    const handleVisibility =
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
      handleVisibility,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
    };
  }, [
    refreshCatalogue,
  ]);

  /* =======================================================
     HERO ROTATION
  ======================================================= */

  useEffect(() => {
    const id =
      window.setInterval(
        () => {
          if (
            !document.hidden
          ) {
            setActiveBanner(
              (value) =>
                (
                  value + 1
                ) %
                heroBanners.length,
            );
          }
        },
        7000,
      );

    return () =>
      window.clearInterval(
        id,
      );
  }, []);

  /* =======================================================
     FIREBASE PUBLIC PRODUCTS
  ======================================================= */

  const all =
    useMemo(
      () =>
        uploadedItems(
          products,
        ),
      [
        products,
      ],
    );

  const count = (
    field,
    value,
  ) =>
    all.filter(
      (item) =>
        String(
          item[
            field
          ] || "",
        ).toLowerCase() ===
        String(
          value,
        ).toLowerCase(),
    ).length;

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const categoryOptions =
    useMemo(
      () =>
        approvedCategories.map(
          (value) => ({
            value,
            label:
              value,
            count:
              count(
                "category",
                value,
              ),
          }),
        ),
      [
        all,
      ],
    );

  const brandOptions =
    useMemo(() => {
      const merged = [];
      const seen =
        new Set();

      const addBrand =
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

          merged.push(
            clean,
          );
        };

      brands.forEach(
        addBrand,
      );

      all.forEach(
        (item) =>
          addBrand(
            item.brand,
          ),
      );

      return merged.map(
        (value) => ({
          value,
          label:
            value.toUpperCase(),
          count:
            count(
              "brand",
              value,
            ),
        }),
      );
    }, [
      all,
      brands,
    ]);

  const typeOptions =
    useMemo(
      () =>
        approvedProductTypes.map(
          (value) => ({
            value,
            label:
              value,
            count:
              count(
                "productType",
                value,
              ),
          }),
        ),
      [
        all,
      ],
    );

  const collectionOptions =
    useMemo(
      () =>
        approvedCollections.map(
          (value) => ({
            value,
            label:
              value,
            count:
              count(
                "collection",
                value,
              ),
          }),
        ),
      [
        all,
      ],
    );

  const wearStyleOptions =
    useMemo(
      () =>
        [
          "Casual Wear",
          "Street Wear",
          "Sportswear",
          "Activewear",
        ].map(
          (value) => ({
            value,
            label:
              value,
            count:
              count(
                "wearStyle",
                value,
              ),
          }),
        ),
      [
        all,
      ],
    );

  const colorOptions =
    useMemo(
      () =>
        approvedColors.map(
          (color) => ({
            value:
              color.value,
            label:
              color.value,
            hex:
              color.hex,
            count:
              count(
                "color",
                color.value,
              ),
          }),
        ),
      [
        all,
      ],
    );

  /* =======================================================
     FILTERING
  ======================================================= */

  const visible =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      return all.filter(
        (item) => {
          const categoryOk =
            !categories.length ||
            categories.includes(
              item.category,
            );

          const brandOk =
            !brandSel.length ||
            brandSel.includes(
              item.brand,
            );

          const typeOk =
            !types.length ||
            types.includes(
              item.productType,
            );

          const wearOk =
            !wearStyles.length ||
            wearStyles.includes(
              item.wearStyle,
            );

          const collectionOk =
            !collectionsSel.length ||
            collectionsSel.includes(
              item.collection,
            );

          const colorOk =
            !colors.length ||
            colors.includes(
              item.color,
            );

          const searchOk =
            !search ||
            [
              item.brand,
              item.productName,
              item.productType,
              item.category,
              item.product
                ?.styleCode,
              item.collection,
              item.wearStyle,
              item.product
                ?.description,
            ].some(
              (value) =>
                String(
                  value || "",
                )
                  .toLowerCase()
                  .includes(
                    search,
                  ),
            );

          return (
            categoryOk &&
            brandOk &&
            typeOk &&
            wearOk &&
            collectionOk &&
            colorOk &&
            searchOk
          );
        },
      );
    }, [
      all,
      query,
      categories,
      brandSel,
      types,
      wearStyles,
      collectionsSel,
      colors,
    ]);

  const toggle = (
    setter,
    value,
  ) =>
    setter(
      (current) =>
        current.includes(
          value,
        )
          ? current.filter(
              (item) =>
                item !==
                value,
            )
          : [
              ...current,
              value,
            ],
    );

  const clear = () => {
    setCategories([]);
    setBrandSel([]);
    setTypes([]);
    setWearStyles([]);
    setCollectionsSel([]);
    setColors([]);
    setQuery("");
  };

  const filtered =
    categories.length ||
    brandSel.length ||
    types.length ||
    wearStyles.length ||
    collectionsSel.length ||
    colors.length ||
    query.trim();

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-white text-[#171717]">

      {/* ===============================================
          HERO
      =============================================== */}

      <section className="relative overflow-hidden bg-[#111]">

        <div className="relative w-full h-auto bg-[#111]">

          {heroBanners.map(
            (
              banner,
              index,
            ) => (
              <img
                key={
                  banner.id
                }
                src={bannerImagePath(
                  banner.file,
                )}
                alt={
                  banner.alt
                }
                loading={
                  index ===
                  0
                    ? "eager"
                    : "lazy"
                }
                decoding="async"
                className={`block w-full h-auto transition-opacity duration-500 ${
                  index ===
                  activeBanner
                    ? "relative opacity-100"
                    : "absolute inset-0 opacity-0"
                }`}
              />
            ),
          )}

        </div>

      </section>

      {/* ===============================================
          MYNTRA-STYLE PRODUCT AREA
      =============================================== */}

      <section className="border-t border-[#e5e5e5]">

        <div className="mx-auto flex max-w-[1920px]">

          {/* ===========================================
              SIDEBAR FILTERS
          =========================================== */}

          <aside className="catalog-filter-scroll hidden w-[278px] shrink-0 self-start border-r border-[#e4e4e4] bg-white lg:sticky lg:top-[80px] lg:block lg:h-[calc(100vh-80px)] lg:overflow-y-auto">

            <FilterGroup
              title="Categories"
              options={
                categoryOptions
              }
              selected={
                categories
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setCategories,
                  value,
                )
              }
              visibleCount={
                6
              }
            />

            <FilterGroup
              title="Brand"
              options={
                brandOptions
              }
              selected={
                brandSel
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setBrandSel,
                  value,
                )
              }
              visibleCount={
                6
              }
            />

            <FilterGroup
              title="Collections"
              options={
                collectionOptions
              }
              selected={
                collectionsSel
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setCollectionsSel,
                  value,
                )
              }
              visibleCount={
                4
              }
            />

            <FilterGroup
              title="Product Types"
              options={
                typeOptions
              }
              selected={
                types
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setTypes,
                  value,
                )
              }
              visibleCount={
                6
              }
            />

            <FilterGroup
              title="Wear Style"
              options={
                wearStyleOptions
              }
              selected={
                wearStyles
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setWearStyles,
                  value,
                )
              }
              visibleCount={
                2
              }
              searchable={
                false
              }
            />

            <FilterGroup
              title="Color"
              options={
                colorOptions
              }
              selected={
                colors
              }
              onToggle={(
                value,
              ) =>
                toggle(
                  setColors,
                  value,
                )
              }
              visibleCount={
                6
              }
              renderOption={(
                option,
              ) => (
                <span className="flex min-w-0 items-center gap-3">

                  <span
                    className="h-5 w-5 shrink-0 rounded-full border border-[#d7d7d7]"
                    style={{
                      backgroundColor:
                        option.hex,
                    }}
                  />

                  <span className="truncate">
                    {
                      option.label
                    }
                  </span>

                </span>
              )}
            />

          </aside>

          {/* ===========================================
              PRODUCT CONTENT
          =========================================== */}

          <div className="min-w-0 flex-1">

            <div className="sticky top-[80px] z-20 border-b border-[#e9e9e9] bg-white/95 px-5 py-5 backdrop-blur sm:px-7 lg:px-8">

              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                <div>

                  <h1 className="text-[22px] font-bold tracking-[-.02em] text-[#2d3340]">
                    Product Collections
                  </h1>

                  <p className="mt-1 text-[12px] text-[#9a9fa8]">
                    {catalogueLoading
                      ? "Syncing catalogue..."
                      : `${visible.length} styles found`}
                  </p>

                  {catalogueError && (
                    <button
                      type="button"
                      onClick={() =>
                        void refreshCatalogue()
                      }
                      className="mt-1 text-[11px] font-medium text-[#db3627] underline underline-offset-2"
                    >
                      Refresh catalogue
                    </button>
                  )}

                </div>

                <div className="flex w-full max-w-[560px] items-center gap-3 bg-[#f6f6f6] px-5 py-3.5">

                  <SearchIcon />

                  <input
                    value={
                      query
                    }
                    onChange={(
                      event,
                    ) =>
                      setQuery(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search products, brands and collections"
                    className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9da1a8]"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuery(
                          "",
                        )
                      }
                      className="text-lg text-[#8f949d]"
                    >
                      ×
                    </button>
                  )}

                </div>

              </div>

            </div>

            {/* =========================================
                ACTIVE FILTER BAR
            ========================================= */}

            {filtered && (
              <div className="flex items-center justify-between border-b border-[#ededed] px-5 py-3 sm:px-7 lg:px-8">

                <span className="text-[12px] text-[#777]">
                  Filters active
                </span>

                <button
                  type="button"
                  onClick={
                    clear
                  }
                  className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#db3627]"
                >
                  Clear all
                </button>

              </div>
            )}

            {/* =========================================
                PRODUCT GRID
            ========================================= */}

            {visible.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 px-5 py-6 sm:grid-cols-3 sm:px-7 md:grid-cols-4 lg:px-8 xl:grid-cols-5">

                {visible.map(
                  (
                    item,
                    index,
                  ) => (
                    <ProductCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      index={
                        index
                      }
                      active={
                        activeImages[
                          item.id
                        ] ||
                        0
                      }
                      onChange={(
                        id,
                        value,
                      ) =>
                        setActiveImages(
                          (
                            current,
                          ) => ({
                            ...current,
                            [
                              id
                            ]:
                              value,
                          }),
                        )
                      }
                    />
                  ),
                )}

              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center px-6 text-center">

                <div>

                  <h2 className="text-2xl font-bold text-[#2d3340]">
                    {catalogueLoading
                      ? "Loading products..."
                      : "No products found."}
                  </h2>

                  {!catalogueLoading &&
                    filtered && (
                    <button
                      type="button"
                      onClick={
                        clear
                      }
                      className="mt-5 border border-black px-5 py-3 text-xs font-semibold uppercase"
                    >
                      Clear Filters
                    </button>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}