import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Form, Spinner, Image } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getMyprofile, updateProfile } from "../http/profileAPI";
import defaultAvatar from "../assets/defaultAvatar.png";
import TextareaAutosize from "react-textarea-autosize";

const Profile = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Общие поля
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [location, setLocation] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const [avatarFile, setAvatarFile] = useState(null);

  // Поля для приюта
  const [shelterDescription, setShelterDescription] = useState("");
  const [shelterWebsite, setShelterWebsite] = useState("");
  const [shelterAddress, setShelterAddress] = useState("");

  const [userType, setUserType] = useState(1); // 1 - обычный, 2 - приют, 3 - админ

  // Загружаем профиль при монтировании
  useEffect(() => {
    if (!user.isAuth) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getMyprofile();
        if (!data) return;
        user.setUser(data);

        setUserName(data.user_name || "");
        setUserSurname(data.user_surname || "");
        setUserPhone(data.user_phone || "");
        setUserEmail(data.user_email || "");
        setLocation(data.location_name || "");

        setUserType(Number(data.user_type || 1));

        if (Number(data.user_type) === 2) {
          setShelterDescription(data.user_shelter_description || "");
          setShelterWebsite(data.user_shelter_site || "");
          setShelterAddress(data.user_shelter_address || "");
        } else if (Number(data.user_type) === 3) {
          setShelterDescription(data.user_shelter_description || "");
        }

        if (data.user_ava_photo) {
          setAvatarPreview(
            `${process.env.REACT_APP_API_URL}/${data.user_ava_photo}`
          );
        } else {
          setAvatarPreview(defaultAvatar);
        }
      } catch (err) {
        console.error(err);
        toast.error("Ошибка при загрузке профиля");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Изменение аватара
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Сохранение изменений
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_name", userName);
      formData.append("user_surname", userSurname);
      formData.append("user_email", userEmail);
      formData.append("user_phone", userPhone);
      formData.append("location_id", location);
      formData.append("user_type", userType);

      if (avatarFile) formData.append("img", avatarFile);

      if (userType === 2) {
        formData.append("user_shelter_description", shelterDescription);
        formData.append("user_shelter_site", shelterWebsite);
        formData.append("user_shelter_address", shelterAddress);
      } else if (userType === 3) {
        formData.append("user_shelter_description", shelterDescription);
      }

      await updateProfile(formData);
      toast.success("Профиль обновлён!");
      const updatedData = await getMyprofile();
      user.setUser(updatedData);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка обновления профиля");
    } finally {
      setLoading(false);
    }
  };

  // Отмена редактирования
  const handleCancel = async () => {
    try {
      const data = await getMyprofile();
      if (!data) return;
      user.setUser(data);

      setUserName(data.user_name || "");
      setUserSurname(data.user_surname || "");
      setUserPhone(data.user_phone || "");
      setUserEmail(data.user_email || "");
      setLocation(data.location_name || "");
      setUserType(Number(data.user_type || 1));

      if (Number(data.user_type) === 2) {
        setShelterDescription(data.user_shelter_description || "");
        setShelterWebsite(data.user_shelter_site || "");
        setShelterAddress(data.user_shelter_address || "");
      } else if (Number(data.user_type) === 3) {
        setShelterDescription(data.user_shelter_description || "");
      }

      if (data.user_ava_photo) {
        setAvatarPreview(
          `${process.env.REACT_APP_API_URL}/${data.user_ava_photo}`
        );
      } else {
        setAvatarPreview(defaultAvatar);
      }

      setAvatarFile(null);
      setIsEditing(false);
    } catch (err) {
      toast.error("Ошибка при восстановлении данных");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <Card style={{ width: "100%", maxWidth: "550px" }} className="p-3 shadow-sm border-0 rounded-4">
        <h3 className="text-center mb-3 fw-bold">Мой профиль</h3>

        <div className="d-flex flex-column align-items-center mb-3">
          <Image
            src={avatarPreview}
            roundedCircle
            width={150}
            height={150}
            className="mb-2 border border-2 border-warning object-fit-cover"
          />

          {/* Бейдж статуса пользователя */}
          <div className="text-center mb-2">
            {userType === 4 && (
              <span className="badge bg-danger px-3 py-2 fs-6 shadow-sm">
                🛡️ Статус: Модератор
              </span>
            )}
            {userType === 3 && (
              <span className="badge bg-success px-3 py-2 fs-6 shadow-sm">
                🐾 Статус: Волонтёр
              </span>
            )}
            {userType === 2 && (
              <span className="badge bg-primary px-3 py-2 fs-6 shadow-sm">
                🏠 Статус: Приют
              </span>
            )}
            {userType === 1 && (
              <span className="badge bg-secondary px-3 py-2 fs-6">
                👤 Статус: Пользователь
              </span>
            )}
          </div>

          {isEditing && (
            <Form.Group className="mb-3 w-75">
              <Form.Label>Сменить аватар</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          {(userType === 1 || userType === 3 || userType === 4) && (
            <>
              {/* Переключатель роли волонтёра */}
              {isEditing && (
                <div className="mb-3 p-3 bg-light rounded-3 border">
                  <Form.Check
                    type="switch"
                    id="volunteer-switch"
                    label="Я волонтёр (помогаю животным)"
                    checked={userType === 3}
                    onChange={(e) => setUserType(e.target.checked ? 3 : 1)}
                    className="fw-bold"
                  />
                  <Form.Text className="text-muted d-block mt-1">
                    {userType === 3
                      ? "Вы будете отображаться с бейджем «Волонтёр» в объявлениях и на вкладке «Волонтёры» на странице партнёров."
                      : "Включите, если готовы помогать бездомным животным как волонтёр (передержка, автопомощь, поиск)."}
                  </Form.Text>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  value={userSurname}
                  onChange={(e) => setUserSurname(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Город</Form.Label>
                <Form.Control
                  value={location || "Самара"}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isEditing}
                />
              </Form.Group>

              {userType === 3 && (
                <Form.Group className="mb-3">
                  <Form.Label>О волонтёрской деятельности / Чем помогаете</Form.Label>
                  <TextareaAutosize
                    minRows={2}
                    value={shelterDescription}
                    onChange={(e) => setShelterDescription(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Например: Передержка кошек, автопомощь по городу Самара, кураторство собак."
                    className="form-control rounded-3"
                    style={{ resize: "none", height: "auto", overflow: "hidden" }}
                  />
                </Form.Group>
              )}
            </>
          )}

          {userType === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Название приюта</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Адрес приюта</Form.Label>
                <Form.Control
                  type="text"
                  value={shelterAddress}
                  onChange={(e) => setShelterAddress(e.target.value)}
                  disabled={!isEditing}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Описание приюта</Form.Label>
                <TextareaAutosize
                  minRows={3}
                  value={shelterDescription}
                  onChange={(e) => setShelterDescription(e.target.value)}
                  disabled={!isEditing}
                  className="form-control rounded-3"
                  style={{ resize: "none", height: "auto", overflow: "hidden" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Сайт приюта</Form.Label>
                <Form.Control
                  type="url"
                  value={shelterWebsite}
                  onChange={(e) => setShelterWebsite(e.target.value)}
                  disabled={!isEditing}
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={!isEditing}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Телефон</Form.Label>
            <Form.Control
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              disabled={!isEditing}
            />
          </Form.Group>

          {!isEditing ? (
            <Button
              variant="warning"
              type="button"
              className="w-100"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button
                variant="success"
                type="submit"
                className="flex-fill"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Сохранить"
                )}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="flex-fill"
                onClick={handleCancel}
              >
                Отмена
              </Button>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
});

export default Profile;
