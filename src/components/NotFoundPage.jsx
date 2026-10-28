import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f2ef] px-4 py-12 text-[#171717] sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center justify-center">
        <div className="w-full text-center">

          <div className="flex justify-center">
            <img
              src="/ZEAL LOGO.png"
              alt="ZEAL"
              className="h-12 w-auto object-contain sm:h-14"
            />
          </div>

          <div className="mt-10">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#db3627]">
              Error 404
            </p> */}

            <h1 className="mt-4 text-[clamp(7rem,20vw,15rem)] font-black leading-[0.8] tracking-[-0.08em]">
              404
            </h1>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Page Not Found
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#706962] sm:text-base">
              The page you are looking for does not exist, may have moved,
              or is no longer available.
            </p>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="zeal-button min-w-[190px] bg-[#171717] px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition duration-200 hover:bg-[#db3627]"
            >
              Back to Home
            </Link>

            {/* <Link
              to="/products"
              className="min-w-[190px] border border-[#171717] bg-transparent px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#171717] transition duration-200 hover:bg-[#171717] hover:text-white"
            >
              View Products
            </Link> */}
          </div>

          <div className="mx-auto mt-14 h-px max-w-xl bg-[#d8d3cd]" />

          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[#9a938d]">
            Design • Develop • Source • Deliver
          </p>

        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;