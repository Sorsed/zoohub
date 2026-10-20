import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import Footer from "./components/Footer";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import AccessibilityBar from "./components/AccessibilityBar";
import "./css/accessibility.css";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    check()
      .then((data) => {
        if (data && (data.loggedIn || data.user_id || data.userId)) {
          const userData = { ...data };
          if (!userData.user_id && userData.userId) {
            userData.user_id = userData.userId;
          }
          if (!userData.userId && userData.user_id) {
            userData.userId = userData.user_id;
          }
          user.setUser(userData);
          user.setIsAuth(true);
        } else {
          user.setUser({});
          user.setIsAuth(false);
        }
      })
      .catch(() => {
        user.setUser({});
        user.setIsAuth(false);
      })
      .finally(() => setLoading(false));
  }, [user]);
  if (loading) {
    return <Spinner animation={"grow"} />;
  }
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <AccessibilityBar />
        <NavBar />
        <AppRouter />
        <Footer />
      </BrowserRouter>
    </AccessibilityProvider>
  );
});

export default App;
