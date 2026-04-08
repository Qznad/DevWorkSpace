import { useState } from "react";
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
      setMessage("Registration successful!");

    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      // Handle different error messages from backend
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
        <h2 className="auth-title">Register</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        <p className="auth-message">{message}</p>
        <div className="auth-switch">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Register;