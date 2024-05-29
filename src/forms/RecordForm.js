import React, { forwardRef, useState } from "react";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import "../modals/RecordModal.css";

const RecordForm = ({ initialRecord, categories, onSave }) => {
  const [record, setRecord] = useState(
    initialRecord || {
      id: "",
      app_name: "",
      category: "",
      username: "",
      password: "",
      url: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(record);
  };

  const [selectedOption, setSelectedOption] = useState("");

  const handleChangeCategory = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="new-record-form"
      autoComplete="off"
      id="record-form"
    >
      <div className="form-content">
        <input type="hidden" value={record.id} name="id" />
        <div className="form-row">
          <div className="form-field">
            <label>Название приложения</label>
            <MyInput
              type="text"
              name="app_name"
              id="app_name"
              value={record.app_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Категория</label>
            <MySelect
              options={categories || []}
              value={record.category}
              onChange={handleChangeCategory}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Имя пользователя</label>
            <MyInput
              type="text"
              name="username"
              id="username"
              value={record.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Пароль</label>
            <MyInput
              type="password"
              name="password"
              id="password"
              value={record.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>URL-адрес</label>
            <MyInput
              type="text"
              name="url"
              id="url"
              value={record.url}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default RecordForm;
