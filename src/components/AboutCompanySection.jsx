function AboutCompanySection() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch lg:gap-20">
          {/* Left content */}
          <div className="max-w-xl lg:pt-3">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#222]">
              Welcome To Zeal Creations
            </p>

            <div className="mt-4 flex items-center gap-4">
              <span className="h-px w-16 bg-[#ff0c00]" />
            </div>

            <h2 className="mt-7 text-[clamp(2.45rem,4.6vw,4.2rem)] leading-[0.98] tracking-[-0.045em] text-[#181818]">
              About ZEAL
            </h2>

            <div className="mt-8 space-y-5">
              <p className="max-w-[620px] text-[15px] leading-8 text-[#303030] sm:text-[17px]">
                ZEAL is a Tiruppur-based fashion manufacturing company
                delivering complete design-to-delivery solutions for global and
                domestic markets. From the initial design concept and product
                development to manufacturing, quality control, packing, and
                final delivery, every stage is managed through one connected and
                professionally controlled system.
              </p>

              <p className="max-w-[620px] text-[15px] leading-8 text-[#303030] sm:text-[17px]">
                With in-house design, sampling, sourcing, production,
                warehousing, and logistics capabilities, ZEAL maintains greater
                control over quality, speed, consistency, and scalability. This
                integrated manufacturing model allows products to move
                efficiently from creative development to market-ready
                production without depending on disconnected external vendors.
              </p>

              <p className="max-w-[620px] text-[15px] leading-8 text-[#303030] sm:text-[17px]">
                Beyond manufacturing, ZEAL operates through a growing network of
                showrooms, retail outlets, and customer-facing clothing stores.
                By connecting in-house production with its retail and
                distribution network, ZEAL creates a complete fashion ecosystem
                that takes every product from design and manufacturing directly
                to the showroom, outlet, and final customer.
              </p>
            </div>
          </div>

          {/* Right image grid */}
          <div className="grid h-full gap-5 md:grid-cols-[1.08fr_0.92fr]">
            {/* Left image column */}
            <div className="grid h-full grid-rows-2 gap-5">
              <figure className="h-full overflow-hidden rounded-[2rem] bg-[#f4f1eb] shadow-[0_18px_40px_rgba(20,20,20,0.08)]">
                <div className="h-full min-h-[260px]">
                  <img
                    src="/optimized/About%201.jpg"
                    alt="ZEAL design and product presentation studio"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  decoding="async"
/>
                </div>
              </figure>

              <figure className="h-full overflow-hidden rounded-[2rem] bg-[#f4f1eb] shadow-[0_18px_40px_rgba(20,20,20,0.08)]">
                <div className="h-full min-h-[260px]">
                  <img
                    src="/optimized/About%203.jpg"
                    alt="ZEAL operations and coordination environment"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  decoding="async"
/>
                </div>
              </figure>
            </div>

            {/* Right image column */}
            <div className="grid h-full grid-rows-2 gap-5 md:py-6">
              <figure className="h-full overflow-hidden rounded-[2rem] bg-[#f4f1eb] shadow-[0_18px_40px_rgba(20,20,20,0.08)]">
                <div className="h-full min-h-[240px]">
                  <img
                    src="/About%202.jpg"
                    alt="ZEAL workspace supporting product development"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  decoding="async"
/>
                </div>
              </figure>

              <figure className="h-full overflow-hidden rounded-[2rem] bg-[#f4f1eb] shadow-[0_18px_40px_rgba(20,20,20,0.08)]">
                <div className="h-full min-h-[240px]">
                  <img
                    src="/About%204.jpg"
                    alt="ZEAL brand and customer experience environment"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  decoding="async"
/>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutCompanySection;