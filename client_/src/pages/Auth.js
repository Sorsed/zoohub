import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Tabs, Tab, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { login, registration } from "../http/userAPI";
import { SHOP_ROUTE } from "../utils/consts";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // ---------------- Вход ----------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- Регистрация ----------------
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userType, setUserType] = useState("user"); // "user" | "shelter"
  const [shelterName, setShelterName] = useState("");
  const [shelterAddress, setShelterAddress] = useState("");
  const [shelterDescription, setShelterDescription] = useState("");
  const [shelterWebsite, setShelterWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);

  useEffect(() => {
    if (user.isAuth) {
      navigate(SHOP_ROUTE);
    }
  }, [user, navigate]);

  // ---------------- Вход ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success("Вы вошли в систему!");
      user.setUser(data.user);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Регистрация ----------------
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (userType === "user") {
        // 👤 Обычный пользователь
        formData.append("user_name", userName);
        formData.append("user_surname", userSurname);
        formData.append("user_phone", userPhone);
        formData.append("user_email", signupEmail);
        formData.append("password", signupPassword);
        formData.append("location_id", 1); // можно заменить на id выбранного города
        formData.append("user_type", isVolunteer ? 3 : 1); // 3 = волонтёр, 1 = обычный пользователь
      } else {
        // 🏠 Приют
        formData.append("user_name", shelterName); // название приюта
        formData.append("user_phone", userPhone);
        formData.append("user_email", signupEmail);
        formData.append("password", signupPassword);
        formData.append("location_id", 1);
        formData.append("user_type", 2); // тип 2 = приют
        formData.append("user_shelter_address", shelterAddress);
        formData.append("user_shelter_description", shelterDescription);
        formData.append("user_shelter_site", shelterWebsite);
      }

      if (avatar) formData.append("img", avatar);

      const data = await registration(formData);
      toast.success("Регистрация прошла успешно!");

      user.setUser(data.user);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <Card style={{ width: "100%", maxWidth: "450px" }} className="p-3">
        <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-3">
          {/* ---------- Вход ---------- */}
          <Tab eventKey="login" title="Вход">
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Войти"}
              </Button>
            </Form>
          </Tab>

          {/* ---------- Регистрация ---------- */}
          <Tab eventKey="signup" title="Регистрация">
            <Form onSubmit={handleSignup}>
              {/* Выбор типа */}
              <div className="d-flex mb-3">
                <Button
                  variant={userType === "user" ? "warning" : "outline-warning"}
                  className="flex-fill me-2"
                  type="button"
                  onClick={() => setUserType("user")}
                >
                  Пользователь
                </Button>
                <Button
                  variant={
                    userType === "shelter" ? "warning" : "outline-warning"
                  }
                  className="flex-fill"
                  type="button"
                  onClick={() => setUserType("shelter")}
                >
                  Приют
                </Button>
              </div>

              {userType === "user" ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                      type="text"
                      value={userSurname}
                      onChange={(e) => setUserSurname(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="isVolunteer"
                      label="Я волонтёр"
                      checked={isVolunteer}
                      onChange={(e) => setIsVolunteer(e.target.checked)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Город</Form.Label>
                    <Form.Control
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Название приюта</Form.Label>
                    <Form.Control
                      type="text"
                      value={shelterName}
                      onChange={(e) => setShelterName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Адрес</Form.Label>
                    <Form.Control
                      type="text"
                      value={shelterAddress}
                      onChange={(e) => setShelterAddress(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Описание приюта</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={shelterDescription}
                      onChange={(e) => setShelterDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Сайт приюта</Form.Label>
                    <Form.Control
                      type="url"
                      value={shelterWebsite}
                      onChange={(e) => setShelterWebsite(e.target.value)}
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="79991234567"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Аватар (необязательно)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
});

export default Auth;
