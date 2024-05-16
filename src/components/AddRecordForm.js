import React, { useState } from "react";

const AddRecordForm = ({ createRecord, onClose, onRecordCreated }) => {
  const [newRecord, setNewRecord] = useState({ app_name: "", url: "" });

  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdRecord = await createRecord(newRecord);
    if (createdRecord) {
      // Запись успешно создана
      setNewRecord({ app_name: "", url: "" });
      onClose();
      onRecordCreated(createdRecord);
    } else {
      // Произошла ошибка при создании записи
      console.error("Failed to create record");
    }
  };

  return (
    <div>
      <h3>Add New Record</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            App Name:
            <input
              type="text"
              name="app_name"
              value={newRecord.app_name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            App URL:
            <input
              type="text"
              name="url"
              value={newRecord.url}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
