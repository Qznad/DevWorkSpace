import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css"; // same CSS as Login

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      console.log("REGISTER SUCCESS:", response.data);
      setMessage("Registration successful! You can now login.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      let errorMsg = "Registration failed";
      if (error.response?.data?.message) {
        errorMsg += " " + error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMsg += " " + error.response.data.errors.join(", ");
      }

      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">
            Join the workspace and start collaborating with your team
          </p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
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
            <p className={`auth-message ${message.includes("successful") || message.includes("now login") ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
