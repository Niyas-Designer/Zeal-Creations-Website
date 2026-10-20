import emailjs from "@emailjs/browser";
import { useMemo, useState } from "react";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-[#deded9] bg-white px-4 py-3 text-sm text-[#1d1d1d] outline-none transition placeholder:text-[#9b9b95] focus:border-[#db3627] focus:ring-2 focus:ring-[#db3627]/10";

const zealLocationUrl =
  "https://www.google.com/maps/place/Zeal+Creations/@11.10418,77.3112403,278m/data=!3m1!1e3!4m6!3m5!1s0x3ba907a2592e5d95:0x41e924ec0e1cd3a0!8m2!3d11.1016579!4d77.3073303!16s%2Fg%2F1vljds7w?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D";
function InfoIcon({ type }) {
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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

  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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

function WorkWithUsPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const emailConfig = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      toEmail:
        import.meta.env.VITE_CONTACT_RECEIVER_EMAIL || "srinivas@zealgroups.in",
    }),
    [],
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setStatus({
      type: "",
      message: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete your first name, email, and message.",
      });

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({
        type: "error",
        message: "Please enter a valid business email address.",
      });

      return;
    }

    if (
      !emailConfig.serviceId ||
      !emailConfig.templateId ||
      !emailConfig.publicKey
    ) {
      setStatus({
        type: "error",
        message: "Email service is not configured. Please check the .env file.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const fullName =
        `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          from_name: fullName,
          from_email: form.email.trim(),
          reply_to: form.email.trim(),
          to_email: emailConfig.toEmail,
          company_name: form.company.trim() || "Not provided",
          phone: form.phone.trim() || "Not provided",
          subject: form.subject.trim() || "Business enquiry",
          message: form.message.trim(),
          submitted_at: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        {
          publicKey: emailConfig.publicKey,
        },
      );

      console.info("Work With Us EmailJS success:", {
        status: response.status,
        text: response.text,
        receiver: emailConfig.toEmail,
      });

      setForm(initialForm);

      setStatus({
        type: "success",
        message:
          "Thank you. Your business enquiry has been sent successfully.",
      });
    } catch (error) {
      console.error("Work With Us EmailJS error:", {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        error,
      });

      const errorMessage =
        error?.text ||
        error?.message ||
        "The message could not be sent. Please try again.";

      setStatus({
        type: "error",
        message: `Email sending failed: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative overflow-hidden bg-[#e9eae6] px-5 py-14 text-[#202027] sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#a7bcc0]/40 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full bg-[#b8b5d1]/40 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#c7aa96]/35 blur-[95px]" />

      <div className="relative mx-auto max-w-[1380px]">
        {/* Page introduction */}
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6b1f]">
            Work With Us
          </p>

          <h1 className="mt-5 text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#211d1a]">
            Let&apos;s build your next collection together.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#5b5651] sm:text-lg">
            From in-house design and development to manufacturing, quality
            control, packing, and final delivery, ZEAL provides a complete
            design-to-delivery partnership for brands, buyers, and retail
            businesses.
          </p>
        </div>

        {/* Main contact panel */}
        <section className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(32,32,39,0.14)] lg:grid-cols-[0.92fr_1.08fr]">
          {/* Left side */}
          <div className="flex flex-col p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
              Contact Information
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#202027] sm:text-4xl">
              Start a business enquiry.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f5f65] sm:text-base">
              Tell us about your product category, quantity, timeline, or
              sourcing requirement. Our team will review the enquiry and respond
              with the appropriate manufacturing direction.
            </p>

            <div className="mt-8 space-y-5 text-sm sm:text-base">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-[#db3627]">
                  <InfoIcon type="phone" />
                </span>

                <a
                  href="tel:+914212262556"
                  className="transition hover:text-[#db3627]"
                >
                  +91 421 2262556
                </a>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-[#db3627]">
                  <InfoIcon type="email" />
                </span>

                <a
                  href="mailto:srinivas@zealgroups.in"
                  className="break-all transition hover:text-[#db3627]"
                >
                  srinivas@zealgroups.in
                </a>
              </div>

              <a
                href={zealLocationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-start gap-4 transition hover:text-[#db3627]"
                aria-label="Open ZEAL Creations location in Google Maps"
              >
                <span className="mt-0.5 text-[#db3627] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <InfoIcon type="location" />
                </span>

                <span className="border-b border-transparent transition group-hover:border-[#db3627]">
                  Tiruppur, Tamil Nadu, India
                </span>
              </a>


            </div>

            {/* Temporary manufacturing image */}
            <a
              href={zealLocationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-10 block overflow-hidden rounded-[1.4rem] bg-[#efefeb]"
              aria-label="View ZEAL Creations on Google Maps"
            >
              <img
                src="/optimized/Zeal-Location-Map.jpg"
                alt="ZEAL Creations location map in Tiruppur"
                className="h-[260px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] sm:h-[320px]"
                loading="lazy"
              decoding="async"
/>

              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />

              <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d1d1d] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <InfoIcon type="location" />
                View on Google Maps
              </div>
            </a>
          </div>

          {/* Right side form */}
          <div className="border-t border-[#ecece7] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#db3627]">
              Send Us a Message
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#202027] sm:text-4xl">
              Share your requirement.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f5f65] sm:text-base">
              Fill in the form and our team will contact you regarding your
              enquiry.
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#29292f]">
                  First name <span className="text-[#db3627]">*</span>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    placeholder="Enter first name"
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-medium text-[#29292f]">
                  Last name
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    placeholder="Enter last name"
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-medium text-[#29292f]">
                  Business email <span className="text-[#db3627]">*</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="Enter email"
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-medium text-[#29292f]">
                  Phone
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Enter phone number"
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-medium text-[#29292f]">
                  Company / Brand name
                  <input
                    type="text"
                    value={form.company}
                    onChange={(event) =>
                      updateField("company", event.target.value)
                    }
                    placeholder="Enter company name"
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-medium text-[#29292f]">
                  Subject
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(event) =>
                      updateField("subject", event.target.value)
                    }
                    placeholder="Product or enquiry subject"
                    className={inputClassName}
                  />
                </label>
              </div>

              <label className="mt-5 block text-sm font-medium text-[#29292f]">
                Message <span className="text-[#db3627]">*</span>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Tell us about product type, quantity, timeline, and other requirements..."
                  rows="7"
                  className={`${inputClassName} resize-none`}
                />
              </label>

              {status.message ? (
                <p
                  className={`mt-5 text-sm ${
                    status.type === "success"
                      ? "text-emerald-700"
                      : "text-[#c9362b]"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex min-h-12 items-center justify-center bg-[#1d1d1d] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#db3627] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorkWithUsPage;