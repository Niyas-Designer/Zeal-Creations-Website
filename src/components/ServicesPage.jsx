import { Link } from "react-router-dom";

const serviceCards = [
  {
    title: "Lead Team",
    description:
      "Our experienced leadership team coordinates design, sourcing, production, and fulfilment through one connected system. This ensures better visibility, faster decisions, and dependable execution from order planning to final delivery.",
    image: "/optimized/Service%20images/lead-team.jpg",
  },
  {
    title: "Competitive Pricing",
    description:
      "We support customers with commercially balanced sourcing and cost-conscious planning. Through efficient development, vendor alignment, and manufacturing discipline, we help create value without compromising quality.",
    image: "/optimized/Service%20images/competitive-pricing.jpg",
  },
  {
    title: "Compliance",
    description:
      "We work with responsible systems, ethical manufacturing practices, and structured operating standards. Our focus is to maintain safe, reliable, and globally aligned processes across key production functions.",
    image: "/optimized/Service%20images/compliance.jpg",
  },
  {
    title: "Quality Assurance",
    description:
      "Quality is monitored at every stage, from raw material evaluation to production checks and final inspection. Our process is built to reduce inconsistency, improve reliability, and support buyer confidence.",
    image: "/optimized/Service%20images/quality-assurance.jpg",
  },
  {
    title: "Latest Fashion",
    description:
      "We stay connected to evolving market movements, silhouettes, materials, and seasonal preferences. This helps us develop collections that are both trend-aware and commercially suitable for global and domestic markets.",
    image: "/optimized/Service%20images/latest-fashion.jpg",
  },
  {
    title: "Risk Management",
    description:
      "We aim to reduce uncertainty through structured planning, communication, and operational control. By aligning sourcing, production, and timelines carefully, we help projects move forward with greater confidence.",
    image: "/optimized/Service%20images/risk-management.jpg",
  },
];

const highlightPoints = [
  "Integrated design-to-delivery support",
  "Commercial sourcing and cost efficiency",
  "Quality-focused manufacturing systems",
  "Compliance-oriented operational structure",
  "Trend-led product development",
  "Scalable and dependable execution",
];

const showcaseImages = [
  "/optimized/Service%20images/latest-fashion.jpg",
  "/optimized/Service%20images/quality-assurance.jpg",
  "/optimized/Service%20images/competitive-pricing.jpg",
  "/optimized/Service%20images/risk-management.jpg",
];

function ServicesPage() {
  return (
    <main className="bg-[#f7f7f3] text-[#161616]">
      <section className="relative overflow-hidden px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="pointer-events-none absolute left-1/2 top-10 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(219,54,39,0.12),rgba(255,255,255,0)_70%)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
                Services
              </p>

              <h1 className="mt-5 max-w-4xl text-[clamp(2.7rem,6vw,5.7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#171717]">
                Connected services for
                <span className="block italic font-normal text-[#db3627]">
                  modern apparel growth.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5a54] sm:text-lg">
                ZEAL supports brands, buyers, and fashion businesses through an
                integrated approach that brings leadership, quality, compliance,
                commercial planning, and market relevance under one system.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {highlightPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#e1ddd7] bg-white px-4 py-4 text-sm font-medium text-[#2b2723] shadow-[0_10px_30px_rgba(17,17,17,0.04)]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact-us"
                  className="inline-flex h-12 items-center justify-center bg-[#1d1d1d] px-7 text-sm font-semibold tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#db3627]"
                >
                  Work With Us
                </Link>

                <Link
                  to="/about-us"
                  className="inline-flex h-12 items-center justify-center border border-[#d5d0c9] bg-white px-7 text-sm font-semibold tracking-[0.08em] text-[#171717] transition-colors duration-300 hover:border-[#171717]"
                >
                  Explore Company
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#e6e1db] bg-white shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
              <img
                src="/optimized/Service%20images/services-hero.jpg"
                alt="ZEAL services overview"
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[520px]"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
              What We Offer
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-[-0.04em] text-[#171717]">
              Services that support product, process, and performance.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#625c55]">
              The following service areas reflect the broader operating
              strengths that help us deliver better consistency, stronger
              coordination, and more reliable business outcomes.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((service) => (
              <article
                key={service.title}
                className="group overflow-hidden rounded-[1.6rem] border border-[#e6e1db] bg-white shadow-[0_14px_40px_rgba(17,17,17,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_60px_rgba(17,17,17,0.10)]"
              >
                <div className="overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#1f1f1f]">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#66605a] sm:text-[15px]">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
                Why It Matters
              </p>

              <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em] text-[#171717]">
                Service strength creates
                <span className="block italic font-normal text-[#db3627]">
                  better business confidence.
                </span>
              </h2>

              <p className="mt-6 text-base leading-8 text-[#625c55]">
                In apparel manufacturing, success does not come from one
                department alone. It depends on how well design, sourcing,
                compliance, quality, planning, and execution work together.
                Our service structure is designed to support that connection.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Helps reduce fragmentation between departments",
                  "Supports better consistency in product execution",
                  "Improves communication across the workflow",
                  "Strengthens commercial and operational clarity",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 text-sm leading-7 text-[#413c37]"
                  >
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#db3627]" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {showcaseImages.map((image, index) => (
                <div
                  key={image}
                  className={`overflow-hidden rounded-[1.5rem] ${
                    index === 0 || index === 3 ? "mt-6 sm:mt-10" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`Service showcase ${index + 1}`}
                    className="h-[220px] w-full object-cover sm:h-[280px]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#db3627] px-7 py-12 text-white shadow-[0_24px_70px_rgba(219,54,39,0.20)] sm:px-10 sm:py-14 lg:flex lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Build With ZEAL
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-tight tracking-[-0.04em]">
              Looking for a manufacturing partner with stronger service support?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Let’s discuss your requirement and explore how our integrated
              service approach can support your category, collection, and market
              goals.
            </p>
          </div>

          <Link
            to="/contact-us"
            className="mt-8 inline-flex h-12 items-center justify-center bg-white px-7 text-sm font-semibold tracking-[0.08em] text-[#171717] transition-transform duration-300 hover:-translate-y-0.5 lg:mt-0"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ServicesPage;
