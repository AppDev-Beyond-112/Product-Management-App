import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Form } from 'react-bootstrap';
import CardView from './CardView';
import FloatingForm from './FloatingForm';
import FloatingActionButton from './FloatingActionButton';
import '../Custom CSS/CardGrid.css';

function CardGrid({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  // New states for filtering and sorting
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('stock');

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filtering and sorting
  const filteredProducts = products
    .filter((product) => {
      const searchQuery = (searchTerm || '').toLowerCase();
      const productCategory = (product.category || '').toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);
      const matchesCategory =
        !selectedCategory || productCategory === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'price') return b.price - a.price; // Descending price
      if (sortOption === 'stock') return b.stock - a.stock; // Descending stock
      return 0;
    });

  // Add or update a product
  const addOrUpdateProduct = (updatedProduct) => {
    setProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (product) => product.barcode === updatedProduct.barcode
      );

      if (existingProductIndex !== -1) {
        // Update the existing product
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = updatedProduct;
        return updatedProducts;
      }
      // Add a new product
      return [...prevProducts, updatedProduct];
    });
    setFormVisible(false); // Close the form after adding or updating
    setSelectedProduct(null); // Reset selected product
  };

  // Delete a product
  const deleteProduct = (barcode) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.barcode !== barcode)
    );
    setFormVisible(false); // Close the form after deletion
    setSelectedProduct(null); // Reset selected product
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
        <span>Loading products...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center">Error: {error}</div>;
  }

  return (
    <>
      {isFormVisible && (
        <FloatingForm
          onClose={() => setFormVisible(false)}
          addCard={addOrUpdateProduct}
          product={selectedProduct}
          onDelete={deleteProduct}
        />
      )}
      <div className="filters mb-3">
        <Row>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category))).map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="stock">Sort by Stock</option>
              <option value="price">Sort by Price</option>
            </Form.Select>
          </Col>
        </Row>
      </div>
      <Row className="custom-gap">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col md={3} key={product.barcode} className="mb-4">
              <CardView
                title={product.name}
                description={product.description}
                stock={product.stock}
                price={product.price}
                barcode={product.barcode}
                category={product.category}
                onClick={() => {
                  setSelectedProduct(product);
                  setFormVisible(true);
                }}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>No products found. Try adjusting your search or filters.</p>
          </Col>
        )}
      </Row>
      <FloatingActionButton onAdd={() => setFormVisible(true)} />
    </>
  );
}

export default CardGrid;
