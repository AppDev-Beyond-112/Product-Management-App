import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';  
import '../Custom CSS/Dashboard.css'; 

function NavBar({ onSearch, setIsAuthenticated }) { 
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate(); // for redirecting after logout

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log(data.message); 
        setIsAuthenticated(false); // Update authentication state
        navigate('/login'); // Navigate to the login page
      } else {
        console.error(data.message); 
      }
    } catch (error) {
      console.error('Error during logout:', error); 
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#" className="custom-brand">
          <img
            src="/sister-store-logo.svg" 
            alt="Sister Store Logo"
            width="30"
            height="30" 
            className="d-inline-block align-top"
          />
          {' '}Sister Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
              <FiLogOut className="me-1" /> Logout 
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchInput} 
              onChange={handleSearchChange} 
            />
            <Button className="custom-orange-outline-button">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
