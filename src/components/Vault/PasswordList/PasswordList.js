import React from "react";
import EmptyVault from "../EmptyVault/EmptyVault";

const PasswordList = ({ records }) => (
  <div>
    {records.length == 0 ? (
      <EmptyVault />
    ) : (
      <ul>
        {records.map((record) => (
          <li key={record.id}>{record.name}</li>
        ))}
      </ul>
    )}
  </div>
);

export default PasswordList;
