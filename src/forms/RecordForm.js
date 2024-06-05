import React, { forwardRef, useState, useEffect } from "react";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import "../modals/RecordModal.css";
import TotpInput from "../components/Vault/Record/TotpInput";
import ErrorNotifications from "../components/Vault/ErrorNotifications";

const RecordForm = ({ editMode, initialRecord, categories, onSave }) => {
  const [errors, setErrors] = useState([]);
  const [record, setRecord] = useState({
    id: "",
    app_name: "",
    category: "",
    username: "",
    password: "",
    url: "",
    totp_secret: "",
  });

  const [showTotpInput, setShowTotpInput] = useState(false);

  const toggleShowTotpInput = () => {
    setShowTotpInput(!showTotpInput);
  };

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
      setShowTotpInput(!!initialRecord.totp_secret);
    }
  }, [initialRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
  };

  const isValidTotpSecret = (value) => {
    const latinAlphabetRegex = /^[a-zA-Z]*$/;
    return latinAlphabetRegex.test(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (record.totp_secret && !isValidTotpSecret(record.totp_secret)) {
      newErrors.totp_secret = "Недопустимые символы";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      onSave(record);
      setErrors({});
    }
  };

  const handleChangeCategory = (e) => {
    const selectedCategoryId = e.target.value;
    setRecord((prevRecord) => ({
      ...prevRecord,
      category: selectedCategoryId,
    }));
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
            <label>Название приложения</label>
            <MyInput
              type="text"
              name="app_name"
              id="app_name"
              value={record.app_name || ""}
              onChange={handleChange}
              required
              readOnly={!editMode}
            />
          </div>
          <div className="form-field">
            <label>Категория</label>
            <MySelect
              options={categories}
              value={record.category || ""}
              onChange={handleChangeCategory}
              disabled={!editMode}
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
              value={record.username || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
          <div className="form-field">
            <label>Пароль</label>
            <MyInput
              type="password"
              name="password"
              id="password"
              value={record.password || ""}
              onChange={handleChange}
              autoComplete="new-password"
              readOnly={!editMode}
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
              value={record.url || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            {errors.totp_secret && (
              <span className="error">{errors.totp_secret}</span>
            )}
            {editMode && showTotpInput ? (
              <>
                <label>Секретный ключ 2FA</label>
                <MyInput
                  type="text"
                  name="totp_secret"
                  id="totp_secret"
                  value={record.totp_secret || ""}
                  onChange={handleChange}
                />
              </>
            ) : editMode && !showTotpInput ? (
              <span
                className="add-secret-key-text"
                onClick={toggleShowTotpInput}
              >
                +Добавить секретный ключ
              </span>
            ) : record?.totp_secret ? (
              <>
                <label>Одноразовый код</label>
                <TotpInput totpSecret={record.totp_secret || ""} readOnly />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
};

export default RecordForm;
