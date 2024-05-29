import React, { useState } from "react";
import "./OptionsSelect.css";

const OptionsSelect = ({ handleOptionSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const options = [
    { label: "Запись", modalName: "modal-new-record" },
    { label: "Категорию", modalName: "modal-new-category" },
  ];

  return (
    <div className="modal-button-container">
      <button
        className="button"
        id="menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleMenu}
      >
        Добавить
        <svg
          className="icon"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          id="menu"
          className="menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="menu-items">
            {options.map((option, index) => (
              <button
                key={index}
                className="menu-item"
                onClick={(event) =>
                  handleOptionSelected(event, option.modalName)
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsSelect;
