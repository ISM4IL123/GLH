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
import AdminApplications from "./components/AdminApplications";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "login"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userStatus, setUserStatus] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.status || null;
  });

  useEffect(() => {
  const updateAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    setIsLoggedIn(!!token);
    setUserStatus(user?.status || null);
  };

  updateAuth();

  window.addEventListener("login", updateAuth);
  window.addEventListener("logout", updateAuth);

  return () => {
    window.removeEventListener("login", updateAuth);
    window.removeEventListener("logout", updateAuth);
  };
}, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setUserStatus(user?.status || null);
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
  userStatus={userStatus}
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
  goToAdmin={() => {
    localStorage.setItem("previousPage", currentPage);
    setCurrentPage("admin");
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
      {currentPage === "admin" && <AdminApplications />}
    </div>
  );
}