import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap'; 
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

  // Dedicated close form handler
  const closeForm = () => {
    setFormVisible(false);
    setSelectedProduct(null); // Reset the selected product
  };

  // Open form for adding a new product
  const openNewProductForm = () => {
    setSelectedProduct(null);
    setFormVisible(true);
  };

  // Open form for editing a product
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setFormVisible(true);
  };

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

    closeForm();
  };

  // Delete a product
  const deleteProduct = (barcode) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.barcode !== barcode)
    );
    closeForm(); // Close the form after deletion
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const productName = (product.name || '').toLowerCase();
      const productDescription = (product.description || '').toLowerCase();
      const productCategory = (product.category || '').toLowerCase();
      const searchQuery = (searchTerm || '').toLowerCase();

      return (
        productName.includes(searchQuery) ||
        productDescription.includes(searchQuery) ||
        productCategory.includes(searchQuery)
      );
    })
    .sort((a, b) => b.stock - a.stock);

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
          onClose={closeForm} // Ensure consistent closing behavior
          addCard={addOrUpdateProduct}
          product={selectedProduct}
          onDelete={deleteProduct}
        />
      )}
      <Row className="custom-gap">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col md={3} key={product.barcode} className="mb-4">
              <CardView
                title={product.name}
                description={product.description}
                stock={product.stock}
                barcode={product.barcode}
                category={product.category}
                onClick={() => handleCardClick(product)}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>No products found. Try adjusting your search.</p>
          </Col>
        )}
      </Row>
      <FloatingActionButton onAdd={openNewProductForm} />
    </>
  );
}

export default CardGrid;