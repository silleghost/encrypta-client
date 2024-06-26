import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../router";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../utils/PrivateRoute";
import { VaultProvider } from "../context/VaultContext";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VaultProvider>
          <Routes>
            {privateRoutes.map((route) => (
              <Route
                element={<PrivateRoute element={route.element} />}
                path={route.path}
                exact={route.exact}
                key={route.path}
              />
            ))}

            {publicRoutes.map((route) => (
              <Route
                element={route.element}
                path={route.path}
                exact={route.exact}
                key={route.path}
              />
            ))}

            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </VaultProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
