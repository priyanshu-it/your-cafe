import React, { useState } from 'react';
import { db, collection, query, where, getDocs } from '../firebase';
import products from '../data/Products';

function OrderStatus() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('name', '==', name),
        where('phone', '==', phone)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleString()
            : 'N/A',
        };
      });
      setOrders(results);
      if (results.length === 0) {
        setError('No orders found for given info.');
      }
    } catch {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Your Order Status</h2>
      <form onSubmit={fetchOrders}>
        <label>
          UserName:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' required />
        </label>

        <label>
          Phone Number:
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter your phone number' required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {orders.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Address</th>
              <th>Items</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ id, cart, status, address, createdAt }) => (
              <tr key={id}>
                <td onClick={() => navigator.clipboard.writeText(id)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }} title="📝 Click to copy">{id}
                </td>
                <td>{address}</td>
                <td>
                  <ul>
                    {cart &&
                      Object.entries(cart).map(([itemId, qty]) => {
                        const product = products.find(p => p.id === itemId);
                        return (
                          <li key={itemId}>
                            {product ? product.name : itemId}: {qty}
                          </li>
                        );
                      })}
                  </ul>
                </td>
                <td>{createdAt}</td>
                <td>{status} <br/> {status === 'ready' ? '15-20 min' : ''}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default OrderStatus;