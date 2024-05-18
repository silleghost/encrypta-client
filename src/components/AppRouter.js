import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../router";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
