import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { saveObject } from "../../../services/apiService";
import { BASE_URL, RECORDS_URL } from "../../../config";
import "./DataImportExport.css";
import { VaultContext } from "../../../context/VaultContext";

const DataImportExport = () => {
  const { masterKey, authTokens } = useContext(AuthContext);
  const { records, setRecords } = useContext(VaultContext);
  const [importFile, setImportFile] = useState(null);

  const handleExport = (format) => {
    if (records.length === 0) {
      alert("Нет данных для экспорта.");
      return;
    }

    if (format === "json") {
      const filteredRecords = records.map(({ id, ...rest }) => rest);
      if (filteredRecords.every((record) => Object.keys(record).length === 0)) {
        alert("Нет данных для экспорта после исключения 'id'.");
        return;
      }
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(filteredRecords));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "records.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (format === "csv") {
      const headers = Object.keys(records[0]).filter(
        (header) => header !== "id"
      );
      if (headers.length === 0) {
        alert("Нет данных для экспорта после исключения 'id'.");
        return;
      }
      const csvRows = [];
      csvRows.push(headers.join(","));

      for (const record of records) {
        const values = headers.map((header) => {
          const escaped = ("" + record[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      }

      const dataStr =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "records.csv");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  const handleImportClick = async (format) => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      try {
        if (format === "json") {
          const new_records = JSON.parse(text);
          for (const record of new_records) {
            const response = await saveObject(
              BASE_URL + RECORDS_URL,
              record,
              masterKey,
              authTokens.access
            );
            setRecords((prev) => [...prev, response.data]);
          }
        } else if (format === "csv") {
          const rows = text.split("\n");
          const headers = rows[0].split(",").map((header) => header.trim());

          for (let i = 1; i < rows.length; i++) {
            const data = rows[i].split(",").map((cell) => cell.trim());
            const record = headers.reduce((obj, header, index) => {
              obj[header] = data[index];
              return obj;
            }, {});
            const response = await saveObject(
              BASE_URL + RECORDS_URL,
              record,
              masterKey,
              authTokens.access
            );
            setRecords((prev) => [...prev, response.data]);
          }
        }
      } catch (error) {
        console.error("Ошибка при импорте данных: ", error);
      }
    };

    reader.readAsText(importFile);
  };

  return (
    <div className="data-import-export-container">
      <div className="data-import-export-section">
        <div className="data-import-export-header">Экспорт данных</div>
        <button
          className="data-import-export-button"
          onClick={() => handleExport("json")}
        >
          Экспорт JSON
        </button>
        <button
          className="data-import-export-button"
          onClick={() => handleExport("csv")}
        >
          Экспорт CSV
        </button>
      </div>
      <div className="data-import-export-section">
        <div className="data-import-export-header">Импорт данных</div>
        <input
          className="data-import-export-input"
          type="file"
          onChange={(e) => setImportFile(e.target.files[0])}
          accept=".json,.csv"
        />
        <button
          className="data-import-export-button"
          onClick={() => handleImportClick("json")}
        >
          Импорт данных
        </button>
      </div>
    </div>
  );
};

export default DataImportExport;
