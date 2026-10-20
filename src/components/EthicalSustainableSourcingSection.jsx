const certifications = [
  {
    title: 'SA 8000',
    subtitle: '2014 Standard',
    kind: 'shield',
  },
  {
    title: 'ISO 9001',
    subtitle: '2015 Certified',
    kind: 'badge',
  },
  {
    title: 'Sedex',
    subtitle: 'Member',
    kind: 'network',
  },
  {
    title: 'FAMA',
    subtitle: 'Certified',
    kind: 'document',
  },
]

const featureColumns = [
  [
    'Zero Child Labor Policy',
    'Safe Working Conditions',
    'Sustainable Fabrics (Organic, BCI, Recycled)',
  ],
  [
    'Ethical Wage Structure',
    'ESG Roadmap Implementation',
  ],
]

function CertificationIcon({ kind }) {
  if (kind === 'shield') {
    return (
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 text-[#e53935]"
        aria-hidden="true"
      >
        <path
          d="M24 5l13 5v10c0 9.3-5.7 16.9-13 20-7.3-3.1-13-10.7-13-20V10l13-5z"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M17.5 24.5l4.5 4.5 8.5-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (kind === 'badge') {
    return (
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 text-[#e53935]"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="18"
          r="10"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M19 28l-3 12 8-4 8 4-3-12"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <path
          d="M20.5 18h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M24 14.5v7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === 'network') {
    return (
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 text-[#e53935]"
        aria-hidden="true"
      >
        <circle
          cx="13"
          cy="15"
          r="5"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle
          cx="35"
          cy="15"
          r="5"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle
          cx="24"
          cy="33"
          r="5"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M17.5 18.5l4.5 8M30.5 18.5l-4.5 8M18 15h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 48 48"
      className="h-11 w-11 text-[#e53935]"
      aria-hidden="true"
    >
      <rect
        x="11"
        y="7"
        width="26"
        height="34"
        rx="5"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M18 18h12M18 24h12M18 30h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M29 11v7h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        d="M6 12.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EthicalSustainableSourcingSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-28 lg:px-10">
      {/* Right-side background image */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] bg-cover bg-center xl:block"
        style={{
          backgroundImage:
            "url('/ethical-sourcing-bg.jpg')",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1580px]">
        <div className="max-w-[52rem] xl:pr-8">
          <div className="flex flex-col">
            {/* Section heading */}
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#334155] sm:text-xs">
                Ethical &amp; Sustainable Sourcing
              </p>

              <span className="mt-4 block h-[2px] w-24 bg-[#e53935]" />
            </div>

            <h2 className="mt-8 max-w-[13ch] text-[clamp(2.6rem,4.2vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#111827]">
              Ethical &amp; Sustainable Sourcing
            </h2>

            <p className="mt-7 max-w-[39rem] text-base leading-8 text-[#52606d] sm:text-[1.04rem]">
              We operate with full transparency, ensuring
              global compliance standards and responsible
              manufacturing practices.
            </p>

            {/* Certification cards */}
            <div className="mt-12 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {certifications.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-[1.6rem] border border-white/90 bg-white/84 px-5 py-6 text-center shadow-[0_18px_40px_rgba(51,65,85,0.08)] backdrop-blur-[10px] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(51,65,85,0.14)]"
                >
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.15rem] border border-[#ffe1e1] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,245,245,0.94))] shadow-[0_10px_24px_rgba(229,57,53,0.12)] transition duration-300 ease-out group-hover:shadow-[0_16px_30px_rgba(229,57,53,0.18)]">
                      <CertificationIcon
                        kind={item.kind}
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2937]">
                    {item.title}
                  </p>

                  <p className="mt-1.5 text-sm text-[#64748b]">
                    {item.subtitle}
                  </p>
                </article>
              ))}
            </div>

            {/* Ethical sourcing features */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {featureColumns.map((column, index) => (
                <div
                  key={`feature-column-${index}`}
                  className="space-y-4"
                >
                  {column.map((item) => (
                    <div
                      key={item}
                      className="group flex items-start gap-4 rounded-[1.35rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(244,247,250,0.96))] px-5 py-4 shadow-[0_12px_26px_rgba(71,85,105,0.06)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(71,85,105,0.11)]"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f06464_0%,#d94646_100%)] text-white shadow-[0_10px_24px_rgba(229,57,53,0.2)] transition duration-300 ease-out group-hover:shadow-[0_14px_28px_rgba(229,57,53,0.28)]">
                        <CheckIcon />
                      </span>

                      <p className="text-[0.96rem] leading-7 text-[#1f2937] sm:text-[1rem]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EthicalSustainableSourcingSection