import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase/firebase";

import AboutCompanySection from "./components/AboutCompanySection";
import AboutZealPage from "./components/AboutZealPage";
import BrandPartnersSection from "./components/BrandPartnersSection";
import CatalogAdminPage from "./components/CatalogAdminPage";
import CategoryPage from "./components/CategoryPage";
import DesignStudioPage from "./components/DesignStudioPage";
import EthicalSustainableSourcingSection from "./components/EthicalSustainableSourcingSection";
import FloatingContactForm from "./components/FloatingContactForm";
import HeroCarousel from "./components/HeroCarousel";
import LegacyMigrationPage from "./components/LegacyMigrationPage";
import ManagementTeamSection from "./components/ManagementTeamSection";
import Navbar from "./components/Navbar";
import ProductDetailPage from "./components/ProductDetailPage";
import ProductShopPage from "./components/ProductShopPage";
import PromotionVideoPage from "./components/PromotionVideoPage";
import ScrollRevealSection from "./components/ScrollRevealSection";
import ServicesPage from "./components/ServicesPage";
import SiteFooter from "./components/SiteFooter";
import StatsHighlightSection from "./components/StatsHighlightSection";
import WhyZealPage from "./components/WhyZealPage";
import WorkWithUsPage from "./components/WorkWithUsPage";

/* =========================================================
   ROUTE SCROLL
========================================================= */

function RouteScrollManager() {
  const {
    pathname,
  } = useLocation();

  const navigationType =
    useNavigationType();

  useEffect(() => {
    if (
      navigationType ===
      "POP"
    ) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior:
              "auto",
          });
        },
      );

    return () =>
      window.cancelAnimationFrame(
        frame,
      );
  }, [
    pathname,
    navigationType,
  ]);

  return null;
}

/* =========================================================
   INFORMATION PAGES
========================================================= */

const informationPages = [
  {
    path: "/csr",
    eyebrow: "CSR",
    title:
      "Communicate impact through clear sustainability narratives.",
    description:
      "This area can later hold environmental goals, community initiatives, and measurable responsibility programmes.",
  },

  {
    path:
      "/infrastructure",
    eyebrow:
      "Infrastructure",
    title:
      "Showcase plants, systems, and industrial scale with confidence.",
    description:
      "Use this page for facility highlights, integrated operations, and large-scale production capabilities.",
  },

  {
    path:
      "/investors",
    eyebrow:
      "Investors",
    title:
      "Support an investor-facing experience with calm, structured design.",
    description:
      "This page can later include reports, governance details, disclosures, financial highlights, and market-facing communication.",
  },

  {
    path:
      "/careers",
    eyebrow:
      "Careers",
    title:
      "Recruit with a polished and modern manufacturing brand voice.",
    description:
      "Add workplace culture, recruitment information, open roles, and employee benefits here.",
  },

  {
    path:
      "/privacy-policy",
    eyebrow:
      "Privacy Policy",
    title:
      "Privacy and data usage information.",
    description:
      "This page can include data usage details, consent language, contact-form policies, and compliance-related information.",
  },
];

/* =========================================================
   INFORMATION PAGE
========================================================= */

function InformationPage({
  eyebrow,
  title,
  description,
}) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f7f3] px-6 py-16 text-slate-900 sm:px-8 sm:py-20 lg:px-10">

      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_48px_rgba(17,17,17,0.05)] backdrop-blur sm:p-10 lg:p-14">

        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8a6a2a]">
          {eyebrow}
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-[#2f2924] md:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-[#5c5148] md:text-lg">
          {description}
        </p>

      </div>

    </main>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  return (
    <>
      <HeroCarousel />

      <ScrollRevealSection>
        <AboutCompanySection />
      </ScrollRevealSection>

      <ScrollRevealSection>
        <StatsHighlightSection />
      </ScrollRevealSection>

      <WhyZealPage />

      <ScrollRevealSection>
        <CategoryPage />
      </ScrollRevealSection>

      <ScrollRevealSection>
        <BrandPartnersSection />
      </ScrollRevealSection>

      <ScrollRevealSection>
        <EthicalSustainableSourcingSection />
      </ScrollRevealSection>

      <ScrollRevealSection>
        <ManagementTeamSection />
      </ScrollRevealSection>
    </>
  );
}

/* =========================================================
   PUBLIC WEBSITE
========================================================= */

function PublicLayout() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/about-us"
          element={
            <AboutZealPage />
          }
        />

        <Route
          path="/design-studio"
          element={
            <DesignStudioPage />
          }
        />

        <Route
          path="/products"
          element={
            <ProductShopPage />
          }
        />

        <Route
          path="/products/:productId"
          element={
            <ProductDetailPage />
          }
        />

        <Route
          path="/our-brand"
          element={
            <BrandPartnersSection variant="page" />
          }
        />

        <Route
          path="/why-zeal"
          element={
            <WhyZealPage />
          }
        />

        <Route
          path="/services"
          element={
            <ServicesPage />
          }
        />

        <Route
          path="/promotion-video"
          element={
            <PromotionVideoPage />
          }
        />

        <Route
          path="/contact-us"
          element={
            <WorkWithUsPage />
          }
        />

        {informationPages.map(
          (page) => (
            <Route
              key={
                page.path
              }
              path={
                page.path
              }
              element={
                <InformationPage
                  eyebrow={
                    page.eyebrow
                  }
                  title={
                    page.title
                  }
                  description={
                    page.description
                  }
                />
              }
            />
          ),
        )}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      <FloatingContactForm />

      <SiteFooter />

    </>
  );
}

/* =========================================================
   FIREBASE AUTH ERROR
========================================================= */

function getLoginErrorMessage(
  error,
) {
  const code =
    error?.code || "";

  if (
    code ===
      "auth/invalid-credential" ||
    code ===
      "auth/wrong-password" ||
    code ===
      "auth/user-not-found"
  ) {
    return "Invalid email or password.";
  }

  if (
    code ===
    "auth/invalid-email"
  ) {
    return "Enter a valid email address.";
  }

  if (
    code ===
    "auth/too-many-requests"
  ) {
    return "Too many login attempts. Please wait and try again.";
  }

  if (
    code ===
    "auth/network-request-failed"
  ) {
    return "Network error. Check your internet connection and try again.";
  }

  if (
    code ===
    "auth/user-disabled"
  ) {
    return "This account has been disabled.";
  }

  return (
    error?.message ||
    "Unable to sign in."
  );
}

/* =========================================================
   FIREBASE CATALOGUE LOGIN
========================================================= */

function CatalogLogin() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const handleLogin =
    async (event) => {
      event.preventDefault();

      if (submitting) {
        return;
      }

      const cleanEmail =
        email.trim();

      if (
        !cleanEmail ||
        !password
      ) {
        setError(
          "Enter your email and password.",
        );

        return;
      }

      setSubmitting(
        true,
      );

      setError("");

      try {
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password,
        );
      } catch (loginError) {
        console.error(
          "Firebase catalogue login failed:",
          loginError,
        );

        setError(
          getLoginErrorMessage(
            loginError,
          ),
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#f3f1ed] px-4 py-10 text-[#171717] sm:px-6 lg:px-8">

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1200px] items-center justify-center">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
              ZEAL
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
              Catalogue Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#726b64]">
              Sign in securely to manage catalogue products and images.
            </p>

          </div>

          <form
            onSubmit={
              handleLogin
            }
            className="rounded-[1.5rem] bg-white p-6 shadow-sm sm:p-8"
          >

            <label className="block">

              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#6f6861]">
                Email
              </span>

              <input
                type="email"
                value={
                  email
                }
                onChange={(
                  event,
                ) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="Enter email"
                autoComplete="email"
                disabled={
                  submitting
                }
                className="w-full border border-[#d5d0ca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
              />

            </label>

            <label className="mt-5 block">

              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#6f6861]">
                Password
              </span>

              <input
                type="password"
                value={
                  password
                }
                onChange={(
                  event,
                ) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={
                  submitting
                }
                className="w-full border border-[#d5d0ca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
              />

            </label>

            {error && (
              <p className="mt-4 rounded-lg bg-[#fff1ee] px-4 py-3 text-sm leading-6 text-[#c72e20]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                submitting
              }
              className="zeal-button mt-6 w-full bg-[#171717] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#db3627] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Signing In..."
                : "Login"}
            </button>

            <div className="mt-6 border-t border-[#ece8e3] pt-5 text-center">

              <p className="text-[11px] leading-6 text-[#8b837b]">
                Protected with Firebase Authentication.
              </p>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   AUTH LOADING
========================================================= */

function CatalogAuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f1ed] px-6 text-[#171717]">

      <div className="text-center">

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db3627]">
          ZEAL
        </p>

        <h1 className="mt-4 text-2xl font-semibold">
          Checking secure session...
        </h1>

      </div>

    </main>
  );
}

/* =========================================================
   PROTECTED CATALOGUE AREA
========================================================= */

function CatalogArea({
  page = "catalog",
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (
          currentUser,
        ) => {
          setUser(
            currentUser,
          );

          setAuthLoading(
            false,
          );
        },
        (error) => {
          console.error(
            "Firebase auth state error:",
            error,
          );

          setUser(
            null,
          );

          setAuthLoading(
            false,
          );
        },
      );

    return unsubscribe;
  }, []);

  const handleLogout =
    async () => {
      if (
        signingOut
      ) {
        return;
      }

      setSigningOut(
        true,
      );

      try {
        await signOut(
          auth,
        );
      } catch (error) {
        console.error(
          "Firebase logout failed:",
          error,
        );
      } finally {
        setSigningOut(
          false,
        );
      }
    };

  if (
    authLoading
  ) {
    return (
      <CatalogAuthLoading />
    );
  }

  if (!user) {
    return (
      <CatalogLogin />
    );
  }

  return (
    <div className="relative">

      <button
        type="button"
        onClick={
          handleLogout
        }
        disabled={
          signingOut
        }
        className="zeal-button fixed right-4 top-4 z-[9999] border border-[#d6d0ca] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#171717] shadow-sm transition hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:right-6 sm:top-6"
      >
        {signingOut
          ? "Logging Out..."
          : "Logout"}
      </button>

      {page ===
      "migration" ? (
        <LegacyMigrationPage />
      ) : (
        <CatalogAdminPage />
      )}

    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const {
    pathname,
  } = useLocation();

  const isCatalogPage =
    pathname ===
      "/catalog" ||
    pathname.startsWith(
      "/catalog/",
    );

  return (
    <>
      <RouteScrollManager />

      {isCatalogPage ? (
        <Routes>

          <Route
            path="/catalog"
            element={
              <CatalogArea />
            }
          />

          <Route
            path="/catalog/migration"
            element={
              <CatalogArea page="migration" />
            }
          />

          <Route
            path="/catalog/*"
            element={
              <Navigate
                to="/catalog"
                replace
              />
            }
          />

        </Routes>
      ) : (
        <PublicLayout />
      )}

    </>
  );
}

export default App;