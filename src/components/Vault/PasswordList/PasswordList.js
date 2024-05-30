import React, { useContext } from "react";
import EmptyVault from "../EmptyVault/EmptyVault";
import { VaultContext } from "../../../context/VaultContext";

const PasswordList = ({ records }) => {
  // const { records } = useContext(VaultContext);

  return (
    <div>
      {records.length === 0 ? (
        <EmptyVault />
      ) : (
        <ul>
          {records.map((record) => (
            <li key={record.id}>{record.app_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordList;
