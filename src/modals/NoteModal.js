import React, { useState } from "react";
import MyModal from "../components/UI/modal/MyModal";
import "./NoteModal.css";

const NoteModal = ({ note, visible, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [customFields, setCustomFields] = useState(
    note ? note.customFields : []
  );

  const handleSave = () => {
    const updatedNote = { ...note, title, content, customFields };
    onSave(updatedNote);
  };

  const handleAddField = () => {
    setCustomFields([...customFields, { type: "", value: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
  };

  return (
    <MyModal visible={visible} setVisible={onClose}>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название заметки"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Текст заметки"
        />
        {customFields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              value={field.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              placeholder="Тип поля"
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) =>
                handleFieldChange(index, "value", e.target.value)
              }
              placeholder="Значение"
            />
          </div>
        ))}
        <button onClick={handleAddField}>Добавить поле</button>
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={() => onDelete(note)}>Удалить</button>
      </div>
    </MyModal>
  );
};

export default NoteModal;
