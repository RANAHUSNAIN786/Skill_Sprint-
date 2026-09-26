import { useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import StaticLayout from "./StaticLayout";

export default function Policy() {

  const [active, setActive] = useState("collection");

  useEffect(() => {

    anime({
      targets: ".policy-header",
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: "easeOutExpo",
    });

    anime({
      targets: ".policy-section",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });

    return () => {
      anime.remove([
        ".policy-header",
        ".policy-section",
      ]);
    };

  }, []);

  const sections = [
    {
      id: "collection",
      number: "01",
      title: "Information we collect",
      content: (
        <>
          <p>
            SkillSprint AI may collect information that you provide when
            creating an account, using the platform, contacting support or
            interacting with workspace features.
          </p>

          <p>
            Depending on how the platform is configured, this may include
            account information, professional information, onboarding
            requirements, preferences and activity associated with your
            workspace.
          </p>
        </>
      ),
    },
    {
      id: "usage",
      number: "02",
      title: "How information is used",
      content: (
        <>
          <p>
            Information may be used to provide, maintain and improve the
            SkillSprint AI experience.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Provide onboarding workflows.</li>
            <li>Display role-specific requirements.</li>
            <li>Track completion and progress.</li>
            <li>Provide customer support.</li>
            <li>Improve platform functionality.</li>
            <li>Protect platform security.</li>
          </ul>
        </>
      ),
    },
    {
      id: "security",
      number: "03",
      title: "Security",
      content: (
        <>
          <p>
            We use reasonable technical and organizational measures designed
            to protect information from unauthorized access, alteration,
            disclosure or destruction.
          </p>

          <p>
            No internet-based service can guarantee absolute security.
            Security practices may evolve as the platform and its
            infrastructure develop.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      number: "04",
      title: "Information sharing",
      content: (
        <>
          <p>
            Information may be processed by service providers that help
            operate, maintain or secure the platform, where appropriate.
          </p>

          <p>
            We do not treat customer information as a public resource.
            Access should be limited according to the purpose for which the
            information is processed and the configuration of the workspace.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      number: "05",
      title: "Data retention",
      content: (
        <>
          <p>
            Information may be retained for as long as necessary to provide
            the relevant service, meet operational requirements, resolve
            disputes, maintain security or satisfy applicable obligations.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      number: "06",
      title: "Your choices",
      content: (
        <>
          <p>
            Depending on your location and applicable requirements, you may
            have rights relating to your personal information.
          </p>

          <p>
            Requests concerning account information or privacy can be sent
            through the contact page.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      number: "07",
      title: "Changes to this policy",
      content: (
        <>
          <p>
            This Privacy Policy may be updated from time to time as the
            platform, business practices or legal requirements change.
          </p>

          <p>
            When material changes are made, the updated version should be
            made available through the appropriate platform or website.
          </p>
        </>
      ),
    },
  ];

  return (
    <StaticLayout>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-24">

        <div className="policy-header max-w-4xl">

          <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-xs font-black uppercase tracking-widest text-violet-700">
            Privacy
          </span>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mt-6">
            Privacy Policy
          </h1>

          <p className="text-lg leading-8 text-slate-500 mt-6">
            This page describes the general approach SkillSprint AI may use
            when handling information through its platform and website.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-500">
              Last updated: September 2026
            </span>

            <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-semibold text-emerald-700">
              Transparency first
            </span>

          </div>

        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10 mt-16">

          {/* Sidebar */}

          <aside className="hidden lg:block">

            <div className="sticky top-28 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">

              <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-4">
                Contents
              </p>

              <div className="space-y-1">

                {sections.map((section) => (

                  <button
                    key={section.id}
                    onClick={() => {

                      setActive(section.id);

                      document
                        .getElementById(section.id)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });

                    }}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold
                      transition-all
                      ${
                        active === section.id
                          ? "bg-violet-50 text-violet-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    {section.number}. {section.title}
                  </button>

                ))}

              </div>

            </div>

          </aside>

          {/* Content */}

          <div className="space-y-5">

            {sections.map((section) => (

              <article
                id={section.id}
                key={section.id}
                className="policy-section group bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-200 transition-all duration-500"
              >

                <div className="flex gap-5">

                  <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-violet-50 text-violet-600 items-center justify-center font-black group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 transition">
                    {section.number}
                  </div>

                  <div className="flex-1">

                    <h2 className="text-2xl font-black mb-5">
                      {section.title}
                    </h2>

                    <div className="space-y-4 text-sm sm:text-base text-slate-500 leading-8">
                      {section.content}
                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

    </StaticLayout>
  );
}