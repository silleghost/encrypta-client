import React from "react";
import ErrorNotification from "../UI/notification/ErrorNotification";

const ErrorNotifications = ({ errors, vaultError, handleCloseError }) => {
  return (
    <div>
      {errors.map((error, index) => (
        <ErrorNotification
          key={index}
          error={error}
          onClose={() => handleCloseError(index)}
          autoCloseDelay={3000}
        />
      ))}
      {vaultError && (
        <ErrorNotification
          error={vaultError}
          onClose={handleCloseError}
          autoCloseDelay={3000}
        />
      )}
    </div>
  );
};

export default ErrorNotifications;
