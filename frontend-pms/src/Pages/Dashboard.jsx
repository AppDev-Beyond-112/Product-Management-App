import React, { useState } from 'react';
import CardGrid from '../Components/CardGrid';
import NavBar from '../Components/NavBar';

function Dashboard({ setIsAuthenticated }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <NavBar onSearch={handleSearch} setIsAuthenticated={setIsAuthenticated} />
      <CardGrid searchTerm={searchQuery} />
    </div>
  );
}

export default Dashboard;
