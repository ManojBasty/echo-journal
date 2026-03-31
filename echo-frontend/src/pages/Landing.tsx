// import { useNavigate } from "react-router-dom";

// export default function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#020617] text-white">

//       {/* ===== NAVBAR ===== */}
//       <div className="flex justify-between items-center px-8 py-5 border-b border-white/10">
//         <h1 className="text-xl font-semibold tracking-wide">ECHO</h1>

//         <div className="flex gap-4">
//           <button
//             onClick={() => navigate("/login")}
//             className="text-gray-300 hover:text-white"
//           >
//             Login
//           </button>

//           <button
//             onClick={() => navigate("/register")}
//             className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-sm"
//           >
//             Get Started
//           </button>
//         </div>
//       </div>

//       {/* ===== HERO ===== */}
//       <div className="text-center mt-24 px-6">
//         <h2 className="text-4xl md:text-5xl font-bold leading-tight">
//           Your thoughts, <br />
//           <span className="text-purple-500">understood by AI</span>
//         </h2>

//         <p className="mt-6 text-gray-400 max-w-xl mx-auto">
//           ECHO helps you reflect, analyze, and grow through your journaling.
//           Turn your daily thoughts into meaningful insights.
//         </p>

//         <div className="mt-8 flex justify-center gap-4">
//           <button
//             onClick={() => navigate("/register")}
//             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
//           >
//             Start Journaling
//           </button>

//           <button
//             onClick={() => navigate("/login")}
//             className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10"
//           >
//             Login
//           </button>
//         </div>
//       </div>

//       {/* ===== FEATURES ===== */}
//       <div className="mt-32 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

//         {[
//           {
//             title: "AI Insights",
//             desc: "Understand your emotions and patterns automatically.",
//           },
//           {
//             title: "Mood Tracking",
//             desc: "Visualize your emotional journey over time.",
//           },
//           {
//             title: "Weekly Reflection",
//             desc: "Get deeper insights into your thoughts every week.",
//           },
//         ].map((f, i) => (
//           <div
//             key={i}
//             className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur hover:border-purple-500 transition"
//           >
//             <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
//             <p className="text-gray-400 text-sm">{f.desc}</p>
//           </div>
//         ))}
//       </div>

//       {/* ===== FOOTER ===== */}
//       <div className="mt-32 text-center text-gray-500 text-sm pb-6">
//         © {new Date().getFullYear()} ECHO — AI Journaling App
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold tracking-wide">ECHO</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm hover:underline"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-1 rounded-lg text-sm"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 space-y-6">

        <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          Your private AI-powered reflection journal
        </h2>

        <p className="text-gray-500 max-w-xl">
          Write freely. Understand your emotions. Discover patterns.
          Echo helps you reflect better with AI-driven insights.
        </p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-400 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 px-8 pb-20 max-w-6xl mx-auto">

        <div className="p-6 rounded-xl border bg-white/60 dark:bg-[#1e293b]/80 backdrop-blur">
          <h3 className="font-semibold text-lg mb-2">📝 Smart Journaling</h3>
          <p className="text-sm text-gray-500">
            Capture your thoughts effortlessly with a clean, distraction-free writing space.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-white/60 dark:bg-[#1e293b]/80 backdrop-blur">
          <h3 className="font-semibold text-lg mb-2">🧠 AI Insights</h3>
          <p className="text-sm text-gray-500">
            Get meaningful summaries, emotional scores, and reflection prompts instantly.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-white/60 dark:bg-[#1e293b]/80 backdrop-blur">
          <h3 className="font-semibold text-lg mb-2">📊 Mood Tracking</h3>
          <p className="text-sm text-gray-500">
            Visualize emotional trends and discover patterns over time.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-400 pb-6">
        Built with focus on privacy • No sharing • No tracking
      </div>
    </div>
  );
}