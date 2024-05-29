import React from "react";

import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import VaultPage from "../pages/VaultPage";
import NotFoundPage from "../pages/NotFoundPage";
import UserLogout from "../pages/UserLogout";

export const publicRoutes = [
  { path: "/login", element: <LoginPage />, exact: true },
  { path: "/registration", element: <RegistrationPage />, exact: true },
  { path: "/404", element: <NotFoundPage />, exact: true },
  { path: "/logout", element: <UserLogout />, exact: true },
];

export const privateRoutes = [
  { path: "/vault", element: <VaultPage />, exact: true },
];
