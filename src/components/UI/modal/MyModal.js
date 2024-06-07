import React from "react";
import "./MyModal.css";

const MyModal = ({ children, visible, setVisible }) => {
  const rootClasses = ["myModal"];

  if (visible) {
    rootClasses.push("active");
  }

  return (
    <div className={rootClasses.join(" ")}>
      <div className={"myModalContent"} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default MyModal;
