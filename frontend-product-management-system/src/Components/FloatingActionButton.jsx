import React from "react";
import '../Custom CSS/Fab.css';

const FloatingActionButton = ({ onAdd }) => { 
  return (
    <button onClick={onAdd} className="fab">
      +
    </button>
  );
};

export default FloatingActionButton;
