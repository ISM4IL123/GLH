import React, { useEffect, useState } from "react";

export default function CheckoutPage({ goBack }) {
  // Add class for CSS targeting
  React.useEffect(() => {
    document.body.classList.add('checkout-page');
    return () => document.body.classList.remove('checkout-page');
  }, []);

  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);


  // New form state
  const [deliveryType, setDeliveryType] = useState("collection");
  const [address, setAddress] = useState({ street: "", city: "", postcode: "" });
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [orderDate] = useState(new Date().toLocaleString());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = deliveryType === "delivery" ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const luhnCheck = (val) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = val.length - 1; i >= 0; i--) {
      let digit = parseInt(val.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const validateVisaCard = () => {
    // Visa: starts with 4, exactly 16 digits
    if (!cardNumber.startsWith("4") || cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
      return "Enter 16 digit Visa card number";
    }

    // Luhn validation
    if (!luhnCheck(cardNumber)) {
      return "Invalid card number (Luhn check failed)";
    }
    // Cardholder name required
    if (!cardholderName.trim()) {
      return "Cardholder name required";
    }
    // Expiry month 01-12, year 00-99
    if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth) || !/^\d{2}$/.test(expiryYear)) {
      return "Expiry must be valid MM/YY";
    }
    // CVV 3 digits for Visa
    if (!/^\d{3}$/.test(cvv)) {
      return "Visa CVV must be 3 digits";
    }
    return "";
  };


  const cardError = validateVisaCard();

  const handleCheckout = async () => {
    const validationError = validateVisaCard();
    if (validationError) {
      setIsError(true);
      setMessage(validationError);
      return;
    }

    setIsProcessing(true);
    setMessage("");
    setIsError(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsError(true);
      setMessage("Please login.");
      setIsProcessing(false);
      return;
    }

    try {
      const cartItems = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const checkoutData = {
        items: cartItems,
        deliveryType,
        address: deliveryType === "delivery" ? address : null,
        paymentMethod: "visa"
      };

      const response = await fetch("http://localhost:5000/api/producers/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(checkoutData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsError(false);
        setMessage("✅ Order placed successfully!");
        localStorage.removeItem("cart");
        setTimeout(() => goBack(), 2000);
      } else {
        setIsError(true);
        setMessage(data.message || "Checkout failed");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Server error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart.length) {
    return <p style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>No items to checkout</p>;
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", padding: "20px", color: "#fff" }}>
        <h3>Checkout</h3>
        <p>Review your order</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1 }}>
        <h2 style={{ textAlign: "center", color: "#00b4d8", marginBottom: "30px" }}>
          Secure Checkout
        </h2>

        <div style={{
          width: "90%",
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "12px",
          color: "#fff"
        }}>

          {message && (
            <div style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: isError ? "rgba(255,107,107,0.2)" : "rgba(76,175,80,0.2)",
              color: isError ? "#ff6b6b" : "#4daf50"
            }}>
              {message}
            </div>
          )}

          {/* Delivery */}
          <fieldset style={{ marginBottom: "30px", border: "none", padding: 0 }}>
            <legend style={{ marginBottom: "15px", color: "#00b4d8" }}>Delivery Method</legend>
            <div style={{ display: "flex", gap: "20px" }}>
              <label style={radioStyle(deliveryType === "collection")}>
                <input
                  id="delivery-collection"
                  type="radio"
                  name="delivery-type"
                  value="collection"
                  checked={deliveryType === "collection"}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                Collection (Free)
              </label>
              <label style={radioStyle(deliveryType === "delivery")}>
                <input
                  id="delivery-delivery"
                  type="radio"
                  name="delivery-type"
                  value="delivery"
                  checked={deliveryType === "delivery"}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                Delivery (£3.99)
              </label>
            </div>
          </fieldset>

          {/* Address */}
          {deliveryType === "delivery" && (
            <div style={{ marginBottom: "30px", padding: "20px", background: "rgba(255,255,255,0.08)", borderRadius: "8px" }}>
              <h4 style={{ marginBottom: "15px", color: "#00b4d8" }}>Delivery Address</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label htmlFor="address-street">Street Address *</label>
                  <input id="address-street" name="street" placeholder="Street Address *" value={address.street} onChange={handleAddressChange} style={inputStyle} aria-required="true" />
                </div>
                <div>
                  <label htmlFor="address-city">City *</label>
                  <input id="address-city" name="city" placeholder="City *" value={address.city} onChange={handleAddressChange} style={inputStyle} aria-required="true" />
                </div>
                <div>
                  <label htmlFor="address-postcode">Postcode *</label>
                  <input id="address-postcode" name="postcode" placeholder="Postcode *" value={address.postcode} onChange={handleAddressChange} style={inputStyle} aria-required="true" />
                </div>
              </div>
            </div>
          )}

          {/* Visa Card */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "15px", color: "#00b4d8" }}>Visa Card Details</h4>
              <fieldset style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "25px", background: "rgba(0,180,216,0.1)", borderRadius: "12px", border: "1px solid rgba(0,180,216,0.3)", margin: 0 }}>
                <legend style={{ marginBottom: "10px", color: "#00b4d8" }}>Visa Card Details</legend>
                <div>
                  <label htmlFor="cardholder-name">Cardholder Name</label>
                  <input
                    id="cardholder-name"
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    style={inputStyle}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="card-number">Card number (16 digits)</label>
                  <input
                    id="card-number"
                    type="text"
                    placeholder="Card number 16 digits"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0,16))}
                    maxLength={16}
                    style={inputStyle}
                    aria-required="true"
                    aria-describedby={cardError ? "card-error" : undefined}
                    aria-invalid={!!cardError}
                  />
                </div>

                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="expiry-month">Expiry MM</label>
                    <input
                      id="expiry-month"
                      type="text"
                      placeholder="MM"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0,2))}
                      maxLength={2}
                      style={{ ...inputStyle, flex: 1 }}
                      aria-required="true"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="expiry-year">Expiry YY</label>
                    <input
                      id="expiry-year"
                      type="text"
                      placeholder="YY"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0,2))}
                      maxLength={2}
                      style={{ ...inputStyle, flex: 1 }}
                      aria-required="true"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
                      maxLength={4}
                      style={{ ...inputStyle, flex: 1 }}
                      aria-required="true"
                    />
                  </div>
                </div>
                {cardError && (
                  <p id="card-error" style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0" }} role="alert">{cardError}</p>
                )}
                <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>
                  <strong>Visa</strong> • Secure 3D Secure • PCI Compliant
                </div>
              </fieldset>
          </div>

          <hr style={{ margin: "30px 0", borderColor: "rgba(255,255,255,0.2)" }} />

          {/* Summary */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "20px", color: "#00b4d8" }}>Order Summary</h3>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "25px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", opacity: 0.9 }}>
                <span>Subtotal ({cart.length} items):</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              {deliveryType === "delivery" && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", opacity: 0.9 }}>
                  <span>Delivery fee:</span>
                  <span>£3.99</span>
                </div>
              )}
              <hr style={{ margin: "15px 0", borderColor: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "bold", marginBottom: "15px" }}>
                <span>Total:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div style={{ opacity: 0.9, lineHeight: "1.4" }}>
                <div><strong>Order Date:</strong> {orderDate}</div>
                <div><strong>Payment:</strong> Visa • {deliveryType}</div>
                {deliveryType === "delivery" && address.street && (
                  <div style={{ fontSize: "0.95rem" }}>
                    <strong>Deliver to:</strong> {address.street}, {address.city} {address.postcode}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button 
              onClick={goBack} 
              disabled={isProcessing || !!cardError}
              aria-label="Go back to previous page"
              style={{ 
                ...btn, 
                opacity: (isProcessing || !!cardError) ? 0.5 : 1,
                flex: 1
              }}
            >
              Back
            </button>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing || !!cardError}
              aria-label={`Pay £${total.toFixed(2)} now`}
              style={{ 
                ...btn, 
                flex: 2,
                opacity: (isProcessing || !!cardError) ? 0.5 : 1,
                cursor: (isProcessing || !!cardError) ? "not-allowed" : "pointer"
              }}
            >
              {isProcessing ? "Processing..." : `Pay £${total.toFixed(2)}`}
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
  padding: "15px 30px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "600"
};

const inputStyle = {
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box"
};

const radioStyle = (checked) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  background: checked ? "rgba(0,180,216,0.2)" : "rgba(255,255,255,0.05)",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s",
  border: checked ? "1px solid #00b4d8" : "1px solid rgba(255,255,255,0.1)"
});
