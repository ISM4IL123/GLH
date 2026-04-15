import React, { useEffect, useState } from "react";
import { getImagePath } from '../utils/imageUtils.js';

export default function CartPage() {
  // Add class for CSS targeting
  React.useEffect(() => {
    document.body.classList.add('cart-page');
    return () => document.body.classList.remove('cart-page');
  }, []);

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
            height: "220px",
            display: "flex",
            flexDirection: "flex-start",
            justifyContent: "space-between"
          }}>
            <img 
              src={getImagePath(product.name, product?.image)} 
              alt={product.name}
              style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}}
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'flex'; 
              }}
            />
            <div style={{width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'none', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>No image</div>
            <div style={{flex: 1}}>
              <h3>{product.name}</h3>
              <p>Producer: {product.producer}</p>
              <p>£{product.price.toFixed(2)}</p>
              <p>Qty: {product.quantity}</p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={() => removeOne(product.id)} 
                aria-label={`Remove one ${product.name}`}
                style={btn}
              >
                -
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("selectedProduct", JSON.stringify(product));
                  localStorage.setItem("previousPage", "cart");
                  localStorage.setItem("currentPage", "details");
                  window.location.reload();
                }}
                aria-label={`View details for ${product.name}`}
                style={btn}
              >
                Details
              </button>

              <button 
                onClick={() => addOne(product.id)} 
                aria-label={`Add one ${product.name}`}
                style={btn}
              >
                +
              </button>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => {
                localStorage.setItem("previousPage", "cart");
                localStorage.setItem("currentPage", "checkout");
                window.location.reload();
              }}
              aria-label={`Proceed to checkout with ${cart.length} items`}
              style={{
                backgroundColor: "#00b4d8",
                color: "#fff",
                border: "none",
                padding: "15px 40px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold"
              }}
            >
              Proceed to Checkout ({cart.length} items)
            </button>
          </div>
        )}
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

