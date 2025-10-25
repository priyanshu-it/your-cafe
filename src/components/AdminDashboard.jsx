import React, { useEffect, useState } from 'react';
import products from '../data/Products'; // adjust path as needed
import { db, collection, getDocs, doc, updateDoc, /* deleteDoc */ } from '../firebase';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // const deleteOrder = async (id) => {
  //   if (!window.confirm('Are you sure to delete this order?')) return;
  //   try {
  //     await deleteDoc(doc(db, 'orders', id));
  //     setOrders((prev) => prev.filter((o) => o.id !== id));
  //   } catch (err) {
  //     console.error('Failed to delete order:', err);
  //   }
  // };

  // Function to print order slip
  const printOrderSlip = (order) => {
    const orderItems = Object.entries(order.cart)
      .map(([itemId, qty]) => {
        const product = products.find((p) => p.id === itemId);
        const name = product ? product.name : itemId;
        const price = product ? product.price : 0;
        const total = price * qty;

        return `<li>${name}: ${qty} × ${(price).toFixed(2)} = ₹${(total).toFixed(2)}</li>`;
      })
      .join('');

    const orderTotal = Object.entries(order.cart).reduce((sum, [itemId, qty]) => {
      const product = products.find((p) => p.id === itemId);
      const price = product ? product.price : 0;
      return sum + 18 + price * qty;
    }, 0).toFixed(2);

    const slipHtml = `
      <html>
        <head>
          <title>Order Slip</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 5px; }
            .total { font-weight: bold; margin-top: 10px; }
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
          </ul>
          <ul>
            <li>Delivery: ₹18</li>
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 15 }}>
                    {order.cart &&
                      Object.entries(order.cart).map(([itemId, qty]) => {
                        const product = products.find((p) => p.id === itemId);
                        const name = product ? product.name : itemId;
                        const price = product ? product.price : 0;
                        const itemTotal = price * qty;

                        return (
                          <li key={itemId}>
                            {name}: {qty} × {price.toFixed(2)} = {(itemTotal).toFixed(2)}
                          </li>
                        );
                      })}
                    <li style={{ fontWeight: 'bold', marginTop: 4 }}>
                      Delivery: ₹18 + Total:{' '}
                      {Object.entries(order.cart)
                        .reduce((sum, [itemId, qty]) => {
                          const product = products.find((p) => p.id === itemId);
                          const price = product ? product.price : 0;
                          return sum + 18 + price * qty;
                        }, 0)
                        .toFixed(2)}
                    </li>
                  </ul>
                </td>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'Delivered' ? (
                    <select>
                      <option value="delivered">Delivered</option>
                    </select>
                  ) : (
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                      
                      <option value="preparing">Preparing</option>
                      <option value="received">Received</option>
                      <option value="ready">Ready</option>
                    </select>
                  )}
                  {/* <button onClick={() => deleteOrder(order.id)} style={{ marginLeft: 8 }} >
                    Delete
                  </button> */}
                  <button onClick={() => printOrderSlip(order)} style={{ marginLeft: 10 }} >
                    <i class="fa fa-print"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AdminDashboard;