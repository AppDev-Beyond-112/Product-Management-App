import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa"; 
import '../Custom CSS/FloatingForm.css'; 

const FloatingForm = ({ onClose, addCard, product }) => {
  const [barcode, setBarcode] = useState(product ? product.barcode : generateBarcode());
  const [itemName, setItemName] = useState(product ? product.name : '');
  const [quantity, setQuantity] = useState(product ? product.stock : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [category, setCategory] = useState(product ? product.category : ''); 

  function generateBarcode() {
    return 'BAR-' + Math.floor(Math.random() * 10000000).toString(); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCard = { barcode, name: itemName, stock: Number(quantity), description, category }; 

    try {
      const response = product
        ? await fetch(`http://localhost:8000/api/products/${barcode}`, { // PUT request for editing
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCard),
          })
        : await fetch('http://localhost:8000/api/products', { // POST request for adding
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCard),
          });

      if (response.ok) {
        const data = await response.json();
        addCard(data); 
        onClose(); 
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("There was an error saving the item!", error);
    }
  };

  useEffect(() => {
    if (product) {
      setBarcode(product.barcode);
      setItemName(product.name);
      setQuantity(product.stock);
      setDescription(product.description);
      setCategory(product.category); 
    }
  }, [product]);

  return (
    <div className="floating-form">
      <div className="close-icon" onClick={onClose}>
        <FaTimes />
      </div>
      <h3>{product ? "Edit Item" : "Add Item"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Barcode:</label>
        <input
          type="text"
          value={barcode}
          readOnly
          className="floating-input"
        />
        <label>Item Name:</label>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="floating-input"
        />
        <label>Quantity:</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="floating-input"
        />
        <label>Description:</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="floating-input"
        />
        <label>Category:</label> 
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} 
          className="floating-input"
        />
        <button type="submit" className="floating-button outline-button">Save</button>
      </form>
    </div>
  );
};

export default FloatingForm;
