import React, { useState, useEffect } from "react";
import MyInput from "../components/UI/input/MyInput";
import CopyButton from "../components/UI/button/CopyButton";

const CardForm = ({ editMode, initialCard, onSave }) => {
  const [card, setCard] = useState({
    id: "",
    card_name: "",
    card_number: "",
    expiry_date: "",
    cvv: "",
    cardholder_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prevCard) => ({ ...prevCard, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(card);
  };

  useEffect(() => {
    if (initialCard) {
      setCard(initialCard);
    }
  }, [initialCard]);

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
            <div className="form-field full-width">
              <label>Номер карты</label>
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="card_number"
                  value={card.card_number || ""}
                  onChange={handleChange}
                  required
                  readOnly={!editMode}
                  autoComplete="off"
                />
                {card.card_number && !editMode && (
                  <CopyButton value={card.card_number || ""} />
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Название карты</label>
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="card_name"
                  value={card.card_name || ""}
                  onChange={handleChange}
                  required
                  readOnly={!editMode}
                  autoComplete="off"
                />
                {card.card_name && !editMode && (
                  <CopyButton value={card.card_name || ""} />
                )}
              </div>
            </div>
            <div className="form-field">
              <label>Имя держателя карты</label>
              <div className="input-with-copy">
                <MyInput
                  type="text"
                  name="cardholder_name"
                  value={card.cardholder_name || ""}
                  onChange={handleChange}
                  required
                  readOnly={!editMode}
                  autoComplete="off"
                />
                {card.cardholder_name && !editMode && (
                  <CopyButton value={card.cardholder_name || ""} />
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Дата истечения</label>
              <MyInput
                type="month"
                name="expiry_date"
                value={card.expiry_date || ""}
                onChange={handleChange}
                required
                readOnly={!editMode}
                autoComplete="off"
              />
            </div>
            <div className="form-field">
              <label>CVV</label>
              <MyInput
                type="text"
                name="cvv"
                value={card.cvv || ""}
                onChange={handleChange}
                required
                readOnly={!editMode}
                autoComplete="off"
                maxLength="3"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardForm;
