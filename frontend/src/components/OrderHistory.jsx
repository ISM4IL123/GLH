import React, { useEffect, useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view order history");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/producers/order-history", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Server error. Please try again.");
        console.error("Order history error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>Loading orders...</p>;
  }

  if (error || !orders.length) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        <p>{error || "No orders found"}</p>
        <button
          onClick={() => {
            localStorage.setItem("previousPage", "orderhistory");
            localStorage.setItem("currentPage", "home");
            window.location.reload();
          }}
          style={{
            backgroundColor: "#00b4d8",
            color: "#fff",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            marginTop: "20px"
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#00b4d8", textAlign: "center" }}>Order History</h2>

      <div style={{
        width: "90%",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        marginBottom: "50px"
      }}>
        {orders.map((order) => (
          <div key={order.id} style={{
            background: "rgba(255,255,255,0.05)",
            padding: "25px",
            borderRadius: "12px",
            color: "#fff"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div>
                <strong>Order #{order.id.slice(-6)}</strong>
                <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
                  {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>£{order.total.toFixed(2)}</strong>
              </div>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}>
              {order.items.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", marginBottom: "4px" }}>{item.name}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Producer: {item.producer} • £{item.price.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    £{item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            localStorage.setItem("previousPage", "orderhistory");
            localStorage.setItem("currentPage", "home");
            window.location.reload();
          }}
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
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
