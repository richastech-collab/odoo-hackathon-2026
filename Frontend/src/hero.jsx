import { motion } from "framer-motion";
import { Car, User, Ticket, Clock3, ArrowRight, PlayCircle } from "lucide-react";

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path
        d="M17 2C9.3 2 3 8.3 3 16c0 1.3 1.5 1.9 2.4 1L11 11.4c.9-.9 2.4-.3 2.4 1v3.1c0 .5-.2 1-.6 1.4L8.4 21.3c-.6.6-.2 1.7.7 1.7H17c7.7 0 14-6.3 14-14S24.7 2 17 2Z"
        fill="#6D28D9"
      />
      <path
        d="M17 32c7.7 0 14-6.3 14-14 0-1.3-1.5-1.9-2.4-1L23 22.6c-.9.9-2.4.3-2.4-1v-3.1c0-.5.2-1 .6-1.4l4.4-4.4c.6-.6.2-1.7-.7-1.7H17c-7.7 0-14 6.3-14 14s6.3 14 14 14Z"
        fill="#1E1B4B"
      />
    </svg>
  );
}

function TruckScene() {
  return (
    <svg viewBox="0 0 560 420" fill="none" className="w-full h-auto">
      {/* skyline */}
      <g opacity="0.35">
        {[
          [10, 260, 30, 140],
          [50, 230, 26, 170],
          [86, 250, 34, 150],
          [130, 210, 24, 190],
          [164, 240, 30, 160],
          [204, 195, 28, 205],
          [242, 225, 22, 175],
          [274, 200, 32, 200],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#C4B5FD" rx="2" />
        ))}
      </g>
      <g opacity="0.28">
        {[
          [330, 235, 28, 165],
          [366, 205, 24, 195],
          [400, 245, 32, 155],
          [440, 215, 26, 185],
          [474, 250, 30, 150],
          [512, 220, 24, 180],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#C4B5FD" rx="2" />
        ))}
      </g>

      {/* road */}
      <path d="M0 372 C 140 350, 420 350, 560 300 L 560 420 L 0 420 Z" fill="#E9E4FB" />
      <path d="M0 366 C 140 344, 420 344, 560 294" stroke="#A78BFA" strokeWidth="3" opacity="0.5" />
      <path
        d="M20 368 C 150 348, 410 348, 540 300"
        stroke="white"
        strokeWidth="3"
        strokeDasharray="14 12"
        opacity="0.9"
      />

      {/* trailer */}
      <rect x="270" y="178" width="220" height="130" rx="6" fill="#F4F4F7" stroke="#D8D6E6" strokeWidth="1.5" />
      <rect x="270" y="178" width="220" height="14" fill="#E4E2F0" />
      <line x1="330" y1="192" x2="330" y2="308" stroke="#D8D6E6" strokeWidth="1.5" />
      <line x1="390" y1="192" x2="390" y2="308" stroke="#D8D6E6" strokeWidth="1.5" />
      <line x1="450" y1="192" x2="450" y2="308" stroke="#D8D6E6" strokeWidth="1.5" />

      {/* cab */}
      <path d="M150 220 h95 c8 0 15 5 18 12 l14 34 h13 v46 H150 z" fill="#8B5CF6" />
      <path d="M150 220 h95 c8 0 15 5 18 12 l14 34 H150 z" fill="#7C3AED" />
      {/* windshield */}
      <path d="M198 232 h34 c5 0 9 3 11 8 l8 20 h-53 z" fill="#1E1B4B" opacity="0.85" />
      {/* door line */}
      <line x1="196" y1="232" x2="196" y2="308" stroke="#6D28D9" strokeWidth="2" />
      {/* headlight */}
      <rect x="150" y="278" width="10" height="14" rx="3" fill="#FDE68A" />
      {/* grille */}
      <rect x="150" y="296" width="10" height="18" rx="2" fill="#5B21B6" />
      {/* step/bumper */}
      <rect x="145" y="308" width="145" height="8" rx="2" fill="#5B21B6" />

      {/* undercarriage shadow */}
      <ellipse cx="330" cy="330" rx="200" ry="14" fill="#6D28D9" opacity="0.12" />

      {/* wheels */}
      {[190, 260, 420, 470].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="316" r="20" fill="#27222E" />
          <circle cx={cx} cy="316" r="9" fill="#B8B4C6" />
        </g>
      ))}
    </svg>
  );
}

function Hero() {
  const navLinks = ["Features", "Solutions", "Pricing", "About Us", "Contact"];

  const stats = [
    { icon: Car, number: "650+", label: "Vehicles" },
    { icon: User, number: "120+", label: "Drivers" },
    { icon: Ticket, number: "1,250+", label: "Trips" },
    { icon: Clock3, number: "99.8%", label: "Uptime" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-white to-violet-50 overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-bold text-slate-900">TransitOps</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm text-slate-600 hover:text-slate-900 transition">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
            Login
          </button>
          <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold mb-6">
            Smart Transport Operations
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] text-slate-900 tracking-tight">
            Manage Your Fleet
            <span className="block">Smarter, Better, Faster</span>
          </h1>

          <p className="mt-5 text-base text-slate-500 max-w-md leading-relaxed">
            All-in-one platform to manage vehicles, drivers, trips,
            maintenance, expenses and analytics in real time.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition shadow-lg shadow-violet-200">
              Get Started
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition">
              <PlayCircle size={16} />
              View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <TruckScene />
        </motion.div>
      </section>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, number, label }) => (
            <div
              key={label}
              className="bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-100 px-5 py-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-violet-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900 leading-none">{number}</span>
              </div>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
