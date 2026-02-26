import React from "react";
import FileUpload from "./FileUpload";

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>SecondSpark AI</h1>
      <p>Battery Intelligence Platform</p>

      <FileUpload />
    </div>
  );
};

export default Dashboard;