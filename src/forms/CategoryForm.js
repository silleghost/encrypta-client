import React, { useState, useEffect } from "react";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import "../modals/RecordModal.css";

const CategoryForm = ({ initialCategory, onSave }) => {
  const [category, setCategory] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(category);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="new-record-form"
      autoComplete="off"
      id="record-form"
    >
      <div className="form-content">
        <div className="form-row">
          <div className="form-field">
            <label>Название категории</label>
            <MyInput
              type="text"
              name="name"
              id="name"
              value={category.name || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
