import React, { useEffect, useRef, useState } from "react";
import "./RecordModal.css";
import RecordForm from "../forms/RecordForm";
import CategoryForm from "../forms/CategoryForm";
import CardForm from "../forms/CardForm";

const RecordModal = ({
  record,
  category,
  categories,
  modalType,
  onClose,
  onSave,
  onDelete,
}) => {
  const isNewItem =
    modalType === "record"
      ? !record || !record.id
      : modalType === "category"
      ? !category || !category.id
      : !record || !record.id;

  const [editMode, setEditMode] = useState(isNewItem);
  const [title, setTitle] = useState("");

  const toggleEditMode = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
  };

  useEffect(() => {
    setEditMode(isNewItem);
    if (isNewItem) {
      setTitle(
        modalType === "record"
          ? "Новая запись"
          : modalType === "category"
          ? "Новая категория"
          : "Новая карта"
      );
    } else {
      setTitle(
        modalType === "record"
          ? "Просмотр записи"
          : modalType === "category"
          ? "Просмотр категории"
          : "Просмотр карты"
      );
    }
  }, [isNewItem, record, category, modalType]);

  const handleSave = (data) => {
    setEditMode(false);
    onSave(modalType, data);
  };

  const handleDelete = () => {
    setEditMode(false);
    onDelete(modalType, record || category);
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <h1 className="modal-title">{title}</h1>
        <button className="modal-close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="modal-close-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {modalType === "record" ? (
        <RecordForm
          editMode={editMode}
          initialRecord={record}
          categories={categories}
          onSave={handleSave}
        />
      ) : modalType === "category" ? (
        <CategoryForm initialCategory={category} onSave={handleSave} />
      ) : modalType === "card" ? (
        <CardForm
          editMode={editMode}
          initialCard={record}
          onSave={handleSave}
        />
      ) : null}
      <div className="modal-footer">
        {editMode ? (
          <>
            <button form="record-form" type="submit" className="save-button">
              <span>Сохранить</span>
            </button>
            <button className="save-button" onClick={toggleEditMode}>
              <span>Отменить</span>
            </button>
          </>
        ) : (
          <button className="save-button" onClick={toggleEditMode}>
            <span>Изменить</span>
          </button>
        )}

        {!isNewItem && (
          <form className="delete-form" onSubmit={handleDelete}>
            <input type="hidden" value={record.id || category.id} name="id" />
            <button type="submit" className="delete-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="delete-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecordModal;
