import React, { useState } from 'react';
import NavBar from './NavBar';
import CardGrid from './CardGrid';
import FloatingActionButton from "./FloatingActionButton";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <NavBar onSearch={handleSearchChange} />
      <CardGrid searchTerm={searchTerm} />
      <FloatingActionButton />
    </div>
  );
}

export default Dashboard;
