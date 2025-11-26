import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SignUp, fetchUsers } from "../../Slices/userslice";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await dispatch(SignUp({ name, email, password }));

    if ((res?.payload && res.payload.success) || res?.meta?.requestStatus === "fulfilled") {
      navigate("/home");
    } else {
      alert("Signup failed! Try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1 className="title">Create Your Account</h1>
        <p className="subtitle">Start your journey with us</p>

        <label className="label">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          placeholder="Create a strong password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signup-btn" onClick={handleSignup}>
          Create Account
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
