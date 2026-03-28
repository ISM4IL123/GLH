import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import LoginPage from "./Login/LoginPage";
import SignupPage from "./Sign up/SignupPage";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import DetailsPage from "./components/DetailsPage";
import CheckoutPage from "./components/CheckoutPage";
import ProducerDashboard from "./components/ProducerDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "login"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isProducer, setIsProducer] = useState(!!localStorage.getItem("isProducer"));
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("isAdmin"));

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setIsProducer(!!localStorage.getItem("isProducer"));
      setIsAdmin(!!localStorage.getItem("isAdmin"));
    };
    
    // Listen to custom login/logout events
    window.addEventListener("login", handleStorageChange);
    window.addEventListener("logout", handleStorageChange);
    
    // Also listen to storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("login", handleStorageChange);
      window.removeEventListener("logout", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
  isLoggedIn={isLoggedIn}
  isProducer={isProducer}
  onLogout={handleLogout}
  goToLogin={goToLogin}
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
  goToProducer={() => {
    localStorage.setItem("previousPage", currentPage);
    setCurrentPage("producer");
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
      {currentPage === "producer" && <ProducerDashboard />}
    </div>
  );
}