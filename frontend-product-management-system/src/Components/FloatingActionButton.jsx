import React, { useState } from "react";
import FloatingForm from "./FloatingForm";
import '../Custom CSS/Fab.css'; 

const FloatingActionButton = ({ onAdd }) => { 
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const handleAddCard = (newCard) => {
    onAdd(newCard); 
    setFormVisible(false); 
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
