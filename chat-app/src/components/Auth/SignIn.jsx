import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SignIn as LoginUser } from "../../Slices/userslice";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await dispatch(LoginUser({ email, password }));

    // Accept both patterns: returned payload with success or fulfilled meta
    if ((res?.payload && res.payload.success) || res?.meta?.requestStatus === "fulfilled") {
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to continue</p>

        <label className="signin-label">Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          className="signin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="signin-label">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="signin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signin-btn" onClick={handleLogin}>
          Sign In
        </button>

        <p className="signin-bottom-text">
          Don’t have an account?{" "}
          <span className="signin-link" onClick={() => navigate("/signup")}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}