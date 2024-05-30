import React, { useContext } from "react";
import EmptyVault from "../EmptyVault/EmptyVault";
import { VaultContext } from "../../../context/VaultContext";
import PasswordItem from "./PasswordItem/PasswordItem";
import "./PasswordList.css";

const PasswordList = ({ handleOpenModal }) => {
  const { records } = useContext(VaultContext);

  return (
    <div>
      {records.length === 0 ? (
        <EmptyVault />
      ) : (
        <div className="password-list">
          <ul className="password-list-items">
            {records.map((record) => (
              <li key={record.id} className="password-list-item">
                <PasswordItem
                  record={record}
                  handleOpenModal={handleOpenModal}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordList;
