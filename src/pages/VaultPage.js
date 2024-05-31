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
  updateRecord,
  deleteRecord,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/vaultService";

const VaultPage = () => {
  const { setRecords, isLoading, error: vaultError } = useContext(VaultContext);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState(null);
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
      setModalType("record");
      setSelectedRecord(null);
      setModal(true);
    } else if (modalName === "modal-new-category") {
      setModalType("category");
      setSelectedCategory(null);
      setModal(true);
    }
  };

  const handleOpenRecordModal = (record = null) => {
    setModalType("record");
    setSelectedRecord(record);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setModalType(null);
    setSelectedCategory(null);
    setSelectedRecord(null);
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
      handleCloseModal();
    }
  };

  const handleSaveCategory = async (category) => {
    try {
      const isNewCategory = !category.id;
      const response = isNewCategory
        ? await createCategory(category)
        : await updateCategory(category);
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
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
      handleCloseModal();
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleSave = (type, data) => {
    if (type === "record") {
      handleSaveRecord(data);
    } else if (type === "category") {
      handleSaveCategory(data);
    }
  };

  const handleDelete = (type, data) => {
    if (type === "record") {
      handleDeleteRecord(data.id);
    } else if (type === "category") {
      handleDeleteCategory(data.id);
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
          category={selectedCategory}
          modalType={modalType}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      </MyModal>
      <NewElementButton handleOptionSelected={handleOpenNewRecordModal} />
    </div>
  );
};

export default VaultPage;
