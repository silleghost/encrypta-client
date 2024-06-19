import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  decryptData,
  fetchDataFromServer,
  sendDataToServer,
  encryptData,
  generateKeyAndId,
} from "../services/shareService";
import "./SendPage.css";

const SendPage = () => {
  const { id, key } = useParams();
  const [data, setData] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { encryptedData, iv } = await fetchDataFromServer(id);
      const decryptedData = await decryptData(encryptedData, key, iv);
      setData(decryptedData);
    };

    loadData();
  }, [id, key]);

  const handleSendData = async () => {
    const { key, iv } = await generateKeyAndId();
    const { encryptedData } = await encryptData(data, key);
    await sendDataToServer(id, encryptedData, iv);
  };

  return (
    <div className="data-receiver-container">
      <h1 className="data-receiver-title">Received Data</h1>
      <p className="data-receiver-content">{data}</p>
      <button onClick={handleSendData}>Отправить данные</button>
    </div>
  );
};

export default SendPage;
