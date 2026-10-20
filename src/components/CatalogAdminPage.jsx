import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_BRANDS,
  deleteProductImages,
  deleteStoragePath,
  loadCatalogue,
  saveBrands,
  saveCatalogue,
  uploadProductImage,
} from "../services/catalogStorage";

const MAX_IMAGE_DIMENSION = 1200;
const IMAGE_QUALITY = 0.78;
const MAX_SINGLE_FILE_MB = 20;

const ANALYZE_ENDPOINT =
  import.meta.env
    .VITE_CATALOG_ANALYZE_ENDPOINT
    ?.trim() ||
  "/api/catalog-analyze";

const fixedCategories = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "infants", label: "Infants" },
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
    value: "special-wash-styles",
    label: "Special Wash Styles",
  },
];

const initialForm = {
  id: "",
  styleCode: "",
  productName: "",
  brand: "",
  category: "",
  collection: "",
  description: "",
  trending: false,
  published: true,
  images: [],
  createdAt: "",
};

function createImageId() {
  return `image-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function waitForPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function getOptionLabel(
  value,
  options,
) {
  return (
    options.find(
      (option) =>
        option.value === value,
    )?.label || ""
  );
}

function normalizeChoice(
  value,
  options,
) {
  const target =
    String(value || "")
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
    String(value || "")
      .trim()
      .toLowerCase();

  if (!target) {
    return "";
  }

  return (
    brands.find(
      (brand) =>
        String(brand)
          .toLowerCase() ===
        target,
    ) || ""
  );
}

function generateStyleCode(
  products,
) {
  const now =
    new Date();

  const year =
    String(
      now.getFullYear(),
    ).slice(-2);

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      now.getDate(),
    ).padStart(
      2,
      "0",
    );

  const prefix =
    `ZL-${year}${month}${day}`;

  const existingCodes =
    new Set(
      products.map(
        (product) =>
          String(
            product.styleCode ||
              "",
          ).toUpperCase(),
      ),
    );

  let sequence =
    products.length + 1;

  let code =
    `${prefix}-${String(
      sequence,
    ).padStart(
      3,
      "0",
    )}`;

  while (
    existingCodes.has(
      code,
    )
  ) {
    sequence += 1;

    code =
      `${prefix}-${String(
        sequence,
      ).padStart(
        3,
        "0",
      )}`;
  }

  return code;
}

function buildFallbackName({
  brand,
  category,
  collection,
  styleCode,
}) {
  const parts = [
    brand,
    getOptionLabel(
      category,
      fixedCategories,
    ),
    getOptionLabel(
      collection,
      fixedCollections,
    ),
  ].filter(Boolean);

  return (
    parts.join(" ") ||
    `Catalogue Style ${styleCode}`
  );
}

function buildFallbackDescription({
  brand,
  category,
  collection,
}) {
  const categoryLabel =
    getOptionLabel(
      category,
      fixedCategories,
    );

  const collectionLabel =
    getOptionLabel(
      collection,
      fixedCollections,
    );

  const brandText =
    brand
      ? `${brand} `
      : "";

  const productText =
    collectionLabel ||
    "apparel style";

  const audience =
    categoryLabel
      ? ` for ${categoryLabel}`
      : "";

  return `${brandText}${productText}${audience}. Product prepared for the ZEAL catalogue.`;
}

function formatBytes(
  bytes,
) {
  if (!bytes) {
    return "";
  }

  const kb =
    bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(
      0,
    )} KB`;
  }

  return `${(
    kb / 1024
  ).toFixed(1)} MB`;
}

function isSupportedImage(
  file,
) {
  const mimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const extensionMatch =
    /\.(jpe?g|png|webp)$/i.test(
      file.name || "",
    );

  return (
    mimeTypes.includes(
      file.type,
    ) ||
    extensionMatch
  );
}

function loadImageFromFile(
  file,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image();

      const objectUrl =
        URL.createObjectURL(
          file,
        );

      image.onload =
        () => {
          URL.revokeObjectURL(
            objectUrl,
          );

          resolve(image);
        };

      image.onerror =
        () => {
          URL.revokeObjectURL(
            objectUrl,
          );

          reject(
            new Error(
              `${file.name} could not be opened. Please use JPG, PNG or WebP.`,
            ),
          );
        };

      image.src =
        objectUrl;
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
        () => {
          resolve(
            String(
              reader.result ||
                "",
            ),
          );
        };

      reader.onerror =
        () => {
          reject(
            reader.error,
          );
        };

      reader.readAsDataURL(
        blob,
      );
    },
  );
}

async function compressImage(
  file,
) {
  if (
    !isSupportedImage(
      file,
    )
  ) {
    throw new Error(
      `${file.name}: Unsupported image format. Please use JPG, PNG or WebP.`,
    );
  }

  const sizeMb =
    file.size /
    (
      1024 *
      1024
    );

  if (
    sizeMb >
    MAX_SINGLE_FILE_MB
  ) {
    throw new Error(
      `${file.name} exceeds ${MAX_SINGLE_FILE_MB} MB.`,
    );
  }

  const image =
    await loadImageFromFile(
      file,
    );

  let width =
    image.naturalWidth;

  let height =
    image.naturalHeight;

  if (
    width >
      MAX_IMAGE_DIMENSION ||
    height >
      MAX_IMAGE_DIMENSION
  ) {
    const scale =
      Math.min(
        MAX_IMAGE_DIMENSION /
          width,

        MAX_IMAGE_DIMENSION /
          height,
      );

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
      "Image compression is not supported.",
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
      `Unable to compress ${file.name}.`,
    );
  }

  const preview =
    await blobToDataUrl(
      blob,
    );

  return {
    id:
      createImageId(),

    name:
      file.name,

    url:
      preview,

    analysisUrl:
      preview,

    pendingBlob:
      blob,

    storagePath:
      "",

    isCover:
      false,

    compressedSize:
      blob.size,

    width,

    height,
  };
}

async function analyzeProductImages({
  images,
  brands,
}) {
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
            images:
              images
                .slice(
                  0,
                  2,
                )
                .map(
                  (image) => ({
                    name:
                      image.name,

                    dataUrl:
                      image.analysisUrl ||
                      image.url,
                  }),
                ),

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
      JSON.parse(raw);
  } catch {
    payload = {
      error:
        raw ||
        "Invalid AI response.",
    };
  }

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        `AI analysis failed (${response.status}).`,
    );
  }

  return payload;
}

function cleanImage(
  image,
) {
  return {
    id:
      image.id,

    name:
      image.name || "",

    url:
      image.url,

    storagePath:
      image.storagePath || "",

    isCover:
      image.isCover ===
      true,

    compressedSize:
      image.compressedSize || 0,

    width:
      image.width || 0,

    height:
      image.height || 0,
  };
}

function CatalogAdminPage() {
  const fileInputRef =
    useRef(null);

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
    form,
    setForm,
  ] = useState(
    initialForm,
  );

  const [
    editingId,
    setEditingId,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    newBrandName,
    setNewBrandName,
  ] = useState("");

  const [
    showBrandManager,
    setShowBrandManager,
  ] = useState(false);

  const [
    showCategories,
    setShowCategories,
  ] = useState(false);

  const [
    showCollections,
    setShowCollections,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState(
    "Connecting to Firebase Storage...",
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    removedPaths,
    setRemovedPaths,
  ] = useState([]);

  useEffect(() => {
    let active =
      true;

    async function loadInitialData() {
      try {
        const data =
          await loadCatalogue();

        if (!active) {
          return;
        }

        setProducts(
          data.products,
        );

        setBrands(
          data.brands,
        );

        setStatus(
          "Firebase Storage connected",
        );
      } catch (error) {
        console.error(
          "Catalogue load failed:",
          error,
        );

        if (!active) {
          return;
        }

        setErrorMessage(
          error?.message ||
            "Unable to load catalogue.",
        );

        setStatus(
          "Storage connection failed",
        );
      } finally {
        if (active) {
          setIsLoading(
            false,
          );
        }
      }
    }

    void loadInitialData();

    return () => {
      active =
        false;
    };
  }, []);

  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return products;
      }

      return products.filter(
        (product) =>
          [
            product.styleCode,
            product.productName,
            product.brand,
            product.category,
            product.collection,
          ].some(
            (value) =>
              String(
                value || "",
              )
                .toLowerCase()
                .includes(
                  keyword,
                ),
          ),
      );
    }, [
      products,
      search,
    ]);

  const handleChange =
    (
      event,
    ) => {
      const {
        name,
        value,
        type,
        checked,
      } =
        event.target;

      setForm(
        (current) => ({
          ...current,

          [name]:
            type ===
            "checkbox"
              ? checked
              : value,
        }),
      );
    };

  const refreshCatalogue =
    async () => {
      setIsLoading(
        true,
      );

      setErrorMessage(
        "",
      );

      setStatus(
        "Refreshing Firebase Storage...",
      );

      try {
        const data =
          await loadCatalogue();

        setProducts(
          data.products,
        );

        setBrands(
          data.brands,
        );

        setStatus(
          "Firebase Storage connected",
        );
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Refresh failed.",
        );

        setStatus(
          "Refresh failed",
        );
      } finally {
        setIsLoading(
          false,
        );
      }
    };

  const openImagePicker =
    () => {
      if (
        isUploading ||
        isSaving
      ) {
        return;
      }

      const input =
        fileInputRef.current;

      if (!input) {
        setErrorMessage(
          "Image picker is unavailable. Please refresh the page.",
        );

        return;
      }

      /*
       * Reset before opening.
       * This also allows selecting the
       * same image again.
       */
      input.value = "";

      input.click();
    };

  const applyAnalysis =
    (
      analysis,
      styleCode,
    ) => {
      setForm(
        (current) => {
          const brand =
            normalizeBrand(
              analysis?.brand,
              brands,
            ) ||
            current.brand;

          const category =
            normalizeChoice(
              analysis?.category,
              fixedCategories,
            ) ||
            current.category;

          const collection =
            normalizeChoice(
              analysis?.collection,
              fixedCollections,
            ) ||
            current.collection;

          return {
            ...current,

            brand,

            category,

            collection,

            productName:
              String(
                analysis?.productName ||
                  "",
              ).trim() ||
              current.productName ||
              buildFallbackName({
                brand,
                category,
                collection,
                styleCode,
              }),

            description:
              String(
                analysis?.description ||
                  "",
              ).trim() ||
              current.description ||
              buildFallbackDescription({
                brand,
                category,
                collection,
              }),
          };
        },
      );
    };

  const shouldSkipLocalAi =
    () => {
      const configuredEndpoint =
        import.meta.env
          .VITE_CATALOG_ANALYZE_ENDPOINT
          ?.trim();

      return (
        import.meta.env.DEV &&
        !configuredEndpoint &&
        window.location.port ===
          "5173"
      );
    };

  const processFiles =
    async (
      incomingFiles,
    ) => {
      const files =
        Array.from(
          incomingFiles || [],
        );

      if (!files.length) {
        return;
      }

      console.log(
        "ZEAL selected images:",
        files,
      );

      setErrorMessage(
        "",
      );

      setIsUploading(
        true,
      );

      setIsDragging(
        false,
      );

      setStatus(
        `Preparing ${files.length} image${
          files.length === 1
            ? ""
            : "s"
        }...`,
      );

      try {
        const prepared =
          [];

        for (
          const file
          of files
        ) {
          const image =
            await compressImage(
              file,
            );

          prepared.push(
            image,
          );
        }

        const styleCode =
          form.styleCode ||
          generateStyleCode(
            products,
          );

        /*
         * IMPORTANT:
         * Preview + Style Code are
         * committed before AI starts.
         */
        setForm(
          (current) => {
            let images = [
              ...current.images,
              ...prepared,
            ];

            const alreadyHasCover =
              images.some(
                (image) =>
                  image.isCover,
              );

            if (
              !alreadyHasCover &&
              images.length > 0
            ) {
              images =
                images.map(
                  (
                    image,
                    index,
                  ) => ({
                    ...image,

                    isCover:
                      index === 0,
                  }),
                );
            }

            return {
              ...current,

              styleCode:
                current.styleCode ||
                styleCode,

              images,
            };
          },
        );

        setStatus(
          `${prepared.length} image${
            prepared.length === 1
              ? ""
              : "s"
          } ready`,
        );

        setIsUploading(
          false,
        );

        /*
         * Force browser to paint
         * image preview before AI.
         */
        await waitForPaint();

        /*
         * npm run dev on port 5173
         * does not run Vercel API.
         * Don't create a noisy 404.
         */
        if (
          shouldSkipLocalAi()
        ) {
          setStatus(
            "Images ready • AI waiting for Vercel dev",
          );

          setErrorMessage(
            "Image upload and preview are working. For AI auto-fill, run the project with npx vercel dev or configure VITE_CATALOG_ANALYZE_ENDPOINT.",
          );

          return;
        }

        setIsAnalyzing(
          true,
        );

        setStatus(
          "Images ready • Analyzing product...",
        );

        try {
          const analysis =
            await analyzeProductImages({
              images:
                prepared,

              brands,
            });

          applyAnalysis(
            analysis,
            styleCode,
          );

          setStatus(
            "Images ready • AI details filled",
          );
        } catch (error) {
          console.error(
            "AI analysis failed:",
            error,
          );

          applyAnalysis(
            {},
            styleCode,
          );

          setErrorMessage(
            `Image preview is working. AI analysis is unavailable: ${
              error?.message ||
              "Unknown error"
            }`,
          );

          setStatus(
            "Images ready • AI unavailable",
          );
        }
      } catch (error) {
        console.error(
          "Image processing failed:",
          error,
        );

        setErrorMessage(
          error?.message ||
            "Image processing failed.",
        );

        setStatus(
          "Image processing failed",
        );
      } finally {
        setIsUploading(
          false,
        );

        setIsAnalyzing(
          false,
        );

        setIsDragging(
          false,
        );
      }
    };

  const handleImageInput =
    async (
      event,
    ) => {
      const input =
        event.currentTarget;

      const selectedFiles =
        Array.from(
          input.files || [],
        );

      console.log(
        "Image picker change:",
        selectedFiles,
      );

      /*
       * We already copied the FileList,
       * so it is now safe to reset.
       */
      input.value = "";

      if (!selectedFiles.length) {
        return;
      }

      setStatus(
        `${selectedFiles.length} image${
          selectedFiles.length === 1
            ? ""
            : "s"
        } selected`,
      );

      await processFiles(
        selectedFiles,
      );
    };

  const handleDrop =
    async (
      event,
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const droppedFiles =
        Array.from(
          event.dataTransfer
            .files || [],
        );

      setIsDragging(
        false,
      );

      await processFiles(
        droppedFiles,
      );
    };

  const setCoverImage =
    (
      imageId,
    ) => {
      setForm(
        (current) => ({
          ...current,

          images:
            current.images.map(
              (image) => ({
                ...image,

                isCover:
                  image.id ===
                  imageId,
              }),
            ),
        }),
      );
    };

  const removeImage =
    (
      imageId,
    ) => {
      const removed =
        form.images.find(
          (image) =>
            image.id ===
            imageId,
        );

      if (
        removed?.storagePath
      ) {
        setRemovedPaths(
          (current) => [
            ...current,
            removed.storagePath,
          ],
        );
      }

      setForm(
        (current) => {
          let images =
            current.images.filter(
              (image) =>
                image.id !==
                imageId,
            );

          if (
            removed?.isCover &&
            images.length > 0
          ) {
            images =
              images.map(
                (
                  image,
                  index,
                ) => ({
                  ...image,

                  isCover:
                    index === 0,
                }),
              );
          }

          return {
            ...current,
            images,
          };
        },
      );
    };

  const moveImage =
    (
      imageIndex,
      direction,
    ) => {
      setForm(
        (current) => {
          const images = [
            ...current.images,
          ];

          const destination =
            imageIndex +
            direction;

          if (
            destination < 0 ||
            destination >=
              images.length
          ) {
            return current;
          }

          const [
            movingImage,
          ] =
            images.splice(
              imageIndex,
              1,
            );

          images.splice(
            destination,
            0,
            movingImage,
          );

          return {
            ...current,
            images,
          };
        },
      );
    };

  const resetForm =
    () => {
      setForm(
        initialForm,
      );

      setEditingId(
        "",
      );

      setRemovedPaths(
        [],
      );

      setErrorMessage(
        "",
      );

      setStatus(
        "Firebase Storage connected",
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  const addBrand =
    async () => {
      const brand =
        newBrandName
          .trim();

      if (!brand) {
        return;
      }

      const exists =
        brands.some(
          (item) =>
            item.toLowerCase() ===
            brand.toLowerCase(),
        );

      if (exists) {
        alert(
          "This brand already exists.",
        );

        return;
      }

      try {
        const saved =
          await saveBrands([
            ...brands,
            brand,
          ]);

        setBrands(
          saved,
        );

        setNewBrandName(
          "",
        );

        setForm(
          (current) => ({
            ...current,
            brand,
          }),
        );
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Unable to save brand.",
        );
      }
    };

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      if (
        !form.images.length
      ) {
        alert(
          "Please upload at least one product image.",
        );

        return;
      }

      if (
        !form.styleCode.trim()
      ) {
        alert(
          "Style Code is missing.",
        );

        return;
      }

      if (
        !form.productName.trim()
      ) {
        alert(
          "Product Name is required.",
        );

        return;
      }

      if (!form.brand) {
        alert(
          "Please select Brand.",
        );

        return;
      }

      if (!form.category) {
        alert(
          "Please select Category.",
        );

        return;
      }

      if (!form.collection) {
        alert(
          "Please select Collection.",
        );

        return;
      }

      const duplicateStyle =
        products.find(
          (product) =>
            String(
              product.styleCode ||
                "",
            )
              .trim()
              .toLowerCase() ===
              form.styleCode
                .trim()
                .toLowerCase() &&
            product.id !==
              editingId,
        );

      if (
        duplicateStyle
      ) {
        alert(
          `Style Code "${form.styleCode}" already exists.`,
        );

        return;
      }

      setIsSaving(
        true,
      );

      setErrorMessage(
        "",
      );

      setStatus(
        "Saving to Firebase Storage...",
      );

      const newlyUploadedPaths =
        [];

      try {
        const now =
          new Date().toISOString();

        const productId =
          editingId ||
          `product-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

        const savedImages =
          [];

        for (
          const image
          of form.images
        ) {
          if (
            image.pendingBlob
          ) {
            const uploaded =
              await uploadProductImage({
                productId,

                imageId:
                  image.id,

                blob:
                  image.pendingBlob,

                fileName:
                  image.name,
              });

            newlyUploadedPaths.push(
              uploaded.storagePath,
            );

            savedImages.push({
              ...cleanImage(
                image,
              ),

              url:
                uploaded.url,

              storagePath:
                uploaded.storagePath,
            });
          } else {
            savedImages.push(
              cleanImage(
                image,
              ),
            );
          }
        }

        const oldProduct =
          products.find(
            (product) =>
              product.id ===
              editingId,
          );

        const productData = {
          id:
            productId,

          styleCode:
            form.styleCode,

          productName:
            form.productName
              .trim(),

          brand:
            form.brand,

          category:
            form.category,

          collection:
            form.collection,

          productType:
            form.collection,

          description:
            form.description
              .trim(),

          trending:
            form.trending,

          published:
            form.published,

          images:
            savedImages,

          sortOrder:
            oldProduct
              ?.sortOrder ??
            products.length,

          createdAt:
            form.createdAt ||
            oldProduct
              ?.createdAt ||
            now,

          updatedAt:
            now,
        };

        const nextProducts =
          editingId
            ? products.map(
                (product) =>
                  product.id ===
                  editingId
                    ? productData
                    : product,
              )
            : [
                ...products,
                productData,
              ];

        const savedCatalogue =
          await saveCatalogue(
            nextProducts,
          );

        for (
          const path
          of removedPaths
        ) {
          await deleteStoragePath(
            path,
          );
        }

        setProducts(
          savedCatalogue,
        );

        const wasEditing =
          Boolean(
            editingId,
          );

        resetForm();

        setStatus(
          "Product saved to Firebase Storage",
        );

        alert(
          wasEditing
            ? "Product updated successfully."
            : "Product saved successfully.",
        );
      } catch (error) {
        console.error(
          "Product save failed:",
          error,
        );

        for (
          const path
          of newlyUploadedPaths
        ) {
          try {
            await deleteStoragePath(
              path,
            );
          } catch (
            cleanupError
          ) {
            console.error(
              "Cleanup failed:",
              cleanupError,
            );
          }
        }

        setErrorMessage(
          error?.message ||
            "Unable to save product.",
        );

        setStatus(
          "Save failed",
        );
      } finally {
        setIsSaving(
          false,
        );
      }
    };

  const handleEdit =
    (
      product,
    ) => {
      setEditingId(
        product.id,
      );

      setRemovedPaths(
        [],
      );

      setErrorMessage(
        "",
      );

      setForm({
        ...initialForm,
        ...product,

        images:
          product.images || [],
      });

      setStatus(
        `Editing ${product.styleCode}`,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  const handleDelete =
    async (
      product,
    ) => {
      if (
        !window.confirm(
          `Delete "${product.productName}"?`,
        )
      ) {
        return;
      }

      setErrorMessage(
        "",
      );

      setStatus(
        "Deleting product...",
      );

      try {
        const remaining =
          products.filter(
            (item) =>
              item.id !==
              product.id,
          );

        const saved =
          await saveCatalogue(
            remaining,
          );

        await deleteProductImages(
          product,
        );

        setProducts(
          saved,
        );

        if (
          editingId ===
          product.id
        ) {
          resetForm();
        }

        setStatus(
          "Product deleted",
        );
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Delete failed.",
        );

        setStatus(
          "Delete failed",
        );
      }
    };

  const updateProduct =
    async (
      productId,
      updater,
    ) => {
      setErrorMessage(
        "",
      );

      try {
        const next =
          products.map(
            (product) =>
              product.id ===
              productId
                ? {
                    ...updater(
                      product,
                    ),

                    updatedAt:
                      new Date().toISOString(),
                  }
                : product,
          );

        const saved =
          await saveCatalogue(
            next,
          );

        setProducts(
          saved,
        );

        setStatus(
          "Catalogue updated",
        );
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Unable to update product.",
        );
      }
    };

  const moveProduct =
    async (
      productId,
      direction,
    ) => {
      const index =
        products.findIndex(
          (product) =>
            product.id ===
            productId,
        );

      const destination =
        index + direction;

      if (
        index < 0 ||
        destination < 0 ||
        destination >=
          products.length
      ) {
        return;
      }

      const next = [
        ...products,
      ];

      const [
        moving,
      ] =
        next.splice(
          index,
          1,
        );

      next.splice(
        destination,
        0,
        moving,
      );

      const reordered =
        next.map(
          (
            product,
            sortOrder,
          ) => ({
            ...product,
            sortOrder,
          }),
        );

      try {
        const saved =
          await saveCatalogue(
            reordered,
          );

        setProducts(
          saved,
        );

        setStatus(
          "Product order updated",
        );
      } catch (error) {
        console.error(
          error,
        );

        setErrorMessage(
          error?.message ||
            "Unable to reorder products.",
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#f4f2ef] px-4 py-10 text-[#171717] sm:px-6 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-[1550px]">

        <div className="mb-8 border-b border-[#d8d3cd] pb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
            ZEAL
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Catalogue Management
          </h1>

          <p className="mt-3 text-sm text-[#706962]">
            Upload and manage products using Firebase Storage.
          </p>


          <div className="mt-5 flex flex-wrap gap-3">

            <span
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                errorMessage
                  ? "bg-[#fff0ed] text-[#b83222]"
                  : "bg-[#eaf7ed] text-[#23783b]"
              }`}
            >
              {isLoading
                ? "Connecting..."
                : status}
            </span>


            <button
              type="button"
              onClick={
                refreshCatalogue
              }
              disabled={
                isLoading
              }
              className="border border-[#171717] px-4 py-2 text-xs font-medium disabled:opacity-40"
            >
              Refresh Storage
            </button>

          </div>


          {errorMessage && (

            <div className="mt-4 rounded-lg border border-[#efc8c2] bg-[#fff6f4] p-4 text-sm leading-6 text-[#a52b1f]">
              {errorMessage}
            </div>

          )}

        </div>


        <div className="mb-6 grid gap-4 lg:grid-cols-3">

          <ManagerCard
            title="Brands"
            value={`${brands.length} brands`}
            onClick={() =>
              setShowBrandManager(
                (current) =>
                  !current,
              )
            }
          />

          <ManagerCard
            title="Categories"
            value="Men • Women • Boys • Girls • Infants"
            onClick={() =>
              setShowCategories(
                (current) =>
                  !current,
              )
            }
          />

          <ManagerCard
            title="Collections"
            value={`${fixedCollections.length} collections`}
            onClick={() =>
              setShowCollections(
                (current) =>
                  !current,
              )
            }
          />

        </div>


        {showBrandManager && (

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
              Brands
            </h2>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <input
                value={
                  newBrandName
                }
                onChange={(
                  event,
                ) =>
                  setNewBrandName(
                    event.target
                      .value,
                  )
                }
                placeholder="New brand name"
                className="catalog-input flex-1"
              />

              <button
                type="button"
                onClick={
                  addBrand
                }
                className="bg-[#171717] px-6 py-3 text-xs font-semibold uppercase text-white"
              >
                Add Brand
              </button>

            </div>


            <div className="mt-5 flex flex-wrap gap-2">

              {brands.map(
                (brand) => (

                  <span
                    key={
                      brand
                    }
                    className="border border-[#d8d3cd] bg-[#faf9f7] px-4 py-3 text-sm"
                  >
                    {brand}
                  </span>

                ),
              )}

            </div>

          </section>

        )}


        {showCategories && (

          <OptionPanel
            title="Available Categories"
            options={
              fixedCategories
            }
          />

        )}


        {showCollections && (

          <OptionPanel
            title="Available Collections"
            options={
              fixedCollections
            }
          />

        )}


        <form
          onSubmit={
            handleSubmit
          }
          className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:p-7 lg:p-9"
        >

          <div className="border-b border-[#e2ded9] pb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#db3627]">
              Product Upload
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {editingId
                ? "Edit Product"
                : "Add New Product"}
            </h2>

          </div>


          <div className="mt-8">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#db3627]">
              Product Images
            </p>


            <input
              ref={
                fileInputRef
              }
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={
                handleImageInput
              }
              className="hidden"
            />


            <div
              onDragEnter={(
                event,
              ) => {
                event.preventDefault();

                setIsDragging(
                  true,
                );
              }}
              onDragOver={(
                event,
              ) => {
                event.preventDefault();

                setIsDragging(
                  true,
                );
              }}
              onDragLeave={(
                event,
              ) => {
                event.preventDefault();

                setIsDragging(
                  false,
                );
              }}
              onDrop={
                handleDrop
              }
              className={`mt-5 flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed px-5 py-10 text-center transition ${
                isDragging
                  ? "border-[#db3627] bg-[#fff4f1]"
                  : "border-[#beb8b1] bg-[#faf9f7]"
              }`}
            >

              <button
                type="button"
                onClick={
                  openImagePicker
                }
                disabled={
                  isUploading ||
                  isSaving
                }
                className="flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#171717] text-2xl text-white">
                  +
                </span>

                <span className="mt-4 text-base font-semibold">

                  {isUploading
                    ? "Optimizing Images..."
                    : isAnalyzing
                      ? "Analyzing Product..."
                      : "Select Product Images"}

                </span>

                <span className="mt-2 text-xs text-[#888]">
                  Click here or drag & drop
                </span>

                <span className="mt-1 text-[10px] text-[#aaa]">
                  JPG • PNG • WebP
                </span>

              </button>

            </div>


            {form.images.length > 0 && (

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                {form.images.map(
                  (
                    image,
                    index,
                  ) => (

                    <div
                      key={
                        image.id
                      }
                      className="overflow-hidden rounded-xl border border-[#e2ded9] bg-white"
                    >

                      <div className="relative">

                        <img
                          src={
                            image.url
                          }
                          alt={
                            image.name ||
                            "Product"
                          }
                          className="aspect-[3/4] w-full object-cover"
                        />


                        {image.isCover && (

                          <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[9px] font-semibold uppercase text-white">
                            Cover
                          </span>

                        )}

                      </div>


                      <div className="p-2">

                        <p className="truncate text-[9px] text-[#777]">
                          {image.name}
                        </p>

                        <p className="mt-1 text-[9px] text-[#999]">
                          {formatBytes(
                            image.compressedSize,
                          )}
                        </p>


                        {!image.isCover && (

                          <button
                            type="button"
                            onClick={() =>
                              setCoverImage(
                                image.id,
                              )
                            }
                            className="mt-2 w-full border px-2 py-2 text-[9px] font-semibold uppercase"
                          >
                            Set Cover
                          </button>

                        )}


                        <div className="mt-2 grid grid-cols-2 gap-1">

                          <button
                            type="button"
                            disabled={
                              index === 0
                            }
                            onClick={() =>
                              moveImage(
                                index,
                                -1,
                              )
                            }
                            className="border p-2 text-xs disabled:opacity-20"
                          >
                            ←
                          </button>

                          <button
                            type="button"
                            disabled={
                              index ===
                              form.images
                                .length -
                                1
                            }
                            onClick={() =>
                              moveImage(
                                index,
                                1,
                              )
                            }
                            className="border p-2 text-xs disabled:opacity-20"
                          >
                            →
                          </button>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              image.id,
                            )
                          }
                          className="mt-2 w-full border border-red-300 px-2 py-2 text-[9px] font-semibold uppercase text-red-600"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ),
                )}

              </div>

            )}

          </div>


          <div className="mt-10 border-t border-[#e2ded9] pt-8">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#db3627]">
              Product Details
            </p>


            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">

              <Field
                label="Style Code"
              >
                <input
                  value={
                    form.styleCode
                  }
                  readOnly
                  placeholder="Auto Generated"
                  className="catalog-input cursor-not-allowed bg-[#f5f3f0] font-semibold"
                />
              </Field>


              <Field
                label="Product Name"
              >
                <input
                  name="productName"
                  value={
                    form.productName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Auto Filled"
                  className="catalog-input"
                />
              </Field>


              <Field
                label="Brand"
              >
                <select
                  name="brand"
                  value={
                    form.brand
                  }
                  onChange={
                    handleChange
                  }
                  className="catalog-input"
                >

                  <option value="">
                    Select Brand
                  </option>

                  {brands.map(
                    (brand) => (

                      <option
                        key={
                          brand
                        }
                        value={
                          brand
                        }
                      >
                        {brand}
                      </option>

                    ),
                  )}

                </select>
              </Field>


              <Field
                label="Category"
              >
                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  className="catalog-input"
                >

                  <option value="">
                    Select Category
                  </option>

                  {fixedCategories.map(
                    (item) => (

                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>

                    ),
                  )}

                </select>
              </Field>


              <Field
                label="Collection"
              >
                <select
                  name="collection"
                  value={
                    form.collection
                  }
                  onChange={
                    handleChange
                  }
                  className="catalog-input"
                >

                  <option value="">
                    Select Collection
                  </option>

                  {fixedCollections.map(
                    (item) => (

                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>

                    ),
                  )}

                </select>
              </Field>

            </div>


            <Field
              label="Description"
            >
              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows="4"
                placeholder="Description"
                className="catalog-input mt-5 resize-none"
              />
            </Field>

          </div>


          <div className="mt-7 flex flex-wrap gap-6 border-t border-[#e2ded9] pt-7">

            <label className="flex items-center gap-2 text-sm font-semibold">

              <input
                type="checkbox"
                name="trending"
                checked={
                  form.trending
                }
                onChange={
                  handleChange
                }
              />

              Trending
            </label>


            <label className="flex items-center gap-2 text-sm font-semibold">

              <input
                type="checkbox"
                name="published"
                checked={
                  form.published
                }
                onChange={
                  handleChange
                }
              />

              Published
            </label>

          </div>


          <div className="mt-8 flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={
                isSaving ||
                isUploading ||
                isAnalyzing
              }
              className="bg-[#171717] px-8 py-4 text-xs font-semibold uppercase text-white disabled:cursor-not-allowed disabled:opacity-40"
            >

              {isSaving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Save Product"}

            </button>


            <button
              type="button"
              onClick={
                resetForm
              }
              disabled={
                isSaving
              }
              className="border border-[#171717] px-8 py-4 text-xs font-semibold uppercase disabled:opacity-40"
            >
              Clear
            </button>

          </div>

        </form>


        <section className="mt-12">

          <div className="flex flex-col justify-between gap-4 border-b border-[#171717] pb-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#db3627]">
                Product Order
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Catalogue Products
              </h2>

            </div>


            <input
              type="search"
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search product..."
              className="catalog-input max-w-sm"
            />

          </div>


          {isLoading ? (

            <div className="mt-6 rounded-2xl bg-white p-8 text-sm text-[#777]">
              Loading catalogue...
            </div>

          ) : filteredProducts.length ===
            0 ? (

            <div className="mt-6 rounded-2xl bg-white p-8 text-sm text-[#777]">
              No catalogue products found.
            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {filteredProducts.map(
                (product) => {

                  const cover =
                    product.images?.find(
                      (image) =>
                        image.isCover,
                    ) ||
                    product.images?.[0];

                  const realIndex =
                    products.findIndex(
                      (item) =>
                        item.id ===
                        product.id,
                    );

                  return (

                    <article
                      key={
                        product.id
                      }
                      className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm lg:flex-row lg:items-center"
                    >

                      <div className="flex flex-1 items-center gap-4">

                        <div className="w-8 text-center text-lg font-semibold text-[#999]">
                          {realIndex + 1}
                        </div>


                        <div className="h-24 w-20 overflow-hidden rounded-lg bg-[#eee]">

                          {cover?.url && (

                            <img
                              src={
                                cover.url
                              }
                              alt={
                                product.productName
                              }
                              className="h-full w-full object-cover"
                            />

                          )}

                        </div>


                        <div className="min-w-0">

                          <div className="flex flex-wrap gap-2">

                            {product.trending && (

                              <span className="bg-[#fff0ed] px-2 py-1 text-[9px] font-semibold uppercase text-[#db3627]">
                                Trending
                              </span>

                            )}

                            <span className="bg-[#f1f1ee] px-2 py-1 text-[9px] font-semibold uppercase">

                              {product.published
                                ? "Published"
                                : "Hidden"}

                            </span>

                          </div>


                          <h3 className="mt-2 truncate font-semibold">
                            {product.productName}
                          </h3>

                          <p className="mt-1 text-xs text-[#777]">
                            {product.styleCode} · {product.brand}
                          </p>

                        </div>

                      </div>


                      <div className="flex flex-wrap gap-2">

                        <button
                          type="button"
                          disabled={
                            realIndex === 0
                          }
                          onClick={() =>
                            moveProduct(
                              product.id,
                              -1,
                            )
                          }
                          className="border px-4 py-3 text-xs disabled:opacity-20"
                        >
                          ↑
                        </button>


                        <button
                          type="button"
                          disabled={
                            realIndex ===
                            products.length -
                              1
                          }
                          onClick={() =>
                            moveProduct(
                              product.id,
                              1,
                            )
                          }
                          className="border px-4 py-3 text-xs disabled:opacity-20"
                        >
                          ↓
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              product,
                            )
                          }
                          className="border px-4 py-3 text-[10px] font-semibold uppercase"
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(
                              product.id,
                              (item) => ({
                                ...item,

                                trending:
                                  !item.trending,
                              }),
                            )
                          }
                          className="border px-4 py-3 text-[10px] font-semibold uppercase"
                        >

                          {product.trending
                            ? "Untrend"
                            : "Trending"}

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(
                              product.id,
                              (item) => ({
                                ...item,

                                published:
                                  !item.published,
                              }),
                            )
                          }
                          className="border px-4 py-3 text-[10px] font-semibold uppercase"
                        >

                          {product.published
                            ? "Hide"
                            : "Publish"}

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product,
                            )
                          }
                          className="border border-red-500 px-4 py-3 text-[10px] font-semibold uppercase text-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </article>

                  );
                },
              )}

            </div>

          )}

        </section>

      </div>


      <style>{`

        .catalog-input {
          width: 100%;
          min-height: 52px;
          border: 1px solid #d5d0ca;
          background: #ffffff;
          padding: 0.9rem 1rem;
          font-size: 0.875rem;
          color: #171717;
          outline: none;

          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background-color 220ms ease;
        }

        .catalog-input:focus {
          border-color: #171717;
          box-shadow: 0 0 0 1px #171717;
        }

        select.catalog-input {
          cursor: pointer;
        }

      `}</style>

    </main>
  );
}

function ManagerCard({
  title,
  value,
  onClick,
}) {
  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-2 text-xs text-[#777]">
          {value}
        </p>
      </div>

      <button
        type="button"
        onClick={
          onClick
        }
        className="mt-5 self-start border border-[#171717] px-4 py-3 text-[10px] font-semibold uppercase"
      >
        Manage
      </button>

    </div>
  );
}

function OptionPanel({
  title,
  options,
}) {
  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">

        {options.map(
          (option) => (

            <span
              key={
                option.value
              }
              className="border border-[#d8d3cd] bg-[#faf9f7] px-4 py-3 text-sm"
            >
              {option.label}
            </span>

          ),
        )}

      </div>

    </section>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">
        {label}
      </span>

      {children}

    </label>
  );
}

export default CatalogAdminPage;