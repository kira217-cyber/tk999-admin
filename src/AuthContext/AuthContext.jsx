// src/context/AuthContext.jsx (অথবা যেখানে এটা আছে)
import { createContext, useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake user data (auto-login for development)
  useEffect(() => {
    const fakeUser = {
      userId: "admin_12345",
      name: "Super Admin",
      email: "admin@example.com",
      role: "super_admin",
      avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=7c3aed&color=fff",
      phone: "+880 17xxx xxxxx",
      balance: 50000,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      setUser(fakeUser);
      localStorage.setItem("userId", fakeUser.userId); // Optional: persist in localStorage
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton while "authenticating"
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-green-950 via-emerald-950 to-black text-gray-100">
        <div className="w-full max-w-md p-8 bg-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
          <div className="space-y-6 text-center">
            {/* Avatar / Profile placeholder */}
            <div className="mx-auto">
              <Skeleton circle width={120} height={120} className="mx-auto" />
            </div>

            {/* Name & Role */}
            <div className="space-y-3">
              <Skeleton height={32} width="70%" className="mx-auto rounded" />
              <Skeleton height={20} width="50%" className="mx-auto rounded" />
            </div>

            {/* Loading text + spinner-like effect */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Skeleton circle width={32} height={32} />
              <Skeleton height={24} width={180} className="rounded" />
            </div>

            {/* Optional extra lines for realism */}
            <Skeleton height={16} width="90%" className="mx-auto mt-4" />
            <Skeleton height={16} width="80%" className="mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};