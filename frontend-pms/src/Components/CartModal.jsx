import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

function CartModal({ show, onHide, onCartUpdate, onStockUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

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
      onCartUpdate(formattedCart.length);
      onStockUpdate(formattedCart);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

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

    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
    onStockUpdate(cartItems);
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const updatedCart = cartItems.filter(
        (item) => item.product_id !== productId
      );
      setCartItems(updatedCart);
      onCartUpdate(updatedCart.length);
      onStockUpdate(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total, 0);

  useEffect(() => {
    if (show) fetchCartItems();
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#ff8c00", color: "white" }}
      >
        <Modal.Title>Your Shopping Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {cartItems.length === 0 ? (
          <div className="text-center py-3">
            <p>Your cart is empty!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <Card key={item.product_id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="mb-2">{item.product_name}</h5>
                    <p className="text-muted mb-1">
                      Price: ₱{item.price.toFixed(2)}
                    </p>
                    <p className="text-muted">
                      Available stock: {item.stock}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product_id,
                          Number(e.target.value),
                          item.stock
                        )
                      }
                    />
                  </Form.Group>
                </div>
                <div className="text-end mt-3">
                  <strong>Total: ₱{item.total.toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer>
          <div className="w-100 text-end">
            <h5>Total Price: ₱{calculateTotal().toFixed(2)}</h5>
            <Button
              variant="warning"
              onClick={onHide}
              style={{ backgroundColor: "#ff8c00", borderColor: "#ff8c00" }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default CartModal;
