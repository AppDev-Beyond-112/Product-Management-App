import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Custom CSS/Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState({
    username: false,
    password: false,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
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

  return (
    <div className="container">
      <img src="/sister-store-logo-2.svg" alt="Sister Store" className="logo" />
      <form onSubmit={handleLogin} className="form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage(""); 
          }}
          onFocus={() => setIsInputFocused((prev) => ({ ...prev, username: true }))}
          onBlur={() => setIsInputFocused((prev) => ({ ...prev, username: false }))}
          onMouseEnter={() => setIsInputFocused((prev) => ({ ...prev, username: true }))}
          onMouseLeave={() => setIsInputFocused((prev) => ({ ...prev, username: false }))}
          className={`input ${isInputFocused.username ? 'inputHoverFocus' : 'inputBlur'}`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage(""); 
          }}
          onFocus={() => setIsInputFocused((prev) => ({ ...prev, password: true }))}
          onBlur={() => setIsInputFocused((prev) => ({ ...prev, password: false }))}
          onMouseEnter={() => setIsInputFocused((prev) => ({ ...prev, password: true }))}
          onMouseLeave={() => setIsInputFocused((prev) => ({ ...prev, password: false }))}
          className={`input ${isInputFocused.password ? 'inputHoverFocus' : 'inputBlur'}`}
        />
        <button
          type="submit"
          className={`button ${isHovering ? 'buttonHover' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          disabled={isButtonDisabled} 
        >
          Login
        </button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Login;
