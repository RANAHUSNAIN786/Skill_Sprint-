import { useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import StaticLayout from "./StaticLayout";

export default function Terms() {

  const [active, setActive] = useState("acceptance");

  useEffect(() => {

    anime({
      targets: ".terms-header",
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: "easeOutExpo",
    });

    anime({
      targets: ".terms-section",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });

    return () => {
      anime.remove([
        ".terms-header",
        ".terms-section",
      ]);
    };

  }, []);

  const sections = [
    {
      id: "acceptance",
      number: "01",
      title: "Acceptance of terms",
      text: "By accessing or using SkillSprint AI, you acknowledge that you have read and understood these Terms of Service and agree to follow the applicable terms governing use of the platform.",
    },
    {
      id: "account",
      number: "02",
      title: "Accounts and responsibilities",
      text: "Users are responsible for maintaining appropriate account information and protecting credentials used to access their account. Organizations may establish additional access rules for their workspace.",
    },
    {
      id: "workspace",
      number: "03",
      title: "Workspace usage",
      text: "SkillSprint AI is intended to support employee onboarding, requirements management, learning workflows and related organizational activities. Users should use the platform only for lawful and authorized purposes.",
    },
    {
      id: "content",
      number: "04",
      title: "User and organization content",
      text: "Organizations and users remain responsible for the content and information they submit to the platform. You should only provide information that you are authorized to use and process.",
    },
    {
      id: "ai",
      number: "05",
      title: "AI-assisted features",
      text: "Some platform capabilities may use AI-assisted functionality to generate suggestions, organize information or support onboarding workflows. AI-generated information should be reviewed by appropriate users before being relied upon for important organizational decisions.",
    },
    {
      id: "acceptable",
      number: "06",
      title: "Acceptable use",
      text: "Users must not use the platform to violate applicable laws, interfere with platform security, attempt unauthorized access, distribute malicious content or misuse the service in a way that could harm other users or the platform.",
    },
    {
      id: "availability",
      number: "07",
      title: "Availability and changes",
      text: "Platform functionality may change over time as features are improved, replaced or discontinued. Maintenance, updates or technical circumstances may temporarily affect availability.",
    },
    {
      id: "intellectual",
      number: "08",
      title: "Intellectual property",
      text: "The platform, branding, interface, software and associated materials are protected by applicable intellectual property laws. Except where expressly permitted, users may not copy, modify or redistribute protected platform materials.",
    },
    {
      id: "termination",
      number: "09",
      title: "Suspension or termination",
      text: "Access may be suspended or terminated where necessary to protect the platform, users, organizations or to address violations of applicable terms.",
    },
    {
      id: "updates",
      number: "10",
      title: "Updates to these terms",
      text: "These Terms of Service may be updated periodically. Continued use of the platform after an updated version becomes effective may be subject to the revised terms.",
    },
  ];

  return (
    <StaticLayout>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-24">

        <div className="terms-header max-w-4xl">

          <span className="inline-flex px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-black uppercase tracking-widest text-cyan-700">
            Legal
          </span>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mt-6">
            Terms of Service
          </h1>

          <p className="text-lg leading-8 text-slate-500 mt-6">
            These terms describe the general rules and responsibilities
            associated with using the SkillSprint AI platform.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-500">
              Last updated: September 2026
            </span>

            <span className="px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-100 text-sm font-semibold text-cyan-700">
              Service guidelines
            </span>

          </div>

        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10 mt-16">

          {/* Contents */}

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
                          ? "bg-cyan-50 text-cyan-700"
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

          {/* Terms */}

          <div className="space-y-5">

            {sections.map((section) => (

              <article
                id={section.id}
                key={section.id}
                className="terms-section group bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-200 hover:-translate-y-1 transition-all duration-500"
              >

                <div className="flex gap-5">

                  <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 items-center justify-center font-black group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition">
                    {section.number}
                  </div>

                  <div>

                    <h2 className="text-2xl font-black mb-4">
                      {section.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-500 leading-8">
                      {section.text}
                    </p>

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