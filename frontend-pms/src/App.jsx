import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./Components/NavBar"; 
import Login from "./Pages/Login"; 
import Dashboard from "./Pages/Dashboard";
import Storefront from "./Pages/Storefront";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(''); // to track if user is admin or regular
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term) => {
    setSearchTerm(term); 
  };

  // Check for authentication state and role on page refresh
  useEffect(() => {
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    if (savedAuthStatus === 'true') {
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }
  }, []);

  // Store authentication status and role to localStorage on login
  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  };

  return (
    <Router>
      {isAuthenticated && <NavBar onSearch={handleSearchChange} setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/storefront" />
            ) : (
              <Login setIsAuthenticated={handleLoginSuccess} />
            )
          }
        />

        {/* Default route for non-authenticated users */}
        <Route
          path="/storefront"
          element={
            !isAuthenticated ? (
              <Storefront searchTerm={searchTerm} />
            ) : (
              userRole === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/storefront" />
            )
          }
        />

        {/* Dashboard route for authenticated admins */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <Dashboard searchTerm={searchTerm} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default fallback route (if no match) */}
        <Route path="*" element={<Navigate to="/storefront" />} />
      </Routes>
    </Router>
  );
}

export default App;
