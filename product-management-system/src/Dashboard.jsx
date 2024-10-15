import React, { useState } from "react";
import NavBar from "./NavBar";
import CardView from "./CardView";
import FloatingActionButton from "./FloatingActionButton"; // Import the FAB component

const Dashboard = () => {
  const [items, setItems] = useState([
    { barcode: "123456789", description: "Item 1", price: 100, quantity: 50, category: "Electronics" },
    { barcode: "987654321", description: "Item 2", price: 200, quantity: 30, category: "Home Appliances" },
    { barcode: "192837465", description: "Item 3", price: 150, quantity: 10, category: "Groceries" },
    { barcode: "102938475", description: "Item 4", price: 120, quantity: 80, category: "Books" },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    barcode: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    const generatedBarcode = Math.floor(100000000 + Math.random() * 900000000).toString();
    setNewItem({ ...newItem, barcode: generatedBarcode });
    setIsAdding(true);
    setSelectedItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewItem({ ...newItem, [name]: value });
    } else {
      setSelectedItem({ ...selectedItem, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems([...items, newItem]);
    setNewItem({
      barcode: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
    });
    setIsAdding(false);
  };

  const handleSave = () => {
    setItems(items.map(item => item.barcode === selectedItem.barcode ? selectedItem : item));
    setSelectedItem(null);
  };

  const handleDelete = () => {
    setItems(items.filter(item => item.barcode !== selectedItem.barcode));
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.dashboardContainer}>
        <div style={styles.cardList}>
          {filteredItems.map((item) => (
            <div key={item.barcode} style={styles.cardWrapper}>
              <CardView item={item} onEdit={() => handleEdit(item)} />
            </div>
          ))}
        </div>

        <div style={styles.editView}>
          {isAdding ? (
            <div>
              <h3>Add New Item</h3>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label>Barcode:</label>
                  <input
                    type="text"
                    value={newItem.barcode}
                    readOnly
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Available Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={newItem.category}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Add Item
                </button>
                <button type="button" style={styles.button} onClick={() => setIsAdding(false)}>
                  Cancel
                </button>
              </form>
            </div>
          ) : selectedItem ? (
            <div>
              <h3>Edit Item</h3>
              <form>
                <div style={styles.formGroup}>
                  <label>Barcode:</label>
                  <input type="text" value={selectedItem.barcode} readOnly style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={selectedItem.description}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedItem.price}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Available Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={selectedItem.quantity}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={selectedItem.category}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="button" style={styles.button} onClick={handleSave}>
                  Save
                </button>
                <button type="button" style={styles.deleteButton} onClick={handleDelete}>
                  Delete
                </button>
                <button type="button" style={styles.button} onClick={() => setSelectedItem(null)}>
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.placeholder}>
              <h3>Item details will show here</h3>
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton onClick={handleAddClick} />
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "81vh",
    width: "100%",
  },
  searchBar: {
    width: "96%",
    padding: "20px",
    borderBottom: "1px solid #ccc",
    marginTop: "60px",
  },
  searchInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  cardList: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
    padding: "20px",
    maxHeight: "100%",
  },
  cardWrapper: {
    width: "100%",
  },
  editView: {
    width: "55%",
    padding: "20px",
    minHeight: "300px",
    height: "100%",
  },
  formGroup: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "orange",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  placeholder: {
    textAlign: "center",
    color: "#888",
  },
};

export default Dashboard;
