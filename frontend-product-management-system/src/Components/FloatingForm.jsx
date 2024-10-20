import React, { useEffect, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import DeleteConfirmation from "./DeleteConfirmation"; 
import '../Custom CSS/FloatingForm.css';

const FloatingForm = ({ onClose, addCard, product, onDelete }) => {
  const [barcode, setBarcode] = useState(product ? product.barcode : generateBarcode());
  const [itemName, setItemName] = useState(product ? product.name : '');
  const [quantity, setQuantity] = useState(product ? product.stock : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [category, setCategory] = useState(product ? product.category : '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function generateBarcode() {
    return 'BAR-' + Math.floor(Math.random() * 10000000).toString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCard = { barcode, name: itemName, stock: Number(quantity), description, category };
  
    let response;
    
    if (product) {
      console.log("Updating product:", newCard); 
      response = await fetch(`http://localhost:8000/api/products/${barcode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });
    } else {
      console.log("Adding new product:", newCard);
      response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });
    }
    
    const data = await response.json();
    addCard({ ...newCard, ...data }); // Merge local state with API response
    onClose();
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${barcode}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(barcode);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error deleting the product:", errorData);
      }
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  const showConfirmationModal = () => {
    setShowDeleteModal(true);
  };

  const closeConfirmationModal = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (product) {
      setBarcode(product.barcode);
      setItemName(product.name);
      setQuantity(product.stock);
      setDescription(product.description);
      setCategory(product.category);
    } else {
      setBarcode(generateBarcode());
      setItemName('');
      setQuantity('');
      setDescription('');
      setCategory('');
    }
  }, [product]);

  return (
    <div className="floating-form">
      <div className="form-header">
        {product && (
          <div className="delete-icon" onClick={showConfirmationModal}>
            <FaTrash />
          </div>
        )}
        <div className="close-icon" onClick={onClose}>
          <FaTimes />
        </div>
      </div>
      <h3>{product ? "Edit Item" : "Add Item"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Barcode:</label>
        <input type="text" value={barcode} readOnly className="floating-input" />
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
        <button type="submit" className="floating-button outline-button">
          {product ? "Update" : "Add"}
        </button>
      </form>

      {showDeleteModal && (
        <DeleteConfirmation
          onClose={closeConfirmationModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default FloatingForm;
