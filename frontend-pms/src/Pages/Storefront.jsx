import React, { useState, useEffect } from "react";
import { Row, Col, Spinner, Badge, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import SFNavBar from "../Components/SFNavBar";
import CartModal from "../Components/CartModal";
import ProductModal from "../Components/ProductModal";
import "../Custom CSS/Storefront.css";

function Storefront({ setIsAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products.");
      const data = await response.json();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/cart/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items.");
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch {
      setError(true);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const userId = parseInt(localStorage.getItem("userId"), 10);
      const response = await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart.");
      }

      fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const handleCheckoutComplete = (updatedCart) => {
    setCartItems(updatedCart); // Clear the cart
  };

  const handleStockUpdate = () => {
    fetchProducts(); // Refresh the product list after stock update
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map((product) => product.category))];
  const cartCount = cartItems.length;

  return (
    <div className="storefront">
      <SFNavBar
        cartCount={cartCount}
        onCartClick={() => setShowCartModal(true)}
        username={username}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="text-center mb-4">
        <img
          src="/sister-store-logo-2.svg"
          alt="Sister Store"
          style={{ width: "150px", marginTop: "20px" }}
        />
      </div>
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center mb-4">
          <InputGroup className="w-50">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Form.Select
            className="w-25 ml-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </div>
        {loading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status" />
          </div>
        )}
        {error && (
          <div className="text-center mt-4">
            <h5>Something went wrong. Please try again later.</h5>
          </div>
        )}
        {!loading && !error && filteredProducts.length > 0 && (
          <Row>
            {filteredProducts.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4">
                <div
                  className="card product-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                >
                  <img
                    src="/itemplaceholder.svg"
                    className="card-img-top product-img"
                    alt={product.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>₱{product.price}</strong>
                    </p>
                    <Badge bg={product.stock > 0 ? "success" : "danger"}>
                      {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        onCartUpdate={(updatedCartCount) => setCartItems((prev) => prev.slice(0, updatedCartCount))}
        onCheckoutComplete={handleCheckoutComplete}
        onStockUpdate={handleStockUpdate}
      />
      {selectedProduct && (
        <ProductModal
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          product={selectedProduct}
          addToCart={(quantity) => handleAddToCart(selectedProduct.id, quantity)}
        />
      )}
    </div>
  );
}

export default Storefront;
