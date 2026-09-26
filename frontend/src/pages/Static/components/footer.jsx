import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center">
                <span className="text-slate-950 font-black text-lg">
                  S
                </span>
              </div>

              <div>
                <p className="text-white font-bold text-lg">
                  SkillSprint <span className="text-amber-400">AI</span>
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.18em]">
                  Smarter Onboarding
                </p>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-7 max-w-md">
              SkillSprint AI helps organizations create personalized,
              AI-powered onboarding experiences that help teams learn,
              adapt, and contribute faster.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {["in", "X", "gh"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              Product
            </h3>

            <div className="space-y-3 text-sm">
              <Link
                to="/"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Home
              </Link>

              <Link
                to="/register"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              Company
            </h3>

            <div className="space-y-3 text-sm">
              <Link
                to="/contact"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Contact
              </Link>

              <Link
                to="/policy"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="block text-slate-400 hover:text-amber-300 transition"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SkillSprint AI. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-xs text-slate-500">
              <Link
                to="/policy"
                className="hover:text-slate-300 transition"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="hover:text-slate-300 transition"
              >
                Terms
              </Link>

              <Link
                to="/contact"
                className="hover:text-slate-300 transition"
              >
                Contact
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}