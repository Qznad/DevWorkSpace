// src/pages/Login.js
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/auth/login", { email, password });
      console.log("LOGIN SUCCESS:", response.data);
      setMessage("Login successful! ✅");

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      if (response.data.token) localStorage.setItem("token", response.data.token);

      navigate("/dashboard"); // Go to dashboard
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      if (error.response?.data?.message) {
        setMessage("Login failed: " + error.response.data.message);
      } else {
        setMessage("Login failed: Incorrect email or password");
      }
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
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          {message && (
            <p className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;