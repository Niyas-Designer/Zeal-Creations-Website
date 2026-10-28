import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const PRODUCT_STORAGE_KEY = "zeal_catalog_products";
const CATEGORY_STORAGE_KEY = "zeal_catalog_categories";
const PRODUCT_CACHE_KEY = "__zeal_catalog_products_cache__";

const defaultCategories = [
  { value: "ardeur", label: "Ardeur" },
  { value: "codez", label: "Codez" },
  { value: "fervoro", label: "Fervoro" },
  { value: "girls-womens", label: "Girls & Womens" },
  { value: "infants", label: "Infants" },
  { value: "acid-wash", label: "Acid Wash" },
  { value: "revisited", label: "Revisited" },
];

function readJsonStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) ?? fallback;
  } catch (error) {
    console.error(`Unable to read ${key}`, error);
    return fallback;
  }
}

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY) || "[]";
    const existing = window[PRODUCT_CACHE_KEY];

    if (existing?.raw === raw && Array.isArray(existing.value)) {
      return existing.value;
    }

    const parsed = JSON.parse(raw);
    const value = Array.isArray(parsed) ? parsed : [];
    window[PRODUCT_CACHE_KEY] = { raw, value };
    return value;
  } catch (error) {
    console.error("Unable to read catalogue products", error);
    return [];
  }
}

function getStoredCategories() {
  const categories = readJsonStorage(CATEGORY_STORAGE_KEY, defaultCategories);
  return Array.isArray(categories) ? categories : defaultCategories;
}

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.src || "";
}

function getCoverImage(product) {
  if (!Array.isArray(product?.images) || product.images.length === 0) return "";
  const cover = product.images.find((image) => image?.isCover === true);
  return getImageUrl(cover || product.images[0]);
}

function formatFallbackLabel(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeProduct = location.state?.product;
  const routeProductMatches =
    routeProduct && String(routeProduct.id) === String(productId);

  const [products, setProducts] = useState(() => {
    if (routeProductMatches) return [routeProduct];
    return getStoredProducts();
  });

  const [categories, setCategories] = useState(() => getStoredCategories());
  const [storageLoaded, setStorageLoaded] = useState(() => !routeProductMatches);

  useEffect(() => {
    let cancelled = false;

    const refreshData = () => {
      if (cancelled) return;
      const storedProducts = getStoredProducts();
      setProducts(storedProducts);
      setCategories(getStoredCategories());
      setStorageLoaded(true);
    };

    if (routeProductMatches) {
      const runLater = () => refreshData();

      if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(runLater, { timeout: 400 });
        return () => {
          cancelled = true;
          window.cancelIdleCallback?.(idleId);
        };
      }

      const timer = window.setTimeout(runLater, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    refreshData();
    return () => {
      cancelled = true;
    };
  }, [productId, routeProductMatches]);

  useEffect(() => {
    const refreshData = () => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
      setStorageLoaded(true);
    };

    window.addEventListener("storage", refreshData);
    window.addEventListener("zeal-catalog-updated", refreshData);

    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("zeal-catalog-updated", refreshData);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productId]);

  const product = useMemo(() => {
    if (routeProductMatches) return routeProduct;

    return products.find(
      (item) => String(item.id) === String(productId),
    );
  }, [products, productId, routeProduct, routeProductMatches]);

  const categoryLabel = useMemo(() => {
    if (!product?.category) return "";

    const category = categories.find((item) => item.value === product.category);
    return category?.label || formatFallbackLabel(product.category);
  }, [product, categories]);

  const images = useMemo(() => {
    if (!Array.isArray(product?.images) || product.images.length === 0) return [];

    const cover = product.images.find((image) => image?.isCover === true);
    if (!cover) return product.images;

    return [cover, ...product.images.filter((image) => image.id !== cover.id)];
  }, [product]);

  const marketplaceLinks = useMemo(() => {
    if (!product) return [];

    return [
      { name: "Amazon", url: product.amazon },
      { name: "Myntra", url: product.myntra },
      { name: "Flipkart", url: product.flipkart },
    ].filter((platform) => Boolean(platform.url));
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product || products.length <= 1) return [];

    const currentType = String(product.productType || "").trim().toLowerCase();
    const currentCategory = String(product.category || "").trim().toLowerCase();
    const currentBrand = String(product.brand || "").trim().toLowerCase();

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          item.published !== false &&
          Array.isArray(item.images) &&
          item.images.length > 0,
      )
      .map((item) => {
        const itemType = String(item.productType || "").trim().toLowerCase();
        const itemCategory = String(item.category || "").trim().toLowerCase();
        const itemBrand = String(item.brand || "").trim().toLowerCase();

        let score = 0;
        if (currentType && itemType === currentType) score += 3;
        if (currentCategory && itemCategory === currentCategory) score += 2;
        if (currentBrand && itemBrand === currentBrand) score += 1;

        return { product: item, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        const orderA =
          typeof a.product.sortOrder === "number"
            ? a.product.sortOrder
            : Number.MAX_SAFE_INTEGER;
        const orderB =
          typeof b.product.sortOrder === "number"
            ? b.product.sortOrder
            : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      })
      .slice(0, 8)
      .map((item) => item.product);
  }, [product, products]);

  const goBackToProducts = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/products", { replace: true });
  };

  if (!product && !storageLoaded) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dedbd6] border-t-[#171717]" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f5f2] px-4 py-20 text-[#171717] sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
              ZEAL
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Product not found.
            </h1>
            <button
              type="button"
              onClick={goBackToProducts}
              className="zeal-button mt-8 inline-flex bg-[#171717] px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-150 hover:bg-[#db3627]"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#e7e3de] bg-[#f7f5f2]">
        <div className="mx-auto max-w-[1650px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#807970] sm:text-xs">
            <button
              type="button"
              onClick={goBackToProducts}
              className="zeal-text-button transition-colors duration-150 hover:text-[#db3627]"
            >
              Products
            </button>

            {product.brand && (
              <>
                <span>/</span>
                <span>{product.brand}</span>
              </>
            )}

            {product.styleCode && (
              <>
                <span>/</span>
                <span className="text-[#171717]">{product.styleCode}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-[1650px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)] lg:gap-12 xl:gap-16">
            <div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {images.map((image, index) => {
                  const imageUrl = getImageUrl(image);
                  const isLastOdd = images.length % 2 !== 0 && index === images.length - 1;

                  return (
                    <div
                      key={image?.id || `${imageUrl}-${index}`}
                      className={`overflow-hidden bg-[#f4f2ef] ${
                        isLastOdd ? "col-span-2" : ""
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${product.productName || product.styleCode} ${index + 1}`}
                          className={`block w-full object-cover ${
                            isLastOdd ? "max-h-[900px] object-contain" : "aspect-[4/5]"
                          }`}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="auto"
                          fetchPriority={index === 0 ? "high" : "auto"}
                        />
                      ) : (
                        <div className="aspect-[4/5] bg-[#f1efec]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {product.brand && (
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
                  {product.brand}
                </p>
              )}

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl xl:text-[3.6rem] xl:leading-[1.02]">
                {product.productName}
              </h1>

              {product.styleCode && (
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#817970]">
                  Style Code: {product.styleCode}
                </p>
              )}

              <div className="mt-8 border-y border-[#e2ded9]">
                {categoryLabel && <InfoRow label="Category" value={categoryLabel} />}
                {product.productType && (
                  <InfoRow label="Product Type" value={product.productType} />
                )}
                {product.collection && (
                  <InfoRow label="Collection" value={product.collection} />
                )}
                <InfoRow
                  label="Images"
                  value={`${images.length} ${images.length === 1 ? "Image" : "Images"}`}
                />
              </div>

              {product.description && (
                <div className="border-b border-[#e2ded9] py-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#514c46]">
                    Product Details
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#6c655e]">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="border-b border-[#e2ded9] py-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#514c46]">
                  Available On
                </p>

                {marketplaceLinks.length > 0 ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {marketplaceLinks.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noreferrer"
                        className="zeal-button flex min-h-12 items-center justify-center border border-[#171717] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:bg-[#171717] hover:text-white"
                      >
                        {platform.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[#817a73]">
                    Marketplace links are currently unavailable.
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled
                className="zeal-button mt-6 w-full cursor-not-allowed bg-[#ece9e5] px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#98918a]"
              >
                Direct Purchase Currently Unavailable
              </button>

              <div className="mt-8 border-t border-[#e2ded9] pt-7">
                <button
                  type="button"
                  onClick={goBackToProducts}
                  className="zeal-text-button inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 hover:text-[#db3627]"
                >
                  <span>←</span>
                  Back to Products
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#e2ded9] bg-[#f7f5f2] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1650px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
                  Product Gallery
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  More from this style.
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="zeal-text-button hidden text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 hover:text-[#db3627] sm:block"
              >
                View All
              </button>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const coverImage = getCoverImage(relatedProduct);

                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${encodeURIComponent(relatedProduct.id)}`}
                    state={{ product: relatedProduct, fromProducts: true }}
                    className="group text-left"
                  >
                    <div className="overflow-hidden bg-white">
                      <img
                        src={coverImage}
                        alt={relatedProduct.productName || relatedProduct.styleCode}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="auto"
                      />
                    </div>

                    <div className="pt-4">
                      {relatedProduct.brand && (
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#db3627] sm:text-[10px]">
                          {relatedProduct.brand}
                        </p>
                      )}
                      <h3 className="mt-1 text-sm font-semibold sm:text-base">
                        {relatedProduct.productName}
                      </h3>
                      {relatedProduct.styleCode && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.09em] text-[#817a73]">
                          Style {relatedProduct.styleCode}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex min-h-[56px] items-center justify-between gap-6 border-b border-[#e2ded9] py-4 last:border-b-0">
      <span className="text-sm text-[#817a73]">{label}</span>
      <span className="text-right text-sm font-semibold text-[#171717]">{value}</span>
    </div>
  );
}

export default ProductDetailPage;
