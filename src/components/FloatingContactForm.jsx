const whatsappNumber = '919597684666'
const whatsappMessage =
  'Hello ZEAL Creations, I would like to discuss an apparel enquiry.'

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-6 w-6 sm:h-7 sm:w-7"
      fill="currentColor"
    >
      <path d="M16.04 3C8.86 3 3.02 8.78 3.02 15.9c0 2.5.73 4.94 2.12 7.02L3 29l6.29-2.06a13.07 13.07 0 0 0 6.74 1.86h.01C23.22 28.8 29 23.02 29 15.9S23.22 3 16.04 3Zm0 23.62h-.01a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-3.73 1.22 1.24-3.61-.26-.42a10.72 10.72 0 0 1-1.68-5.76c0-5.92 4.86-10.74 10.83-10.74 2.89 0 5.61 1.12 7.65 3.15a10.63 10.63 0 0 1 3.17 7.59c0 5.92-4.86 10.74-10.82 10.74Zm5.94-8.04c-.33-.16-1.93-.94-2.23-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.21-.38.24-.71.08-.33-.16-1.39-.51-2.64-1.62-.98-.86-1.64-1.93-1.83-2.25-.19-.32-.02-.5.14-.66.15-.14.33-.38.49-.57.16-.19.22-.32.33-.54.11-.21.05-.4-.03-.57-.08-.16-.74-1.78-1.02-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.32-1.15 1.11-1.15 2.71s1.18 3.15 1.34 3.37c.16.21 2.31 3.5 5.6 4.91.78.34 1.39.54 1.87.69.79.25 1.5.21 2.07.13.63-.09 1.93-.78 2.2-1.54.27-.76.27-1.4.19-1.54-.08-.13-.3-.21-.63-.38Z" />
    </svg>
  )
}

function FloatingContactForm() {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with ZEAL Creations on WhatsApp"
        className="pointer-events-auto inline-flex h-14 w-14 animate-[contact-float_4.2s_ease-in-out_infinite] items-center justify-center rounded-full bg-[#ff0c00] text-white shadow-[0_18px_42px_rgba(15,23,42,0.25)] transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#1fbd5a] hover:shadow-[0_24px_54px_rgba(37,211,102,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 sm:h-auto sm:w-auto sm:gap-3 sm:px-5 sm:py-3.5"
      >
        {/* <span className="hidden text-sm font-semibold uppercase tracking-[0.12em] sm:inline">
          WhatsApp Us
        </span> */}

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/14">
          <WhatsAppIcon />
        </span>
      </a>
    </div>
  )
}

export default FloatingContactForm