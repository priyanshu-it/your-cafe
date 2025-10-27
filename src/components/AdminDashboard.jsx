import React, { useEffect, useState } from 'react';
import products from '../data/Products'; // adjust path as needed
import { db, collection, getDocs, doc, updateDoc } from '../firebase';

const DELIVERY_CHARGE = 18;

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersCol = collection(db, 'orders');
      const snapshot = await getDocs(ordersCol);
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleString()
            : 'N/A',
        };
      });
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Print order slip
  const printOrderSlip = (order) => {
    const orderItems = Object.entries(order.cart)
      .map(([itemId, qty]) => {
        const product = products.find((p) => p.id === itemId);
        const price = product?.price || 0;
        const name = product?.name || itemId;
        return `<li>${name}: ${qty} × ₹${price.toFixed(2)} = ₹${(price * qty).toFixed(2)}</li>`;
      })
      .join('');

    const itemsTotal = Object.entries(order.cart).reduce((sum, [itemId, qty]) => {
      const product = products.find((p) => p.id === itemId);
      return sum + (product?.price || 0) * qty;
    }, 0);

    const orderTotal = (itemsTotal + DELIVERY_CHARGE).toFixed(2);

    const slipHtml = `
      <html>
        <head>
          <title>Order Slip</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
        </head>
        <body><div className="navbar-logo">☕ Your Café</div>
          <h2 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #2980b9; padding-bottom: 8px; margin-bottom: 20px;">
            Food Order Slip
          </h2>
          <h3 style="color: #34495e;">Customer Details:</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Time:</strong> ${order.createdAt}</p>
          <h3 style="margin-top: 20px; color: #34495e;">Order Details:</h3>
          <ul>
            ${orderItems}
            <li>Delivery: ₹${DELIVERY_CHARGE}</li>
          </ul>
            <p style="font-weight: bold; margin-top: 15px; font-size: 18px; text-align: right; 
            color: #27ae60; border-top: 2px solid #27ae60; padding-top: 10px;">
                Total Amount: ₹${orderTotal}
            </p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(slipHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="container-edit">
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Items</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const itemsTotal = Object.entries(order.cart).reduce((sum, [itemId, qty]) => {
                const product = products.find((p) => p.id === itemId);
                return sum + (product?.price || 0) * qty;
              }, 0);
              const orderTotal = (itemsTotal + DELIVERY_CHARGE).toFixed(2);

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 15 }}>
                      {Object.entries(order.cart).map(([itemId, qty]) => {
                        const product = products.find((p) => p.id === itemId);
                        const price = product?.price || 0;
                        return (
                          <li key={itemId}>
                            {product?.name || itemId}: {qty} × ₹{price.toFixed(2)} = ₹{(price * qty).toFixed(2)}
                          </li>
                        );
                      })}
                      <li style={{ fontWeight: 'bold', marginTop: 4 }}>
                        Delivery: ₹{DELIVERY_CHARGE} + Total: ₹{orderTotal}
                      </li>
                    </ul>
                  </td>
                  <td>{order.createdAt}</td>
                  <td>
                   <b>{order.status}</b> <hr/>
                    {order.status === 'Delivered' ? (
                      <select disabled>
                        <option>Delivered</option>
                      </select>
                    ) : (
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} >
                        <option value="Preparing">Preparing</option>
                        <option value="Received">Received</option> 
                        <option value="Ready">Ready</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <button onClick={() => printOrderSlip(order)} style={{ marginLeft: 10 }}>
                      <i className="fa fa-print"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;