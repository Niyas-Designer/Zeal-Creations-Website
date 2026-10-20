import { Link } from 'react-router-dom'
import ScrollRevealSection from './ScrollRevealSection'

const heroStats = [
  { value: '2006', label: 'Year Founded' },
  { value: '3M+', label: 'Garments Annual Capacity' },
  { value: 'In-House', label: 'Design, Production, Commerce' },
  { value: 'Global Reach', label: 'India to Overseas Markets' },
]

const infrastructureImages = [
  {
    src: '/optimized/Knitting.jpg',
    alt: 'Knitting and fabric creation machinery',
  },
  {
    src: '/optimized/Stats%20Banner.jpg',
    alt: 'Production and finishing floor',
  },
  {
    src: '/optimized/Garments.jpg',
    alt: 'Garment handling and product presentation',
  },
]

const growthStats = [
  { value: '3M+', label: 'Garments annual capacity' },
  { value: 'In-House Studio', label: 'Experienced design and sampling support' },
  { value: 'Multi-Category', label: 'Menswear, womenswear, and kidswear' },
  { value: 'Retail + E-commerce', label: 'Offline and online business capability' },
  { value: 'Global Outlook', label: 'Domestic and international reach' },
]

const journeyPoints = [
  {
    year: '2006',
    title: 'Business operations established in Tiruppur',
  },
  {
    year: 'Design Studio Built',
    title: 'In-house design and sampling support strengthened',
  },
  {
    year: 'Manufacturing Expanded',
    title: 'Operational scale increased across categories',
  },
  {
    year: 'Brand Development',
    title: 'Launch and growth of in-house fashion brands',
  },
  {
    year: 'Retail Presence',
    title: 'Showroom and retail expansion across locations',
  },
  {
    year: 'Global Reach',
    title: 'Overseas branch and wider market presence',
  },
]

const brands = [
  'Fervoro',
  'Ardeur',
  'Ardeur Premium',
  'Ardeur Streetz',
  'Only Teens',
  'Code Z',
  'Her Ardeur',
  'Revisited',
]

const highlights = [
  {
    title: 'Design Studio and Product Development',
    description:
      'From concept creation to sampling coordination, ZEAL builds collections with speed, relevance, and commercial clarity.',
    image: '/optimized/Designing.jpg',
  },
  {
    title: 'Manufacturing Capabilities and Quality Systems',
    description:
      'Integrated production systems and quality checkpoints support dependable output across categories and market requirements.',
    image: '/optimized/Stats%20Banner.jpg',
  },
  {
    title: 'Brand Growth and Retail Expansion',
    description:
      'ZEAL continues to grow through owned brands, showroom experiences, and a retail model shaped around long-term relevance.',
    image: '/About%204.jpg',
  },
]

function AboutZealPage() {
  return (
    <main className="bg-[#f7f7f3] text-[#161616]">
      <ScrollRevealSection>
        <section className="pt-10">
          <div className="w-full overflow-hidden bg-[#111111] text-white shadow-[0_26px_60px_rgba(17,17,17,0.18)]">
            <div className="relative isolate overflow-hidden">
              <img
                src="/optimized/Banner%201.jpg"
                alt="ZEAL industrial campus and business environment"
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                loading="eager"
              decoding="async"
/>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.84),rgba(17,17,17,0.62),rgba(17,17,17,0.42))]" />

              <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/72">
                  ZEAL ABOUT PAGE
                </p>
                <h1 className="mt-5 max-w-4xl text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
                  Building Fashion with Vision, Scale, and Speed
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
                  From design to delivery, ZEAL is creating a fully integrated
                  fashion ecosystem built for brands, buyers, and modern retail.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.value}
                      className="rounded-[1.4rem] border border-white/14 bg-white/10 px-5 py-5 backdrop-blur-sm"
                    >
                      <p className="text-[1.55rem] font-semibold tracking-[-0.03em] text-white">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/76">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-[clamp(2.2rem,4.3vw,4.1rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
              We are a fashion company building towards a smarter, faster, and more integrated future.
            </h2>
            <p className="mx-auto mt-7 max-w-4xl text-[1rem] leading-8 text-[#52524d] sm:text-[1.04rem]">
              ZEAL is a design-led apparel company built on the idea that strong
              brands need strong systems behind them. We combine creativity,
              manufacturing, retail understanding, and digital capability under
              one roof to create products and experiences that move with the
              market.
            </p>
            <p className="mx-auto mt-5 max-w-4xl text-[1rem] leading-8 text-[#52524d] sm:text-[1.04rem]">
              Our strength lies in doing things in-house, with greater control,
              better quality, and faster execution across every stage of the
              business.
            </p>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] border border-[#e5e5de] bg-white p-6 shadow-[0_20px_48px_rgba(17,17,17,0.06)] sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:p-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Brand Statement
              </p>
              <h2 className="mt-4 max-w-[12ch] text-[clamp(2.15rem,4.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Building a complete fashion future. From India. For the world.
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-[#4f4f49]">
                Founded in Tiruppur, ZEAL has grown into a multi-dimensional
                apparel business serving both domestic and international markets.
                What began as a manufacturing-driven company has evolved into a
                complete ecosystem that includes design development, scalable
                production, e-commerce capability, retail presence, and brand
                creation.
              </p>
            </div>

            <figure className="h-full min-h-[340px] overflow-hidden rounded-[1.8rem] bg-[#ecece7] lg:min-h-full">
              <img
                src="/optimized/About%201.jpg"
                alt="ZEAL team and product environment"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                loading="lazy"
              decoding="async"
/>
            </figure>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <figure className="overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_48px_rgba(17,17,17,0.07)]">
              <div className="aspect-[1.02/1]">
                <img
                  src="/optimized/Designing.jpg"
                  alt="Design sketching and sampling process"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                decoding="async"
/>
              </div>
            </figure>

            <div className="max-w-xl lg:justify-self-end">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Design-Led System
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Designed with purpose. Built with control.
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-[#4f4f49]">
                At ZEAL, design is not treated as decoration after production
                decisions are made. It is embedded into the process from the
                beginning. Our in-house design studio works closely with
                sampling, sourcing, and production teams to ensure every
                collection balances creativity, trend relevance, commercial
                value, and execution feasibility.
              </p>
              <p className="mt-5 text-[1rem] leading-8 text-[#4f4f49]">
                This connected workflow helps us reduce delays, improve
                consistency, and create better products from concept to shipment.
              </p>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Infrastructure
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                An integrated foundation built for scale
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-[#4f4f49]">
                ZEAL has invested in a strong operational backbone to support
                high-quality output and reliable delivery. Our infrastructure
                includes in-house design support, sampling coordination,
                manufacturing capability, quality systems, warehousing, and
                commercial operations that work together as one connected network.
              </p>
              <p className="mt-5 text-[1rem] leading-8 text-[#4f4f49]">
                This structure allows us to respond faster, manage quality more
                effectively, and support both private-label production and
                in-house brand growth.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {infrastructureImages.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]"
                >
                  <div className="aspect-square">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      loading="lazy"
                    decoding="async"
/>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="bg-[#121212] px-6 py-16 text-white sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
              Engineering Growth Through Fashion
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {growthStats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-6"
                >
                  <p className="text-[1.3rem] font-semibold tracking-[-0.03em] text-white">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/76">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Facilities & Expansion
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Future Ready. Already.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[1.8rem] border border-[#e5e5de] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]">
                <div className="aspect-[1.35/0.8] overflow-hidden">
                  <img
                    src="/optimized/Banner%201.jpg"
                    alt="Manufacturing and operations campus"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  decoding="async"
/>
                </div>
                <div className="px-6 py-6">
                  <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#111111]">
                    Manufacturing & Operations
                  </h3>
                  <p className="mt-4 text-[1rem] leading-8 text-[#4f4f49]">
                    ZEAL continues to strengthen its manufacturing and
                    operational foundation with a focus on quality, efficiency,
                    and scalable growth.
                  </p>
                </div>
              </article>

              <article className="overflow-hidden rounded-[1.8rem] border border-[#e5e5de] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]">
                <div className="aspect-[1.35/0.8] overflow-hidden">
                  <img
                    src="/About%204.jpg"
                    alt="Retail and showroom environment"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  decoding="async"
/>
                </div>
                <div className="px-6 py-6">
                  <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#111111]">
                    Retail & Brand Presence
                  </h3>
                  <p className="mt-4 text-[1rem] leading-8 text-[#4f4f49]">
                    With physical retail presence, brand development, and
                    overseas expansion, ZEAL is building a business designed for
                    long-term market relevance.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Our People
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Our People
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-[#4f4f49]">
                ZEAL is powered by people across design, development,
                production, quality, retail, and business operations. Our
                strength comes from the way these teams work together with shared
                ownership, market awareness, and a commitment to doing things
                right.
              </p>
              <p className="mt-5 text-[1rem] leading-8 text-[#4f4f49]">
                From product development to final delivery, collaboration is at
                the center of how we grow.
              </p>
            </div>

            <figure className="overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_48px_rgba(17,17,17,0.07)]">
              <img
                src="/optimized/About%203.jpg"
                alt="ZEAL workplace and team environment"
                className="h-full w-full object-cover"
                loading="lazy"
              decoding="async"
/>
            </figure>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
              Our Journey
            </p>
            <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
              Our Journey
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {journeyPoints.map((point) => (
                <article
                  key={point.year}
                  className="rounded-[1.6rem] border border-[#e5e5de] bg-white px-5 py-6 shadow-[0_14px_30px_rgba(17,17,17,0.05)]"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#db3627]">
                    {point.year}
                  </p>
                  <p className="mt-4 text-[1rem] leading-7 text-[#2f2f2b]">
                    {point.title}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Our Brands
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Brands Built Within ZEAL
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-[#4f4f49]">
                Beyond manufacturing, ZEAL is also a brand-building company. Our
                portfolio reflects a broad understanding of market segments,
                product identity, and consumer positioning.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="rounded-[1.45rem] border border-[#e5e5de] bg-white px-5 py-6 text-center text-[1.05rem] font-medium tracking-[0.04em] text-[#161616] shadow-[0_14px_30px_rgba(17,17,17,0.04)]"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a84]">
                Media & News
              </p>
              <h2 className="mt-4 text-[clamp(2.05rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                Highlights from ZEAL
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-[1.8rem] border border-[#e5e5de] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]"
                >
                  <div className="aspect-[1.2/0.82] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      loading="lazy"
                    decoding="async"
/>
                  </div>
                  <div className="px-6 py-6">
                    <h3 className="text-[1.3rem] font-semibold tracking-[-0.03em] text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[0.98rem] leading-8 text-[#4f4f49]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#121212] px-6 py-12 text-white shadow-[0_26px_60px_rgba(17,17,17,0.18)] sm:px-8 lg:px-12 lg:py-14">
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/68">
                Final CTA
              </p>
              <h2 className="mt-4 text-[clamp(2.15rem,4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
                Build With ZEAL
              </h2>
              <p className="mt-6 text-[1rem] leading-8 text-white/78">
                Whether you are a global buyer, retail partner, private-label
                client, or brand looking for a dependable fashion manufacturing
                ecosystem, ZEAL is built to support growth with design
                intelligence, production capability, and long-term partnership
                value.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-medium tracking-[0.08em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f1f1eb]"
              >
                Contact Us
              </Link>
              <Link
                to="/our-brand"
                className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/6 px-6 py-3.5 text-sm font-medium tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore Our Brands
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealSection>
    </main>
  )
}

export default AboutZealPage
