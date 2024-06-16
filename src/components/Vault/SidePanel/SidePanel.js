import React, { useContext, useEffect, useState } from "react";
import { VaultContext } from "../../../context/VaultContext";
import "./SidePanel.css";

const SidePanel = ({
  onSearch,
  onFilterCategory,
  onFilterType,
  activeFilterType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const { categories } = useContext(VaultContext);

  useEffect(() => {
    return () => clearTimeout(debounceTimer);
  }, [debounceTimer]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(newSearchTerm);
    }, 500);

    setDebounceTimer(timer);
  };

  const handleCategoryFilter = (category) => {
    onFilterCategory(category);
  };

  return (
    <div className="side-panel">
      <div className="search-box">
        <span className="search-icon">&#128269;</span>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="category-list">
        <div className="category-cloud">
          {categories.map((category) => (
            <span
              key={category.id}
              className="category-tag"
              onClick={() => handleCategoryFilter(category)}
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className="additional-filters">
          <h3>Дополнительные фильтры</h3>
          <button
            className={`filter-button ${
              activeFilterType === "record" ? "active" : ""
            }`}
            onClick={() => onFilterType("record")}
          >
            Запись
          </button>
          <button
            className={`filter-button ${
              activeFilterType === "card" ? "active" : ""
            }`}
            onClick={() => onFilterType("card")}
          >
            Карта
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
