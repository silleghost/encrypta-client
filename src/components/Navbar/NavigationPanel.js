import React from "react";
import { Link } from "react-router-dom";
import "./NavigationPanel.css";

const navigationRoutes = [
  { path: "/vault", name: "Хранилище" },
  { path: "/tools", name: "Инструменты" },
  { path: "/notes", name: "Заметки" },
  { path: "/settings", name: "Настройки" },
  { path: "/about", name: "Справка" },
  { path: "/logout", name: "Выход" },
];

const NavigationPanel = () => {
  return (
    <div className="container">
      <div className="nav">
        <div className="leftSection">
          <ul className="ul">
            {navigationRoutes.map((route) => (
              <li key={route.name}>
                <Link to={route.path} className="link">
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
