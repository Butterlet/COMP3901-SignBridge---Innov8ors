import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            🤟 SignBridge
          </Link>

          <div className="navbar-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/translator" className="nav-link">
              Translator
            </Link>
            <Link to="/history" className="nav-link">
              History
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/learning" className="nav-link">
                  Learn
                </Link>
                <Link to="/quiz" className="nav-link">
                  Quiz
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              </>
            ) : (
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <button
                  onClick={() => navigate("/signup")}
                  className="signup-button"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="login-button"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
