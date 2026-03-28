import React from "react";
import "./form.css";

export default function TopBar({ isLoggedIn, isProducer, onLogout, goToLogin, goToHome, goToCart, goToProfile, goToProducer }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isProducer");
    localStorage.removeItem("isAdmin");
    // Dispatch custom event to update login state
    window.dispatchEvent(new Event("logout"));
    if (onLogout) onLogout();
  };

  const handleAuthButton = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      goToLogin();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "15px 30px",
        background: "rgba(0,0,0,0.45)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        zIndex: 10,
      }}
    >
      <div
        style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}
        onClick={goToHome}
      >
        LOGO
      </div>

      <div
        style={{
          display: "flex",
          gap: "25px",
          fontSize: "1.1rem",
          marginRight: "60px",
        }}
      >
        <span style={{ cursor: "pointer" }} onClick={goToHome}>
          Home
        </span>

        <span style={{ cursor: "pointer" }} onClick={goToCart}>
          Cart
        </span>

        <span style={{ cursor: "pointer" }} onClick={goToProfile}>
          Account
        </span>

        {isProducer && (
          <span style={{ cursor: "pointer", color: "#00b894", fontWeight: "bold" }} onClick={goToProducer}>
            Producer
          </span>
        )}

        <button
          className="form-submit"
          style={{ width: "auto", padding: "8px 15px" }}
          onClick={handleAuthButton}
        >
          {isLoggedIn ? "Logout" : "Log In"}
        </button>
      </div>
    </div>
  );
}