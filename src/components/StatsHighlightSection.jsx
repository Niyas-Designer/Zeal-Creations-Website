import { useEffect, useRef, useState } from 'react'

const stats = [
  {
    number: '3M+',
    label: 'Pieces | Year',
  },
  {
    number: '1000+',
    label: 'Skilled Workers',
  },
  {
    number: '7 Days',
    label: 'Sampling Lead',
  },
  {
    number: '25+',
    label: 'Years Experience',
  },
]

function StatsHighlightSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current

    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate w-full overflow-hidden bg-[#151515]">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-[2px] animate-[stats-bg-zoom_22s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: "url('/optimized/Stats%20Banner%202.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 text-center sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="mx-auto flex max-w-xs flex-col items-center"
              style={{
                opacity: isVisible ? undefined : 0,
                transform: isVisible ? undefined : 'translateY(16px)',
                animation: isVisible ? 'stats-copy-in 700ms ease-out forwards' : 'none',
                animationDelay: isVisible ? `${index * 180}ms` : '0ms',
              }}
            >
              <div
                className="text-[clamp(2.9rem,7vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-white"
                style={{
                  opacity: isVisible ? undefined : 0,
                  transform: isVisible ? undefined : 'translateY(10px)',
                  animation: isVisible ? 'stats-copy-in 650ms ease-out forwards' : 'none',
                  animationDelay: isVisible ? `${index * 180 + 100}ms` : '0ms',
                }}
              >
                {stat.number}
              </div>
              <div
                className="mt-3 text-[15px] font-normal tracking-[0.08em] text-white sm:text-base"
                style={{
                  opacity: isVisible ? undefined : 0,
                  transform: isVisible ? undefined : 'translateY(10px)',
                  animation: isVisible ? 'stats-copy-in 650ms ease-out forwards' : 'none',
                  animationDelay: isVisible ? `${index * 180 + 260}ms` : '0ms',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsHighlightSection
