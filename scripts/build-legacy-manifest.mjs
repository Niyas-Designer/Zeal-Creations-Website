import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const SOURCE_DIR = path.join(
  ROOT,
  "public",
  "Product images",
);

const OUTPUT_DIR = path.join(
  ROOT,
  "public",
  "legacy-migration",
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  "manifest.json",
);

const IMAGE_EXTENSIONS = new Set([
  ".webp",
  ".jpg",
  ".jpeg",
  ".png",
]);

const EXPECTED_COUNTS = {
  Ardeur: 38,
  Codez: 65,
  "Girls and Womens": 21,
  Fervoro: 20,
  infants: 12,
  "Acid wash": 10,
  Revisited: 7,
};

const APPROVED_BRAND_HINTS = {
  Ardeur: "Ardeur",
};

const CATEGORY_HINTS = {
  infants: "infants",
};

const COLLECTION_HINTS = {
  "Acid wash": "special-wash-styles",
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function naturalSort(a, b) {
  return a.localeCompare(
    b,
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    },
  );
}

function publicUrl(folder, fileName) {
  return `/Product%20images/${encodeURIComponent(
    folder,
  )}/${encodeURIComponent(fileName)}`;
}

async function getFolders() {
  const entries =
    await fs.readdir(
      SOURCE_DIR,
      {
        withFileTypes: true,
      },
    );

  return entries
    .filter(
      (entry) =>
        entry.isDirectory(),
    )
    .map(
      (entry) =>
        entry.name,
    )
    .sort(naturalSort);
}

async function getImages(folder) {
  const folderPath =
    path.join(
      SOURCE_DIR,
      folder,
    );

  const entries =
    await fs.readdir(
      folderPath,
      {
        withFileTypes: true,
      },
    );

  return entries
    .filter(
      (entry) => {
        if (
          !entry.isFile()
        ) {
          return false;
        }

        const extension =
          path.extname(
            entry.name,
          ).toLowerCase();

        return IMAGE_EXTENSIONS.has(
          extension,
        );
      },
    )
    .map(
      (entry) =>
        entry.name,
    )
    .sort(naturalSort);
}

async function buildManifest() {
  const folders =
    await getFolders();

  const products = [];
  const folderCounts = {};

  for (
    const folder
    of folders
  ) {
    const images =
      await getImages(
        folder,
      );

    folderCounts[folder] =
      images.length;

    for (
      let index = 0;
      index <
      images.length;
      index += 1
    ) {
      const fileName =
        images[index];

      const id =
        `legacy-${slugify(
          folder,
        )}-${String(
          index + 1,
        ).padStart(
          3,
          "0",
        )}-${slugify(
          fileName,
        )}`;

      products.push({
        id,

        sourceType:
          "legacy",

        sourceFolder:
          folder,

        sourceFile:
          fileName,

        sourceUrl:
          publicUrl(
            folder,
            fileName,
          ),

        brandHint:
          APPROVED_BRAND_HINTS[
            folder
          ] || "",

        categoryHint:
          CATEGORY_HINTS[
            folder
          ] || "",

        collectionHint:
          COLLECTION_HINTS[
            folder
          ] || "",

        migrationStatus:
          "pending",

        reviewStatus:
          "pending",

        published:
          false,
      });
    }
  }

  const total =
    products.length;

  const problems = [];

  if (total !== 173) {
    problems.push(
      `Expected 173 total images, found ${total}.`,
    );
  }

  for (
    const [
      folder,
      expected,
    ] of Object.entries(
      EXPECTED_COUNTS,
    )
  ) {
    const actual =
      folderCounts[
        folder
      ] || 0;

    if (
      actual !==
      expected
    ) {
      problems.push(
        `${folder}: expected ${expected}, found ${actual}.`,
      );
    }
  }

  if (
    problems.length
  ) {
    console.error(
      "\n❌ Legacy manifest validation failed:\n",
    );

    for (
      const problem
      of problems
    ) {
      console.error(
        `- ${problem}`,
      );
    }

    process.exitCode =
      1;

    return;
  }

  await fs.mkdir(
    OUTPUT_DIR,
    {
      recursive: true,
    },
  );

  const manifest = {
    version: 1,

    generatedAt:
      new Date().toISOString(),

    total,

    folderCounts,

    products,
  };

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      manifest,
      null,
      2,
    ),
    "utf8",
  );

  console.log("");
  console.log(
    "✅ LEGACY MANIFEST CREATED",
  );

  console.log(
    `✅ Total images: ${total}`,
  );

  console.log("");

  for (
    const [
      folder,
      count,
    ] of Object.entries(
      folderCounts,
    )
  ) {
    console.log(
      `✅ ${folder}: ${count}`,
    );
  }

  console.log("");

  console.log(
    `📄 ${path.relative(
      ROOT,
      OUTPUT_FILE,
    )}`,
  );

  console.log("");

  console.log(
    "🔥 READY FOR AI MIGRATION",
  );
}

buildManifest().catch(
  (error) => {
    console.error(
      "\n❌ Manifest creation failed:",
      error,
    );

    process.exitCode =
      1;
  },
);