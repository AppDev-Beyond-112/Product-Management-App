import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import CheckoutModal from "./CheckoutModal";

function CartModal({ show, onHide, onCartUpdate, onStockUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

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

      // Separate items with and without stock
      const itemsWithStock = formattedCart.filter((item) => item.stock > 0);
      const zeroStockItems = formattedCart.filter((item) => item.stock === 0);

      // Remove zero stock items from the database
      for (const zeroStockItem of zeroStockItems) {
        await removeFromCart(zeroStockItem.product_id, true);
      }

      setCartItems(itemsWithStock || []);
      onCartUpdate(itemsWithStock.length);
      onStockUpdate(itemsWithStock);
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

    const updatedCart = cartItems.map((item) =>
      item.product_id === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    );

    setCartItems(updatedCart);
    onStockUpdate(updatedCart);
  };

  const removeFromCart = async (productId, skipStateUpdate = false) => {
    try {
      const userId = localStorage.getItem("userId");
      await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!skipStateUpdate) {
        const updatedCart = cartItems.filter(
          (item) => item.product_id !== productId
        );
        setCartItems(updatedCart);
        onCartUpdate(updatedCart.length);
        onStockUpdate(updatedCart);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      setError("Failed to remove item. Please try again.");
    }
  };

  const updateCartItemsInDatabase = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await Promise.all(
        cartItems.map((item) =>
          fetch(`http://localhost:8000/api/cart/${item.product_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              quantity: item.quantity,
              total_price: item.total,
            }),
          })
        )
      );
    } catch (error) {
      console.error("Error updating cart items:", error.message);
      setError("Failed to update cart items. Please try again.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total, 0);

  useEffect(() => {
    if (show) fetchCartItems();
  }, [show]);

  const handleModalClose = async () => {
    await updateCartItemsInDatabase(); // Update quantities in the database when modal closes
    onStockUpdate(cartItems); // Update storefront when modal closes
    onHide();
  };

  const handleCheckout = async () => {
    await updateCartItemsInDatabase(); // Update quantities in the database when proceeding to checkout
    setShowCheckout(true);
    onStockUpdate(cartItems); // Ensure storefront updates on proceeding to checkout
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} centered size="lg">
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
            <div style={{ overflowX: "auto" }}>
              <Table
                bordered
                hover
                className="w-100"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
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
                      <td>₱{item.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
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
                            style={{
                              width: "80px",
                              textAlign: "center",
                              marginRight: "10px",
                            }}
                          />
                          <span style={{ fontSize: "0.9rem", color: "#555" }}>
                            / {item.stock}
                          </span>
                        </div>
                      </td>
                      <td>₱{item.total.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        {cartItems.length > 0 && (
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <h5>Total Price: ₱{calculateTotal().toFixed(2)}</h5>
              <Button
                variant="warning"
                onClick={handleCheckout}
                style={{ backgroundColor: "#ff8c00", borderColor: "#ff8c00" }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Modal.Footer>
        )}
      </Modal>

      <CheckoutModal
        show={showCheckout}
        onHide={() => {
          setShowCheckout(false);
          onStockUpdate(cartItems); // Update storefront when checkout modal is closed
        }}
        cartItems={cartItems}
        onConfirmCheckout={(updatedCart) => {
          setCartItems(updatedCart);
          onCartUpdate(updatedCart.length);
          onStockUpdate(updatedCart);
          setShowCheckout(false);
        }}
      />
    </>
  );
}

export default CartModal;
