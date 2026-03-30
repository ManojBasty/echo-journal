import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const data = await loginUser(email, password);

    console.log("LOGIN RESPONSE:", data); // ADD THIS

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } catch (error: any) {
    console.log("LOGIN ERROR:", error.response); // ADD THIS
    alert(error.response?.data?.message || "Login failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">

    <div className="w-full max-w-md p-8 rounded-2xl 
    bg-white/5 border border-white/10 backdrop-blur space-y-5">

      <h2 className="text-2xl font-semibold text-center text-white">
        Welcome back
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg 
        bg-black/30 border border-white/10 
        text-white placeholder-gray-400 
        focus:outline-none focus:border-purple-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-lg 
        bg-black/30 border border-white/10 
        text-white placeholder-gray-400 
        focus:outline-none focus:border-purple-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full py-3 rounded-lg 
        bg-purple-600 hover:bg-purple-700 
        transition text-white font-medium"
      >
        Login
      </button>

    </div>
  </div>
);
}