import { Link } from "react-router-dom";

const partnerNames = [
  "Carrefour",
  "Lotto",
  "Pantaloons",
  "Van Heusen",
  "Blue Age",
  "Rina",
  "Marvel",
  "Egatex",
  "R&B",
  "Louis Philippe",
  "Reebok",
  "Umbro",
  "Al Shika",
];

const brandProfiles = [
  {
    id: "ardeur",
    index: "01",
    name: "Ardeur",
    category: "Modern Casualwear",
    logo: "Ardeur Logo.jpg",
    hero: "Banner 2.jpg",
    line: "Own the vibe with clean everyday essentials.",
    copy:
      "ARDEUR brings casualwear into a sharper space with graphic tees, relaxed fits, and wardrobe staples built for confident daily style.",
    images: [
      "/Product%20images/Ardeur/0W2A9686.webp",
      "/Product%20images/Ardeur/0W2A9720.webp",
      "/Product%20images/Ardeur/0W2A9812.webp",
    ],
  },
  {
    id: "ardeur-zeal",
    index: "02",
    name: "Ardeur Zeal In You",
    category: "Active & Performance",
    logo: "Ardeur Zeal in you Logo.jpg",
    hero: "Banner 3.jpg",
    line: "Built for comfort. Made to move.",
    copy:
      "The Zeal In You line focuses on movement, flexibility, and easy active styling for customers who live between training, travel, and everyday comfort.",
    images: [
      "/Product%20images/Ardeur/0W2A0032.webp",
      "/Product%20images/Ardeur/0W2A0052.webp",
      "/Product%20images/Ardeur/0W2A0066.webp",
    ],
  },
  {
    id: "codez",
    index: "03",
    name: "Codez",
    category: "Kidswear",
    logo: "Codez logo.jpg",
    hero: "Banner 4.jpg",
    line: "Play, explore, and grow in colour.",
    copy:
      "CODEZ is designed for kids with energy: graphic tees, easy joggers, soft co-ords, and practical silhouettes made for real play.",
    images: [
      "/Product%20images/Codez/1.webp",
      "/Product%20images/Codez/24.webp",
      "/Product%20images/Codez/48.webp",
    ],
  },
  {
    id: "fervoro",
    index: "04",
    name: "Fervoro",
    category: "Men's Polo Collection",
    logo: "Fervoro Logo.jpg",
    hero: "Banner 5.jpg",
    line: "Premium polo energy for modern wardrobes.",
    copy:
      "FERVORO blends refined polo styling with strong outdoor campaign language, creating a confident menswear identity for elevated casual dressing.",
    images: [
      "/Product%20images/Fervoro/1.webp",
      "/Product%20images/Fervoro/8.webp",
      "/Product%20images/Fervoro/14.webp",
    ],
  },
  {
    id: "fervoro-italy",
    index: "05",
    name: "Fervoro Italy",
    category: "Refined Menswear",
    logo: "Fervoro Italy Logo.jpg",
    hero: "Banner 5.jpg",
    line: "A cleaner, sharper take on premium casuals.",
    copy:
      "FERVORO ITALY extends the brand language into polished styling, strong collar stories, and premium casualwear with a European-inspired finish.",
    images: [
      "/Product%20images/Fervoro/3.webp",
      "/Product%20images/Fervoro/10.webp",
      "/Product%20images/Fervoro/20.webp",
    ],
  },
  {
    id: "ardeur-street",
    index: "06",
    name: "Ardeur Street",
    category: "Streetwear",
    logo: "Ardeur Street.jpg",
    hero: "Banner 1.jpg",
    line: "Streetwear with an edge.",
    copy:
      "ARDEUR STREET brings washed finishes, strong graphics, and expressive attitude into a youth-focused streetwear line.",
    images: [
      "/Product%20images/Acid%20wash/1.webp",
      "/Product%20images/Acid%20wash/4.webp",
      "/Product%20images/Acid%20wash/8.webp",
    ],
  },
  {
    id: "revisited",
    index: "07",
    name: "Revisited",
    category: "Old Trends Reworked",
    logo: "Revisited Logo.jpg",
    hero: "Banner 8.jpg",
    line: "Old trends, renewed for now.",
    copy:
      "REVISITED turns familiar fashion references into fresh essentials with updated fits, bold edits, and easy urban comfort.",
    images: [
      "/Product%20images/Revisited/1.webp",
      "/Product%20images/Revisited/4.webp",
      "/Product%20images/Revisited/7.webp",
    ],
  },
];

const logoPath = (file) => `/Brands%20Logos/${encodeURIComponent(file)}`;
const bannerPath = (file) => `/optimized/Product%20banners/${encodeURIComponent(file)}`;

function ImageFrame({ src, alt, className = "", eager = false }) {
  return (
    <div
      className={`overflow-hidden border border-[#ead8d8] bg-white ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        fetchPriority={eager ? "high" : "auto"}
      />
    </div>
  );
}

function BrandLogo({ brand }) {
  return (
    <div className="flex min-h-28 items-center justify-center border border-[#ead8d8] bg-white p-5">
      <img
        src={logoPath(brand.logo)}
        alt={`${brand.name} logo`}
        className="max-h-20 max-w-[220px] object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function BrandCard({ brand, index }) {
  const reverse = index % 2 === 1;

  return (
    <section
      id={brand.id}
      className="scroll-mt-28 border-t border-[#ead8d8] bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">
        <div
          className={`grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
                  Brand {brand.index}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#171717]/55">
                  {brand.category}
                </p>
              </div>

              <div className="mt-7">
                <BrandLogo brand={brand} />
              </div>

              <h2 className="mt-8 max-w-[12ch] text-[clamp(3rem,8vw,7.2rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-[#171717]">
                {brand.name}
              </h2>

              <p className="mt-6 max-w-xl text-2xl font-semibold leading-tight text-[#db3627] sm:text-3xl">
                {brand.line}
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#625b5b] sm:text-base">
                {brand.copy}
              </p>
            </div>

            <div className="grid grid-cols-3 border border-[#ead8d8]">
              {["Logo", "Campaign", "Products"].map((item) => (
                <div
                  key={item}
                  className="border-r border-[#ead8d8] px-4 py-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#171717]/55 last:border-r-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="group grid gap-3">
            <ImageFrame
              src={bannerPath(brand.hero)}
              alt={`${brand.name} campaign banner`}
              className="aspect-[1900/850]"
              eager={index === 0}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {brand.images.map((image, imageIndex) => (
                <ImageFrame
                  key={image}
                  src={image}
                  alt={`${brand.name} product visual ${imageIndex + 1}`}
                  className="aspect-[4/5]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersMarquee() {
  return (
    <section
      className="-mt-12 bg-white py-2 sm:-mt-16 sm:py-3"
      aria-label="ZEAL business partners"
    >
      <div className="mx-auto max-w-full overflow-hidden bg-[#db3627] text-white">
        <div className="px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex w-max items-center whitespace-nowrap animate-[brand-marquee_26s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...partnerNames, ...partnerNames].map((partner, index) => (
              <div
                key={`${partner}-${index}`}
                className="flex items-center gap-5 pr-5 sm:gap-7 sm:pr-7"
                aria-hidden={index >= partnerNames.length}
              >
                <span className="text-[0.92rem] font-medium tracking-[0.04em] text-white transition-opacity duration-300 hover:opacity-70 sm:text-[0.98rem]">
                  {partner}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[1.05rem] font-semibold leading-none text-white"
                >
                  *
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandsPage() {
  return (
    <main className="overflow-x-clip bg-white text-[#171717]">
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
              ZEAL Brand Portfolio
            </p>

            <h1 className="mt-6 max-w-[10ch] text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.78] tracking-[-0.085em]">
              Brands with distinct energy.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#625b5b] sm:text-lg">
              A cleaner showcase for ZEAL's fashion brands, pairing official
              logos with original campaign and product imagery from the project.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ImageFrame
              src={bannerPath("Banner 2.jpg")}
              alt="ARDEUR campaign banner"
              className="aspect-[1900/850] sm:col-span-2"
              eager
            />
            <ImageFrame
              src={bannerPath("Banner 4.jpg")}
              alt="CODEZ campaign banner"
              className="aspect-[1900/850]"
              eager
            />
            <ImageFrame
              src={bannerPath("Banner 5.jpg")}
              alt="FERVORO campaign banner"
              className="aspect-[1900/850]"
              eager
            />
          </div>
        </div>
      </section>

      <nav
        aria-label="Brand page navigation"
        className="sticky top-[72px] z-30 border-y border-[#ead8d8] bg-white/95 backdrop-blur-md sm:top-[76px] xl:top-[80px]"
      >
        <div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-10 [&::-webkit-scrollbar]:hidden">
          {brandProfiles.map((brand) => (
            <a
              key={brand.id}
              href={`#${brand.id}`}
              className="shrink-0 border border-[#ead8d8] bg-white px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#171717] transition-colors duration-200 hover:border-[#db3627] hover:bg-[#db3627] hover:text-white"
            >
              {brand.name}
            </a>
          ))}
        </div>
      </nav>

      <section className="bg-[#db3627] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brandProfiles.slice(0, 4).map((brand) => (
            <a
              key={brand.id}
              href={`#${brand.id}`}
              className="group flex min-h-28 items-center justify-between border border-white/25 px-5 py-4 transition-colors duration-300 hover:bg-white hover:text-[#db3627]"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                {brand.name}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {brandProfiles.map((brand, index) => (
        <BrandCard key={brand.id} brand={brand} index={index} />
      ))}

      <section className="bg-[#171717] px-4 py-18 text-white sm:px-6 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff4a3d]">
              ZEAL Brand Ecosystem
            </p>
            <h2 className="mt-6 max-w-[12ch] text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
              One house. Many fashion voices.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center justify-center bg-[#db3627] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore Products
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Work With ZEAL
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandPartnersSection({ variant = "marquee" }) {
  if (variant === "page") {
    return <BrandsPage />;
  }

  return <PartnersMarquee />;
}

export default BrandPartnersSection;
