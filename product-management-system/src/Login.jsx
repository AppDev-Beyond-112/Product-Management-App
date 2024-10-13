import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "15px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  logo: {
    width: "250px",
    height: "auto",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid transparent", 
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#333",
    outline: "none",
    transition: "border-color 0.3s ease", 
  },
  inputHoverFocus: {
    borderColor: "orange", 
  },
  inputBlur: {
    borderColor: "transparent", 
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "orange",
  },
  error: {
    color: "red",
  },
};

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState({
    username: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password123") {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <img src="/sister-store-logo-2.svg" alt="Sister Store" style={styles.logo} />
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setIsInputFocused((prev) => ({ ...prev, username: true }))}
          onBlur={() => setIsInputFocused((prev) => ({ ...prev, username: false }))}
          onMouseEnter={() => setIsInputFocused((prev) => ({ ...prev, username: true }))}
          onMouseLeave={() => setIsInputFocused((prev) => ({ ...prev, username: false }))}
          style={
            isInputFocused.username
              ? { ...styles.input, ...styles.inputHoverFocus }
              : { ...styles.input, ...styles.inputBlur } 
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsInputFocused((prev) => ({ ...prev, password: true }))}
          onBlur={() => setIsInputFocused((prev) => ({ ...prev, password: false }))}
          onMouseEnter={() => setIsInputFocused((prev) => ({ ...prev, password: true }))}
          onMouseLeave={() => setIsInputFocused((prev) => ({ ...prev, password: false }))}
          style={
            isInputFocused.password
              ? { ...styles.input, ...styles.inputHoverFocus }
              : { ...styles.input, ...styles.inputBlur } 
          }
        />
        <button
          type="submit"
          style={isHovering ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Login
        </button>
      </form>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
