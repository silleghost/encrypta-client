import React, { useState, useEffect, useContext } from "react";
import { getAuditRecords } from "../../../services/auditService";
import { AuthContext } from "../../../context/AuthContext";
import "./AuditLog.css";

const AuditLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { masterKey, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAuditRecords(masterKey, authTokens.access);
        setRecords(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="audit-log-viewer">
      <h3>Журнал аудита</h3>
      <table>
        <thead>
          <tr>
            <th>Действие</th>
            <th>Дата и время</th>
            <th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.action}</td>
              <td>
                {new Date(record.creation_date).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td>{record.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
