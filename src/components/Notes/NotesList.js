import React from "react";
import "./NotesList.css";

const NotesList = ({ notes, onNoteSelect }) => {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id} onClick={() => onNoteSelect(note)}>
          {note.content}
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
