import React, { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext, VaultProvider } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList";
import { useFetchRecords } from "../hooks/useFetchRecords";
import Loading from "../components/UI/loading/Loading";
import MyModal from "../components/UI/modal/MyModal";

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

  return (
    <div>
      <NavigationPanel />
      {isLoading ? <Loading /> : <PasswordList records={records} />}
      <MyModal visible={modal} setVisible={setModal}>
        adsd
      </MyModal>
    </div>
  );
};

export default VaultPage;
