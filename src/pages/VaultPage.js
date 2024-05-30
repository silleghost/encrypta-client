import React, { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList/PasswordList";
import Loading from "../components/UI/loading/Loading";
import MyModal from "../components/UI/modal/MyModal";
import RecordModal from "../modals/RecordModal";
import ErrorNotification from "../components/UI/notification/ErrorNotification";
import NewElementButton from "../components/UI/select/OptionsSelect";
import { createRecord, updateRecord } from "../services/vaultService";

const VaultPage = () => {
  const { setRecords, isLoading, error: vaultError } = useContext(VaultContext);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleError = (errorMessage) => {
    setErrors((prevErrors) => [...prevErrors, errorMessage]);
  };

  const handleCloseError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handleOpenModal = (event, modalName) => {
    event.preventDefault();
    if (modalName === "modal-new-record") {
      setModal(true);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleSaveRecord = async (record) => {
    try {
      const isNewRecord = !record.id;
      const response = isNewRecord
        ? await createRecord(record)
        : await updateRecord(record);
      console.log("Запись сохранена:", response.data);
      setRecords((prevRecords) => {
        if (isNewRecord) {
          return [...prevRecords, response.data];
        } else {
          return prevRecords.map((r) =>
            r.id === record.id ? response.data : r
          );
        }
      });
    } catch (error) {
      console.error("Ошибка при сохранении записи:", error);
      handleError(error.message);
    } finally {
      setModal(false);
    }
  };

  const handleDeleteRecord = (record) => {
    console.log("Запись удалена");
  };

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
      <NavigationPanel />
      {isLoading ? <Loading /> : <PasswordList />}
      <MyModal visible={modal} setVisible={setModal}>
        <RecordModal
          onSave={handleSaveRecord}
          onDelete={handleDeleteRecord}
          onClose={handleCloseModal}
        />
      </MyModal>
      <NewElementButton handleOptionSelected={handleOpenModal} />
    </div>
  );
};

export default VaultPage;
