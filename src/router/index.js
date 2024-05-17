import React from "react";

import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import VaultPage from "../pages/VaultPage";

export const publicRoutes = [
  { path: "/login", element: <LoginPage />, exact: true },
  { path: "/registration", element: <RegistrationPage />, exact: true },
];

export const privateRoutes = [
  { path: "/vault", element: <VaultPage />, exact: true },
];
