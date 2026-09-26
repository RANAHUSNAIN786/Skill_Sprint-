import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import anime from "animejs/lib/anime.es.js";

export default function StaticLayout({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (loading) return;

    // Main page entrance
    anime({
      targets: ".page-shell",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      easing: "easeOutExpo",
    });

    // Navbar entrance
    anime({
      targets: ".static-nav",
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 800,
      easing: "easeOutExpo",
    });

    // Animated blobs
    anime({
      targets: ".floating-orb",
      translateY: [-18, 18],
      translateX: [-12, 12],
      direction: "alternate",
      loop: true,
      duration: 3500,
      easing: "easeInOutSine",
      delay: anime.stagger(300),
    });

    // Background grid
    anime({
      targets: ".background-grid",
      opacity: [0, 0.55],
      duration: 1400,
      easing: "easeOutQuad",
    });

    // Reveal elements
    anime({
      targets: ".reveal",
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 750,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });

    // Cards
    anime({
      targets: ".animated-card",
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.97, 1],
      duration: 700,
      delay: anime.stagger(90),
      easing: "easeOutExpo",
    });

    // Buttons
    anime({
      targets: ".animated-button",
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 600,
      delay: 400,
      easing: "easeOutBack",
    });

    return () => {
      anime.remove([
        ".page-shell",
        ".static-nav",
        ".floating-orb",
        ".background-grid",
        ".reveal",
        ".animated-card",
        ".animated-button",
      ]);
    };
  }, [loading, location.pathname]);

  const links = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "Policy", path: "/policy" },
    { name: "Terms", path: "/terms" },
  ];

  const handleNavHover = (e) => {
    anime({
      targets: e.currentTarget.querySelector(".nav-icon"),
      scale: [1, 1.25, 1],
      rotate: [0, -8, 8, 0],
      duration: 450,
      easing: "easeOutBack",
    });
  };

  const handleButtonHover = (e) => {
    anime({
      targets: e.currentTarget,
      scale: 1.04,
      duration: 250,
      easing: "easeOutQuad",
    });
  };

  const handleButtonLeave = (e) => {
    anime({
      targets: e.currentTarget,
      scale: 1,
      duration: 300,
      easing: "easeOutElastic(1, .6)",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#17213d] overflow-hidden">

      {/* ================= LOADER ================= */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <div className="text-center">

            <div className="relative mx-auto w-20 h-20 mb-6">

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 animate-pulse" />

              <div className="absolute inset-[4px] rounded-[14px] bg-white flex items-center justify-center">
                <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  S
                </span>
              </div>

            </div>

            <p className="font-bold text-slate-800">
              SkillSprint AI
            </p>

            <div className="flex justify-center gap-1 mt-3">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:100ms]" />
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:200ms]" />
            </div>

          </div>
        </div>
      )}

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="background-grid absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="floating-orb absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="floating-orb absolute top-[25%] -right-24 w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="floating-orb absolute bottom-0 left-[35%] w-72 h-72 rounded-full bg-orange-200/20 blur-3xl" />

      </div>

      {/* ================= NAVBAR ================= */}

      <header className="static-nav relative z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="h-[78px] flex items-center justify-between">

            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-3 group"
              onMouseEnter={(e) => {
                anime({
                  targets: e.currentTarget.querySelector(".brand-box"),
                  rotate: [0, -8, 8, 0],
                  scale: [1, 1.08, 1],
                  duration: 500,
                  easing: "easeOutBack",
                });
              }}
            >

              <div className="brand-box w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-black text-xl">
                  S
                </span>
              </div>

              <div className="hidden sm:block">
                <h1 className="font-extrabold text-[17px] tracking-tight text-slate-900">
                  SkillSprint AI
                </h1>

                <p className="text-xs text-slate-400 font-medium">
                  Intelligent onboarding
                </p>
              </div>

            </Link>

            {/* Desktop Navigation */}

            <nav className="hidden md:flex items-center gap-1">

              {links.map((link, index) => {
                const active =
                  location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onMouseEnter={handleNavHover}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                      text-sm font-semibold transition-all duration-300
                      ${
                        active
                          ? "text-violet-700 bg-violet-50"
                          : "text-slate-600 hover:text-violet-700 hover:bg-slate-50"
                      }
                    `}
                  >

                    <span className="nav-icon text-[11px]">
                      {["⌂", "✉", "◈", "◆"][index]}
                    </span>

                    {link.name}

                    {active && (
                      <span className="absolute left-1/2 -bottom-[10px] -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600" />
                    )}

                  </Link>
                );
              })}

            </nav>

            {/* Right Side */}

            <div className="hidden md:flex items-center gap-3">

              <Link
                to="/login"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:border-violet-300 hover:text-violet-700 transition"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="animated-button px-5 py-2.5 rounded-xl bg-[#11182d] text-white text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-violet-700 transition"
              >
                Get Started
              </Link>

            </div>

            {/* Mobile button */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 text-xl"
            >
              {menuOpen ? "×" : "☰"}
            </button>

          </div>

          {/* Mobile menu */}

          {menuOpen && (
            <div className="md:hidden pb-5 pt-2">

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xl">

                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="grid grid-cols-2 gap-2 mt-3">

                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold"
                  >
                    Register
                  </Link>

                </div>

              </div>

            </div>
          )}

        </div>
      </header>

      {/* ================= PAGE ================= */}

      <main className="page-shell relative z-10">
        {children}
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="relative z-10 bg-[#10172d] text-white mt-20">

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8">

          <div className="grid md:grid-cols-4 gap-12">

            {/* Brand */}

            <div className="md:col-span-1">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center">
                  <span className="font-black text-lg">
                    S
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold">
                    SkillSprint AI
                  </h3>
                  <p className="text-xs text-slate-400">
                    Intelligent onboarding
                  </p>
                </div>

              </div>

              <p className="text-sm leading-7 text-slate-400">
                A modern AI-powered onboarding platform designed to help
                organizations build better employee experiences, faster.
              </p>

            </div>

            {/* Product */}

            <div>
              <h4 className="font-bold mb-5">
                Platform
              </h4>

              <div className="space-y-3 text-sm text-slate-400">

                <Link
                  to="/"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Home
                </Link>

                <Link
                  to="/contact"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Contact
                </Link>

                <Link
                  to="/policy"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/terms"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Terms of Service
                </Link>

              </div>
            </div>

            {/* Capabilities */}

            <div>

              <h4 className="font-bold mb-5">
                Capabilities
              </h4>

              <div className="space-y-3 text-sm text-slate-400">

                <p>AI onboarding paths</p>
                <p>Employee progress tracking</p>
                <p>Role-based learning</p>
                <p>Policy management</p>
                <p>Team insights</p>

              </div>

            </div>

            {/* Contact */}

            <div>

              <h4 className="font-bold mb-5">
                Get in touch
              </h4>

              <div className="space-y-4 text-sm text-slate-400">

                <p>
                  Have a question about SkillSprint AI?
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-violet-300 font-semibold hover:text-white transition"
                >
                  Contact our team
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

          <div className="h-px bg-white/10 my-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">

            <p>
              © {new Date().getFullYear()} SkillSprint AI. All rights reserved.
            </p>

            <div className="flex items-center gap-5">

              <Link
                to="/policy"
                className="hover:text-white transition"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="hover:text-white transition"
              >
                Terms
              </Link>

              <Link
                to="/contact"
                className="hover:text-white transition"
              >
                Contact
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}