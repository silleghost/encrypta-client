import React from "react";
import "./FilterIndicator.css";

const FilterIndicator = ({
  searchTerm,
  filterByCategory,
  onClearSearch,
  onClearCategory,
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
            Фильтрация по категории: {filterByCategory.name}
          </span>
          <button
            className="filter-indicator__remove"
            onClick={onClearCategory}
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterIndicator;
