import { Routes, Route, Redirect, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { ADMIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { useContext } from "react";
import { Context } from "../index";

const AppRouter = () => {
  const { user, device } = useContext(Context);

  console.log(user);
  return (
    <Routes>
      {user.isAuth &&
        authRoutes?.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} exact />
        ))}
      {publicRoutes?.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
    </Routes>
  );
};

export default AppRouter;
