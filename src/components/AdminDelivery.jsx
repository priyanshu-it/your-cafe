import React, { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc, collection, getDocs } from "../firebase";

function AdminDelivery() {
  const [orderId, setOrderId] = useState("");
  const [pinId, setPinId] = useState("");
  const [deliveryPassword, setDeliveryPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  // 🔹 Load all orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const snapshot = await getDocs(ordersRef);
        const orderList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("⚠️ Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const ADMIN_PASSWORD = "admin123";

    try {
      // 🔸 Check admin password
      if (deliveryPassword !== ADMIN_PASSWORD) {
        setError("❌ Incorrect delivery password.");
        return;
      }

      // 🔸 Compute expected PIN
      const numericPart = parseInt(orderId.replace(/\D/g, ""), 10);
      const orderNum = !isNaN(numericPart) ? numericPart : orderId.length;
      const expectedPin = orderNum * 2;

      if (parseInt(pinId, 10) !== expectedPin) {
        setError(`❌ Invalid PIN ID.`);
        return;
      }

      // 🔸 Check if order exists
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        setError("❌ Order not found in database.");
        return;
      }

      // 🔸 Update order status
      await updateDoc(orderRef, { status: "Delivered" });

      setSuccess(`✅ Delivery verified for Order ID.`);
    } catch (err) {
      console.error("Error updating delivery:", err);
      setError("⚠️ Failed to update delivery status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Admin Verify Delivery</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleVerify}>
        <select value={orderId} onChange={(e) => setOrderId(e.target.value)} required style={{ width: "100%" }} >
          <option value="">-- Select Order ID --</option>
          {orders.map((order) => {
            const id = order.id;
            const prefix = id.slice(0, 16); // show end 4 characters hide
            const masked = `${prefix} XXXX`;
            return (
              <option key={id} value={id}>
                {masked}
              </option>
            );
          })}
        </select>

        <label>
          PIN ID:
          <input type="number" value={pinId} onChange={(e) => setPinId(e.target.value)} placeholder="Enter PIN ID" required />
        </label>

        <label>
          Delivery Password:
          <input type="password" value={deliveryPassword} onChange={(e) => setDeliveryPassword(e.target.value)} placeholder="Admin password" required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"} <i className="fa fa-sign-in"></i>
        </button>
      </form>
    </div>
  );
}

export default AdminDelivery;