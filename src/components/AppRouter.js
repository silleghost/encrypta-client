import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../router";

const AppRouter = () => {
  const isAuth = false;

  return (
    <BrowserRouter>
      <Routes>
        {isAuth
          ? privateRoutes.map((route) => (
              <Route
                element={route.element}
                path={route.path}
                exact={route.exact}
                key={route.path}
              />
            ))
          : publicRoutes.map((route) => (
              <Route
                element={route.element}
                path={route.path}
                exact={route.exact}
                key={route.path}
              />
            ))}
        <Route
          path="*"
          element={isAuth ? <Navigate to="/vault" /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
