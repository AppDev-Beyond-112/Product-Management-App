import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Alert } from "react-bootstrap";
import CheckoutModal from "./CheckoutModal";

function CartModal({ show, onHide, onCartUpdate, onStockUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(`http://localhost:8000/api/cart/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items.");

      const data = await response.json();
      const formattedCart = data.cart.map((item) => ({
        ...item,
        price: parseFloat(item.price_per_item),
        total: parseFloat(item.total_price),
        stock: item.available_stock,
      }));

      setCartItems(formattedCart || []);
      setLocalCart(formattedCart || []);
      onCartUpdate(formattedCart.length);
      onStockUpdate(formattedCart); // Update stock levels when fetching cart
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity, maxStock) => {
    if (quantity > maxStock) {
      setError(`Quantity cannot exceed available stock (${maxStock}).`);
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    setError(null);

    setLocalCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );

    // Trigger stock update after quantity change
    onStockUpdate(localCart);
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const updatedCart = localCart.filter((item) => item.product_id !== productId);
      setLocalCart(updatedCart);
      onCartUpdate(updatedCart.length);
      
      // Trigger stock update after item removal
      onStockUpdate(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Save changes to cart
  const saveCartChanges = async () => {
    try {
      const userId = localStorage.getItem("userId");

      await Promise.all(
        localCart.map((item) =>
          fetch(`http://localhost:8000/api/cart/${item.product_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, quantity: item.quantity }),
          })
        )
      );

      fetchCartItems();
    } catch (error) {
      console.error("Error saving cart changes:", error.message);
    }
  };

  // Calculate total
  const calculateTotal = () =>
    localCart.reduce((total, item) => total + item.total, 0);

  // Handle checkout completion
  const handleCheckoutCompletion = (updatedCart) => {
    setLocalCart([]); // Clear the cart locally
    onCartUpdate(0); // Reset cart count
    onStockUpdate(); // Trigger stock update in parent component
  };

  useEffect(() => {
    if (show) fetchCartItems();
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          saveCartChanges();
          onHide();
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          {localCart.length === 0 ? (
            <div className="text-center py-5">
              <p>Your cart is empty!</p>
            </div>
          ) : (
            <>
              <Table responsive bordered hover className="text-center align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {localCart.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.product_name}</td>
                      <td>₱{item.price.toFixed(2)}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          max={item.stock}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product_id,
                              Number(e.target.value),
                              item.stock
                            )
                          }
                        />
                        <small className="text-muted">Max: {item.stock}</small>
                      </td>
                      <td>₱{item.total.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-end mt-3">
                <h5>Total: ₱{calculateTotal().toFixed(2)}</h5>
              </div>
            </>
          )}
        </Modal.Body>
        {localCart.length > 0 && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                saveCartChanges();
                onHide();
              }}
            >
              Close
            </Button>
            <Button
              variant="warning"
              onClick={() => setShowCheckoutModal(true)}
              style={{ color: "white" }}
            >
              Checkout
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      <CheckoutModal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        cartItems={localCart}
        onConfirmCheckout={handleCheckoutCompletion}
        onStockUpdate={onStockUpdate} // Trigger stock update on successful checkout
      />
    </>
  );
}

export default CartModal;
