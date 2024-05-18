import React from "react";
import "./MyButton.css";

const MyButton = ({ children, ...props }) => {
  return (
    <button {...props} className="my-button">
      {children}
    </button>
  );
};

export default MyButton;
