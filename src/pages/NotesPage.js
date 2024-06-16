import React, { useState } from "react";
import NotesList from "../components/Notes/NotesList";
import NoteModal from "../modals/NoteModal";
import { aesEncrypt, aesDecrypt } from "../crypto";
import NavigationPanel from "../components/Navbar/NavigationPanel";

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
    // Здесь должен быть код для сохранения зашифрованной заметки в базу данных
    setModalVisible(false);
  };

  const handleDelete = (note) => {
    // Здесь должен быть код для удаления заметки из базы данных
    setModalVisible(false);
  };

  return (
    <div>
      <NavigationPanel />
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
