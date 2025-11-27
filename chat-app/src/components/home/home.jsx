import React, { useEffect } from "react";
import { fetchUsers, getUser } from "../../Slices/userslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Protect route
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear(); // or your logout logic
    navigate("/");
  };

  return (
    <div className="home-wrapper">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="profile-avatar">{getInitials(currentUser?.name)}</div>
          <h2 className="header-title">Chats</h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="content-area">
        <div className="welcome-box">
          <h2>Welcome, {currentUser?.name}</h2>
          <p>You are logged in</p>
        </div>

        <div className="contact-list">
          <h3 className="contact-title">Contacts</h3>
          {users
            ?.filter((u) => u.email !== currentUser?.email)
            .map((user, index) => (
              <div
                key={index}
                className="contact-card"
                onClick={() => navigate("/chatpage", { state: user })}
              >
                <div className="contact-avatar">{getInitials(user.name)}</div>
                <div className="contact-info">
                  <p className="contact-name">{user.name}</p>
                  <p className="contact-sub">Tap to chat</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
