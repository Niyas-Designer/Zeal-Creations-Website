import { Link } from 'react-router-dom'

const studioImages = {
  hero: '/optimized/Service%20images/latest-fashion.jpg',
  collaboration: '/optimized/Service%20images/lead-team.jpg',
  sketches: '/optimized/Service%20images/competitive-pricing.jpg',
  desk: '/optimized/Designing.jpg',
  fitting: '/optimized/Service%20images/quality-assurance.jpg',
  swatches: '/optimized/Service%20images/compliance.jpg',
}

const heroCards = [
  {
    src: studioImages.sketches,
    alt: 'Fashion sketches and fabric swatches',
    position:
      'left-[2%] top-[32%] h-28 w-24 -rotate-[14deg] sm:h-36 sm:w-28 lg:h-44 lg:w-36',
  },
  {
    src: studioImages.desk,
    alt: 'Fashion design desk and sketchbook',
    position:
      'left-[19%] top-[9%] h-32 w-24 -rotate-[8deg] sm:h-40 sm:w-32 lg:h-48 lg:w-40',
  },
  {
    src: studioImages.hero,
    alt: 'Fashion design team working in a studio',
    position:
      'left-1/2 top-0 h-36 w-28 -translate-x-1/2 rotate-[2deg] sm:h-44 sm:w-36 lg:h-52 lg:w-44',
  },
  {
    src: studioImages.collaboration,
    alt: 'Fashion designers collaborating',
    position:
      'right-[19%] top-[9%] h-32 w-24 rotate-[8deg] sm:h-40 sm:w-32 lg:h-48 lg:w-40',
  },
  {
    src: studioImages.fitting,
    alt: 'Garment fitting and development',
    position:
      'right-[2%] top-[32%] h-28 w-24 rotate-[14deg] sm:h-36 sm:w-28 lg:h-44 lg:w-36',
  },
]

const studioCapabilities = [
  'Trend & market research',
  'Creative direction',
  'Colour and material development',
  'Fashion illustration',
  'Product development',
  'Sampling and fit review',
]

const processSteps = [
  {
    number: '01',
    title: 'Understand the Brief',
    description:
      'We align the category, target customer, price position, season, quantity and commercial objective before design begins.',
  },
  {
    number: '02',
    title: 'Build the Direction',
    description:
      'Trend research, colour stories, materials, silhouettes and key details are shaped into a focused collection direction.',
  },
  {
    number: '03',
    title: 'Develop the Product',
    description:
      'Concepts move through sketches, design refinement, fabric coordination, construction planning and sample development.',
  },
  {
    number: '04',
    title: 'Refine for Production',
    description:
      'Fit, proportion, detailing and manufacturability are reviewed so the approved style is ready for the next production stage.',
  },
]

const studioPillars = [
  {
    title: 'Creative Leadership',
    description:
      'Our design team connects creative thinking with category knowledge and production understanding. Every direction is developed with the final product, customer and market in mind.',
    image: studioImages.hero,
  },
  {
    title: 'Trend & Market Intelligence',
    description:
      'We study evolving silhouettes, colour movements, material stories and consumer preferences to create commercially relevant apparel concepts for each season.',
    image: studioImages.sketches,
  },
  {
    title: 'Innovative Design Process',
    description:
      'From hand sketches and digital exploration to fabric selection and sample review, our process combines creativity, technology and practical garment knowledge.',
    image: studioImages.desk,
  },
  {
    title: 'Collaborative Environment',
    description:
      'Designers, merchandisers, sourcing teams, technicians and buyers work through a connected process that keeps decisions clear and product development aligned.',
    image: studioImages.collaboration,
  },
  {
    title: 'Tailored Collection Solutions',
    description:
      'Whether the requirement is a focused capsule, private-label range, category extension or custom development, each collection is shaped around the buyer brief.',
    image: studioImages.swatches,
  },
  {
    title: 'Sampling & Fit Refinement',
    description:
      'We review construction, proportion, surface details and fit before bulk production, helping translate the approved design into a reliable, production-ready style.',
    image: studioImages.fitting,
  },
]

const galleryImages = [
  {
    src: studioImages.collaboration,
    alt: 'Designers discussing a new fashion concept',
  },
  {
    src: studioImages.sketches,
    alt: 'Fashion concept sketches and fabric references',
  },
  {
    src: studioImages.hero,
    alt: 'Designers developing garments in a studio',
  },
  {
    src: studioImages.fitting,
    alt: 'Garment fitting and construction review',
  },
]

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function DesignStudioPage() {
  return (
    <main className="overflow-hidden bg-white text-[#171717]">
      <section className="relative isolate overflow-hidden bg-[#f7f7f3] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-28">
        <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(219,54,39,0.12),rgba(255,255,255,0)_68%)] blur-2xl" />

        <div className="mx-auto max-w-7xl">
          <div className="relative mx-auto h-[250px] max-w-5xl sm:h-[330px] lg:h-[390px]">
            {heroCards.map((card) => (
              <div
                key={card.alt}
                className={`absolute overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_24px_60px_rgba(17,17,17,0.14)] ${card.position}`}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  className="h-full w-full object-cover"
                  loading="eager"
                decoding="async"
/>
              </div>
            ))}
          </div>

          <div className="mx-auto -mt-4 max-w-4xl text-center sm:-mt-8 lg:-mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
              ZEAL Design Studio
            </p>

            <h1 className="mt-5 text-[clamp(2.7rem,7vw,6.4rem)] font-semibold leading-[0.93] tracking-[-0.055em] text-[#171717]">
              Ideas Designed
              <span className="block font-normal italic text-[#db3627]">
                for Production.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#625c55] sm:text-lg">
              Our in-house design studio transforms market insight, buyer briefs,
              fabric possibilities and creative direction into commercially
              relevant, production-ready apparel.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#studio-process"
                className="inline-flex h-12 items-center justify-center gap-3 bg-[#171717] px-7 text-sm font-semibold tracking-[0.06em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#db3627]"
              >
                Explore Our Process
                <ArrowIcon />
              </a>

              <Link
                to="/contact-us"
                className="inline-flex h-12 items-center justify-center border border-[#cfc9c2] bg-white px-7 text-sm font-semibold tracking-[0.06em] text-[#171717] transition-colors duration-300 hover:border-[#171717]"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#db3627]">
              Connected Creative Workflow
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-5xl">
              A studio built around the product.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#6b655f]">
              Creativity is only the beginning. Our studio connects research,
              design, sourcing, sampling and technical review so every concept
              can move forward with clarity.
            </p>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[2rem] border border-[#dedbd6] bg-[#20242a] shadow-[0_30px_80px_rgba(17,17,17,0.14)] lg:grid-cols-[0.36fr_0.64fr]">
            <div className="flex flex-col justify-center gap-1 border-b border-white/10 p-5 sm:p-8 lg:border-b-0 lg:border-r">
              {studioCapabilities.map((capability, index) => (
                <div
                  key={capability}
                  className={`flex items-center justify-between border-b border-white/10 px-1 py-4 text-sm transition-colors duration-300 last:border-b-0 ${
                    index === 0
                      ? 'text-white'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  <span>{capability}</span>
                  <span className="text-xs text-[#ff685d]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative min-h-[430px] overflow-hidden sm:min-h-[560px]">
              <img
                src={studioImages.collaboration}
                alt="ZEAL design studio collaboration reference"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              decoding="async"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff8b83]">
                  From Creative Direction to Sample Review
                </p>
                <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  One connected team. One clear product direction.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f3] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#db3627]">
                Concept to Product
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#171717] sm:text-5xl">
                Creative thinking,
                <span className="block font-normal italic text-[#db3627]">
                  made commercially relevant.
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#625c55]">
                We balance creative expression with price, category, customer,
                fabric, construction and production requirements. The result is
                not just an attractive idea, but a style designed to move
                confidently into development.
              </p>

              <div className="mt-9 grid grid-cols-2 gap-4">
                {[
                  ['01', 'Research-led'],
                  ['02', 'Buyer-focused'],
                  ['03', 'Material-aware'],
                  ['04', 'Production-ready'],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="border-t border-[#cfc9c2] py-4"
                  >
                    <span className="text-xs font-semibold text-[#db3627]">
                      {number}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-[#27231f]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl pb-10">
              <div className="-rotate-[4deg] overflow-hidden rounded-[1.5rem] border-[10px] border-white bg-white shadow-[0_26px_70px_rgba(17,17,17,0.14)]">
                <img
                  src={studioImages.sketches}
                  alt="Initial fashion concept and sketch development"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                decoding="async"
/>
                <p className="px-5 py-4 text-center text-sm font-semibold tracking-[0.08em]">
                  CREATIVE DIRECTION
                </p>
              </div>

              <div className="absolute -bottom-2 -right-2 w-[54%] rotate-[5deg] overflow-hidden rounded-[1.25rem] border-[8px] border-white bg-white shadow-[0_22px_60px_rgba(17,17,17,0.18)] sm:-right-8">
                <img
                  src={studioImages.fitting}
                  alt="Garment development and fit refinement"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                decoding="async"
/>
                <p className="px-3 py-3 text-center text-xs font-semibold tracking-[0.08em]">
                  PRODUCT DEVELOPMENT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="studio-process"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#db3627]">
              Our Development Process
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-5xl">
              From brief to production-ready style.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="group relative min-h-[330px] overflow-hidden rounded-[1.6rem] border border-[#dedbd6] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(17,17,17,0.1)]"
              >
                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#f3e2df] transition-transform duration-500 group-hover:scale-125" />

                <span className="relative text-sm font-semibold text-[#db3627]">
                  Step {step.number}
                </span>
                <h3 className="relative mt-20 text-2xl font-semibold tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className="relative mt-4 text-sm leading-7 text-[#6b655f]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#171717] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff685d]">
              Inside the Studio
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Creative capability with
              <span className="block font-normal italic text-[#ff685d]">
                manufacturing understanding.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {studioPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]"
              >
                <div className="overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  decoding="async"
/>
                </div>
                <div className="p-7 sm:p-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#db3627]">
                Studio Gallery
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Where the next product begins.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#6b655f]">
              These are temporary reference images. They can be replaced with
              actual ZEAL studio photographs without changing the page layout.
            </p>
          </div>

          <div className="mt-12 grid auto-rows-[230px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.alt}
                className={`group overflow-hidden rounded-[1.4rem] ${
                  index === 0 || index === 3 ? 'lg:row-span-2' : ''
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                decoding="async"
/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#db3627] px-7 py-14 text-white sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Build Your Next Collection With ZEAL
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Bring us the brief. We will help shape the product.
            </h2>
          </div>

          <Link
            to="/contact-us"
            className="mt-8 inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-white px-7 text-sm font-semibold tracking-[0.06em] text-[#171717] transition-transform duration-300 hover:-translate-y-0.5 lg:mt-0"
          >
            Work With Our Studio
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default DesignStudioPage
