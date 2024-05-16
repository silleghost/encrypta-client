import React, { useState } from "react";
import { useGetRecords } from "../lib/vault-hooks";

const ChangeRecordForm = ({
  record,
  onCloseForm,
  updateRecord,
  onRecordUpdated,
}) => {
  const [editedRecord, setEditedRecord] = useState(record);

  const handleChange = (e) => {
    setEditedRecord({ ...editedRecord, [e.target.name]: e.target.value });
  };

  const handleSaveRecord = async () => {
    const updatedRecord = await updateRecord(editedRecord);
    if (updatedRecord) {
      onCloseForm();
      onRecordUpdated(updatedRecord);
    } else {
      console.log("Error updating record:", updateRecord);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="app_name"
        value={editedRecord.app_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="url"
        value={editedRecord.url}
        onChange={handleChange}
      />
      <button onClick={handleSaveRecord}>Save</button>
    </div>
  );
};

export default ChangeRecordForm;
