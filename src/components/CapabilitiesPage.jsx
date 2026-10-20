import { Link } from 'react-router-dom'
import ScrollRevealSection from './ScrollRevealSection'

const policySections = [
  {
    title: 'Code of Conduct',
    intro:
      'ZEAL’s Code of Conduct defines the principles that guide our day-to-day operations and business relationships.',
    points: [
      'Ethical business practices',
      'Fair treatment of employees',
      'Transparent operations',
      'Accountability across all departments',
    ],
    closing:
      'The Code applies to all employees, partners, and stakeholders associated with ZEAL.',
  },
  {
    title: 'Supplier & Partner Standards',
    intro:
      'ZEAL works closely with suppliers, vendors, and business partners who share our commitment to ethical and responsible practices.',
    points: [
      'Follow fair labor practices',
      'Maintain safe working environments',
      'Adhere to environmental standards',
      'Operate with transparency and integrity',
    ],
    closing:
      'Anyone working with ZEAL must operate at the same standard we hold ourselves to.',
  },
  {
    title: 'Anti-Corruption Policy',
    intro:
      'ZEAL maintains a zero-tolerance approach toward corruption, bribery, and unethical influence.',
    points: [
      'Transparent business dealings',
      'Fair negotiation practices',
      'Strict avoidance of conflicts of interest',
    ],
    closing:
      'All decisions are made based on merit, value, and long-term trust — not short-term advantage.',
  },
  {
    title: 'Responsible Business Practices',
    intro:
      'ZEAL believes that business growth must align with social and environmental responsibility.',
    points: [
      'Ethical sourcing',
      'Waste-conscious production',
      'Responsible use of resources',
      'Long-term sustainability thinking',
    ],
    closing:
      'We continuously evaluate and improve our processes to reduce impact while maintaining performance.',
  },
  {
    title: 'Compliance & Certification',
    intro:
      'ZEAL follows recognized compliance standards to ensure safe, fair, and ethical operations.',
    points: [
      'SA 8000:2014 Compliance',
      'Workplace safety protocols',
      'Labor and employment regulations',
      'Quality and process standards',
    ],
    closing:
      'Compliance is not treated as a requirement — it is part of how we operate daily.',
  },
  {
    title: 'Quality & Accountability',
    intro:
      'Every product delivered by ZEAL reflects a structured system of checks, controls, and accountability.',
    points: [
      'Inline and final quality inspections',
      'Defined production standards',
      'Continuous monitoring and reporting',
      'Consistency across all production stages',
    ],
    closing:
      'Responsibility is built into the process, not added at the end.',
  },
  {
    title: 'Communication & Transparency',
    intro:
      'ZEAL promotes open communication across all levels of the organization.',
    points: [
      'Clear reporting systems',
      'Transparent client communication',
      'Structured internal coordination',
      'Accountability in decision-making',
    ],
    closing: 'Trust is built through clarity, not assumptions.',
  },
  {
    title: 'People & Workplace Ethics',
    intro: 'Our people are central to ZEAL’s growth.',
    points: [
      'Fair employment practices',
      'Safe and respectful workplaces',
      'Equal opportunity and inclusion',
      'Professional development and growth',
    ],
    closing: 'A strong workplace creates strong outcomes.',
  },
  {
    title: 'Continuous Improvement',
    intro:
      'ZEAL continuously evolves its systems, policies, and practices to align with global standards and future expectations.',
    points: [],
    closing:
      'We believe compliance is not static — it must grow with the business, the industry, and the world around it.',
  },
]

function PolicySection({ title, intro, points, closing }) {
  return (
    <article className="grid gap-6 border-b border-[#e4e1da] py-10 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)] lg:gap-10">
      <div>
        <p className="text-[0.74rem] font-medium uppercase tracking-[0.24em] text-[#8a867d]">
          {title}
        </p>
      </div>

      <div className="max-w-4xl">
        <p className="text-[1rem] leading-8 text-[#34322d]">{intro}</p>

        {points.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <div
                key={point}
                className="rounded-[1.25rem] border border-[#e8e4db] bg-white px-4 py-4 text-[0.98rem] leading-7 text-[#1f1e1a]"
              >
                {point}
              </div>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-[1rem] leading-8 text-[#56524a]">{closing}</p>
      </div>
    </article>
  )
}

function CapabilitiesPage() {
  return (
    <main className="bg-[#f6f4ef] text-[#141414]">
      <ScrollRevealSection>
        <section className="px-6 pt-12 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 border-t border-[#e4e1da] pt-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] lg:items-start">
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a867d]">
                Ethics &amp; Compliance
              </p>
              <h1 className="mt-5 max-w-[12ch] text-[clamp(2.7rem,5.6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111]">
                Built on Responsibility. Driven by Integrity.
              </h1>
              <p className="mt-7 max-w-3xl text-[1.05rem] leading-8 text-[#4e4a42]">
                At ZEAL, growth means nothing without responsibility. Our
                operations are built on ethical practices, transparent systems,
                and compliance standards that ensure accountability across every
                level of the business.
              </p>
              <p className="mt-5 max-w-3xl text-[1.05rem] leading-8 text-[#4e4a42]">
                From design to delivery, we are committed to doing things the
                right way — consistently, responsibly, and without shortcuts.
              </p>
            </div>

            <figure className="overflow-hidden rounded-[2rem] bg-[#ebe7dd]">
              <div className="aspect-[1/1.05]">
                <img
                  src="/ethical-sourcing-bg.jpg"
                  alt="Folded fabric representing responsible sourcing"
                  className="h-full w-full object-cover"
                  loading="lazy"
                decoding="async"
/>
              </div>
            </figure>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#111111] px-6 py-10 text-white shadow-[0_26px_60px_rgba(17,17,17,0.16)] sm:px-8 lg:px-10 lg:py-12">
            <p className="max-w-5xl text-[clamp(1.6rem,3vw,2.55rem)] font-medium leading-[1.28] tracking-[-0.04em] text-white">
              “Strong businesses are not defined by scale alone, but by the
              standards they choose to operate with.”
            </p>
            <p className="mt-6 max-w-4xl text-[1rem] leading-8 text-white/72">
              ZEAL operates with a clear focus on ethical conduct, fair
              practices, and long-term accountability — ensuring that every
              decision aligns with both business integrity and social
              responsibility.
            </p>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {policySections.map((section) => (
              <PolicySection key={section.title} {...section} />
            ))}
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection>
        <section className="px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#e4e1da] bg-white px-6 py-10 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:px-8 lg:px-10 lg:py-12">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8a867d]">
              Final Statement
            </p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
              Accountability in Every Step
            </h2>
            <p className="mt-6 max-w-4xl text-[1rem] leading-8 text-[#4e4a42]">
              ZEAL is committed to building a business that balances performance
              with responsibility. Our approach ensures that every product,
              process, and partnership reflects the standards we stand for.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center rounded-xl bg-[#111111] px-6 py-3.5 text-sm font-medium tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#db3627]"
              >
                Contact Us
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center justify-center rounded-xl border border-[#d9d4ca] bg-[#f7f4ee] px-6 py-3.5 text-sm font-medium tracking-[0.08em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111]"
              >
                About ZEAL
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealSection>
    </main>
  )
}

export default CapabilitiesPage
