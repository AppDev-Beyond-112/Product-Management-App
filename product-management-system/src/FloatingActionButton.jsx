import React from "react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={styles.fab}
    >
      +
    </button>
  );
};

const styles = {
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "orange",
    color: "white",
    border: "none",
    fontSize: "24px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
};

export default FloatingActionButton;
