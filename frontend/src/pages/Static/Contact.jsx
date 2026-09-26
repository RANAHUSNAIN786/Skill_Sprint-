import { useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import StaticLayout from "./StaticLayout";

export default function Contact() {

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {

    anime({
      targets: ".contact-heading",
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 900,
      easing: "easeOutExpo",
    });

    anime({
      targets: ".contact-card",
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.96, 1],
      duration: 900,
      delay: anime.stagger(150),
      easing: "easeOutExpo",
    });

    anime({
      targets: ".contact-icon",
      scale: [0, 1],
      rotate: [-20, 0],
      duration: 700,
      delay: anime.stagger(120),
      easing: "easeOutBack",
    });

    return () => {
      anime.remove([
        ".contact-heading",
        ".contact-card",
        ".contact-icon",
      ]);
    };

  }, []);

  const submitForm = (e) => {

    e.preventDefault();

    setSubmitted(true);

    anime({
      targets: ".success-message",
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.95, 1],
      duration: 600,
      easing: "easeOutBack",
    });
  };

  const contactItems = [
    {
      icon: "✉",
      title: "General questions",
      text: "Questions about SkillSprint AI, onboarding or the platform.",
      action: "Send us a message",
    },
    {
      icon: "◉",
      title: "Product support",
      text: "Need help understanding a feature or workspace workflow?",
      action: "Get support",
    },
    {
      icon: "⚡",
      title: "Partnerships",
      text: "Interested in discussing integrations or business collaboration?",
      action: "Discuss partnership",
    },
  ];

  return (
    <StaticLayout>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-24">

        {/* Header */}

        <div className="contact-heading max-w-3xl mb-14">

          <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-xs font-black uppercase tracking-widest text-violet-700">
            Contact SkillSprint AI
          </span>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mt-6">
            Let's build a better
            <span className="block bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              onboarding experience.
            </span>
          </h1>

          <p className="text-lg leading-8 text-slate-500 mt-6">
            Have a question, suggestion or partnership idea?
            Send us a message and our team can help you find the right
            direction.
          </p>

        </div>

        {/* Contact cards */}

        <div className="grid md:grid-cols-3 gap-5 mb-16">

          {contactItems.map((item) => (

            <div
              key={item.title}
              className="contact-card group p-7 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 hover:border-violet-200 transition-all duration-500"
            >

              <div className="contact-icon w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-xl text-violet-700 mb-6 group-hover:bg-violet-600 group-hover:text-white transition">
                {item.icon}
              </div>

              <h3 className="text-xl font-black">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 leading-7 mt-3">
                {item.text}
              </p>

              <p className="text-sm text-violet-600 font-bold mt-5 group-hover:translate-x-1 transition">
                {item.action} →
              </p>

            </div>

          ))}

        </div>

        {/* Main area */}

        <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-8">

          {/* Information */}

          <div className="contact-card bg-[#11182d] text-white rounded-[30px] p-8 sm:p-10 relative overflow-hidden">

            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-600/30 blur-3xl" />

            <div className="relative">

              <span className="text-xs uppercase tracking-widest font-black text-violet-300">
                Let's connect
              </span>

              <h2 className="text-3xl font-black mt-4">
                Questions are always welcome.
              </h2>

              <p className="text-slate-300 leading-7 mt-5">
                Whether you are exploring the platform, planning an
                organization-wide rollout or simply want to learn more,
                send us a message.
              </p>

              <div className="space-y-5 mt-10">

                <div className="flex gap-4">

                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    ✉
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Email
                    </p>
                    <p className="font-bold mt-1">
                      hello@skillsprint.ai
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    ◷
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Response
                    </p>
                    <p className="font-bold mt-1">
                      Usually within one business day
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Form */}

          <div className="contact-card bg-white border border-slate-200 rounded-[30px] p-7 sm:p-10 shadow-sm">

            {submitted ? (

              <div className="success-message min-h-[450px] flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-6">
                  ✓
                </div>

                <h2 className="text-3xl font-black">
                  Message received
                </h2>

                <p className="text-slate-500 max-w-md leading-7 mt-4">
                  Thank you for reaching out. Your message has been
                  submitted successfully.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-7 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-violet-700 transition"
                >
                  Send another message
                </button>

              </div>

            ) : (

              <form
                onSubmit={submitForm}
                className="space-y-6"
              >

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Full name
                  </label>

                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Email address
                  </label>

                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Subject
                  </label>

                  <select
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition bg-white"
                  >
                    <option>General question</option>
                    <option>Product support</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Message
                  </label>

                  <textarea
                    required
                    rows="6"
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#11182d] text-white font-black hover:bg-violet-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300"
                >
                  Send message →
                </button>

              </form>

            )}

          </div>

        </div>

      </section>

    </StaticLayout>
  );
}