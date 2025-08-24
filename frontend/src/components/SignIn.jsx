import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/authSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass: password }),
        credentials: "include", // 🔥 important: httpOnly cookie
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(loginFailure(data.message || "Invalid login"));
      } else {
        // Store only user info; token is in httpOnly cookie
        const userData = data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(loginSuccess({ user: userData }));
        navigate("/");
      }
    } catch (err) {
      dispatch(loginFailure("Server error. Try again."));
    }
  };

  return (
    <div className="min-h-[90svh] flex items-center justify-center bg-gray-50 font-josefin">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-12 md:p-16"
      >
        <h2 className="text-4xl font-bold text-center text-red-600 mb-10">
          Admin Sign In
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600 text-lg">Signing you in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <div className="flex items-center border rounded-xl px-4 py-3 shadow-sm">
                <Mail className="text-red-600 mr-3" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none text-gray-700 text-lg"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <div className="flex items-center border rounded-xl px-4 py-3 shadow-sm">
                <Lock className="text-red-600 mr-3" size={20} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-gray-700 text-lg"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 text-red-600 border border-red-300 rounded-xl p-3 text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition-all text-white py-3 rounded-xl font-semibold text-lg shadow-md"
            >
              Sign In
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SignIn;
