import { useState } from 'react'
import ScrollRevealSection from './ScrollRevealSection'

const divisions = [
  {
    title: 'In-house Studio',
    label:
      'Trend-driven design, product development, and creative direction led by an in-house team focused on innovation and market relevance.',
    image: '/optimized/Designing.jpg',
    imageAlt: 'ZEAL in-house fashion design and product development',
  },
  {
    title: 'Production Unit',
    label:
      'Advanced manufacturing with scalable capacity, strict quality control, and efficient turnaround aligned with global standards.',
    image: '/optimized/Production-Unit.jpg',
    imageAlt: 'ZEAL garment manufacturing and production unit',
  },
  {
    title: 'Warehouse',
    label:
      'Integrated warehousing, inventory coordination, order fulfilment, packing, and dispatch systems supporting efficient product movement and reliable delivery.',
    image: '/optimized/Banner%203.jpg',
    imageAlt: 'ZEAL warehousing, inventory, and fulfilment operations',
  },
  {
    title: 'Brand Retail Showroom',
    label:
      'Physical retail spaces designed to enhance customer experience and strengthen brand presence across key markets.',
    image: '/Brand Retail Showroom.jpeg',
    imageAlt: 'ZEAL showroom and clothing display environment',
  },
]

function WhyZealPage() {
  const [activeDivision, setActiveDivision] = useState(null)

  function showDivision(index) {
    setActiveDivision(index)
  }

  function hideDivision() {
    setActiveDivision(null)
  }

  return (
    <main className="bg-[#f7f7f3] text-[#161616]">
      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
          <div className="mx-auto max-w-[1240px]">
            {divisions.map((division, index) => {
              const isActive = activeDivision === index

              return (
                <article
                  key={division.title}
                  className={`relative grid min-h-[150px] gap-5 border-b border-[#e4e4de] py-8 transition-colors duration-300 sm:min-h-[175px] sm:py-10 xl:grid-cols-[minmax(0,1fr)_380px_340px] xl:items-center xl:gap-8 ${
                    isActive ? 'z-30' : 'z-0'
                  }`}
                >
                  {/* Division title */}
                  <div className="relative z-20">
                    <h2>
                      <button
                        type="button"
                        onMouseEnter={() => showDivision(index)}
                        onMouseLeave={hideDivision}
                        onFocus={() => showDivision(index)}
                        onBlur={hideDivision}
                        className="w-fit cursor-default bg-transparent p-0 text-left text-[clamp(2.2rem,4.4vw,4rem)] font-medium leading-[1] tracking-[-0.06em] text-[#111111] outline-none transition-opacity duration-300 focus-visible:text-[#db3627]"
                        aria-label={`Preview ${division.title}`}
                      >
                        {division.title}
                      </button>
                    </h2>
                  </div>

                  {/* Hover image preview */}
                  <div
                    className="pointer-events-none relative hidden h-full items-center justify-center xl:flex"
                    aria-hidden="true"
                  >
                    <div
                      className={`absolute left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white p-2 shadow-[0_24px_65px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out ${
                        isActive
                          ? 'visible scale-100 opacity-100'
                          : 'invisible scale-[0.94] opacity-0'
                      }`}
                    >
                      <img
                        src={division.image}
                        alt=""
                        className="h-[270px] w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  {/* Division description */}
                  <p className="relative z-10 max-w-[340px] pt-1 text-sm leading-7 text-[#3f3f3b] xl:justify-self-end xl:text-right">
                    {division.label}
                  </p>
                </article>
              )
            })}

            <div className="pt-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#111111] sm:text-[0.95rem]">
                From Concept → Creation → Commerce → Customer
              </p>
            </div>
          </div>
        </section>
      </ScrollRevealSection>
    </main>
  )
}

export default WhyZealPage