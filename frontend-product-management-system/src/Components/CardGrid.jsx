import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap'; 
import CardView from './CardView'; 
import FloatingForm from './FloatingForm'; 
import '../Custom CSS/CardGrid.css';

function CardGrid({ searchTerm }) {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [error, setError] = useState(null); 
  const [isFormVisible, setFormVisible] = useState(false); 

  const fetchProducts = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:8000/api/products'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setFormVisible(true); 
  };

  const addCard = (newCard) => {
    setProducts(prevProducts => [...prevProducts, newCard]);
    fetchProducts(); 
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name?.toLowerCase() || '';
    const productDescription = product.description?.toLowerCase() || '';
    const productCategory = product.category?.toLowerCase() || '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      productName.includes(lowerCaseSearchTerm) ||
      productDescription.includes(lowerCaseSearchTerm) ||
      productCategory.includes(lowerCaseSearchTerm)
    );
  });
  
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    ); 
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isFormVisible && (
        <FloatingForm 
          onClose={toggleForm} 
          addCard={addCard} 
          product={selectedProduct} 
        />
      )}
      <Row className="custom-gap">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col md={3} key={product.id} className="mb-4">
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
            <p>No products found.</p>
          </Col>
        )}
      </Row>
    </>
  );
}

export default CardGrid;
