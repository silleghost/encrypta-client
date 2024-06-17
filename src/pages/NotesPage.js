import React, { useState, useEffect } from "react";
import NotesList from "../components/Notes/NotesList";
import NoteModal from "../modals/NoteModal";
import { aesEncrypt, aesDecrypt } from "../crypto";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
} from "../services/notesService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleSave = async (note) => {
    const encryptedContent = await aesEncrypt(
      new TextEncoder().encode(note.content)
    );
    let savedNote;
    if (note.id) {
      savedNote = await updateNote(note);
    } else {
      savedNote = await createNote(note);
    }
    if (!note.id) {
      setNotes([...notes, savedNote.data]); // Добавляем новую заметку в список
    } else {
      const updatedNotes = notes.map((n) =>
        n.id === savedNote.data.id ? savedNote.data : n
      );
      setNotes(updatedNotes); // Обновляем список заметок
    }
    setModalVisible(false);
  };

  const handleDelete = async (note) => {
    await deleteNote(note.id);
    setNotes(notes.filter((n) => n.id !== note.id)); // Удаляем заметку из списка
    setModalVisible(false);
  };

  const handleAddNote = () => {
    const newNote = { content: "", id: null }; // Создаем новую заметку с пустым содержанием и без ID
    setSelectedNote(newNote);
    setModalVisible(true);
  };

  const fetchNotes = async () => {
    const fetchedNotes = await getNotes(); // Загрузка заметок из API
    setNotes(fetchedNotes.data); // Обновление состояния заметок
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <NavigationPanel />
      <button onClick={handleAddNote}>Добавить заметку</button>{" "}
      {/* Кнопка для добавления новой заметки */}
      <NotesList notes={notes} onNoteSelect={handleNoteSelect} />
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default NotesPage;
