import React, { useState, useEffect } from "react";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import "../modals/RecordModal.css";
import TotpInput from "../components/Vault/Record/TotpInput";
import { TOTP } from "totp-generator";
import CopyButton from "../components/UI/button/CopyButton";
import GenerateButton from "../components/UI/button/GenerateButton";

import PasswordGenerator from "../components/Tools/PasswordGenerator/PasswordGenerator";

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

  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);

  const tooglePasswordGenerator = (e) => {
    e.preventDefault();
    setShowPasswordGenerator(!showPasswordGenerator);
  };

  const handleSelectPassword = (value) => {
    if (value !== "") {
      setRecord((prevRecord) => ({
        ...prevRecord,
        password: value,
      }));
    }
    setShowPasswordGenerator(false);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShowPasswordGenerator(false);
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

  const cleanTotpSecret = (value) => {
    return value.replace(/\s/g, "");
  };

  const isValidTotpSecret = (value) => {
    try {
      TOTP.generate(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      record.totp_secret &&
      !isValidTotpSecret(cleanTotpSecret(record.totp_secret))
    ) {
      newErrors.totp_secret = "Некорректный ключ";
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
    <div className="modal-content">
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
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="app_name"
                  id="app_name"
                  value={record.app_name || ""}
                  onChange={handleChange}
                  required
                  readOnly={!editMode}
                />
                {record.app_name && !editMode && (
                  <CopyButton value={record.app_name || ""} />
                )}
              </div>
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
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="username"
                  id="username"
                  value={record.username || ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
                {record.username && !editMode && (
                  <CopyButton value={record.username || ""} />
                )}
              </div>
            </div>
            <div className="form-field">
              <label>Пароль</label>
              <div className="input-with-copy">
                <MyInput
                  type="password"
                  name="password"
                  id="password"
                  value={record.password || ""}
                  onChange={handleChange}
                  autoComplete="new-password"
                  readOnly={!editMode}
                />
                {editMode && (
                  <GenerateButton handleClick={tooglePasswordGenerator} />
                )}
                {record.password && !editMode && (
                  <CopyButton value={record.password || ""} />
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>URL-адрес</label>
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="url"
                  id="url"
                  value={record.url || ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
                {record.url && !editMode && (
                  <CopyButton value={record.url || ""} />
                )}
              </div>
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
                  <TotpInput
                    totpSecret={cleanTotpSecret(record.totp_secret) || ""}
                    readOnly
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </form>
      {showPasswordGenerator && editMode && (
        <PasswordGenerator
          embedded={true}
          onSelectPassword={handleSelectPassword}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default RecordForm;
