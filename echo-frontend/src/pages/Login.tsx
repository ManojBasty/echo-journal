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
  <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-black dark:text-white">

    <div className="bg-white dark:bg-gray-900 p-8 rounded shadow w-96 space-y-4">

      <h2 className="text-2xl font-semibold text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 rounded border bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 rounded border bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="w-full bg-black text-white p-2 rounded">
        Login
      </button>

    </div>
  </div>
);
}