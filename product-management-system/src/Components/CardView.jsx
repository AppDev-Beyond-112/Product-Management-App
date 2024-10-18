import React from 'react';
import Card from 'react-bootstrap/Card';
import { Badge } from 'react-bootstrap';
import '../Custom CSS/CardView.css';

function CardView({ title, description, stock, barcode, category, onClick }) {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {title}
          </Card.Title>
          <Badge pill bg="warning">
            {category}
          </Badge>
        </div>
        <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>
          {description}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center">
          <Badge pill bg={stock > 0 ? 'success' : 'danger'}>
            {stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
          <span style={{ fontSize: '0.8rem', color: '#777' }}>Barcode: {barcode}</span>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#333' }}>
          Stock Number: <strong>{stock}</strong>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardView;
