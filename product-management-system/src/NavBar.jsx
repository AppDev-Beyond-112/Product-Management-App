import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Sister Store Dashboard</h1>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/" style={styles.link}>Logout</Link>
      </div>
    </nav>
  );
};

const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "orange",
      borderBottom: "1px solid #ccc",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      margin: 0,
      fontSize: "24px",
      color: "#fff",
      fontWeight: "bold",
    },
    links: {
      display: "flex",
      gap: "15px",
    },
    link: {
      textDecoration: "none",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    },
  };

export default NavBar;
