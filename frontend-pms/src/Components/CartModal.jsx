import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';

function CartModal({ show, onHide, onCheckoutClick }) {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from the backend
  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('User ID from localStorage:', userId);

      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/cart/${userId}`, { method: 'GET' });

      console.log('Response object:', response);

      if (!response.ok) {
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);

        try {
          const errorData = await response.json();
          console.error('Error details from server:', errorData);
          throw new Error(errorData.message || 'Failed to fetch cart items');
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError.message);
          throw new Error('Unknown error occurred while fetching cart items');
        }
      }

      const data = await response.json();
      console.log('Cart data retrieved from server:', data);

      const formattedCart = data.cart.map(item => ({
        ...item,
        price_per_item: parseFloat(item.price_per_item), // Convert to number
        total_price: parseFloat(item.total_price),       // Convert to number
      }));

      setCartItems(formattedCart || []);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      await fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error updating cart item:', error.message);
    }
  };

  // Remove item from the cart
  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      await fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error removing cart item:', error.message);
    }
  };

  // Calculate total cart price
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total_price, 0);

  // Fetch cart items when modal is shown
  useEffect(() => {
    if (show) {
      fetchCartItems();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>₱{item.price_per_item.toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(item.product_id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>₱{item.total_price.toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => removeFromCart(item.product_id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {cartItems.length > 0 && (
          <div className="mt-3 text-right">
            <h5>Total: ₱{calculateTotal().toFixed(2)}</h5>
          </div>
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onCheckoutClick}>
            Checkout
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default CartModal;
