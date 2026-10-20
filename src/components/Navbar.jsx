import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about-us" },
   { label: 'Design Studio', to: '/design-studio' },
  { label: "Products", to: "/products" },
  { label: "Brands", to: "/our-brand" },
  { label: "Services", to: "/services" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleNavigation() {
    setIsMenuOpen(false)

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })

    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={handleNavigation}
          aria-label="Go to ZEAL home page"
        >
          <span className="flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
            <img
              src="/ZEAL%20LOGO.png"
              alt="ZEAL Creations logo"
              className="h-full w-full object-contain"
            />
          </span>

          <span className="min-w-0">
            <img
              src="/zeal-wordmark.svg"
              alt="ZEAL"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          <ul className="flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `relative whitespace-nowrap py-2 text-[13px] font-medium tracking-[0.08em] transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#db3627] after:transition-transform after:duration-300 ${
                      isActive
                        ? 'text-[#161616] after:scale-x-100'
                        : 'text-[#3d3d3d] hover:text-[#161616] hover:after:scale-x-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/contact-us"
            onClick={handleNavigation}
            className="inline-flex h-11 items-center justify-center bg-[#1d1d1d] px-5 text-[13px] font-medium tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#db3627] hover:shadow-[0_12px_24px_rgba(219,54,39,0.16)]"
          >
            Work With Us
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/contact-us"
            onClick={handleNavigation}
            className="hidden h-10 items-center justify-center border border-stone-300 px-3 text-[11px] font-medium tracking-[0.1em] text-[#1d1d1d] transition-colors duration-200 hover:border-[#db3627] hover:text-[#db3627] sm:inline-flex"
          >
            Work With Us
          </Link>

          <button
            type="button"
            aria-label={
              isMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`group relative flex h-11 w-11 items-center justify-center overflow-hidden bg-[#1f1f1f] p-2 text-white transition-all duration-300 hover:bg-[#db3627] ${
              isMenuOpen
                ? 'shadow-[0_14px_28px_rgba(31,31,31,0.22)]'
                : 'shadow-[0_10px_22px_rgba(31,31,31,0.14)]'
            }`}
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-all duration-500 group-hover:translate-x-full group-hover:opacity-100" />

            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                className={`absolute h-[3px] w-5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)] transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? 'translate-y-0 rotate-45'
                    : '-translate-y-[7px]'
                }`}
              />

              <span
                className={`absolute h-[3px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)] transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? 'w-0 opacity-0'
                    : 'w-5 opacity-100'
                }`}
              />

              <span
                className={`absolute h-[3px] w-5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)] transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? 'translate-y-0 -rotate-45'
                    : 'translate-y-[7px]'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-stone-200 bg-[#faf8f4] lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `border-b border-stone-200 py-3 text-sm font-medium tracking-[0.08em] transition-colors last:border-b-0 ${
                    isActive
                      ? 'text-[#db3627]'
                      : 'text-[#2b2b2b] hover:text-[#db3627]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/contact-us"
              onClick={handleNavigation}
              className="mt-4 inline-flex h-11 items-center justify-center bg-[#1d1d1d] px-5 text-sm font-medium tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#db3627]"
            >
              Work With Us
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar