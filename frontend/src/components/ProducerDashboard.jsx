import React, { useState, useEffect } from "react";

export default function ProducerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/producers/my-products", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userName = user?.name;
        setProducts((data.products || []).filter(p => p.producer === userName));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/producers/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: productName,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
          description
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsError(false);
        setMessage("Product added successfully!");
        setProductName("");
        setPrice("");
        setStock("");
        setCategory("");
        setDescription("");
        setShowAddProductForm(false);
        fetchProducts();
      } else {
        setIsError(true);
        setMessage(data.message || "Error adding product");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/producers/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Product deleted successfully!");
        fetchProducts();
      } else {
        setIsError(true);
        setMessage(data.message || "Error deleting product");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Server error. Please try again.");
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditStock(product.stock);
    setEditDescription(product.description);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditStock("");
    setEditDescription("");
  };

  const handleUpdateProduct = async (productId) => {
    if (!editStock || !editDescription) {
      setIsError(true);
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/producers/product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          stock: parseInt(editStock),
          description: editDescription
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsError(false);
        setMessage("Product updated successfully!");
        setEditingProductId(null);
        fetchProducts();
      } else {
        setIsError(true);
        setMessage(data.message || "Error updating product");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div style={{ color: "#fff", padding: "60px 40px" }}>
      <h2>Producer Dashboard</h2>
      <p>Welcome, {user?.name}!</p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#6c5ce7",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        onClick={() => setShowAddProductForm(!showAddProductForm)}
      >
        {showAddProductForm ? "Cancel" : "Add New Product"}
      </button>

      {showAddProductForm && (
        <form
          onSubmit={handleAddProduct}
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            maxWidth: "600px"
          }}
        >
          <h3>Add New Product</h3>

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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Organic Apples"
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "5px",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2.50"
              step="0.01"
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "5px",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="100"
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "5px",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Fruit, Vegetables, Dairy"
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "5px",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
              required
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "5px",
                color: "#fff",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "10px",
              background: isSubmitting ? "#999" : "#00b894",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontSize: "1rem"
            }}
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Your Products ({products.length})</h3>
        {products.length === 0 ? (
          <p>No products yet. Add your first product!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                {editingProductId === product.id ? (
                  <div>
                    <h4>{product.name}</h4>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Category:</strong> {product.category}</p>

                    <div style={{ marginBottom: "15px", marginTop: "10px" }}>
                      <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: "5px",
                          color: "#fff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows="3"
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: "5px",
                          color: "#fff",
                          boxSizing: "border-box",
                          fontFamily: "inherit"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleUpdateProduct(product.id)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#00b894",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#95a5a6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>{product.name}</h4>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Stock:</strong> {product.stock} units</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => startEdit(product)}
                        style={{
                          flex: 1,
                          padding: "8px 15px",
                          background: "#3498db",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          flex: 1,
                          padding: "8px 15px",
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
