import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";

function CheckoutModal({ show, onHide, cartItems, onConfirmCheckout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate checkout process or call your API here
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8000/api/cart/checkout/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, cart_items: cartItems }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed. Please try again.");
      }

      const data = await response.json();

      // Call the onConfirmCheckout callback after successful checkout
      onConfirmCheckout(data.updatedCart || []);

      // Close the modal
      onHide();
    } catch (err) {
      console.error("Error during checkout:", err.message);
      setError("Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to proceed with the checkout?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleCheckout} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CheckoutModal;
