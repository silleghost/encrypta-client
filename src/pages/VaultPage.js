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
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from "../services/vaultService";

const VaultPage = () => {
  const { setRecords, isLoading, error: vaultError } = useContext(VaultContext);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleError = (errorMessage) => {
    setErrors((prevErrors) => [...prevErrors, errorMessage]);
  };

  const handleCloseError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handleOpenNewRecordModal = (event, modalName) => {
    event.preventDefault();
    if (modalName === "modal-new-record") {
      setModal(true);
      setSelectedRecord(null);
    }
  };

  const handleOpenRecordModal = (record = null) => {
    setModal(true);
    setSelectedRecord(record);
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
      handleError(error.message);
    } finally {
      setModal(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await deleteRecord(recordId);

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordId)
      );
    } catch (error) {
      handleError(error.message);
    } finally {
      setModal(false);
    }
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
      {isLoading ? (
        <Loading />
      ) : (
        <PasswordList handleOpenModal={handleOpenRecordModal} />
      )}
      <MyModal visible={modal} setVisible={setModal}>
        <RecordModal
          record={selectedRecord}
          onSave={handleSaveRecord}
          onDelete={() => handleDeleteRecord(selectedRecord.id)}
          onClose={handleCloseModal}
        />
      </MyModal>
      <NewElementButton handleOptionSelected={handleOpenNewRecordModal} />
    </div>
  );
};

export default VaultPage;
