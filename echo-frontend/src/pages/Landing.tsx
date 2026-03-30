import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ===== NAVBAR ===== */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-wide">ECHO</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-300 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div className="text-center mt-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Your thoughts, <br />
          <span className="text-purple-500">understood by AI</span>
        </h2>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto">
          ECHO helps you reflect, analyze, and grow through your journaling.
          Turn your daily thoughts into meaningful insights.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Start Journaling
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10"
          >
            Login
          </button>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="mt-32 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

        {[
          {
            title: "AI Insights",
            desc: "Understand your emotions and patterns automatically.",
          },
          {
            title: "Mood Tracking",
            desc: "Visualize your emotional journey over time.",
          },
          {
            title: "Weekly Reflection",
            desc: "Get deeper insights into your thoughts every week.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur hover:border-purple-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-32 text-center text-gray-500 text-sm pb-6">
        © {new Date().getFullYear()} ECHO — AI Journaling App
      </div>
    </div>
  );
}