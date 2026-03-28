import React, { useEffect, useState } from "react";

export default function CheckoutPage({ goBack }) {
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setIsProcessing(true);
    setMessage("");
    setIsError(false);

    try {
      const cartItems = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      console.log("Sending checkout request with items:", cartItems);

      const response = await fetch("http://localhost:5000/api/producers/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          items: cartItems
        })
      });

      const data = await response.json();
      console.log("Checkout response:", data);

      if (response.ok && data.success) {
        setIsError(false);
        setMessage("Order placed successfully!");
        localStorage.removeItem("cart");
        setTimeout(() => {
          goBack();
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.message || "Error processing checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setIsError(true);
      setMessage("Server error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart.length) {
    return (
      <p style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        No items to checkout
      </p>
    );
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>

      {/* SIDEBAR */}
      <div style={{ width: "220px", padding: "20px", color: "#fff" }}>
        <h3>Checkout</h3>
        <p>Review your order</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1 }}>

        <h2 style={{ textAlign: "center", color: "#00b4d8" }}>
          Checkout
        </h2>

        {/* MAIN BOX */}
        <div style={{
          width: "90%",
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "10px",
          color: "#fff"
        }}>

          {/* MESSAGE */}
          {message && (
            <div style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              background: isError ? "#ffebee" : "#e8f5e9",
              color: isError ? "#c62828" : "#2e7d32"
            }}>
              {message}
            </div>
          )}

          {/* ITEMS */}
          {cart.map(item => (
            <div key={item.id} style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px"
            }}>
              <span>{item.name} x{item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr style={{ margin: "20px 0", borderColor: "#555" }} />

          {/* TOTAL */}
          <h3 style={{ textAlign: "right" }}>
            Total: £{total.toFixed(2)}
          </h3>

          {/* BUTTONS */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px"
          }}>
            <button onClick={goBack} disabled={isProcessing} style={{ ...btn, opacity: isProcessing ? 0.5 : 1 }}>
              Back
            </button>

            <button onClick={handleCheckout} disabled={isProcessing} style={{ ...btn, flex: 1, opacity: isProcessing ? 0.5 : 1, cursor: isProcessing ? "not-allowed" : "pointer" }}>
              {isProcessing ? "Processing..." : "Confirm Order"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const btn = {
  backgroundColor: "#00b4d8",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer"
};