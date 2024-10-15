import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={styles.searchBar}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  searchBar: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

export default SearchBar;
