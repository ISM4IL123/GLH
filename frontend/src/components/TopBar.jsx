import React from "react";
import "./form.css";

export default function TopBar({ onLogout, goToHome, goToCart, goToProfile }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
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

        <button
          className="form-submit"
          style={{ width: "auto", padding: "8px 15px" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}