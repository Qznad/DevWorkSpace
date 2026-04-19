// src/pages/Login.js
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });
      console.log("LOGIN SUCCESS:", response.data);
      // Use sessionStorage instead of localStorage for better security
      // Session storage is cleared when the browser tab closes
      sessionStorage.setItem("user", JSON.stringify(response.data));
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }

      setMessageType("success");
      setMessage("✅ Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      let errorMsg = "Login failed";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message === "Network Error") {
        errorMsg = "Network error: Cannot reach the server. Make sure the backend is running.";
      } else if (error.response?.status === 401) {
        errorMsg = "Invalid email or password";
      }
      setMessageType("error");
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Jump back into your workspace and continue collaborating
          </p>
        </div>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          {message && (
            <p className={`auth-message ${messageType === "success" ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;