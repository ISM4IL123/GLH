import React, { useEffect, useState } from "react";

export default function CheckoutPage({ goBack }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    localStorage.removeItem("cart");
    alert("Order placed successfully!");
    goBack();
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
            <button onClick={goBack} style={btn}>
              Back
            </button>

            <button onClick={handleCheckout} style={{ ...btn, flex: 1 }}>
              Confirm Order
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