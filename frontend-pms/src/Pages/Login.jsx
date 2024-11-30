import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { FaUser, FaLock, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'; // Importing icons

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Ensure confirmPassword is in registration data
    contact: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(""); // Added password strength state
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Evaluate password strength
  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) return { label: "Weak", color: "red" };
    if (/[A-Z]/.test(password) && /\d/.test(password)) return { label: "Strong", color: "green" };
    return { label: "Average", color: "orange" };
  };

  const handlePasswordChange = (value) => {
    setRegistrationData((prev) => ({ ...prev, password: value }));
    const strength = evaluatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleConfirmPasswordChange = (value) => {
    setRegistrationData((prev) => ({ ...prev, confirmPassword: value }));
  };

  const handleFieldFocus = (field) => {
    setRegistrationErrors((prev) => ({ ...prev, [field]: "" }));
  };

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
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword, contact } = registrationData;
    const errors = {};

    if (!name.trim()) errors.name = "Name is required.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) errors.email = "Invalid email address.";
    if (!/^\d{10}$/.test(contact)) errors.contact = "Contact must be a 10-digit number.";
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Password must have at least 8 characters, 1 uppercase letter, and 1 number.";
    }
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match."; // Validate confirmPassword

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
        body: JSON.stringify({ name, email, password, contact }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setRegistrationErrors({});
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        setRegistrationErrors({ general: data.message });
      }
    } catch (error) {
      setRegistrationErrors({ general: "An error occurred while registering." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSwitch = () => {
    // Clear the form when switching to the login screen
    setIsRegistering(false);
    setRegistrationData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact: "",
    });
    setRegistrationErrors({});
    setPasswordStrength("");

    setUsername("");
    setPassword("");
    setErrorMessage("");
  };

  useEffect(() => {
    if (!isRegistering) {
      // Clear the form when leaving the register form
      setRegistrationData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact: "",
      });
      setRegistrationErrors({});
      setPasswordStrength("");
    }
  }, [isRegistering]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "32rem", fontFamily: "Montserrat", borderRadius: "15px" }} className="shadow-sm">
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/sister-store-logo-2.svg" alt="Sister Store" style={{ width: "150px" }} />
          </div>
          {!isRegistering ? (
            <Form onSubmit={handleLoginSubmit}>
              <h4 className="text-center mb-4" style={{ color: "darkorange", fontSize: "1.5rem" }}>Login</h4>
              <Form.Group controlId="loginUsername" className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>
                  <FaUser style={{ marginRight: "8px", color: "darkorange" }} /> Username
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                    style={{ height: "52px", fontSize: "1.2rem" }}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="loginPassword" className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>
                  <FaLock style={{ marginRight: "8px", color: "darkorange" }} /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  required
                  style={{ height: "52px", fontSize: "1.2rem" }}
                />
              </Form.Group>
              {errorMessage && (
                <div className="text-danger text-center mb-3" style={{ fontSize: "1.2rem" }}>
                  {errorMessage}
                </div>
              )}
              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "darkorange", borderColor: "darkorange", height: "52px", fontSize: "1.2rem" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  style={{ color: "darkorange", fontSize: "1rem" }}
                  onClick={() => setIsRegistering(true)}
                >
                  Don’t have an account? Register here.
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <h4 className="text-center mb-4" style={{ color: "darkorange", fontSize: "1.5rem" }}>Register</h4>
              {["name", "email", "contact"].map((field, idx) => (
                <Form.Group key={idx} controlId={`register${field}`} className="mb-3">
                  <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>
                    {field === "contact" ? <FaPhoneAlt style={{ marginRight: "8px", color: "darkorange" }} /> : field === "email" ? <FaEnvelope style={{ marginRight: "8px", color: "darkorange" }} /> : <FaUser style={{ marginRight: "8px", color: "darkorange" }} />}
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type={field === "email" ? "email" : "text"}
                    placeholder={`Enter ${field}`}
                    value={registrationData[field]}
                    onChange={(e) => setRegistrationData((prev) => ({ ...prev, [field]: e.target.value }))}
                    isInvalid={!!registrationErrors[field]}
                    style={{ height: "52px", fontSize: "1.2rem" }}
                    required
                    onFocus={() => handleFieldFocus(field)}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "1.0em" }}>
                    {registrationErrors[field]}
                  </Form.Control.Feedback>
                </Form.Group>
              ))}
              <Form.Group controlId="registerPassword" className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>
                  <FaLock style={{ marginRight: "8px", color: "darkorange" }} /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={registrationData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  isInvalid={!!registrationErrors.password}
                  style={{ height: "52px", fontSize: "1.2rem" }}
                  required
                />
                <div style={{ fontSize: "1.1em", color: passwordStrength.color, textAlign: "left", marginTop: "5px" }}>
                  {passwordStrength.label}
                </div>
                <Form.Control.Feedback type="invalid" style={{ fontSize: "1.0em" }}>
                  {registrationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerConfirmPassword" className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>
                  <FaLock style={{ marginRight: "8px", color: "darkorange" }} /> Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={registrationData.confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  isInvalid={!!registrationErrors.confirmPassword}
                  style={{ height: "52px", fontSize: "1.2rem" }}
                  required
                  onFocus={() => handleFieldFocus("confirmPassword")}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: "1.0em" }}>
                  {registrationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              {registrationErrors.general && (
                <div className="text-danger text-center mb-3" style={{ fontSize: "1.2rem" }}>
                  {registrationErrors.general}
                </div>
              )}
              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "darkorange", borderColor: "darkorange", height: "52px", fontSize: "1.2rem" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  style={{ color: "darkorange", fontSize: "1rem" }}
                  onClick={handleFormSwitch}
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
