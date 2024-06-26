import React from "react";

import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import VaultPage from "../pages/VaultPage";
import NotFoundPage from "../pages/NotFoundPage";
import UserLogout from "../pages/UserLogout";
import ToolsPage from "../pages/ToolsPage";
import NotesPage from "../pages/NotesPage";
import SendPage from "../pages/SendPage";

export const publicRoutes = [
  { path: "/login", element: <LoginPage />, exact: true },
  { path: "/registration", element: <RegistrationPage />, exact: true },
  { path: "/404", element: <NotFoundPage />, exact: true },
  { path: "/send", element: <SendPage />, exact: false },
];

export const privateRoutes = [
  { path: "/vault", element: <VaultPage />, exact: true },
  { path: "/tools", element: <ToolsPage />, exact: true },
  { path: "/logout", element: <UserLogout />, exact: true },
  { path: "/notes", element: <NotesPage />, exact: true },
];
