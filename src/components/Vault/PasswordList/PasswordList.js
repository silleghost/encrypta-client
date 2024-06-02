import React, { useContext } from "react";
import EmptyVault from "../EmptyVault/EmptyVault";
import { VaultContext } from "../../../context/VaultContext";
import PasswordItem from "./PasswordItem/PasswordItem";
import "./PasswordList.css";
import Loading from "../../UI/loading/Loading";

const PasswordList = ({ records, handleOpenModal }) => {
  return (
    <div className="password-list">
      {records.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul className="password-list-items">
          {records.map((record) => (
            <li key={record.id} className="password-list-item">
              <PasswordItem record={record} handleOpenModal={handleOpenModal} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordList;
