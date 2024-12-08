import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Image } from 'react-bootstrap';
import '../Custom CSS/ProductModal.css';

export default function ProductModal({ show, onHide, product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (show) {
      setQuantity(1); // Reset quantity to 1 when the modal is opened
    }
  }, [show]);

  const handleSliderChange = (e) => {
    setQuantity(+e.target.value);
  };

  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, +e.target.value));
    setQuantity(value || 1); // Fallback to 1 if the input is invalid
  };

  const handleAddToCart = () => {
    addToCart(quantity);
    onHide();
  };

  return (
    <Modal
      {...{ show, onHide }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ padding: '10px' }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span style={{ fontFamily: 'Montserrat', fontWeight: '600' }}>
            {product.name}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12} className="text-center mb-3">
            <Image
              src={product.image || "/itemplaceholder.svg"}
              alt={product.name}
              fluid
              className="rounded shadow-sm"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          </Col>
          <Col md={12}>
            <h5
              className="mb-3"
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 'bold',
                borderBottom: '2px solid #ffc107',
                paddingBottom: '5px',
              }}
            >
              Product Details
            </h5>

            <p style={{ marginBottom: '15px', fontSize: '1rem', color: '#555' }}>
              {product.description}
            </p>
            <p style={{ fontSize: '1rem', color: '#555' }}>
              <span>Category: </span>
              {product.category || 'Uncategorized'}
            </p>
            <p style={{ fontSize: '1rem', color: '#555' }}>
              <span>Price: </span>${product.price}
            </p>
            <p style={{ fontSize: '1rem', color: '#555' }}>
              <span>Stock: </span>
              {product.stock > 0 ? (
                <span style={{ color: 'green' }}>{product.stock} Available</span>
              ) : (
                <span style={{ color: 'red' }}>Out of Stock</span>
              )}
            </p>

            <div className="quantity-selector mt-3 mb-4">
              <div className="d-flex align-items-center">
                <input
                  type="range"
                  className="form-range w-75 me-3"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleSliderChange}
                  style={{
                    accentColor: '#ffc107',
                    height: '8px',
                  }}
                />
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  min="1"
                  max={product.stock}
                  style={{
                    width: '4rem',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '5px',
                    fontSize: '1rem',
                    color: '#555',
                  }}
                />
              </div>
            </div>

            <Button
              variant="warning"
              className="mt-3 w-100 py-2 shadow-sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || quantity < 1}
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontFamily: 'Montserrat',
              }}
            >
              Add to Cart
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
