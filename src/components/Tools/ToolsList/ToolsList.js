import React, { useState } from "react";
import PasswordGenerator from "../PasswordGenerator/PasswordGenerator";
import SecurityAnalysis from "../SecurityAnalysis/SecurityAnalysis";
import AuditLog from "../AuditLog/AuditLog"; // Added import for AuditLogViewer
import DataImportExport from "../DataImportExport/DataImportExport"; // Added import for DataImportExport
import "./ToolsList.css";

const ToolsList = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
  };

  const renderTool = () => {
    switch (selectedTool) {
      case "passwordGenerator":
        return <PasswordGenerator embedded={false} />;
      case "securityAnalysis":
        return <SecurityAnalysis />;
      case "auditLog": // Added new case for AuditLogViewer
        return <AuditLog />;
      case "dataImportExport": // Added new case for DataImportExport
        return <DataImportExport />;
      default:
        return null;
    }
  };

  return (
    <div className="tools-container">
      {selectedTool ? (
        <div>
          <button className="back-button" onClick={() => setSelectedTool(null)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
            Вернуться к списку инструментов
          </button>
          {renderTool()}
        </div>
      ) : (
        <ul className="tools-list">
          <li
            className="tool-item"
            onClick={() => handleToolClick("passwordGenerator")}
          >
            <span className="tool-name">Генератор паролей</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </li>
          <li
            className="tool-item"
            onClick={() => handleToolClick("securityAnalysis")}
          >
            <span className="tool-name">Анализ безопасности</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </li>
          <li
            className="tool-item"
            onClick={() => handleToolClick("auditLog")} // Added list item for AuditLogViewer
          >
            <span className="tool-name">Журнал аудита</span>
          </li>
          <li
            className="tool-item"
            onClick={() => handleToolClick("dataImportExport")} // Added list item for DataImportExport
          >
            <span className="tool-name">Импорт/Экспорт данных</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ToolsList;
