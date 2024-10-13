import React from "react";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to the Dashboard</h2>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Dashboard;
