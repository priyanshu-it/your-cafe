import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate,
} from 'react-router-dom';

import CustomerOrderForm from './components/CustomerOrderForm';
import OrderStatus from './components/OrderStatus';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

import { auth, onAuthStateChanged, signOut } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-logo">☕ Your Café</div>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/admin">Admin Dashboard</Link>
              <button className="logout-btn" onClick={() => signOut(auth)}>
                Log-Out <i class="fa fa-sign-out"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/"><i class="fa fa-home"></i> Home Page</Link>
              <Link to="/status"><i class="fa fa-exclamation"></i> Order Status</Link>
              <Link to="https://github.com/priyanshu-it"><i class="fa fa-phone"></i> Content-Us</Link>
              <Link to="/admin-login"><i class="fa fa-user"></i> Admin Login</Link>
            </>
          )}
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<CustomerOrderForm />} />
          <Route path="/status" element={<OrderStatus />} />
          <Route
            path="/admin-login"
            element={!user ? <AdminLogin /> : <Navigate to="/admin" replace />}
          />
          <Route
            path="/admin"
            element={user ? <AdminDashboard /> : <Navigate to="/admin-login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}