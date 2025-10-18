import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";

const Registration = observer(() => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [errors, setErrors] = useState({}); // Для хранения ошибок

  // Проверка на email
  const validateEmail = (email) => {
    const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegEx.test(email);
  };

  useEffect(() => {
    if (user.isAuth) {
      navigate(SHOP_ROUTE); // Перенаправление, если роль не "ADMIN"
    }
  }, [user, navigate]);

  // Функция валидации
  const handleValidation = () => {
    let validationErrors = {};
    if (!validateEmail(email)) {
      validationErrors.email = "Некорректный email!";
    }

    if (password.length < 6) {
      validationErrors.password = "Пароль должен быть не менее 6 символов!";
    }

    return validationErrors;
  };

  const click = async () => {
    const validationErrors = handleValidation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      let data = await registration(email, password, name, login);
      user.setUser(data);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{"Регистрация"}</h2>

        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-4"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!errors.email} // Показываем ошибку, если она есть
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>

          <Form.Control
            className="mt-4"
            placeholder="Введите ваш логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <Form.Control
            className="mt-4"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Form.Control
            className="mt-4"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            isInvalid={!!errors.password} // Показываем ошибку, если она есть
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>

          <Row>
            <Col className="d-flex justify-content-between mt-4 pl-3 pe-3">
              <div>
                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>

              <Button
                variant={"outline-success"}
                onClick={click}
                // Отключаем кнопку при наличии ошибок
              >
                {isLogin ? "Войти" : "Регистрация"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Registration;
