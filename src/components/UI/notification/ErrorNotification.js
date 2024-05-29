import React, { useEffect } from "react";
import "./ErrorNotification.css";

const ErrorNotification = ({ error, onClose, autoCloseDelay = 5000 }) => {
  useEffect(() => {
    let timeoutId = null;

    if (error) {
      timeoutId = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error, autoCloseDelay, onClose]);

  if (!error) {
    return null;
  }

  return (
    <div className="error-notification">
      <div className="error-message">
        {error}
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
      </div>
    </div>
  );
};

export default ErrorNotification;
