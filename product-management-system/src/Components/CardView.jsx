import React from "react";

const CardView = ({ item, onEdit }) => {
  return (
    <div
      style={styles.card}
      onClick={onEdit}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFD580")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
    >
      <h4>{item.description}</h4>
      <p>Barcode: {item.barcode}</p>
      <p>Price: ₱{item.price}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Category: {item.category}</p>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default CardView;
