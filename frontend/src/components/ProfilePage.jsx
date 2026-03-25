export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    return (
      <div style={{ color: "#fff", padding: "20px" }}>
        <h2>Profile</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>
    );
  }