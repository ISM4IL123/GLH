import React, { useState } from "react";

export default function ProfilePage({ onNavigate }) {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Current user:", user);
    const [showProducerForm, setShowProducerForm] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProducerSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/producers/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId: user?.id,
                    businessName,
                    businessType,
                    description
                }),
            });

            const data = await response.json();
            console.log("Producer application response:", data);

            if (response.ok && data.success) {
                setIsError(false);
                setMessage("Application submitted successfully! We'll review it soon.");
                setBusinessName("");
                setBusinessType("");
                setDescription("");
                setTimeout(() => setShowProducerForm(false), 1500);
            } else {
                setIsError(true);
                setMessage(data.message || "Error submitting application");
            }
        } catch (err) {
            console.error("Producer application error:", err);
            setIsError(true);
            setMessage("Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ color: "#fff", padding: "60px" }}>
            <h2>Profile</h2>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>

            {user?.status !== "producer" && (
                <>
                    <button
                        style={{
                            marginTop: "30px",
                            padding: "10px 20px",
                            background: "#6c5ce7",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                        onClick={() => setShowProducerForm(!showProducerForm)}
                    >
                        {showProducerForm ? "Cancel" : "Apply to be a Producer"}
                    </button>

                    {showProducerForm && (
                        <form
                            onSubmit={handleProducerSubmit}
                            style={{
                                marginTop: "30px",
                                padding: "20px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                maxWidth: "500px"
                            }}
                        >
                            <h3>Producer Application</h3>

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
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Your business name"
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
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                    Type of Products
                                </label>
                                <input
                                    type="text"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    placeholder="e.g. Organic Vegetables, Dairy Products"
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
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                    Business Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell us about your business..."
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
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}