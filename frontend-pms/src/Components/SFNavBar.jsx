import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'; // Import required icons
import '../Custom CSS/SFNavbar.css';

export default function SFNavbar({ cartCount, onCartClick }) {
  return (
    <Navbar expand="lg" style={{ backgroundColor: 'rgb(255, 165, 0)' }} variant="dark">
      <Container fluid>
        {/* Brand with Shop Icon */}
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <FaStore className="me-2" style={{ fontSize: '1.5rem' }} />
          <span className="navbar-text-white">Sister Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-left">
            {/* User Icon */}
            <Nav.Item>
              <Nav.Link href="#" className="text-white">
                <FaUser className="me-2" style={{ fontSize: '1.2rem' }} />
                User
              </Nav.Link>
            </Nav.Item>
            {/* Shopping Cart */}
            <Nav.Item>
              <Nav.Link onClick={onCartClick} className="text-white" style={{ cursor: 'pointer' }}>
                <FaShoppingCart className="me-2" />
                <Badge pill bg="">
                  {cartCount}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            {/* Logout Button */}
            <Nav.Item>
              <Nav.Link href="#" className="text-white">
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
