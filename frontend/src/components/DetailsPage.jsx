import React, { useState } from "react";

export default function DetailsPage({ product, goBack }) {
  const [amount, setAmount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === product?.id);
    return existing ? existing.quantity : 1;
  });

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const existing = cart.find(p => p.id === product.id);
  
    if (existing) {
      if (existing.quantity + amount > product.stock) return;
      existing.quantity += amount;
    } else {
      cart.push({ ...product, quantity: amount });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // ✅ go back to EXACT page
    goBack();
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>

      {/* SIDEBAR (same as homepage) */}
      <div style={{ width: "220px", padding: "20px", color: "#fff" }}>
        <h3>Product</h3>
        <p>{product.category}</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1 }}>

        {/* CLOSE BUTTON */}
        <button
          onClick={goBack}
          style={{
            marginLeft: "20px",
            marginBottom: "10px",
            background: "#00b4d8",
            border: "none",
            padding: "8px 12px",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          X
        </button>

        <h2 style={{ textAlign: "center", color: "#00b4d8" }}>
          {product.name}
        </h2>

        {/* BIG BOX */}
        <div style={{
          width: "90%",
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "10px",
          color: "#fff"
        }}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          <p>Price: £{product.price.toFixed(2)}</p>
          <p>Stock: {product.stock}</p>

          {/* QUANTITY CONTROLS */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            justifyContent: "center"
          }}>
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              style={btnStyle}
            >-</button>

            <div style={{
              padding: "10px",
              minWidth: "40px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {amount}
            </div>
            <button
              onClick={() => {
                if (amount < product.stock) setAmount(amount + 1);
              }}
              style={btnStyle}
            >+</button>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={addToCart}
            style={{ ...btnStyle, width: "100%", marginTop: "20px" }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  backgroundColor: "#00b4d8",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer"
};