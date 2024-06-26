import React, { useState } from "react";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import { deleteObject } from "../services/apiService";
import { BASE_URL, NOTES_URL } from "../config";

const NoteForm = ({ onSave, initialRecord, masterKey, authToken }) => {
  const fieldOptions = [
    { id: "text", name: "Текстовое поле" },
    { id: "date", name: "Поле даты" },
    { id: "boolean", name: "Логическое поле" },
  ];

  // Инициализация состояний с учетом initialRecord
  const [title, setTitle] = useState(initialRecord ? initialRecord.title : "");
  const [content, setContent] = useState(
    initialRecord ? initialRecord.content : ""
  );
  const [customFields, setCustomFields] = useState(
    initialRecord && Array.isArray(initialRecord.customFields)
      ? initialRecord.customFields
      : []
  );

  const handleAddCustomField = (type) => {
    if (type) {
      const newField = { type, key: "", value: "" };
      setCustomFields([...customFields, newField]);
    }
  };

  const handleCustomFieldChange = (index, key, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setCustomFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialRecord ? initialRecord.id : null,
      title,
      content,
      customFields,
    });
  };

  const handleDelete = async () => {
    if (initialRecord && initialRecord.id) {
      try {
        await deleteObject(
          BASE_URL + NOTES_URL,
          initialRecord,
          masterKey,
          authToken
        );
        alert("Заметка удалена");
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Заметка для удаления не найдена");
    }
  };

  return (
    <form className="note-form" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Содержание"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {customFields.map((field, index) => (
        <div className="custom-field-container" key={index}>
          <MyInput
            className="custom-field-key"
            type="text"
            placeholder="Ключ"
            value={field.key || ""}
            onChange={(e) =>
              handleCustomFieldChange(index, "key", e.target.value)
            }
          />
          {field.type === "boolean" ? (
            <MyInput
              className="custom-field-checkbox"
              type="checkbox"
              checked={field.value === "true"}
              onChange={(e) =>
                handleCustomFieldChange(
                  index,
                  "value",
                  e.target.checked ? "true" : "false"
                )
              }
            />
          ) : (
            <MyInput
              className="custom-field-value"
              type={field.type === "date" ? "date" : "text"}
              placeholder="Значение"
              value={field.value}
              onChange={(e) =>
                handleCustomFieldChange(index, "value", e.target.value)
              }
            />
          )}
        </div>
      ))}
      <div className="add-custom-field-select">
        <MySelect
          options={fieldOptions}
          onChange={(e) => handleAddCustomField(e.target.value)}
        />
      </div>
      <button type="button" onClick={handleDelete}>
        Удалить заметку
      </button>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default NoteForm;
