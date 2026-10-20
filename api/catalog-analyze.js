const OPENAI_RESPONSES_URL =
  "https://api.openai.com/v1/responses";

/* =========================================================
   CORS
========================================================= */

const ALLOWED_ORIGINS = new Set([
  "https://zealgroups.in",
  "https://www.zealgroups.in",
  "https://rcloud-zeal-website.web.app",
  "https://rcloud-zeal-website.firebaseapp.com",
  "http://localhost:3000",
  "http://localhost:5173",
]);

function applyCors(req, res) {
  const origin =
    typeof req.headers?.origin === "string"
      ? req.headers.origin
      : "";

  if (
    origin &&
    ALLOWED_ORIGINS.has(origin)
  ) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin,
    );
  }

  res.setHeader(
    "Vary",
    "Origin",
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS",
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
  );

  res.setHeader(
    "Access-Control-Max-Age",
    "86400",
  );
}

/* =========================================================
   RESPONSE TEXT
========================================================= */

function getOutputText(data) {
  if (
    typeof data?.output_text ===
      "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  const texts = [];

  for (
    const item
    of data?.output || []
  ) {
    for (
      const content
      of item?.content || []
    ) {
      if (
        content?.type ===
          "output_text" &&
        typeof content?.text ===
          "string"
      ) {
        texts.push(
          content.text,
        );
      }
    }
  }

  return texts
    .join("\n")
    .trim();
}

/* =========================================================
   JSON PARSER
========================================================= */

function parseJsonOutput(text) {
  const cleaned =
    String(text || "")
      .replace(
        /^```json\s*/i,
        "",
      )
      .replace(
        /^```\s*/i,
        "",
      )
      .replace(
        /\s*```$/i,
        "",
      )
      .trim();

  try {
    return JSON.parse(
      cleaned,
    );
  } catch {
    const firstBrace =
      cleaned.indexOf("{");

    const lastBrace =
      cleaned.lastIndexOf("}");

    if (
      firstBrace >= 0 &&
      lastBrace >
        firstBrace
    ) {
      return JSON.parse(
        cleaned.slice(
          firstBrace,
          lastBrace + 1,
        ),
      );
    }

    throw new Error(
      "AI returned invalid JSON.",
    );
  }
}

/* =========================================================
   OPTIONS
========================================================= */

function stringifyOptions(
  options,
) {
  if (
    !Array.isArray(options)
  ) {
    return [];
  }

  return options
    .map((item) => {
      if (
        typeof item ===
          "string"
      ) {
        return item.trim();
      }

      return String(
        item?.label ||
          item?.value ||
          "",
      ).trim();
    })
    .filter(Boolean);
}

/* =========================================================
   BRAND MATCHING
========================================================= */

function normalizeBrandText(
  value,
) {
  return String(
    value || "",
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      "",
    );
}

function findBrandInsideText(
  text,
  allowedBrands,
) {
  const source =
    normalizeBrandText(
      text,
    );

  if (!source) {
    return "";
  }

  /*
   * Longest brand first.
   * Important for:
   * Ardeur
   * Ardeur Streetz
   * Ardeur Zeal in you
   */
  const sortedBrands = [
    ...allowedBrands,
  ].sort(
    (a, b) =>
      normalizeBrandText(
        b,
      ).length -
      normalizeBrandText(
        a,
      ).length,
  );

  for (
    const brand
    of sortedBrands
  ) {
    const normalizedBrand =
      normalizeBrandText(
        brand,
      );

    if (
      normalizedBrand &&
      source.includes(
        normalizedBrand,
      )
    ) {
      return brand;
    }
  }

  return "";
}

function matchAllowedBrand(
  aiBrand,
  allowedBrands,
) {
  if (
    !aiBrand ||
    !allowedBrands.length
  ) {
    return "";
  }

  const target =
    normalizeBrandText(
      aiBrand,
    );

  if (!target) {
    return "";
  }

  /*
   * Exact normalized match.
   * Example:
   * M&H -> mh
   * M H -> mh
   * K&K -> kk
   */
  const exact =
    allowedBrands.find(
      (brand) =>
        normalizeBrandText(
          brand,
        ) ===
        target,
    );

  if (exact) {
    return exact;
  }

  /*
   * Longest partial match.
   */
  const partial =
    findBrandInsideText(
      aiBrand,
      allowedBrands,
    );

  if (partial) {
    return partial;
  }

  return "";
}

/* =========================================================
   HANDLER
========================================================= */

export default async function handler(
  req,
  res,
) {
  applyCors(
    req,
    res,
  );

  res.setHeader(
    "Cache-Control",
    "no-store",
  );

  /*
   * Browser CORS preflight.
   */
  if (
    req.method === "OPTIONS"
  ) {
    return res
      .status(204)
      .end();
  }

  if (
    req.method !== "POST"
  ) {
    return res
      .status(405)
      .json({
        error:
          "Method not allowed.",
      });
  }

  const apiKey =
    process.env
      .OPENAI_API_KEY;

  const model =
    process.env
      .OPENAI_MODEL ||
    "gpt-6-luna";

  if (
    !apiKey ||
    apiKey.includes(
      "xxxxxxxx",
    )
  ) {
    return res
      .status(500)
      .json({
        error:
          "OPENAI_API_KEY is missing or invalid.",
      });
  }

  try {
    const body =
      typeof req.body ===
        "string"
        ? JSON.parse(
            req.body,
          )
        : req.body || {};

    const images =
      Array.isArray(
        body.images,
      )
        ? body.images.filter(
            (image) =>
              typeof image
                ?.dataUrl ===
                "string" &&
              image.dataUrl.startsWith(
                "data:image/",
              ),
          )
        : [];

    if (!images.length) {
      return res
        .status(400)
        .json({
          error:
            "No valid product images were received.",
        });
    }

    const brands =
      stringifyOptions(
        body.allowedBrands,
      );

    const categories =
      stringifyOptions(
        body.allowedCategories,
      );

    const collections =
      stringifyOptions(
        body.allowedCollections,
      );

    const fileNames =
      images
        .map(
          (
            image,
            index,
          ) =>
            `Image ${index + 1}: ${
              image.name ||
              "Unnamed image"
            }`,
        )
        .join("\n");

    /*
     * Filename is useful secondary
     * evidence if brand is present
     * in the exported file name.
     */
    const filenameBrand =
      findBrandInsideText(
        images
          .map(
            (image) =>
              image.name ||
              "",
          )
          .join(" "),
        brands,
      );

    const prompt = `
You are an expert fashion catalogue product analyst working for ZEAL.

Analyse the supplied garment images carefully.

Your job is to identify:

1. Product name
2. Brand
3. Category
4. Collection / garment type
5. Professional product description


IMAGE FILENAMES:

${fileNames}


ALLOWED BRANDS:

${brands.join(", ")}


ALLOWED CATEGORIES:

${categories.join(", ")}


ALLOWED COLLECTIONS:

${collections.join(", ")}


==============================
BRAND DETECTION — IMPORTANT
==============================

Actively inspect every supplied image for brand evidence.

Check:

- chest logos
- sleeve logos
- printed wordmarks
- embroidery
- neck labels
- woven labels
- hang tags
- waistband branding
- garment artwork
- printed typography
- visible brand symbols
- small logo marks
- filename clues

Use the image filename only as SECONDARY evidence.

If a brand is identified, return the EXACT spelling from the ALLOWED BRANDS list.

Pay special attention to these distinct brands/sub-brands:

- Ardeur
- Ardeur Zeal in you
- Ardeur Streetz

Do NOT automatically return "Ardeur" when the image actually indicates "Ardeur Zeal in you" or "Ardeur Streetz".

Also recognise punctuation variations such as:

- M&H
- M H
- MH

and:

- K&K
- K K
- KK

These should map back to the exact allowed brand spelling.

If there is not enough evidence to identify a brand reliably, return an empty string.

Never invent a brand.


==============================
PRODUCT NAME
==============================

Create a concise professional ecommerce-style product name.

Base it only on visible garment details.

Examples of useful visible attributes:

- oversized
- regular fit
- graphic
- printed
- solid
- zipper
- hoodie
- sweatshirt
- polo
- crew neck
- track pant
- jogger
- shorts
- co-ord set


==============================
CATEGORY
==============================

Choose the best match ONLY from the allowed category list.

Use:

- garment styling
- model presentation
- garment proportions
- visible design characteristics

Do not invent another category.


==============================
COLLECTION
==============================

Choose the exact garment type from the allowed collection list.

Examples:

T-shirt → T-Shirts
Polo → Polo T-Shirts
Hoodie → Hoodies
Sweatshirt → Sweatshirts
Track pant → Track Pants


==============================
DESCRIPTION
==============================

Write a concise professional catalogue description.

Include only visually supported details such as:

- garment type
- visible colour
- fit
- silhouette
- neckline
- sleeves
- artwork
- print
- wash effect
- visible construction details

Do NOT invent:

- fabric composition
- GSM
- price
- performance claims
- hidden features
- materials that cannot be identified visually


==============================
OUTPUT FORMAT
==============================

Return ONLY one valid JSON object.

Use exactly:

{
  "productName": "",
  "brand": "",
  "category": "",
  "collection": "",
  "description": ""
}

No markdown.
No explanation.
No text outside the JSON object.
`;

    const imageInputs =
      images
        .slice(
          0,
          2,
        )
        .map(
          (
            image,
            index,
          ) => ({
            type:
              "input_image",

            image_url:
              image.dataUrl,

            /*
             * First image gets high
             * detail because brand
             * logos can be small.
             */
            detail:
              index === 0
                ? "high"
                : "low",
          }),
        );

    const openAIResponse =
      await fetch(
        OPENAI_RESPONSES_URL,
        {
          method:
            "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              model,

              input: [
                {
                  role:
                    "user",

                  content: [
                    {
                      type:
                        "input_text",

                      text:
                        prompt,
                    },

                    ...imageInputs,
                  ],
                },
              ],

              max_output_tokens:
                500,
            }),
        },
      );

    const responseData =
      await openAIResponse.json();

    if (
      !openAIResponse.ok
    ) {
      console.error(
        "OpenAI API error:",
        responseData,
      );

      return res
        .status(
          openAIResponse.status,
        )
        .json({
          error:
            responseData
              ?.error
              ?.message ||
            "OpenAI API request failed.",
        });
    }

    const outputText =
      getOutputText(
        responseData,
      );

    if (!outputText) {
      return res
        .status(502)
        .json({
          error:
            "OpenAI returned an empty response.",
        });
    }

    const result =
      parseJsonOutput(
        outputText,
      );

    /*
     * Brand resolution priority:
     *
     * 1. Explicit filename brand
     * 2. AI brand field
     * 3. Brand mentioned elsewhere
     *    in AI output
     */
    const aiBrand =
      matchAllowedBrand(
        result?.brand,
        brands,
      );

    const outputBrand =
      findBrandInsideText(
        [
          result?.productName,
          result?.brand,
          result?.description,
        ].join(" "),
        brands,
      );

    const finalBrand =
      filenameBrand ||
      aiBrand ||
      outputBrand ||
      "";

    return res
      .status(200)
      .json({
        productName:
          String(
            result
              ?.productName ||
              "",
          ).trim(),

        brand:
          finalBrand,

        category:
          String(
            result
              ?.category ||
              "",
          ).trim(),

        collection:
          String(
            result
              ?.collection ||
              "",
          ).trim(),

        description:
          String(
            result
              ?.description ||
              "",
          ).trim(),
      });
  } catch (error) {
    console.error(
      "Catalogue analysis failed:",
      error,
    );

    return res
      .status(500)
      .json({
        error:
          error?.message ||
          "Catalogue analysis failed.",
      });
  }
}