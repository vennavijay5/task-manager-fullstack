import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Username may already be taken.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Task Manager</h2>
      <h3>Create Account</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default RegisterPage;
