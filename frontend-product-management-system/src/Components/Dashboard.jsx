import React, { useState } from 'react';
import NavBar from './NavBar';
import CardGrid from './CardGrid';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <NavBar onSearch={handleSearchChange} />
      <CardGrid searchTerm={searchTerm} />
    </div>
  );
}

export default Dashboard;
