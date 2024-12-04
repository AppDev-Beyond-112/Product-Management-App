import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import SFNavBar from '../Components/SFNavBar';
import CartModal from '../Components/CartModal';
import ProductModal from '../Components/ProductModal';
import CheckoutModal from '../Components/CheckoutModal'; // Added checkout modal
import '../Custom CSS/Storefront.css';

function Storefront() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false); // Added for checkout
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products.');
        const data = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateCartItem = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleCheckoutConfirm = (paymentMethod) => {
    alert(`Order confirmed! Payment Method: ${paymentMethod}`);
    setCartItems([]); // Clear cart after checkout
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="storefront">
      {/* Navigation Bar */}
      <SFNavBar cartCount={cartItems.length} onCartClick={() => setShowCartModal(true)} />

      {/* Store Logo */}
      <div className="text-center mb-4">
        <img
          src="/sister-store-logo-2.svg"
          alt="Sister Store"
          style={{ width: '150px', marginTop: '20px' }}
        />
      </div>

      {/* Search and Filter Section */}
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

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status" />
          </div>
        )}
        {error && (
          <div className="text-center mt-4">
            <h5>Sister Store is not currently selling anything~</h5>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <Row>
            {filteredProducts.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4">
                <div
                  className="card product-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(product)}
                >
                  <img
                    src="/itemplaceholder.svg"
                    className="card-img-top product-img"
                    alt={product.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      margin: '0 auto',
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>₱{product.price}</strong>
                    </p>
                    <Badge pill bg={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Modals */}
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cartItems={cartItems}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        onCheckoutClick={() => {
          setShowCartModal(false);
          setShowCheckoutModal(true);
        }}
      />
      {selectedProduct && (
        <ProductModal
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          product={selectedProduct}
          addToCart={addToCart}
        />
      )}
      <CheckoutModal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        onConfirmCheckout={handleCheckoutConfirm}
      />
    </div>
  );
}

export default Storefront;
