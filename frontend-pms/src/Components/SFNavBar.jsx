import React from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { FaShoppingCart, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../Custom CSS/SFNavbar.css";

export default function SFNavBar({ cartCount, onCartClick, username, setIsAuthenticated }) {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        console.log(data.message);
        setIsAuthenticated(false); // Update authentication state
        localStorage.clear(); // Clear user-related localStorage items
        navigate("/login"); // Redirect to login page
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "rgb(255, 165, 0)" }} variant="dark">
      <Container fluid>
        {/* Brand with Shop Icon */}
        <Navbar.Brand onClick={() => navigate("/")} className="d-flex align-items-center" style={{ cursor: "pointer" }}>
          <FaStore className="me-2" style={{ fontSize: "1.5rem" }} />
          <span className="navbar-text-white">Sister Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {/* User Icon with Username */}
            <Nav.Item>
              <Nav.Link href="#" className="text-white">
                <FaUser className="me-2" style={{ fontSize: "1.2rem" }} />
                {username || "Guest"}
              </Nav.Link>
            </Nav.Item>

            {/* Shopping Cart */}
            <Nav.Item>
              <Nav.Link onClick={onCartClick} className="text-white" style={{ cursor: "pointer" }}>
                <FaShoppingCart className="me-2" />
                <Badge pill bg="light" text="dark">
                  {cartCount}
                </Badge>
              </Nav.Link>
            </Nav.Item>

            {/* Logout Button */}
            <Nav.Item>
              <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: "pointer" }}>
                <FaSignOutAlt className="me-2" />
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
