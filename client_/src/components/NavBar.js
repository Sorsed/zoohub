import React, { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Heart, Menu, X } from "lucide-react";
import {
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SHOP_ROUTE,
  FAVOURITES_ROUTE,
} from "../utils/consts";
import { logout } from "../http/userAPI";
import "../css/navbar.css";

const Header = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logOut = async () => {
    try {
      await logout(); // ждем, пока сервер удалит сессию и очистит cookie
      user.setUser({});
      user.setIsAuth(false);
      navigate(SHOP_ROUTE);
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    }
  };

  const navItems = [
    { label: "Главная", href: SHOP_ROUTE },
    { label: "Найти питомца", href: "/find-pet" },
    { label: "Истории", href: "/stories" },
    { label: "Партнеры", href: "/partners" },
    { label: "Помощь", href: "/help" },
    //{ label: "О проекте", href: "/about" },
  ];

  return (
    <Navbar bg="light" expand="md" sticky="top" className="shadow-sm">
      <Container>
        {/* Логотип */}
        <NavLink
          to={SHOP_ROUTE}
          className="navbar-brand d-flex align-items-center"
        >
          <Heart size={24} className="text-danger me-2" fill="currentColor" />
          <span className="fw-bold">ZooHub</span>
        </NavLink>

        {/* Кнопка-бургер */}
        <Navbar.Toggle
          aria-controls="main-navbar"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Navbar.Toggle>

        {/* Навигация */}
        <Navbar.Collapse id="main-navbar" in={isMenuOpen}>
          <Nav className="ms-auto">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.href} className="nav-link">
                {item.label}
              </NavLink>
            ))}

            {/* Если пользователь авторизован */}
            {user.isAuth ? (
              <>
                <Button
                  className="ms-2 btn-no-border"
                  onClick={() => navigate(PROFILE_ROUTE)}
                >
                  Профиль
                </Button>
                <Button
                  className="ms-2 btn-no-border"
                  onClick={() => navigate(FAVOURITES_ROUTE)}
                >
                  Избранное
                </Button>

                <Button
                  variant="warning"
                  className="ms-2"
                  onClick={() => logOut()}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                variant="outline-primary"
                className="ms-2"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Войти
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Header;
/*<Button variant="warning" className="ms-2">
              Помочь сейчас
            </Button>*/
