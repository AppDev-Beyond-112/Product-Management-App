import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Badge, Form, InputGroup } from 'react-bootstrap'; // Import necessary components
import { Search } from 'react-bootstrap-icons'; // Importing Search icon from react-bootstrap-icons
import SFNavBar from '../Components/SFNavBar';
import ProductModal from '../Components/ProductModal'; // Import the modal component
import '../Custom CSS/Storefront.css'; // Custom styles for the storefront

function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

  // Fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/products'); // Adjust URL as needed
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(true); // Set error state to true
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding items to the cart
  const addToCart = (quantity) => {
    setCartCount(prevCount => prevCount + quantity); // Add the specified quantity to the cart count
  };

  // Filtered products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for the category selector
  const uniqueCategories = [...new Set(products.map((product) => product.category))];

  // Handle card click to open the modal
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="storefront">
      {/* Navbar Component with Cart */}
      <SFNavBar cartCount={cartCount} />

      <div className="text-center mb-4">
        <img src="/sister-store-logo-2.svg" alt="Sister Store" style={{ width: "150px", marginTop: "20px" }} />
      </div>

      {/* Storefront Content */}
      <div className="container-fluid mt-4">
        {/* Search and Category Filter */}
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

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status" />
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {/* Error or No Products Message */}
        {!loading && (error || filteredProducts.length === 0) && (
          <div className="text-center mt-4">
            <h5 className="storefront-message">
              Sister Store is not currently selling anything~
            </h5>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <Row>
            {filteredProducts.map((product) => (
              <Col lg={3} md={4} sm={6} xs={12} key={product.barcode} className="mb-4">
                <div
                  className="card product-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(product)}
                >
                  <img
                    src="/itemplaceholder.svg"
                    className="card-img-top product-img"
                    alt={product.name}
                    style={{
                      width: "100px", // Reduced size
                      height: "100px", // Reduced size
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text product-description">{product.description}</p>
                    {/* In Stock moved here */}
                    <Badge pill bg={product.stock > 0 ? "success" : "danger"} className="mb-2">
                      {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
          addToCart={addToCart}
        />
      )}
    </div>
  );
}

export default Storefront;
