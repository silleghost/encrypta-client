import React, { useContext } from "react";
import { VaultContext } from "../../../context/VaultContext";
import { createRecord } from "../../../services/vaultService";
import "./DataImportExport.css";

const DataImportExport = () => {
  const { records, setRecords } = useContext(VaultContext);

  const handleExport = (format) => {
    if (format === "json") {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(records));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "records.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (format === "csv") {
      const csvRows = [];
      const headers = Object.keys(records[0]);
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

  const handleImport = async (event, format) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      try {
        if (format === "json") {
          const records = JSON.parse(text);
          for (const record of records) {
            await createRecord(record);
            setRecords((prev) => [...prev, record]);
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
            await createRecord(record);
            setRecords((prev) => [...prev, record]);
          }
        }
      } catch (error) {
        console.error("Ошибка при импорте данных: ", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="data-import-export-container">
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
      <input
        className="data-import-export-input"
        type="file"
        onChange={(e) => handleImport(e, "json")}
        accept=".json,.csv"
      />
    </div>
  );
};

export default DataImportExport;
