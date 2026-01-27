import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/auth/authSlice";
import { authAPI } from "../redux/auth/authAPI";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaUserShield,
  FaShieldAlt,
} from "react-icons/fa";
import { BiCheckCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginStart());
    try {
      await authAPI.login({ email, password }, dispatch);
      dispatch(loginSuccess());
      <Navigate to="/dashboard" />;
      toast.success("Login successful!");
    } catch (error) {
       <Navigate to="/dashboard" />;
      dispatch(
        loginFailure(error.message || "Login failed. Please try again."),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 text-center border-b border-emerald-800/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 mb-6 shadow-lg shadow-emerald-900/50"
            >
              <FaUserShield className="text-3xl text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-emerald-200/70">
              Sign in to your admin dashboard
            </p>
          </div>

          {/* Card Body */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-emerald-400" />
                    Email Address
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaEnvelope className="text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-emerald-400" />
                    Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaLock className="text-emerald-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 ${rememberMe ? "bg-emerald-500 border-emerald-500" : "border-emerald-400/50 group-hover:border-emerald-400"} transition-all duration-200 flex items-center justify-center`}
                    >
                      {rememberMe && (
                        <BiCheckCircle className="text-white text-sm" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-emerald-200 group-hover:text-emerald-100 transition-colors">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-900/20 border border-red-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <FaShieldAlt />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-gray-700 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/30 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Card Footer */}
          <div className="p-6 border-t border-emerald-800/30 bg-gradient-to-t from-black/20 to-transparent">
            <div className="text-center">
              <p className="text-sm text-emerald-200/60">
                Secure access • Admin only • Protected by encryption
              </p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-emerald-200/50 text-sm">
            <span className="text-emerald-400">© 2024 Admin Panel</span> •
            v2.0.1
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-emerald-300/40">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>SSL Secured</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -20, 20, -10],
              x: [null, 10, -10, 5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
