import React, { useState, useEffect } from 'react';
import { db, collection, addDoc } from '../firebase';
import products from '../data/Products'; // Update path if needed

const DELIVERY_CHARGE = 18;

function CustomerOrderForm() {
  const [cart, setCart] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const orderTotal = products.reduce((sum, { id, price }) => sum + (cart[id] || 0) * price, 0);

  useEffect(() => {
    document.title = cartItemCount > 0
      ? `(${cartItemCount}) Your Cafe - Order Now`
      : 'Your Cafe - Order Now';
  }, [cartItemCount]);

  const handleQtyChange = (id, qty) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (qty > 0) newCart[id] = qty;
      else delete newCart[id];
      return newCart;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!name || !phone || !address) {
      setError('Please fill all personal info fields.');
      return;
    }

    if (Object.keys(cart).length === 0) {
      setError('Please select at least one product.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        name,
        phone,
        address,
        cart,
        status: 'Preparing',
        createdAt: new Date(),
      });

      setSuccess('Order placed successfully!');
      setCart({});
      setName('');
      setPhone('');
      setAddress('');
    } catch (err) {
      setError('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-edit">
        {cartItemCount > 0 && (
          <a style={{
            textDecoration: 'none', backgroundColor: 'teal', color: '#fff', padding: '8px',
            borderRadius: '100px', border: '3px solid skyblue', position: 'fixed', top: '100px', right: '2rem',
            zIndex: 1000, boxShadow: isHovered ? '0 0 8px #0077ff' : undefined, transition: 'background 0.2s, box-shadow 0.2s',
          }}
            href="#pin-d"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Cart <i className="fa fa-bell"></i>
            <span style={{
              position: 'absolute', top: '-5px', right: '-5px', fontSize: '12px', fontWeight: '900',
              backgroundColor: isHovered ? ' ' : 'red', borderRadius: '48%', padding: '3px 6px'
            }}
            >
              {isHovered ? ' ' : cartItemCount}
            </span>
          </a>
        )}

        <h2>Place Your Order</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Food Menu</legend>
            <div className="products-grid">
              {products.map(({ id, name, price }) => {
                const qty = cart[id] || 0;
                return (
                  <div key={id} className="product-card">
                    <div className="product-header">
                      <div className="product-name">{name}</div>
                      <div className="product-price">₹{price.toFixed(2)}</div>
                    </div>
                    <div className="product-qty">
                      <b>Quantity:</b>
                      <select value={qty} onChange={(e) => handleQtyChange(id, parseInt(e.target.value, 10) || 0)} >
                        {[...Array(11).keys()].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="product-total">
                      Total: ₹{(qty * price).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div id="pin-d" className="order-total" style={{ position: 'relative', overflow: 'visible', backgroundColor: 'white', zIndex: '1000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Item (Qty)</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Price / Action</th>
                  </tr>

                </thead>
                <tbody>
                  {products
                    .filter(({ id }) => cart[id])
                    .map(({ id, name, price }) => {
                      const qty = cart[id];
                      return (
                        <tr key={id} style={{ borderBottom: '1px solid #ddd' }}>

                          {/* ITEM + QTY */}
                          <td style={{ padding: '8px' }}>
                            {name} <strong style={{ color: '#555' }}>x {qty}</strong>
                          </td>

                          {/* PRICE + ACTION */}
                          <td style={{ textAlign: 'right', padding: '8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                            <span>₹{(qty * price).toFixed(2)}</span>
                            <button onClick={() => handleQtyChange(id, 0)} title="Remove item"
                              style={{ margin: 0, padding: '4px 8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  <p style={{ margin: '0', color: '#999', textAlign: 'left' }}>
                    ➡
                  </p>

                  {/* Subtotal */}
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td style={{ textAlign: 'left', padding: '8px' }}>
                      <strong>Item(s) Price:</strong>
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>
                      ₹{orderTotal.toFixed(2)}
                    </td>
                  </tr>

                  {/* Delivery Charge */}
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td style={{ textAlign: 'left', padding: '8px' }}>
                      <strong>Delivery Charge:</strong>
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>
                      ₹{DELIVERY_CHARGE.toFixed(2)}
                    </td>
                  </tr>

                  {/* Total */}
                  <tr style={{ backgroundColor: '#f1f1f1', borderTop: '2px solid #ccc' }}>
                    <td style={{ textAlign: 'left', padding: '8px' }}>
                      <strong>Total Amount:</strong>
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>
                      <strong>₹{(orderTotal + DELIVERY_CHARGE).toFixed(2)}</strong>
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          </fieldset>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <fieldset>
            <legend>Your Information</legend>

            <label> UserName / Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </label>

            <label> Phone Number:
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} pattern="[0-9]{10}" maxLength="10" inputMode="numeric" placeholder="Enter 10 digit phone no" required />
            </label>

            <label> Build no / floor no / Address:
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" required />
            </label>

            <br />
            <button type="submit" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </fieldset>
        </form>
      </div>

      <footer style={{ textAlign: 'center', padding: '0', fontSize: '14px', backgroundColor: '#f5f5f5', color: '#333' }}>
        <p>© 2025 ☕ Your Cafe - Developed By Priyanshu <br /> All rights reserved.</p>
      </footer>
    </>
  );
}

export default CustomerOrderForm;