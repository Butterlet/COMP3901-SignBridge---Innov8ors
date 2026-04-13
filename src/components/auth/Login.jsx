import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      console.log('Backend response:', response.status, data); 
      if (response.ok) {
        // Fetch the real user profile after login
        const profileResponse = await fetch('http://localhost:5000/profile', {
          credentials: 'include'
        });
        const profileData = await profileResponse.json();
        dispatch(setUser({
          id: profileData.username,
          name: `${profileData.first_name} ${profileData.last_name}`,
          email: profileData.email,
          level: profileData.jsl_level,
          joinDate: new Date().toISOString()
        }));
	localStorage.setItem('user', JSON.stringify({ name: `${profileData.first_name} ${profileData.last_name}`, email: profileData.email }));
	localStorage.setItem('token', 'logged-in');
        navigate('/profile');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error details'. err);
      setError(Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Log In</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            disabled={loading}
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
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-center" style={{ marginTop: '1rem', color: '#6b7280' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#3b82f6' }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;