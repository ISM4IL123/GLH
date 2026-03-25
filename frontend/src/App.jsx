import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import LoginPage from "./Login/LoginPage";
import SignupPage from "./Sign up/SignupPage";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import DetailsPage from "./components/DetailsPage";
import CheckoutPage from "./components/CheckoutPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "login"
  );

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const goToLogin = () => setCurrentPage("login");
  const goToSignup = () => setCurrentPage("signup");
  const goToHome = () => setCurrentPage("home");
  const handleLogout = () => {
    goToLogin(); // redirect to login
  };
  const goBack = () => {
    setCurrentPage(localStorage.getItem("previousPage") || "home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        paddingTop: "80px",
        background: "linear-gradient(135deg, #19106d, #03011d)",
      }}
    >
      <TopBar 
  onLogout={handleLogout}
  goToHome={() => {
    localStorage.setItem("previousPage", currentPage);
    setCurrentPage("home");
  }}
  goToCart={() => {
    localStorage.setItem("previousPage", currentPage);
    setCurrentPage("cart");
  }}
  goToProfile={() => {
    localStorage.setItem("previousPage", currentPage);
    setCurrentPage("profile");
  }}
/>
      {currentPage === "login" && (
        <LoginPage onLoginSuccess={goToHome} goToSignup={goToSignup} />
      )}
      {currentPage === "signup" && <SignupPage goToLogin={goToLogin} />}  
      {currentPage === "home" && <HomePage />}
      {currentPage === "cart" && <CartPage />}
      {currentPage === "profile" && <ProfilePage />}
      {currentPage === "checkout" && (
  <CheckoutPage goBack={goBack} />
)}
      {currentPage === "details" && (
  <DetailsPage
    product={JSON.parse(localStorage.getItem("selectedProduct"))}
    goBack={goBack}
  />
)}
    </div>
  );
}