import React, { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Heart, Menu, X, Glasses, ShieldAlert } from "lucide-react";
import {
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SHOP_ROUTE,
  FAVOURITES_ROUTE,
  CREATE_ADS_ROUTE,
  FIND_PET_ROUTE,
  QUIZ_ROUTE,
  STORIES_ROUTE,
  PARTNERS_ROUTE,
  HELP_ROUTE,
  MODERATION_ROUTE,
} from "../utils/consts";
import { logout } from "../http/userAPI";
import { useAccessibility } from "../context/AccessibilityContext";
import "../css/navbar.css";

const Header = observer(() => {
  const { user } = useContext(Context);
  const { isAccessible, toggleAccessible } = useAccessibility();
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
    { label: "Найти питомца", href: FIND_PET_ROUTE },
    { label: "Тест-подбор", href: QUIZ_ROUTE },
    { label: "Истории", href: STORIES_ROUTE },
    { label: "Партнеры", href: PARTNERS_ROUTE },
    { label: "Помощь", href: HELP_ROUTE },
  ];

  return (
    <>
      {/* Верхняя сервисная полоса */}
      <div className="bg-white border-bottom py-1 small text-muted top-service-bar">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span>📍 Самара</span>
            <span className="d-none d-md-inline">📞 8 (800) 555-0123</span>
          </div>

          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`btn btn-sm ${
                isAccessible
                  ? "btn-warning text-dark fw-bold shadow-sm"
                  : "btn-outline-secondary border-0 text-dark fw-semibold"
              } d-flex align-items-center gap-1 py-1 px-2 rounded-2`}
              onClick={toggleAccessible}
              title={
                isAccessible
                  ? "Выключить режим для слабовидящих"
                  : "Включить версию для слабовидящих"
              }
            >
              <Glasses size={15} className="accessibility-icon" />
              <span>
                {isAccessible ? "Панель доступности (Вкл)" : "Версия для слабовидящих"}
              </span>
            </button>
          </div>
        </Container>
      </div>

      <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
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
            <Nav className="ms-auto align-items-center">
              {navItems.map((item) => (
                <NavLink key={item.label} to={item.href} className="nav-link px-2">
                  {item.label}
                </NavLink>
              ))}

              {/* Кнопка подать объявление */}
              <Button
                variant="warning"
                className="ms-lg-3 ms-0 my-2 my-lg-0 fw-semibold text-dark shadow-sm"
                onClick={() =>
                  navigate(user.isAuth ? CREATE_ADS_ROUTE : LOGIN_ROUTE)
                }
              >
                + Подать объявление
              </Button>

            {/* Если пользователь авторизован */}
            {user.isAuth ? (
              <>
                {/* Кнопка модератора для user_type === 4 */}
                {Number(user.user?.user_type) === 4 && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2 fw-semibold d-flex align-items-center gap-1 shadow-sm text-nowrap"
                    onClick={() => navigate(MODERATION_ROUTE)}
                    title="Открыть панель модератора"
                  >
                    <ShieldAlert size={15} />
                    <span>🛡️ Панель модератора</span>
                  </Button>
                )}

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
                  variant="outline-secondary"
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
    </>
  );
});

export default Header;
/*<Button variant="warning" className="ms-2">
              Помочь сейчас
            </Button>*/
