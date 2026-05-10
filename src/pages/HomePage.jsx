import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const HomePage = () => {
  const { isAuthenticated } = useUser();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Break Language Barriers</h1>
          <p className="hero-subtitle">
            Translate Jamaican Sign Language into text in real-time using your
            webcam. Learn and practice JSL with our interactive tools.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Link to="/translator" className="btn btn-secondary">
              Start Translating Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="grid-3">
        <div className="card">
          <div className="card-title">Learning Tools</div>
          <p className="card-text">
            Access Flashcards and practice materials to improve your JSL skills
            at your own pace.
          </p>
          <div>
            {isAuthenticated ? (
              <Link to="/learning" className="nav-link feature-signup">
                Go to Learning →
              </Link>
            ) : (
              <Link to="/signup" className="nav-link feature-signup">
                Sign up to access →
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Track Your Progress</div>
          <p className="card-text">
            Monitor your improvement from doing quizzes and flashcards. Stay
            motivated on your JSL learning journey.
          </p>
          <div>
            {isAuthenticated ? (
              <Link to="/profile" className="nav-link feature-signup">
                View Progress →
              </Link>
            ) : (
              <Link to="/signup" className="nav-link feature-signup">
                Sign up to track →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Open Camera</h3>
            <p className="step-text">
              Click "Start Camera" and allow access to your webcam
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Sign Naturally</h3>
            <p className="step-text">
              Make JSL gestures in front of the camera
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Get Text</h3>
            <p className="step-text">
              See your signs translated to text in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-number">30+</div>
          <div className="stat-label">JSL Signs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">10+</div>
          <div className="stat-label">Interactive Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free to Start</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Practice Anytime</div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="cta-section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 0",
        }}
      >
        <h2 className="cta-title">Ready to Start Learning JSL?</h2>
        <p className="cta-text">
          Join now to translate and learn Jamaican Sign Language
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link to="/translator" className="btn btn-secondary">
            Start Translating Now
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/learning" className="btn btn-primary">
                Go to Learning
              </Link>
              <Link to="/profile" className="btn btn-outline">
                Profile
              </Link>
            </>
          ) : (
            <Link to="/signup" className="btn btn-primary">
              Create a Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
