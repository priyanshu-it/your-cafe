import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
        <label> Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' required/>
        </label>

        <label> Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='At least 6 characters' required />
        </label>

        <button type="submit">Log-In <i class="fa fa-sign-in"></i></button>
      </form>
    </div>
  );
}
export default AdminLogin;