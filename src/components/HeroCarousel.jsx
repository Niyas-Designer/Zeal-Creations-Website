import { useCallback, useEffect, useState } from 'react'

const slides = [
  {
    id: 1,
    title: ['Built on Precision.', 'Driven by Fashion.'],
    description:
      'A modern garment manufacturing company combining industry expertise, advanced production, and global fashion insight.',
    image: '/optimized/Banner%201.jpg',
  },
  {
    id: 2,
    title: ['Where Ideas Become', 'Apparel.'],
    description:
      'Our creative studio transforms concepts into trend-ready garments through innovation, design expertise, and market insight.',
    image: '/optimized/Banner%202.jpg',
  },
  {
    id: 3,
    title: ['Fashion Meets', 'Digital Warehouse.'],
    description:
      'Connecting manufacturers and warehouses through a powerful platform built for modern fashion distribution.',
    image: '/optimized/Banner%203.jpg',
  },
]

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const changeSlide = useCallback((direction) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction

      if (nextIndex < 0) {
        return slides.length - 1
      }

      return nextIndex % slides.length
    })
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!document.hidden) {
        changeSlide(1)
      }
    }, 6500)

    return () => window.clearInterval(intervalId)
  }, [changeSlide])

  return (
    <section className="relative isolate flex min-h-[82vh] w-full overflow-hidden bg-[#1f1913] text-white md:min-h-[86vh]">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              isActive
                ? 'translate-x-0 opacity-100'
                : 'translate-x-8 opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[6500ms] ease-linear ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding={index === 0 ? 'sync' : 'async'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              aria-hidden="true"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#14110d]/88 via-[#14110d]/54 to-[#14110d]/20" />
          </div>
        )
      })}

      <div className="relative z-10 flex w-full items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <div
              key={`content-${activeIndex}`}
              className="space-y-6"
            >
              <div className="space-y-2">
                {slides[activeIndex].title.map((line, index) => (
                  <div
                    key={line}
                    className={`translate-y-6 opacity-0 text-[clamp(2.6rem,6vw,5.7rem)] leading-[0.92] tracking-[-0.04em] text-white ${
                      index === 1 ? 'italic' : 'not-italic'
                    }`}
                    style={{
                      animation: 'hero-copy-in 800ms ease-out forwards',
                      animationDelay: `${index * 140}ms`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <p
                className="max-w-xl translate-y-6 opacity-0 text-sm leading-7 text-stone-200 sm:text-base"
                style={{
                  animation: 'hero-copy-in 800ms ease-out forwards',
                  animationDelay: '420ms',
                }}
              >
                {slides[activeIndex].description}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => changeSlide(-1)}
            className="flex h-11 w-11 items-center justify-center bg-[#ff0c00] text-lg text-white transition-colors duration-200 hover:bg-[#46372e]"
          >
            <span aria-hidden="true">&larr;</span>
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => changeSlide(1)}
            className="flex h-11 w-11 items-center justify-center bg-[#ff0c00] text-lg text-white transition-colors duration-200 hover:bg-[#46372e]"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
