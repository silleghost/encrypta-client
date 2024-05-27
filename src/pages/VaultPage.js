import React, { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext, VaultProvider } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList";
import { useFetchRecords } from "../hooks/useFetchRecords";
import Loading from "../components/UI/loading/Loading";

const VaultPage = () => {
  const { isLoading, records, error, fetchRecords } = useFetchRecords();
  const { setRecords } = useContext(VaultContext);

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
    </div>
  );
};

export default VaultPage;
