import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Keep loading state

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

  // Show loading while "authenticating"
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-red-600">
        <div className="text-white text-xl font-semibold">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            <span>Authenticating...</span>
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