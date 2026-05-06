import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    experienceLevel: 'beginner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // 1. Call the real signup endpoint
      const signupResponse = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: sends/receives cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: firstName,
          last_name: lastName,
          jsl_level: formData.experienceLevel
        })
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        // Handle server-side validation errors (e.g., email already exists)
        throw new Error(signupData.message || 'Signup failed');
      }

      // 2. After successful signup, fetch the user profile (auto-login)
      const profileResponse = await fetch('http://localhost:5000/profile', {
        credentials: 'include'
      });

      if (!profileResponse.ok) {
        throw new Error('Account created but could not fetch profile');
      }

      const profileData = await profileResponse.json();

      // 3. Update Redux store
      dispatch(setUser({
        id: profileData.username,
        name: `${profileData.first_name} ${profileData.last_name}`,
        email: profileData.email,
        level: profileData.jsl_level,
        joinDate: new Date().toISOString(),
        progress: profileData.progress || { quizzesTaken: 0, averageScore: 0, signsLearned: 0 }
      }));

      // 4. Redirect to profile page
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create an Account</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="beginner">Beginner - New to JSL</option>
            <option value="intermediate">Intermediate - Know some signs</option>
            <option value="advanced">Advanced - Comfortable with JSL</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center" style={{ marginTop: '1rem', color: '#6b7280' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#3b82f6' }}>
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Signup;