import React from "react";
import CardItem from "./CardItem/CardItem"; // Предполагается, что вы создадите CardItem
import "./CardList.css";

const CardList = ({ cards, handleOpenModal }) => {
  return (
    <div className="card-list">
      <ul className="card-list-items">
        {cards.map((card) => (
          <li key={card.id} className="card-list-item">
            <CardItem card={card} handleOpenModal={handleOpenModal} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;
