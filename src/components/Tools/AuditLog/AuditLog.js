import React, { useState, useEffect } from "react";
import { getAuditRecords } from "../../../services/auditService";
import "./AuditLog.css";

const AuditLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAuditRecords();
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
      <ul>
        {records.map((record, index) => (
          <li key={index}>
            {record.action} {record.status} {record.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLog;
