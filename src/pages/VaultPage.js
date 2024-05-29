import React, { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList/PasswordList";
import { useFetchRecords } from "../hooks/useFetchRecords";
import Loading from "../components/UI/loading/Loading";
import MyModal from "../components/UI/modal/MyModal";
import RecordModal from "../modals/RecordModal";
import ErrorNotification from "../components/UI/notification/ErrorNotification";
import NewElementButton from "../components/UI/select/OptionsSelect";

const VaultPage = () => {
  const { isLoading, records, error, fetchRecords } = useFetchRecords();
  const { setRecords } = useContext(VaultContext);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setRecords(records);
  }, []);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
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

  const handleSaveRecord = (record) => {
    console.log("Будет сохранена следующая запись:", record);
    setModal(false);
  };

  const handleDeleteRecord = (record) => {
    console.log("Запись удалена");
  };

  return (
    <div>
      <ErrorNotification
        error={error}
        onClose={handleCloseError}
        autoCloseDelay={3000}
      />
      <NavigationPanel />
      {isLoading ? <Loading /> : <PasswordList records={records} />}
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
