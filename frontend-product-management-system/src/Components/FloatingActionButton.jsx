import React, { useState } from "react";
import FloatingForm from "./FloatingForm";
import '../Custom CSS/Fab.css'; 

const FloatingActionButton = ({ onAdd }) => { // Accept onAdd prop
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const handleAddCard = (newCard) => {
    onAdd(newCard); // Call the parent function to add a card
    setFormVisible(false); // Close the form after adding
  };

  return (
    <>
      <button onClick={toggleForm} className="fab">
        +
      </button>
      {isFormVisible && (
        <FloatingForm onClose={toggleForm} addCard={handleAddCard} /> 
      )}
    </>
  );
};

export default FloatingActionButton;
