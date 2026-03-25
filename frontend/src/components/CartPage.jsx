import React, { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeOne = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);

    updateCart(newCart);
  };

  const addOne = (id) => {
    const newCart = cart.map(item => {
      if (item.id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    updateCart(newCart);
  };

  if (!cart.length) {
    return <p style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>Your cart is empty</p>;
  }

  return (
    <div>
      <h2 style={{ color: "#00b4d8", textAlign: "center" }}>Your Cart</h2>

      <div style={{
  width: "90%",
  maxWidth: "900px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
}}>
        {cart.map(product => (
          <div key={product.id} style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#fff",
            height: "220px",   // 🔥 FIXED SIZE
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h3>{product.name}</h3>
              <p>£{product.price.toFixed(2)}</p>
              <p>Qty: {product.quantity}</p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => removeOne(product.id)} style={btn}>-</button>

              <button
                onClick={() => {
                  localStorage.setItem("selectedProduct", JSON.stringify(product));
                  localStorage.setItem("currentPage", "details");
                  window.location.reload();
                }}
                style={btn}
              >
                Details
              </button>

              <button onClick={() => addOne(product.id)} style={btn}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = {
  backgroundColor: "#00b4d8",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer"
};