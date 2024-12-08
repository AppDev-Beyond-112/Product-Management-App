import React, { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import DeleteConfirmation from "./DeleteConfirmation";
import "../Custom CSS/FloatingForm.css";

const FloatingForm = ({ onClose, addCard, product, onDelete }) => {
  const [barcode] = useState(product ? product.barcode : generateBarcode());
  const [itemName, setItemName] = useState(product ? product.name : "");
  const [quantity, setQuantity] = useState(product ? product.stock : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [description, setDescription] = useState(product ? product.description : "");
  const [category, setCategory] = useState(product ? product.category : "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function generateBarcode() {
    return "BAR-" + Math.floor(Math.random() * 10000000).toString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCard = {
      barcode,
      name: itemName,
      stock: Number(quantity),
      price: Number(price),
      description,
      category,
    };

    try {
      let response;
      if (product) {
        response = await fetch(`http://localhost:8000/api/products/${barcode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCard),
        });
      } else {
        response = await fetch("http://localhost:8000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCard),
        });
      }

      if (response.ok) {
        const data = await response.json();
        addCard({ ...newCard, ...data });
      } else {
        console.error("API call failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      onClose();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${barcode}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(barcode);
        onClose();
      } else {
        console.error("Failed to delete product:", await response.text());
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const showConfirmationModal = () => setShowDeleteModal(true);
  const closeConfirmationModal = () => setShowDeleteModal(false);

  return (
    <>
      {/* Backdrop */}
      <div className="floating-backdrop" onClick={onClose}></div>

      {/* Form */}
      <div className="floating-form">
        <div className="form-header">
          {product && (
            <div className="delete-icon" onClick={showConfirmationModal} title="Delete">
              <FaTrash />
            </div>
          )}
          <div className="close-icon" onClick={onClose} title="Close">
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
          <label>Price:</label>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            {product ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmation onClose={closeConfirmationModal} onConfirm={handleDelete} />
      )}
    </>
  );
};

export default FloatingForm;
