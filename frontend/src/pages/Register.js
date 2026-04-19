import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const response = await API.post("/auth/register", {
        name: fullName,
        email,
        password,
      });

      console.log("REGISTER SUCCESS:", response.data);

      // Use sessionStorage instead of localStorage for better security
      // Session storage is cleared when the browser tab closes
      sessionStorage.setItem("user", JSON.stringify(response.data));
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }

      setMessageType("success");
      setMessage("✅ Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      let errorMsg = "Registration failed";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMsg = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join(", ")
          : error.response.data.errors;
      } else if (error.message === "Network Error") {
        errorMsg = "Network error: Cannot reach the server. Make sure the backend is running.";
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
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">
            Join the workspace and start collaborating with your team
          </p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          {message && (
            <p className={`auth-message ${messageType === "success" ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
