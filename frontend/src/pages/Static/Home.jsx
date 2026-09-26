import { useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "animejs/lib/anime.es.js";
import StaticLayout from "./StaticLayout";

export default function Home() {

  useEffect(() => {

    // Hero title animation
    anime({
      targets: ".hero-word",
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [-20, 0],
      duration: 900,
      delay: anime.stagger(90),
      easing: "easeOutExpo",
    });

    // Hero badge
    anime({
      targets: ".hero-badge",
      scale: [0.7, 1],
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutBack",
    });

    // Stats counter
    document.querySelectorAll(".counter").forEach((element) => {

      const target = Number(element.dataset.value);

      anime({
        targets: { value: 0 },
        value: target,
        duration: 1800,
        easing: "easeOutExpo",
        round: 1,
        update: function (anim) {
          element.innerHTML =
            Math.round(anim.animations[0].currentValue) +
            (element.dataset.suffix || "");
        },
      });

    });

    // Floating hero card
    anime({
      targets: ".hero-floating-card",
      translateY: [-10, 10],
      direction: "alternate",
      loop: true,
      duration: 2500,
      easing: "easeInOutSine",
    });

    // Feature icons
    anime({
      targets: ".feature-icon",
      scale: [0.7, 1],
      rotate: [-15, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(130),
      easing: "easeOutBack",
    });

    return () => {
      anime.remove([
        ".hero-word",
        ".hero-badge",
        ".counter",
        ".hero-floating-card",
        ".feature-icon",
      ]);
    };

  }, []);

  const features = [
    {
      icon: "⚡",
      title: "AI-Powered Onboarding",
      text: "Create personalized onboarding experiences based on role, skills, department and organizational requirements.",
    },
    {
      icon: "🧠",
      title: "Adaptive Learning Paths",
      text: "Employees receive structured learning paths that can adapt as they complete requirements and demonstrate knowledge.",
    },
    {
      icon: "📊",
      title: "Progress Intelligence",
      text: "Give managers a clear view of onboarding progress, outstanding requirements and employee readiness.",
    },
    {
      icon: "🛡️",
      title: "Policy Awareness",
      text: "Centralize policies and make important organizational information easier for employees to discover.",
    },
    {
      icon: "🎯",
      title: "Role-Based Experiences",
      text: "Build onboarding journeys around the actual responsibilities and expectations associated with each role.",
    },
    {
      icon: "🔄",
      title: "Continuous Improvement",
      text: "Use onboarding insights to identify gaps and improve the experience for future employees.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create your workspace",
      text: "Set up your organization and define the basic structure of your onboarding environment.",
    },
    {
      number: "02",
      title: "Define requirements",
      text: "Organize policies, competencies, documents and role-specific expectations.",
    },
    {
      number: "03",
      title: "Build onboarding paths",
      text: "Create structured journeys for employees based on their role and responsibilities.",
    },
    {
      number: "04",
      title: "Track progress",
      text: "Monitor completion and identify requirements that still need attention.",
    },
  ];

  return (
    <StaticLayout>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 lg:pt-28 pb-20">

          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-14 items-center">

            {/* Left */}

            <div>

              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-violet-100 shadow-sm mb-7">

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span className="text-sm font-bold text-violet-700">
                  AI-powered onboarding platform
                </span>

                <span className="text-xs text-slate-400">
                  v2.0
                </span>

              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-[#10182f]">

                <span className="hero-word inline-block">
                  Onboard
                </span>{" "}

                <span className="hero-word inline-block bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  smarter.
                </span>

                <br />

                <span className="hero-word inline-block">
                  Grow
                </span>{" "}

                <span className="hero-word inline-block text-violet-700">
                  faster.
                </span>

              </h1>

              <p className="reveal mt-7 max-w-2xl text-lg leading-8 text-slate-500">
                SkillSprint AI brings onboarding, requirements, policies,
                learning paths and progress tracking into one intelligent
                workspace for modern teams.
              </p>

              <div className="reveal flex flex-col sm:flex-row gap-4 mt-9">

                <Link
                  to="/register"
                  className="animated-button group inline-flex justify-center items-center gap-3 px-7 py-4 rounded-2xl bg-[#11182d] text-white font-bold shadow-xl shadow-slate-900/15 hover:bg-violet-700 transition"
                >
                  Start onboarding
                  <span className="group-hover:translate-x-1 transition">
                    →
                  </span>
                </Link>

                <Link
                  to="/contact"
                  className="animated-button inline-flex justify-center items-center gap-3 px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold shadow-sm hover:border-violet-300 hover:text-violet-700 hover:-translate-y-1 transition"
                >
                  Talk to our team
                </Link>

              </div>

              <div className="reveal flex flex-wrap gap-6 mt-9 text-sm text-slate-500">

                <span className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Role-based
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  AI-assisted
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Progress tracking
                </span>

              </div>

            </div>

            {/* Right visual */}

            <div className="relative">

              <div className="hero-floating-card relative bg-white rounded-[30px] border border-slate-200 shadow-2xl shadow-violet-500/10 p-6">

                <div className="flex items-center justify-between mb-7">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Workspace
                    </p>

                    <h3 className="text-xl font-black mt-1">
                      Onboarding overview
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-black">
                    AI
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">

                    <p className="text-xs text-violet-500 font-bold">
                      Active
                    </p>

                    <p className="text-3xl font-black mt-2">
                      24
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Employees
                    </p>

                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100">

                    <p className="text-xs text-cyan-600 font-bold">
                      Progress
                    </p>

                    <p className="text-3xl font-black mt-2">
                      78%
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Average completion
                    </p>

                  </div>

                </div>

                <div className="mt-4 p-5 rounded-2xl border border-slate-100">

                  <div className="flex justify-between mb-3">

                    <span className="text-sm font-bold">
                      New employee journey
                    </span>

                    <span className="text-xs text-emerald-500 font-bold">
                      On track
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

                    <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-violet-600 to-cyan-400" />

                  </div>

                  <div className="flex justify-between mt-3 text-xs text-slate-400">

                    <span>Requirements</span>
                    <span>76%</span>

                  </div>

                </div>

                <div className="mt-4 space-y-3">

                  {[
                    ["✓", "Security policy", "Completed"],
                    ["✓", "Role orientation", "Completed"],
                    ["→", "Department training", "In progress"],
                  ].map((item) => (

                    <div
                      key={item[1]}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-violet-50 transition"
                    >

                      <div className="flex items-center gap-3">

                        <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-violet-600 font-bold shadow-sm">
                          {item[0]}
                        </span>

                        <span className="text-sm font-semibold">
                          {item[1]}
                        </span>

                      </div>

                      <span className="text-xs text-slate-400">
                        {item[2]}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

              <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-violet-300/30 blur-3xl rounded-full" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-cyan-300/30 blur-3xl rounded-full" />

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="border-y border-slate-200 bg-white">

        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              ["3", "x", "Faster onboarding workflows"],
              ["92", "%", "Completion visibility"],
              ["24", "+", "Workspace capabilities"],
              ["24", "/7", "Accessible workspace"],
            ].map(([number, suffix, text]) => (

              <div
                key={text}
                className="animated-card text-center lg:text-left"
              >

                <div className="text-4xl font-black text-slate-900">

                  <span
                    className="counter"
                    data-value={number}
                    data-suffix={suffix}
                  >
                    0
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-2">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-24">

        <div className="max-w-2xl mb-14">

          <span className="reveal text-xs font-black uppercase tracking-[.2em] text-violet-600">
            Platform capabilities
          </span>

          <h2 className="reveal text-4xl sm:text-5xl font-black mt-4 tracking-tight">
            Everything your onboarding workspace needs.
          </h2>

          <p className="reveal text-slate-500 text-lg leading-8 mt-5">
            Replace scattered documents, manual follow-ups and disconnected
            onboarding processes with one structured workspace.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="animated-card group p-7 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 hover:border-violet-200 transition-all duration-500"
            >

              <div className="feature-icon w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition duration-500">
                {feature.icon}
              </div>

              <h3 className="text-xl font-black mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-500 leading-7">
                {feature.text}
              </p>

              <div className="mt-6 text-sm font-bold text-violet-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                Explore capability →
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="bg-white border-y border-slate-200">

        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24">

          <div className="text-center max-w-2xl mx-auto mb-16">

            <span className="reveal text-xs font-black uppercase tracking-[.2em] text-violet-600">
              Simple workflow
            </span>

            <h2 className="reveal text-4xl font-black mt-4">
              From first day to full readiness.
            </h2>

            <p className="reveal text-slate-500 mt-5 leading-7">
              A structured approach that gives employees clarity while giving
              managers better visibility.
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-5">

            {steps.map((step) => (

              <div
                key={step.number}
                className="animated-card relative p-7 rounded-3xl bg-[#f8f9ff] border border-slate-200 hover:bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
              >

                <span className="text-5xl font-black text-violet-100">
                  {step.number}
                </span>

                <h3 className="font-black text-lg mt-5">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-500 leading-7 mt-3">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="max-w-5xl mx-auto px-6 py-24">

        <div className="relative overflow-hidden rounded-[35px] bg-[#11182d] px-7 sm:px-14 py-16 text-center text-white">

          <div className="absolute top-0 left-1/4 w-60 h-60 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative">

            <span className="reveal inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold">
              Build a better onboarding experience
            </span>

            <h2 className="reveal text-4xl sm:text-5xl font-black mt-6">
              Ready to make onboarding smarter?
            </h2>

            <p className="reveal max-w-2xl mx-auto text-slate-300 mt-5 leading-7">
              Bring employees, requirements, policies and progress together
              in one intelligent workspace.
            </p>

            <Link
              to="/register"
              className="animated-button inline-flex mt-8 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black hover:bg-violet-50 hover:-translate-y-1 transition"
            >
              Create your workspace →
            </Link>

          </div>

        </div>

      </section>

    </StaticLayout>
  );
}