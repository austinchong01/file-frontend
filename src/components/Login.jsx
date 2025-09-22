// src/components/Login.jsx - Enhanced with JWT auth check
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (api.isAuthenticated()) {
      // Optional: verify token is still valid
      api.dashboard().then((result) => {
        if (result.success) {
          navigate("/dashboard");
        }
        // If token is invalid, api.dashboard() will remove it automatically
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Logging in...");

    const result = await api.login(email, password);

    if (result.success) {
      setMessage(`Login successful! Welcome ${result.user.name}`);
      navigate("/dashboard");
    } else {
      setMessage(`Login failed: ${result.message}`);
    }

    setIsLoading(false);
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            File Storage
          </h1>
          <h2 className="text-2xl text-center text-gray-800 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-2 px-4 rounded ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={goToRegister}
              disabled={isLoading}
              className="text-blue-500 hover:text-blue-800 text-sm disabled:text-gray-400"
            >
              Don't have an account? Register here
            </button>
          </div>

          {message && (
            <p
              className={`text-center text-sm mt-4 ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
