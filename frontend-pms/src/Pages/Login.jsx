import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { FaUser, FaLock, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Login = ({ setIsAuthenticated }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });

  const [registrationErrors, setRegistrationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ label: "", color: "" });

  const navigate = useNavigate();

  // Evaluate password strength
  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) return { label: "Weak", color: "red" };
    if (/[A-Z]/.test(password) && /\d/.test(password))
      return { label: "Strong", color: "green" };
    return { label: "Average", color: "orange" };
  };

  const handlePasswordChange = (value) => {
    setRegistrationData((prev) => ({ ...prev, password: value }));
    const strength = evaluatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  // Handle login form submission
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user_id); // Store userId
        localStorage.setItem("username", username); // Store username

        setIsAuthenticated(true);

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/storefront");
        }
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch {
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, contact } = registrationData;
    const errors = {};
  
    // Validate registration form
    if (!name.trim()) errors.name = "Name is required.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      errors.email = "Invalid email address.";
    if (!/^\d{10,12}$/.test(contact))
      errors.contact = "Contact must be a 10-12 digit number.";
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
      errors.password = "Password must have at least 8 characters, 1 uppercase letter, and 1 number.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
  
    if (Object.keys(errors).length > 0) {
      setRegistrationErrors(errors);
      return;
    }
  
    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword, // Laravel requires "password_confirmation"
          contactNum: contact, // Use the correct field name for the backend
        }),
      });
      const data = await response.json();
  
      if (data.status === "success") {
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch {
      setErrorMessage("An error occurred while registering.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleFormSwitch = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage("");
    setRegistrationErrors({});
    setPasswordStrength({ label: "", color: "" });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "30rem", borderRadius: "15px" }} className="shadow-lg">
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/sister-store-logo-2.svg" alt="Sister Store" style={{ width: "120px" }} />
          </div>
          {!isRegistering ? (
            <Form onSubmit={handleLoginSubmit}>
              <h4 className="text-center mb-4" style={{ color: "orange" }}>Login</h4>
              <Form.Group controlId="loginUsername" className="mb-3">
                <Form.Label><FaUser /> Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="loginPassword" className="mb-3">
                <Form.Label><FaLock /> Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
              <Button
                type="submit"
                className="w-100 mb-3"
                style={{ backgroundColor: "darkorange", border: "none" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleFormSwitch}
                  style={{ color: "orange", textDecoration: "none" }}
                >
                  Don’t have an account? Register here.
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <h4 className="text-center mb-4" style={{ color: "orange" }}>Register</h4>
              <Form.Group controlId="registerName" className="mb-3">
                <Form.Label><FaUser /> Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                  isInvalid={!!registrationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {registrationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerEmail" className="mb-3">
                <Form.Label><FaEnvelope /> Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  isInvalid={!!registrationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {registrationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerPassword" className="mb-3">
                <Form.Label><FaLock /> Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={registrationData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  isInvalid={!!registrationErrors.password}
                />
                <div
                  className="mt-2"
                  style={{ fontSize: "0.9em", color: passwordStrength.color }}
                >
                  Password strength: {passwordStrength.label}
                </div>
                <Form.Control.Feedback type="invalid">
                  {registrationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerConfirmPassword" className="mb-3">
                <Form.Label><FaLock /> Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={registrationData.confirmPassword}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, confirmPassword: e.target.value })
                  }
                  isInvalid={!!registrationErrors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {registrationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerContact" className="mb-3">
                <Form.Label><FaPhoneAlt /> Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact number"
                  value={registrationData.contact}
                  onChange={(e) => setRegistrationData({ ...registrationData, contact: e.target.value })}
                  isInvalid={!!registrationErrors.contact}
                />
                <Form.Control.Feedback type="invalid">
                  {registrationErrors.contact}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type="submit"
                className="w-100 mb-3"
                style={{ backgroundColor: "darkorange", border: "none" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleFormSwitch}
                  style={{ color: "orange", textDecoration: "none" }}
                >
                  Already have an account? Login here.
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
