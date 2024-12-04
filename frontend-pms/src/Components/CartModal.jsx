import React from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';

function CartModal({ show, onHide, cartItems, updateCartItem, removeFromCart, onCheckoutClick }) {
  // Calculate total cart price
  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
      return total + itemTotal;
    }, 0);

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
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₱{(Number(item.price) || 0).toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td>₱{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => removeFromCart(item.id)}>
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
