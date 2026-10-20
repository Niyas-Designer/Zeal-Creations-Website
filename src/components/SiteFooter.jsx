import { Link } from "react-router-dom";

const footerNavLinks = [
  { label: "About Us", to: "/about-us" },
  { label: "Collection", to: "/products" },
  { label: "Showrooms", to: "/infrastructure" },
  { label: "Contact", to: "/contact-us" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/zeal-groups",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M6.35 8.3A1.85 1.85 0 106.3 4.6a1.85 1.85 0 00.05 3.7zM4.8 19.3h3.1V9.65H4.8V19.3zm5 0h3.1v-4.85c0-1.28.24-2.52 1.82-2.52 1.55 0 1.58 1.45 1.58 2.6v4.77h3.1v-5.4c0-2.65-.57-4.68-3.66-4.68-1.48 0-2.48.82-2.88 1.58h-.04V9.65H9.8c.04.76 0 9.65 0 9.65z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function DetailIcon({ type }) {
  if (type === "location") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M12 21c3.8-4.46 6-7.69 6-11a6 6 0 10-12 0c0 3.31 2.2 6.54 6 11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="12"
          cy="10"
          r="2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="5.5"
          width="17"
          height="13"
          rx="2.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M5 7l7 5.2L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M7.2 4.8h2.1l1.15 3.2-1.5 1.5a13.9 13.9 0 006.55 6.55l1.5-1.5 3.2 1.15v2.1c0 .9-.73 1.63-1.63 1.63A15.97 15.97 0 014.57 6.43c0-.9.73-1.63 1.63-1.63z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(229,57,53,0.45),_rgba(229,57,53,0.18)_34%,_rgba(0,0,0,0)_72%)] blur-2xl" />

      <div className="mx-auto max-w-[1580px] px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
          {/* Footer heading */}
          <div className="max-w-[50rem]">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-white/84">
              <span>Zeal Creations</span>

              <span className="h-2 w-2 rounded-full bg-[#e53935]" />
            </div>

            <h2 className="mt-8 text-[clamp(2.8rem,7vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-white">
              <span>Let&apos;s build</span>

              <br />

              <span className="text-[#e53935]">
                market-ready
              </span>

              <br />

              <span>knitwear solutions.</span>
            </h2>
          </div>

          {/* QR section */}
          <div className="w-full max-w-sm xl:max-w-[30rem] xl:pt-2">
            <div className="inline-flex border border-[#e53935]/85 bg-white/6 p-4 shadow-[0_0_0_1px_rgba(229,57,53,0.2),0_22px_44px_rgba(229,57,53,0.08)] transition duration-300 ease-out hover:shadow-[0_0_0_1px_rgba(229,57,53,0.45),0_28px_52px_rgba(229,57,53,0.16)] xl:p-6">
              <div className="rounded-[1.5rem] bg-white p-4 xl:p-6">
                <img
                  src="/zeal-linkedin-qr.jpg"
                  alt="Zeal Creations LinkedIn QR code"
                  className="h-44 w-44 object-cover sm:h-52 sm:w-52 xl:h-[21rem] xl:w-[21rem] 2xl:h-[23rem] 2xl:w-[23rem]"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.18em] text-white/84 xl:text-[1rem]">
                Connect with us
              </p>

              <p className="mt-2 text-base text-white/62 xl:text-[1.15rem]">
                ON WHATSAPP
              </p>
            </div>
          </div>
        </div>

        {/* Locations and contact details */}
        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 lg:grid-cols-[1.1fr_1.1fr_1.2fr]">
          {/* India */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/88">
              India
            </h3>

            <div className="mt-4 flex items-start gap-3 text-white/68">
              <DetailIcon type="location" />

              <div>
                <p className="text-base text-white">
                  Tirupur, Tamil Nadu
                </p>

                <p className="mt-1 text-sm uppercase tracking-[0.12em] text-white/48">
                  Manufacturing Head Office
                </p>
              </div>
            </div>
          </div>

          {/* Dubai and USA */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/88">
              Dubai
            </h3>

            <div className="mt-4 flex items-start gap-3 text-white/68">
              <DetailIcon type="location" />

              <div>
                <p className="text-base text-white">
                  United Arab Emirates Distribution Office
                </p>
              </div>
            </div>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/88">
              U.S.A
            </h3>

            <div className="mt-4 flex items-start gap-3 text-white/68">
              <DetailIcon type="location" />

              <div>
                <p className="text-base text-white">
                  Coming Soon...
                </p>
              </div>
            </div>
          </div>

          {/* Email and phone */}
          <div className="space-y-5">
            <div className="flex items-start gap-3 text-white/68">
              <DetailIcon type="email" />

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/48">
                  Email
                </p>

                <a
                  href="mailto:srinivas@zealgroups.in"
                  className="mt-1 inline-block text-base text-white transition hover:text-[#e53935] hover:underline"
                >
                  srinivas@zealgroups.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/68">
              <DetailIcon type="phone" />

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/48">
                  Phone
                </p>

                <a
                  href="tel:+914212262556"
                  className="mt-1 inline-block text-base text-white transition hover:text-[#e53935] hover:underline"
                >
                  +91 421 2262556
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/68">
              {footerNavLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="transition hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="text-white/76 transition duration-300 ease-out hover:scale-110 hover:text-[#e53935]"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/48 lg:flex-row lg:items-center lg:justify-between">
            <p>
              © 2026 Zeal Creations. All rights reserved.
            </p>

            <Link
              to="/privacy-policy"
              className="transition hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;