import React, { useEffect, useState, useContext } from "react";
import { getObjects, saveObject } from "../services/apiService";
import { BASE_URL, NOTES_URL } from "../config";
import "../pages/NotesPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { AuthContext } from "../context/AuthContext";
import NoteForm from "../forms/NoteForm";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const { masterKey, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const result = await getObjects(
          BASE_URL + NOTES_URL,
          masterKey,
          authTokens.access
        );

        setNotes(result.data);
      } catch (error) {
        console.error("Ошибка при загрузке заметок:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleAddNote = () => {
    setIsAddingNote(!isAddingNote);
  };

  const handleSubmit = async (note) => {
    const formData = {
      id: note.id,
      title: note.title,
      content: note.content,
      custom_fields: note.customFields,
    };

    try {
      const saveResult = await saveObject(
        BASE_URL + NOTES_URL,
        formData,
        masterKey,
        authTokens.access
      );
      setIsAddingNote(false); // Закрыть форму после сохранения
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
    }
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (note) => {
    handleSubmit(note);
    setIsEditing(false);
  };

  const handleCloseDetails = () => {
    setSelectedNote(null); // Сброс выбранной заметки для закрытия деталей
  };

  return (
    <>
      <NavigationPanel />
      <div className="notes-container">
        <h2 className="notes-title">Заметки</h2>
        <ul>
          {notes.map((note, index) => (
            <React.Fragment key={index}>
              <li
                className={`note-item ${
                  selectedNote && selectedNote.id === note.id ? "active" : ""
                }`}
                onClick={() => handleSelectNote(note)}
              >
                {note.title}
              </li>
              {selectedNote && selectedNote.id === note.id && (
                <div className="note-details">
                  {!isEditing ? (
                    <>
                      <div className="note-detail-item">
                        <span className="note-detail-label">Заголовок:</span>
                        <span className="note-detail-content">
                          {selectedNote.title}
                        </span>
                      </div>
                      <div className="note-detail-item">
                        <span className="note-detail-label">Содержание:</span>
                        <span className="note-detail-content">
                          {selectedNote.content}
                        </span>
                      </div>
                      {selectedNote.customFields &&
                        selectedNote.customFields.map((field, index) => (
                          <div className="custom-field" key={index}>
                            <span className="custom-field-label">
                              {field.key}:
                            </span>
                            <span className="custom-field-value">
                              {field.type === "boolean"
                                ? field.value === "true"
                                  ? "Да"
                                  : "Нет"
                                : field.value}
                            </span>
                          </div>
                        ))}
                      <button
                        className="edit-note-button"
                        onClick={handleEditNote}
                      >
                        Редактировать
                      </button>
                    </>
                  ) : (
                    <NoteForm
                      initialRecord={selectedNote}
                      onSave={handleSaveEdit}
                      masterKey={masterKey}
                      authToken={authTokens.access}
                    />
                  )}
                  <button
                    className="close-note-button"
                    onClick={handleCloseDetails}
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
        <button className="add-note-button" onClick={handleAddNote}>
          Добавить заметку
        </button>
        {isAddingNote && <NoteForm onSave={handleSubmit} />}
      </div>
    </>
  );
};

export default NotesPage;
