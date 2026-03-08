import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import NotesPage from "./NotesPage";
import QuestionsPage from "./QuestionsPage";
import ProfilePage from "./ProfilePage";
import { API_BASE_URL } from "./config";

const CURRENT_USER_ID = 1;

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentUser, setCurrentUser] = useState(null);

  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}/`);
        if (!res.ok) {
          throw new Error("Failed to fetch current user");
        }
        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error loading current user:", error);
        setCurrentUser({
          username: "Guest",
          role: "student",
        });
      }
    };

    fetchCurrentUser();
  }, []);

  const userInitial = currentUser?.username?.charAt(0).toUpperCase() || "G";
  const formattedRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : "Student";

  const styles = getStyles(isMobile);

  return (
    <Router>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.brand}>
            <img
              src="favicon.ico"
              alt="StudySync"
              style={styles.logo}
            />
            <div>
              <h2 style={styles.title}>StudySync</h2>
              <span style={styles.tagline}>Collaborative course notes</span>
            </div>
          </div>

          <div style={styles.rightSide}>
            <div style={styles.navLinks}>
              <NavLink to="/" end style={({ isActive }) => navLinkStyle(isActive, isMobile)}>
                Notes
              </NavLink>

              <NavLink
                to="/questions"
                style={({ isActive }) => navLinkStyle(isActive, isMobile)}
              >
                Questions
              </NavLink>

              <NavLink
                to="/profile"
                style={({ isActive }) => navLinkStyle(isActive, isMobile)}
              >
                Profile
              </NavLink>
            </div>

            <NavLink
              to="/profile"
              style={({ isActive }) => profileChipStyle(isActive, isMobile)}
            >
              <div style={styles.avatar}>{userInitial}</div>
              <div style={styles.profileText}>
                <span style={styles.profileName}>
                  {currentUser ? currentUser.username : "Loading..."}
                </span>
                <span style={styles.profileRole}>{formattedRole}</span>
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<NotesPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

const navLinkStyle = (isActive, isMobile) => ({
  textDecoration: "none",
  fontWeight: 600,
  fontSize: isMobile ? "13px" : "14px",
  padding: isMobile ? "9px 12px" : "10px 16px",
  borderRadius: "999px",
  color: isActive ? "#1d4ed8" : "#475569",
  background: isActive ? "#eff6ff" : "transparent",
  border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
});

const profileChipStyle = (isActive, isMobile) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: isMobile ? "8px 10px" : "8px 12px",
  borderRadius: "999px",
  background: isActive ? "#eff6ff" : "#ffffff",
  border: isActive ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
  textDecoration: "none",
  minWidth: isMobile ? "100%" : "auto",
  justifyContent: isMobile ? "center" : "flex-start",
  transition: "all 0.2s ease",
});

function getStyles(isMobile) {
  return {
    navbar: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e2e8f0",
    },

    navContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "14px 16px" : "14px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: isMobile ? "stretch" : "center",
      gap: "16px",
      flexDirection: isMobile ? "column" : "row",
    },

    brand: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    logo: {
      width: isMobile ? "42px" : "46px",
      height: isMobile ? "42px" : "46px",
      borderRadius: "12px",
      boxShadow: "0 6px 18px rgba(37, 99, 235, 0.15)",
      background: "white",
      padding: "4px",
      objectFit: "contain",
    },

    title: {
      margin: 0,
      fontSize: isMobile ? "18px" : "20px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#0f172a",
    },

    tagline: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#64748b",
    },

    rightSide: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      width: isMobile ? "100%" : "auto",
      flexDirection: isMobile ? "column" : "row",
    },

    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "999px",
      width: isMobile ? "100%" : "auto",
      justifyContent: isMobile ? "center" : "flex-start",
      flexWrap: "wrap",
    },

    avatar: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "14px",
      flexShrink: 0,
    },

    profileText: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.1,
      alignItems: "flex-start",
    },

    profileName: {
      fontSize: "13px",
      fontWeight: 700,
      color: "#0f172a",
    },

    profileRole: {
      fontSize: "11px",
      color: "#64748b",
    },
  };
}

export default App;