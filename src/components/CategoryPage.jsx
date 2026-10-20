import { Link } from 'react-router-dom'

const categoryCards = {
  men: {
    title: "Men's Wear",
    image: '/optimized/MENS%20IMG.jpg',
    position: 'object-center',
    alt: 'Male model in premium casual wear',
  },
  women: {
    title: "Women's Wear",
    image: '/optimized/WOMENS%20IMG.jpg',
    position: 'object-center',
    alt: 'Female model in premium casual wear',
  },
  kids: {
    eyebrow: 'Playwear Edit',
    title: 'KIDS',
    description:
      'Soft cotton sets, playful coordinates, and easy silhouettes for bright everyday moments.',
    image: '/optimized/Kids%20Banner.jpg',
    position: 'object-[82%_center]',
    alt: 'Child in premium casual clothing holding a hat',
  },
  infants: {
    eyebrow: 'Little Moments',
    title: 'INFANTS',
    description:
      'Comfort-first cotton styles, playful prints, and easy separates for cheerful early adventures.',
    image: '/optimized/Infants%20Banner.jpg',
    position: 'object-[72%_center]',
    alt: 'Young children in soft-toned casual clothing',
  },
}

const buttonClass =
  'inline-flex items-center bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#222] shadow-[0_12px_26px_rgba(0,0,0,0.12)] transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#fff]'

function PrimaryCategoryCard({ category, heightClass }) {
  return (
    <article className="group relative overflow-hidden bg-white shadow-[0_18px_44px_rgba(34,24,18,0.08)]">
      <div className={`relative ${heightClass}`}>
        <img
          src={category.image}
          alt={category.alt}
          className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${category.position}`}
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/60 group-hover:via-black/14" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 py-8 text-center text-white sm:px-8 sm:py-9">
          <h2 className="text-[1.45rem] uppercase tracking-[0.16em] sm:text-[1.75rem] xl:text-[1.9rem]">
            {category.title}
          </h2>

          <Link
            to="/products"
            className={`${buttonClass} mt-5`}
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  )
}

function SupportingCategoryCard({ category }) {
  return (
    <article className="group relative overflow-hidden bg-white shadow-[0_18px_44px_rgba(34,24,18,0.08)]">
      <div className="relative h-[340px] sm:h-[380px] lg:h-[330px] xl:h-[360px]">
        <img
          src={category.image}
          alt={category.alt}
          className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${category.position}`}
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/18 to-transparent transition-colors duration-300 group-hover:from-black/66 group-hover:via-black/22" />

        <div className="absolute inset-0 flex max-w-[15.5rem] flex-col items-start justify-start px-6 py-7 text-left sm:max-w-[18rem] sm:px-8 sm:py-8 xl:max-w-[15rem] xl:px-7 xl:py-7 2xl:max-w-[16rem]">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white sm:text-xs">
            {category.eyebrow}
          </p>

          <h3 className="mt-4 text-[clamp(2.65rem,9vw,4.5rem)] leading-[0.92] tracking-[-0.045em] text-white xl:text-[clamp(2.55rem,3.6vw,4rem)]">
            {category.title}
          </h3>

          <p className="mt-4 max-w-[14rem] text-[0.92rem] leading-6 text-white sm:text-[0.98rem] sm:leading-7 xl:max-w-[13.25rem] xl:text-[0.88rem] xl:leading-5 2xl:max-w-[14rem] 2xl:text-[0.95rem] 2xl:leading-6">
            {category.description}
          </p>

          <Link
            to="/products"
            className={`${buttonClass} mt-6`}
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  )
}

function CategoryPage() {
  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
      <section className="mx-auto max-w-[1580px]">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.84fr)]">
          <PrimaryCategoryCard
            category={categoryCards.men}
            heightClass="h-[420px] sm:h-[520px] lg:h-[620px] xl:h-[760px]"
          />

          <PrimaryCategoryCard
            category={categoryCards.women}
            heightClass="h-[420px] sm:h-[520px] lg:h-[620px] xl:h-[760px]"
          />

          <div className="grid grid-cols-1 gap-6">
            <SupportingCategoryCard category={categoryCards.kids} />
            <SupportingCategoryCard category={categoryCards.infants} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default CategoryPage
