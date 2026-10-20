const profiles = [
  {
    name: "P. Srinivasan",
    role: "Managing Director",
    image: "/optimized/management-01.jpg",
    position: "object-[center_top]",
    email: "srinivas@zealgroups.in",
  },
  {
    name: "Manzoor Ahmed Khan",
    role: "Managing Director",
    image: "/optimized/management-02.jpg",
    position: "object-[center_top]",
    email: "manzoor@zealgroups.in",
  },
  {
    name: "Abu Hassan",
    role: "Managing Director",
    image: "/optimized/management-03.jpg",
    position: "object-[center_top]",
    email: "hassan@zealgroups.in",
  },
];

function MailIcon() {
  return (
    <img
      src="/management-mail-icon.jpg"
      alt=""
      className="h-5 w-5 object-contain"
      aria-hidden="true"
    />
  );
}

function ManagementTeamSection() {
  return (
    <section className="relative overflow-hidden bg-[#f2f6fa] px-6 py-24 sm:px-8 sm:py-28 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: "url('/optimized/Banner%201.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(242,246,250,0.98))]" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="flex flex-col gap-6">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-sm text-[#5b6670]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7f95ad]" />
              <span>Leadership</span>
            </p>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.6rem)] font-semibold tracking-[-0.05em] text-[#1a1a1a]">
              Meet the Management
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b6b6b] sm:text-[1.02rem]">
              Meet the talented individuals who drive our company&apos;s success
              with their dedication, expertise, and passion for innovation.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {profiles.map((profile) => (
            <article
              key={profile.name}
              className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-[0_18px_42px_rgba(61,84,109,0.08)] backdrop-blur-[6px] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(61,84,109,0.13)]"
            >
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#eef4fa_0%,#dde7f1_100%)]">
                <div className="relative h-[21rem] sm:h-[24rem] xl:h-[25rem]">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] ${profile.position}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(34,52,74,0.12)_100%)]" />
                </div>

                <div className="absolute inset-x-3 bottom-3">
                  <div className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-[#e8eef5] bg-white/96 px-5 py-4 shadow-[0_12px_28px_rgba(47,67,89,0.08)] backdrop-blur-sm">
                    <div className="min-w-0">
                      <h3 className="truncate text-[1.1rem] font-semibold tracking-[-0.03em] text-[#1a1a1a]">
                        {profile.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#6b7683]">
                        {profile.role}
                      </p>
                    </div>

                    <a
                      href={`mailto:${profile.email}`}
                      aria-label={`Email ${profile.name}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d7e1eb] bg-[#f8fbfe] transition duration-300 ease-out hover:border-[#c2d2e1] hover:bg-white"
                    >
                      <MailIcon />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 px-1">
                <p className="text-sm leading-6 text-[#5e6b78]">
                  <span className="font-medium text-[#d74b56]">Email :</span>{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="transition hover:text-[#1a1a1a] hover:underline"
                  >
                    {profile.email}
                  </a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ManagementTeamSection;
