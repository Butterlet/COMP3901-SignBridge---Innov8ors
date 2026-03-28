import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
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
              <button
                onClick={() => navigate('/signup')}
                className="signup-button"
              >
                Sign Up Free
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;