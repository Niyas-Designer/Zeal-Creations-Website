import {
  Fragment,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getCachedCatalogue,
  subscribeCatalogue,
  loadCatalogue,
} from "../services/catalogStorage";
import { EMPTY_MASTERS, productMasterValue } from "../services/catalogMasters.js";
import { displayType, normalizeCategory, normalizeCategoryOptions, normalizeColor, productTypesOf, typeRank, typeSection } from "../utils/productFilters.js";

const PAGE_SIZE = 24;

/* =========================================================
   FILTER MASTER DATA
========================================================= */

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

// One comparison rule for counts, options and filtering: trimmed, case-insensitive.
const filterKey = (value) => String(value ?? "").trim().toLowerCase();

// Builds the lookup sets once per render, then one predicate serves both the
// visible list and the Product Type counts. `skip` leaves one group out.
function buildFilterSets({ categories, brandSel, types, wearStyles, collectionsSel, colors, query }) {
  const pick = (list) => (list.length ? new Set(list.map(filterKey)) : null);
  return {
    category: pick(categories), brand: pick(brandSel), type: pick(types), wear: pick(wearStyles),
    collection: pick(collectionsSel), color: pick(colors), search: query.trim().toLowerCase(),
  };
}
function matchesFilters(item, f, skip = "") {
  return (
    (!f.category || f.category.has(filterKey(item.category))) &&
    (!f.brand || f.brand.has(filterKey(item.brandValue))) &&
    (skip === "type" || !f.type || item.productTypes.some((type) => f.type.has(filterKey(type)))) &&
    (!f.wear || f.wear.has(filterKey(item.wearStyle))) &&
    (!f.collection || f.collection.has(filterKey(item.collection))) &&
    (!f.color || f.color.has(filterKey(item.color))) &&
    (!f.search || item.searchText.includes(f.search))
  );
}

/* =========================================================
   FIREBASE PRODUCTS
========================================================= */

function uploadedItems(
  products,
  masters,
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

          brandValue: productMasterValue(product, "brands", masters),
          brand: masters.brands.find((option) => option.value === productMasterValue(product, "brands", masters))?.label || product.brand || "",

          label:
            masters.brands.find((option) => option.value === product.brand)?.label || product.brand || "ZEAL",

          category:
            normalizeCategory(product, masters),

          productTypes:
            productTypesOf(product, masters),

          wearStyle:
            productMasterValue(product, "wearStyles", masters),

          collection:
            productMasterValue(product, "collections", masters),

          color:
            normalizeColor(
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
    .map((item) => ({
      ...item,
      productType: displayType(item.productTypes),
      searchText: [
        item.productTypes.join(" "),
        item.brand,
        item.productName,
        item.productType,
        item.category,
        item.product?.styleCode,
        item.collection,
        item.wearStyle,
        item.product?.description,
      ].map((value) => String(value || "").toLowerCase()).join("\n"),
    }))
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

    // Failure count is tied to the src it belongs to, so a new src starts at 0
    // without resetting state from an effect.
    const [failed, setFailed] = useState({ src, count: 0 });
    const sourceIndex = failed.src === src ? failed.count : 0;

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
          setFailed((current) => ({
            src,
            count: (current.src === src ? current.count : 0) + 1,
          }))
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
              className="zeal-control flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f6] text-[#697083] transition hover:bg-[#ececef]"
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
              className="zeal-text-button text-[#999]"
            >
              ×
            </button>
          )}

        </div>
      )}

      <div className="mt-5 space-y-4">

        {shownOptions.map(
          (option, optionIndex) => {
            const checked =
              selected.includes(
                option.value,
              );
            const showSection =
              !filterQuery && option.section &&
              option.section !== shownOptions[optionIndex - 1]?.section;
            return (
              <Fragment key={option.value}>
              {showSection && (
                <p className="pt-1 text-[11px] font-semibold uppercase tracking-[.08em] text-[#9b9fa7]">
                  {option.section}
                </p>
              )}
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
              </Fragment>
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
              className="zeal-text-button pt-1 text-[14px] font-medium text-[#ff4264] transition hover:text-[#db294c]"
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

function ProductCardBase({
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
              className="zeal-control absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 opacity-0 shadow transition group-hover:opacity-100"
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
              className="zeal-control absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 opacity-0 shadow transition group-hover:opacity-100"
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

const ProductCard = memo(ProductCardBase);

export default function ProductShopPage() {
  const [products, setProducts] = useState(() => getCachedCatalogue()?.products || []);
  const [masters, setMasters] = useState(() => getCachedCatalogue()?.masters || EMPTY_MASTERS);
  const [catalogueLoading, setCatalogueLoading] = useState(() => !getCachedCatalogue());

  const [
    catalogueError,
    setCatalogueError,
  ] = useState("");

  const [queryInput, setQueryInput] = useState("");
  const query = useDeferredValue(queryInput);

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

  const refreshCatalogue = useCallback(async ({ maxAge = 0 } = {}) => {
    try {
      await loadCatalogue({ maxAge });
      setCatalogueError("");
    } catch (error) {
      setCatalogueError(error?.message || "Unable to load live catalogue.");
    } finally {
      setCatalogueLoading(false);
    }
  }, []);

  useEffect(() => {
    const applyCatalogue = (data) => {
      setProducts(data.products);
      setMasters(data.masters);
      setCatalogueLoading(false);
      setCatalogueError("");
    };
    const unsubscribe = subscribeCatalogue(applyCatalogue);
    const cached = getCachedCatalogue();
    if (cached) applyCatalogue(cached);
    // Immediate cached render; the network refresh never clears existing products.
    void refreshCatalogue({ maxAge: 5000 });
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refreshCatalogue({ maxAge: 60000 });
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshCatalogue]);

  /* =======================================================
     FIREBASE PUBLIC PRODUCTS
  ======================================================= */

  const all =
    useMemo(
      () =>
        uploadedItems(
          products,
          masters,
        ),
      [
        products,
        masters,
      ],
    );

  const counts = useMemo(() => {
    const fields = ["category", "collection", "wearStyle", "brandValue", "color"];
    const result = Object.fromEntries(fields.map((field) => [field, new Map()]));
    all.forEach((item) => fields.forEach((field) => {
      const key = filterKey(item[field]);
      if (key) result[field].set(key, (result[field].get(key) || 0) + 1);
    }));
    return result;
  }, [all]);

  // Product Type counts follow the other active filters (Men, Boys, brand...),
  // so a type's count is exactly what selecting it will show.
  const typeCounts = useMemo(() => {
    const sets = buildFilterSets({ categories, brandSel, types: [], wearStyles, collectionsSel, colors, query });
    const result = new Map();
    all.forEach((item) => {
      if (!matchesFilters(item, sets, "type")) return;
      new Set(item.productTypes.map(filterKey)).forEach((key) => result.set(key, (result.get(key) || 0) + 1));
    });
    return result;
  }, [all, categories, brandSel, wearStyles, collectionsSel, colors, query]);

  const typeOptionList = useMemo(() => {
    const selectedKeys = new Set(types.map(filterKey));
    const labels = new Map();
    all.forEach((item) => item.productTypes.forEach((type) => labels.set(filterKey(type), type)));
    return [...labels]
      .map(([key, value]) => ({ value, label: value, section: typeSection(value), count: typeCounts.get(key) || 0 }))
      .filter((option) => option.count > 0 || selectedKeys.has(filterKey(option.value)))
      .sort((a, b) => typeRank(a.value) - typeRank(b.value) || a.value.localeCompare(b.value));
  }, [all, types, typeCounts]);

  const masterOptions = useMemo(() => {
    const fields = { categories: "category", collections: "collection", wearStyles: "wearStyle", brands: "brandValue" };
    const rest = Object.fromEntries(Object.entries(fields).map(([key, field]) => {
      const base = key === "categories" ? normalizeCategoryOptions(masters[key]) : masters[key];
      const configured = base
        .map((option) => ({ ...option, label: key === "brands" ? option.label.toUpperCase() : option.label, count: counts[field].get(filterKey(option.value)) || 0 }));
      // Any value present on a published product but missing from the saved
      // masters still gets a checkbox, so no product is unreachable by filters.
      const known = new Set(configured.map((option) => filterKey(option.value)));
      const extras = new Map();
      all.forEach((item) => {
        const value = String(item[field] || "").trim();
        const valueKey = filterKey(value);
        if (!valueKey || known.has(valueKey) || extras.has(valueKey)) return;
        const label = key === "brands" ? String(item.brand || value).toUpperCase() : value;
        extras.set(valueKey, { value, label, count: counts[field].get(valueKey) || 0 });
      });
      return [key, [...configured, ...extras.values()]];
    }));
    return { ...rest, productTypes: typeOptionList };
  }, [all, masters, counts, typeOptionList]);

  const categoryOptions = masterOptions.categories;
  const typeOptions = masterOptions.productTypes;
  const collectionOptions = masterOptions.collections;
  const wearStyleOptions = masterOptions.wearStyles;
  const brandOptions = masterOptions.brands;

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
              counts.color.get(filterKey(color.value)) || 0,
          }),
        ),
      [
        counts,
      ],
    );

  /* =======================================================
     FILTERING
  ======================================================= */

  const visible = useMemo(() => {
    const sets = buildFilterSets({ categories, brandSel, types, wearStyles, collectionsSel, colors, query });
    return all.filter((item) => matchesFilters(item, sets));
  }, [all, query, categories, brandSel, types, wearStyles, collectionsSel, colors]);

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
    setQueryInput("");
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
     PROGRESSIVE RENDERING
     Only a page of cards is mounted at a time; more load as the
     visitor scrolls. Resets automatically when any filter changes.
  ======================================================= */
  const signature = [categories, brandSel, types, wearStyles, collectionsSel, colors]
    .map((list) => list.join("|"))
    .join("~") + `~${query.trim().toLowerCase()}`;
  const [pageState, setPageState] = useState({ signature: "", count: PAGE_SIZE });
  const shownCount = pageState.signature === signature ? pageState.count : PAGE_SIZE;
  const hasMore = shownCount < visible.length;
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    setPageState((current) => ({
      signature,
      count: (current.signature === signature ? current.count : PAGE_SIZE) + PAGE_SIZE,
    }));
  }, [signature]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!hasMore || !node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some((entry) => entry.isIntersecting)) loadMore(); },
      { rootMargin: "900px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, shownCount, loadMore]);

  const handleImageChange = useCallback((id, value) => {
    setActiveImages((current) => ({ ...current, [id]: value }));
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-white text-[#171717]">

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
              visibleCount={14}
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
                      className="zeal-text-button mt-1 text-[11px] font-medium text-[#db3627] underline underline-offset-2"
                    >
                      Refresh catalogue
                    </button>
                  )}

                </div>

                <div className="flex w-full max-w-[560px] items-center gap-3 bg-[#f6f6f6] px-5 py-3.5">

                  <SearchIcon />

                  <input
                    value={
                      queryInput
                    }
                    onChange={(
                      event,
                    ) =>
                      setQueryInput(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search products, brands and collections"
                    className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9da1a8]"
                  />

                  {queryInput && (
                    <button
                      type="button"
                      onClick={() =>
                        setQueryInput(
                          "",
                        )
                      }
                      className="zeal-text-button text-lg text-[#8f949d]"
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
                  className="zeal-text-button text-[11px] font-semibold uppercase tracking-[.08em] text-[#db3627]"
                >
                  Clear all
                </button>

              </div>
            )}

            {/* =========================================
                PRODUCT GRID
            ========================================= */}

            {visible.length ? (
              <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 px-5 py-6 sm:grid-cols-3 sm:px-7 md:grid-cols-4 lg:px-8 xl:grid-cols-5">

                {visible.slice(0, shownCount).map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    index={index}
                    active={activeImages[item.id] || 0}
                    onChange={handleImageChange}
                  />
                ))}
              </div>
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center px-5 pb-12 pt-2">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="zeal-button border border-black px-6 py-3 text-xs font-semibold uppercase"
                  >
                    Load more ({visible.length - shownCount} remaining)
                  </button>
                </div>
              )}
              </>
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
                      className="zeal-button mt-5 border border-black px-5 py-3 text-xs font-semibold uppercase"
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