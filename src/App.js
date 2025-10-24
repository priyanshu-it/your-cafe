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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-logo">☕ Your Café</div>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </div>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link>
              <button className="logout-btn" onClick={() => { signOut(auth); closeMenu(); }}>
                Log-Out <i className="fa fa-sign-out"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu}><i className="fa fa-home"></i> Home Page</Link>
              <Link to="/status" onClick={closeMenu}><i className="fa fa-exclamation"></i> Order Status</Link>
              <a href="https://github.com/priyanshu-it" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                <i className="fa fa-phone"></i> Contact-Us
              </a>
              <Link to="/admin-login" onClick={closeMenu}><i className="fa fa-user"></i> Admin Login</Link>
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