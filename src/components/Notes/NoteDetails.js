import React from "react";

const NoteDetails = ({ note, onClose, onEdit }) => {
  return (
    <div className="note-details">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      {note.customFields &&
        note.customFields.map((field, index) => (
          <div key={index}>
            <strong>{field.key}: </strong>
            {field.type === "boolean"
              ? field.value === "true"
                ? "Да"
                : "Нет"
              : field.value}
          </div>
        ))}
      <button className="edit-note-button" onClick={() => onEdit(note)}>
        Редактировать
      </button>
      <button className="close-note-button" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
};

export default NoteDetails;
