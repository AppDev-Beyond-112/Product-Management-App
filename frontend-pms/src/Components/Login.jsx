import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Custom CSS/Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

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
        setErrorMessage(data.message);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
      setIsButtonDisabled(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const { name, email, password, confirmPassword, contact } = registrationData;
    const errors = [];
  
    // Validation
    if (!name.trim()) {
      errors.push("Name is required.");
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!/^\d{10}$/.test(contact)) {
      errors.push("Please enter a valid 10-digit phone number.");
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      errors.push(
        "Password must be at least 8 characters long and include at least one uppercase letter and one number."
      );
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }
  
    // If there are errors, set them to state
    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, contact }),
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
        setErrorMessage([]);
        setIsRegistering(false); // Go back to login view
        alert("Registration successful! Please log in.");
      } else {
        setErrorMessage([data.message]);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage(["An error occurred while registering. Please try again."]);
    }
  };
  
  

  const handleInputChange = (field, value) => {
    setRegistrationData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  return (
    <div className="container">
  <img src="/sister-store-logo-2.svg" alt="Sister Store" className="logo" />
  {!isRegistering ? (
    <form onSubmit={handleLogin} className="form">
      {/* Login Fields */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setErrorMessage("");
        }}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
        className="input"
      />
      <button
        type="submit"
        className="button"
        disabled={isButtonDisabled}
      >
        Login
      </button>
      <button
        type="button"
        className="button secondary"
        onClick={() => setIsRegistering(true)}
      >
        Register
      </button>
    </form>
  ) : (
    <form onSubmit={handleRegister} className="form">
      {/* Registration Fields */}
      <input
        type="text"
        placeholder="Name"
        value={registrationData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="input"
      />
      <input
        type="email"
        placeholder="Email"
        value={registrationData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={registrationData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={registrationData.confirmPassword}
        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={registrationData.contact}
        onChange={(e) => handleInputChange("contact", e.target.value)}
        className="input"
      />
      <button type="submit" className="button">
        Register
      </button>
      <button
        type="button"
        className="button secondary"
        onClick={() => setIsRegistering(false)}
      >
        Back to Login
      </button>
    </form>
  )}

  {/* Display errors as a list */}
  {errorMessage.length > 0 && (
    <ul className="error-list">
      {errorMessage.map((error, index) => (
        <li key={index} className="error-item">
          {error}
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default Login;
