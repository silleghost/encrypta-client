import React from "react";
import "./FilterIndicator.css";

const FilterIndicator = ({
  searchTerm,
  filterByCategory,
  filterType,
  onClearSearch,
  onClearCategory,
  onClearFilterType,
}) => {
  return (
    <div className="filter-indicator">
      {searchTerm && (
        <div className="filter-indicator__item">
          <span className="filter-indicator__label">Поиск: {searchTerm}</span>
          <button className="filter-indicator__remove" onClick={onClearSearch}>
            &#10005;
          </button>
        </div>
      )}
      {filterByCategory && (
        <div className="filter-indicator__item">
          <span className="filter-indicator__label">
            Категория: {filterByCategory.name}
          </span>
          <button
            className="filter-indicator__remove"
            onClick={onClearCategory}
          >
            &#10005;
          </button>
        </div>
      )}
      {filterType && (
        <div className="filter-indicator__item">
          <span className="filter-indicator__label">
            Тип: {filterType === "record" ? "Запись" : "Карта"}
          </span>
          <button
            className="filter-indicator__remove"
            onClick={onClearFilterType}
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterIndicator;
