import React, { useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { FaMapMarkerAlt, FaMoneyBillAlt, FaCreditCard } from "react-icons/fa";
import "../Custom CSS/CheckoutModal.css";

function CheckoutModal({ show, onHide, cartItems, onConfirmCheckout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    unitAndBarangay: "",
    city: "",
    province: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total, 0).toFixed(2);

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8000/api/cart/checkout/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            cart_items: cartItems,
            shipping_details: shippingDetails,
            payment_method: paymentMethod,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed. Please try again.");
      }

      const data = await response.json();
      onConfirmCheckout(data.updatedCart || []);
      setShowConfirmation(false);
      onHide();
    } catch (err) {
      console.error("Error during checkout:", err.message);
      setError("Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToConfirmation = () => {
    // Validation to ensure all fields are filled
    if (
      !shippingDetails.unitAndBarangay ||
      !shippingDetails.city ||
      !shippingDetails.province
    ) {
      setError("Please fill in all shipping details.");
      return;
    }
    setError(null);
    setShowConfirmation(true);
  };

  return (
    <>
      {/* Main Checkout Form */}
      <Modal show={show && !showConfirmation} onHide={onHide} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#ff8c00", color: "white" }}>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="container-fluid">
            <h5>
              <FaMapMarkerAlt /> Shipping Details
            </h5>
            <Form.Group controlId="formUnitBarangay" className="mt-3">
              <Form.Label>
                <FaMapMarkerAlt /> Unit & Barangay
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your unit and barangay"
                name="unitAndBarangay"
                value={shippingDetails.unitAndBarangay}
                onChange={handleInputChange}
                className="input-field"
              />
            </Form.Group>
            <Form.Group controlId="formCity" className="mt-3">
              <Form.Label>
                <FaMapMarkerAlt /> City
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your city"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                className="input-field"
              />
            </Form.Group>
            <Form.Group controlId="formProvince" className="mt-3">
              <Form.Label>
                <FaMapMarkerAlt /> Province
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your province"
                name="province"
                value={shippingDetails.province}
                onChange={handleInputChange}
                className="input-field"
              />
            </Form.Group>
            <h5 className="mt-4">
              <FaMoneyBillAlt /> Payment Method
            </h5>
            <Form.Check
              type="radio"
              label={
                <span>
                  <FaMoneyBillAlt /> Cash on Delivery
                </span>
              }
              name="paymentMethod"
              id="cashOnDelivery"
              value="cash-on-delivery"
              checked={paymentMethod === "cash-on-delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-2"
            />
            <Form.Check
              type="radio"
              label={
                <span>
                  <FaCreditCard /> Credit/Debit Card
                </span>
              }
              name="paymentMethod"
              id="card"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-2"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={handleProceedToConfirmation}
            style={{ backgroundColor: "#ff8c00", borderColor: "#ff8c00" }}
          >
            Proceed to Confirmation
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#ff8c00", color: "white" }}>
          <Modal.Title>Confirm Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            {/* Shipping Details */}
            <h5>
              <FaMapMarkerAlt /> Shipping Details
            </h5>
            <p className="mt-2">
              {`${shippingDetails.unitAndBarangay}, ${shippingDetails.city}, ${shippingDetails.province}`}
            </p>

            <hr />

            {/* Payment Method */}
            <h5>
              <FaMoneyBillAlt /> Payment Method
            </h5>
            <p className="mt-2">
              {paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Credit/Debit Card"}
            </p>

            <hr />

            {/* Total Price */}
            <h5>Total Price</h5>
            <p className="mt-2">₱{calculateTotal()}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Edit Details
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Confirm Order"}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default CheckoutModal;
