import React from 'react';
import Card from 'react-bootstrap/Card';
import { Badge } from 'react-bootstrap';
import '../Custom CSS/CardView.css';

function CardView({ title, description, stock, barcode, category, price, onClick }) {
  return (
    <Card 
      style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px' }} 
      onClick={onClick} 
      className="clickable-card" 
    >
      <Card.Img
        variant="top"
        src="/itemplaceholder.svg"
        style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }} 
      />
      <Card.Body>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {title}
          </Card.Title>
        </div>

        {/* Description */}
        <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>
          {description}
        </Card.Text>

        {/* Barcode */}
        <div className="d-flex justify-content-between align-items-center">
          <span style={{ fontSize: '0.8rem', color: '#777' }}>Barcode: {barcode}</span>
        </div>

        {/* Category */}
        <div style={{ fontSize: '0.8rem', color: '#777' }}>
          Category: <strong>{category}</strong>
        </div>

        {/* Price */}
        <div style={{ marginTop: '8px', fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
          Price: <span style={{ color: '#f39c12' }}>${price}</span>
        </div>

        {/* Stock */}
        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '8px' }}>
          <Badge 
            pill 
            bg={stock > 0 ? 'success' : 'danger'}
          >
            {stock > 0 ? `In Stock (${stock})` : `Out of Stock (${stock})`}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardView;
