import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [progress, setProgress] = useState(
    user?.progress || { quizzesTaken: 0, averageScore: 0 },
  );

  useEffect(() => {
    // If we don't have a full user object but have a session, lets try fetching profile
    const loadProfile = async () => {
      if (!user) return;
      if (!user.id) return;
      try {
        const profile = await getUserProfile();
        if (profile) {
          const u = {
            id: profile.id || user.id,
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            level: profile.jsl_level,
            joinDate: user.joinDate || new Date().toISOString(),
            progress: profile.progress || { quizzesTaken: 0, averageScore: 0 },
          };
          setUserState(u);
          setIsAuthenticated(true);
          setProgress(u.progress);
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (err) {
        // ignore
      }
    };
    loadProfile();
    
  }, []);

  const setUser = (u) => {
    setUserState(u);
    setIsAuthenticated(!!u);
    setProgress(u?.progress || { quizzesTaken: 0, averageScore: 0 });
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    setProgress({ quizzesTaken: 0, averageScore: 0 });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      fetch("http://localhost:5000/logout", { credentials: "include" });
    } catch (e) {}
  };

  const updateProgress = (p) => {
    const next = { ...progress, ...p };
    setProgress(next);
    setUserState((prev) => (prev ? { ...prev, progress: next } : prev));
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored) {
      stored.progress = next;
      localStorage.setItem("user", JSON.stringify(stored));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        logout,
        progress,
        updateProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
