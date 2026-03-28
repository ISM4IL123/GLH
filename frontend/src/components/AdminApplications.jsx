import React, { useState, useEffect } from "react";

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/producers/applications", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setApplications(data.applications || []);
            } else {
                setIsError(true);
                setMessage(data.message || "Error fetching applications");
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
            setIsError(true);
            setMessage("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        try {
            const response = await fetch("http://localhost:5000/api/producers/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    applicationId,
                    status: newStatus
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsError(false);
                setMessage(`Application ${newStatus} successfully!`);
                fetchApplications();
            } else {
                setIsError(true);
                setMessage(data.message || "Error updating application");
            }
        } catch (err) {
            console.error("Error updating application:", err);
            setIsError(true);
            setMessage("Server error. Please try again.");
        }
    };

    if (loading) {
        return (
            <div style={{ color: "#fff", padding: "60px", textAlign: "center" }}>
                <h2>Producer Applications</h2>
                <p>Loading applications...</p>
            </div>
        );
    }

    return (
        <div style={{ color: "#fff", padding: "60px 40px" }}>
            <h2>Producer Applications</h2>

            {message && (
                <div style={{
                    padding: "15px",
                    marginBottom: "20px",
                    borderRadius: "5px",
                    background: isError ? "#ffebee" : "#e8f5e9",
                    color: isError ? "#c62828" : "#2e7d32"
                }}>
                    {message}
                </div>
            )}

            {applications.length === 0 ? (
                <p>No applications yet.</p>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                padding: "20px",
                                borderRadius: "10px",
                                border: `2px solid ${
                                    app.status === "approved"
                                        ? "#00b894"
                                        : app.status === "rejected"
                                        ? "#e74c3c"
                                        : "#f39c12"
                                }`
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                                <div>
                                    <h3>{app.businessName}</h3>
                                    <p><strong>User ID:</strong> {app.userId}</p>
                                    <p><strong>Type:</strong> {app.businessType}</p>
                                    <p><strong>Status:</strong> <span style={{ 
                                        color: app.status === "approved" ? "#00b894" : app.status === "rejected" ? "#e74c3c" : "#f39c12",
                                        textTransform: "uppercase",
                                        fontWeight: "bold"
                                    }}>{app.status}</span></p>
                                </div>
                                <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
                                    <p>{new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "5px" }}>
                                <p><strong>Description:</strong></p>
                                <p>{app.description}</p>
                            </div>

                            {app.status === "pending" && (
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={() => handleUpdateStatus(app._id, "approved")}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            background: "#00b894",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(app._id, "rejected")}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            background: "#e74c3c",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
