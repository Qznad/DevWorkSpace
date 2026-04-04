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
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="auth-message">{message}</p>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;