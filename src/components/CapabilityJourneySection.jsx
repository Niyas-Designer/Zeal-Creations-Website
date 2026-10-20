const capabilities = [
  {
    title: 'Design & Development',
    description:
      'Trend-driven design, concept creation, and product development led by an in-house team aligned with global market demands.',
    image: '/optimized/Designing.jpg',
    position: 'object-center',
    alt: 'Fashion sketching and design concept workspace',
  },
  {
    title: 'Fabric & Knitting',
    description:
      'Advanced knitting capabilities with precision engineering, material control, and consistent fabric quality.',
    image: '/optimized/Knitting.jpg',
    position: 'object-center',
    alt: 'Knitting machine with yarn threads in motion',
  },
  {
    title: 'Processing & Finishing',
    description:
      'Dyeing, washing, and finishing processes executed with strict quality standards and attention to detail.',
    image: '/optimized/Stats%20Banner.jpg',
    position: 'object-center',
    alt: 'Garment processing and production floor',
  },
  {
    title: 'Final Production',
    description:
      'Scalable manufacturing with efficient workflows, quality control systems, and timely delivery aligned with global benchmarks.',
    image: '/optimized/Garments.jpg',
    position: 'object-center',
    alt: 'Finished garments on display with folded apparel',
  },
]

function CapabilityJourneySection() {
  return (
    <section className="bg-white pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#222]">
            Our Strategic Capabilities
          </p>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#ff0c00]" />
          </div>

          <h2 className="mt-8 text-[clamp(2.15rem,4vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#181818]">
            End-to-End Apparel Capabilities, Fully Integrated
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-[1rem] leading-8 text-[#5a5a55] sm:text-[1.04rem]">
            A fully in-house workflow ensuring speed, consistency, and
            uncompromised quality at every stage.
          </p>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="group relative overflow-hidden bg-black"
            >
              <div className="relative h-[340px] overflow-hidden sm:h-[380px] xl:h-[460px]">
                <img
                  src={capability.image}
                  alt={capability.alt}
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${capability.position}`}
                  loading="lazy"
                decoding="async"
/>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.06),rgba(17,17,17,0.18))] transition-colors duration-300 group-hover:bg-[linear-gradient(180deg,rgba(17,17,17,0.08),rgba(17,17,17,0.28))]" />
                <div className="absolute inset-x-0 bottom-0 bg-white/88 px-6 py-5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/92">
                  <h3 className="text-[1rem] font-semibold uppercase leading-tight tracking-[0.18em] text-[#181818] sm:text-[1.02rem]">
                    {capability.title}
                  </h3>
                  <p className="mt-3 max-w-[26rem] text-sm leading-6 text-[#4e4e49]">
                    {capability.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-stone-200 px-6 pt-6 sm:px-8 lg:px-10">
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-[#181818] sm:text-[0.95rem]">
            Integrated Workflow | Faster Turnaround | Consistent Quality
          </p>
      </div>
    </section>
  )
}

export default CapabilityJourneySection
