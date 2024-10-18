import React, { useState } from "react";
import FloatingForm from "./FloatingForm";
import CardGrid from "./CardGrid"; 
import '../Custom CSS/Fab.css'; 

const FloatingActionButton = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [cardsData, setCardsData] = useState([]); 

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const addCard = (newCard) => {
    setCardsData([...cardsData, newCard]); 
  };

  return (
    <>
      <button onClick={toggleForm} className="fab">
        +
      </button>
      {isFormVisible && (
        <FloatingForm onClose={toggleForm} addCard={addCard} /> 
      )}
      <CardGrid cardsData={cardsData} />
    </>
  );
};

export default FloatingActionButton;
