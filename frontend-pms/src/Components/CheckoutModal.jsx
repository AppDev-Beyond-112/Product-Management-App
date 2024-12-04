import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

function CheckoutModal({ 
  show, 
  onHide, 
  cartItems, 
  deliveryFee = 50, 
  onConfirmCheckout 
}) {
  const [paymentMethod, setPaymentMethod] = useState('');

  const calculateCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleConfirm = () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    onConfirmCheckout(paymentMethod);
    onHide(); // Close the modal after confirmation
  };

  const totalCartPrice = calculateCartTotal();
  const finalTotal = totalCartPrice + deliveryFee;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <>
            <h5>Order Summary</h5>
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Delivery Fee</span>
                  <strong>₱{deliveryFee.toFixed(2)}</strong>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Total</strong>
                  <strong>₱{finalTotal.toFixed(2)}</strong>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <Form className="mt-4">
              <h5>Mode of Payment</h5>
              <Form.Check
                type="radio"
                label="Cash on Delivery"
                name="paymentMethod"
                value="Cash on Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Credit/Debit Card"
                name="paymentMethod"
                value="Credit/Debit Card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Form>
          </>
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm Checkout
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default CheckoutModal;
