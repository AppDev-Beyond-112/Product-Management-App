import React, { useState } from 'react';
import CardGrid from './CardGrid';

function Dashboard({ searchTerm }) {
  return (
    <div>
      <CardGrid searchTerm={searchTerm} />
    </div>
  );
}

export default Dashboard;
