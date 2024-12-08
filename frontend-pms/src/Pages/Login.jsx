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
  const [passwordStrength, setPasswordStrength] = useState("");

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

  const handleFieldFocus = (field) => {
    setRegistrationErrors((prev) => ({ ...prev, [field]: "" }));
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
        localStorage.setItem("username", username); // Store username in localStorage
        console.log('User ID:', localStorage.userId); // Check if userId is being retrieved correctly

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
        body: JSON.stringify({ name, email, password, contact }),
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
    setPasswordStrength("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "32rem", fontFamily: "Montserrat", borderRadius: "15px" }} className="shadow-sm">
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/sister-store-logo-2.svg" alt="Sister Store" style={{ width: "150px" }} />
          </div>
          {!isRegistering ? (
            <Form onSubmit={handleLoginSubmit}>
              <h4 className="text-center mb-4" style={{ color: "darkorange" }}>Login</h4>
              <Form.Group controlId="loginUsername" className="mb-3">
                <Form.Label><FaUser /> Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => handleFieldFocus("username")} // Call handleFieldFocus when field gains focus
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
                  onFocus={() => handleFieldFocus("password")} // Call handleFieldFocus when field gains focus
                  required
                />
              </Form.Group>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
              <Button type="submit" className="w-100" style={{ backgroundColor: "darkorange" }} disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <Button variant="link" onClick={handleFormSwitch} className="mt-3">
                Don’t have an account? Register here.
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <h4 className="text-center mb-4" style={{ color: "darkorange" }}>Register</h4>
              {["name", "email", "contact"].map((field, idx) => (
                <Form.Group key={idx} controlId={`register${field}`} className="mb-3">
                  <Form.Label>{field === "contact" ? <FaPhoneAlt /> : field === "email" ? <FaEnvelope /> : <FaUser />} {field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type={field === "email" ? "email" : "text"}
                    placeholder={`Enter ${field}`}
                    value={registrationData[field]}
                    onChange={(e) => setRegistrationData((prev) => ({ ...prev, [field]: e.target.value }))}
                    isInvalid={!!registrationErrors[field]}
                    onFocus={() => handleFieldFocus(field)} // Call handleFieldFocus for registration fields as well
                  />
                  <Form.Control.Feedback type="invalid">{registrationErrors[field]}</Form.Control.Feedback>
                </Form.Group>
              ))}
              <Form.Group controlId="registerPassword" className="mb-3">
                <Form.Label><FaLock /> Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={registrationData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  isInvalid={!!registrationErrors.password}
                  onFocus={() => handleFieldFocus("password")} // Call handleFieldFocus for password field
                />
                <div style={{ fontSize: "1.1em", color: passwordStrength.color, textAlign: "left", marginTop: "5px" }}>
                  {passwordStrength.label}
                </div>
                <Form.Control.Feedback type="invalid">{registrationErrors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="registerConfirmPassword" className="mb-3">
                <Form.Label><FaLock /> Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={registrationData.confirmPassword}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  isInvalid={!!registrationErrors.confirmPassword}
                  onFocus={() => handleFieldFocus("confirmPassword")} // Call handleFieldFocus for confirm password field
                />
                <Form.Control.Feedback type="invalid">{registrationErrors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
              <Button type="submit" className="w-100" style={{ backgroundColor: "darkorange" }} disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <Button variant="link" onClick={handleFormSwitch} className="mt-3">
                Already have an account? Login here.
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
