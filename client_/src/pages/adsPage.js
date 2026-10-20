import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spinner,
  Card,
  Badge,
  Button,
  Carousel,
  Row,
  Image,
  Modal,
} from "react-bootstrap";
import { MapPin, ArrowLeft, Phone, Mail, ShieldAlert, Edit3, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchAdvertisementById,
  deleteAdvertisement,
} from "../http/advertisementAPI";
import defaultAnimal from "../assets/defaultAnimal.png";
import defaultAvatar from "../assets/defaultAvatar.png";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../index";
import {
  addToFavourites,
  removeFromFavourites,
  checkFavourite,
} from "../http/fauvoriteAPI";
import {
  OTHER_PROFILE_PAGE_ROUTE,
  EDIT_ADS_ROUTE,
  FIND_PET_ROUTE,
} from "../utils/consts";

import { observer } from "mobx-react-lite";

const AdsPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(Context);

  const isModerator = user.isAuth && Number(user.user?.user_type) === 4;

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadAd = async () => {
      try {
        const data = await fetchAdvertisementById(id);
        setAd(data);
      } catch (e) {
        setError("Не удалось загрузить объявление");
      }

      if (user.isAuth) {
        try {
          const data2 = await checkFavourite(id);
          setIsFavorite(data2?.isFavourite || false);
        } catch (e) {
          setIsFavorite(false);
        }
      } else {
        setIsFavorite(false);
      }
      setLoading(false);
    };
    loadAd();
  }, [id, user.isAuth]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="text-center py-5 text-muted">
        <p>{error || "Объявление не найдено"}</p>
        <Button variant="outline-warning" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
    );
  }

  const ownerAvatar = ad.user_ava_photo
    ? `${process.env.REACT_APP_API_URL}/${ad.user_ava_photo}`
    : defaultAvatar;

  const photos =
    ad.photos && ad.photos.length > 0
      ? ad.photos.map((p) => `${process.env.REACT_APP_API_URL}/${p}`)
      : [defaultAnimal];

  const handleFavoriteToggle = () => {
    if (user.isAuth) {
      if (!isFavorite) {
        addToFavourites(id)
          .then(() => setIsFavorite(true))
          .catch(() => toast.error("Не удалось добавить в избранное"));
      } else {
        removeFromFavourites(id)
          .then(() => setIsFavorite(false))
          .catch(() => toast.error("Не удалось удалить из избранного"));
      }
    } else {
      toast.info("Войдите в аккаунт, чтобы добавить в избранное");
    }
  };

  const handleClick = () => {
    navigate(`${OTHER_PROFILE_PAGE_ROUTE}/${ad.user_id}`);
  };

  const formatAge = (age) => {
    if (!age || age <= 0) return "не указан";

    // Если меньше года — показываем месяцы
    if (age < 1) {
      const months = Math.round(age * 12);
      const lastDigit = months % 10;
      const lastTwo = months % 100;

      let word = "месяцев";
      if (lastTwo < 11 || lastTwo > 14) {
        if (lastDigit === 1) word = "месяц";
        else if (lastDigit >= 2 && lastDigit <= 4) word = "месяца";
      }

      return `${months} ${word}`;
    }

    // Если год или больше
    const years = Math.floor(age);
    const lastDigit = years % 10;
    const lastTwo = years % 100;

    let word = "лет";
    if (lastTwo < 11 || lastTwo > 14) {
      if (lastDigit === 1) word = "год";
      else if (lastDigit >= 2 && lastDigit <= 4) word = "года";
    }

    return `${years} ${word}`;
  };

  return (
    <div className="container py-5">
      <Button
        variant="link"
        className="text-decoration-none text-muted mb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="me-2" />
        Назад
      </Button>

      <Card className="shadow-sm border-0 rounded-4 p-3">
        <div className="row">
          {/* Фото / галерея */}
          <div className="col-md-6 mb-3">
            <Carousel
              interval={null}
              indicators={photos.length > 1}
              controls={photos.length > 1}
            >
              {photos.map((photo, idx) => (
                <Carousel.Item key={idx}>
                  <div
                    style={{
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "1rem",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Фон ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(20px) brightness(0.6)",
                        transform: "scale(1.1)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                    <img
                      src={photo}
                      alt={`Фото ${idx + 1}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        position: "relative",
                        zIndex: 1,
                        display: "block",
                      }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          {/* Информация */}
          <div className="col-md-6">
            <h1 className="fw-bold mb-2">{ad.animal_name || "Без имени"}</h1>
            <Button
              variant="outline-dark"
              style={{
                position: "absolute",
                top: "20px",
                right: "70px",
                padding: "10px",
                zIndex: 90,
                borderRadius: "20%",
              }}
              onClick={handleFavoriteToggle}
            >
              <FontAwesomeIcon
                icon={isFavorite ? faHeartSolid : faHeartRegular}
                style={{ color: isFavorite ? "red" : "black" }}
              />
            </Button>

            <div className="d-flex flex-wrap gap-2 mb-2">
              {Number(ad.type_advertisement) === 2 ? (
                <Badge bg="danger" className="fs-6 px-3 py-2">Потерялся</Badge>
              ) : Number(ad.type_advertisement) === 3 ? (
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">Найден</Badge>
              ) : Number(ad.type_advertisement) === 4 ? (
                <Badge bg="info" className="fs-6 px-3 py-2">Нужна передержка</Badge>
              ) : (
                <Badge bg="primary" className="fs-6 px-3 py-2">Ищет дом</Badge>
              )}

              {ad.isUrgent && (
                <Badge bg="danger" className="fs-6 px-3 py-2">
                  Срочно ищет дом!
                </Badge>
              )}
            </div>

            {(ad.location_name || ad.location) && (
              <p className="text-muted small d-flex align-items-center mb-2">
                <MapPin size={14} className="me-1 text-danger" />
                {ad.location_name || ad.location}
              </p>
            )}

            <hr />
            <div
              className="d-flex align-items-center mb-3 gap-3"
              style={{ cursor: "pointer" }}
              onClick={handleClick}
            >
              <div className="d-flex align-items-center mb-3 gap-3">
                <div>
                  <div className="fw-bold">
                    <h4 className="text-dark fw-bold mb-1">
                      {ad.user_name} {ad.user_surname}
                    </h4>
                  </div>
                  <div className="text-muted small">
                    Проверенный куратор • Самара
                  </div>
                  <div className="mt-1">
                    <span className="badge bg-warning text-dark">
                      {Number(ad.user_type) === 2
                        ? "Официальный приют"
                        : Number(ad.user_type) === 3
                        ? "Волонтёр"
                        : "Частное лицо"}
                    </span>
                  </div>
                </div>
                <Image src={ownerAvatar} roundedCircle width={60} height={60} />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button
                variant="warning"
                className="flex-fill fw-semibold d-flex align-items-center justify-content-center"
                style={{ borderRadius: "1rem" }}
                onClick={() => {
                  const phone = ad.tutor_number || ad.user_phone;
                  if (phone) {
                    navigator.clipboard?.writeText(phone);
                    toast.success(`Номер ${phone} скопирован!`);
                    window.location.href = `tel:${phone}`;
                  } else {
                    setShowContactModal(true);
                  }
                }}
              >
                <Phone size={18} className="me-2" />
                {ad.tutor_number || ad.user_phone ? "Позвонить" : "Контакты"}
              </Button>
              <Button
                variant="outline-dark"
                className="flex-fill fw-semibold d-flex align-items-center justify-content-center"
                style={{ borderRadius: "1rem" }}
                onClick={() => {
                  const email = ad.tutor_email || ad.user_email;
                  if (email) {
                    navigator.clipboard?.writeText(email);
                    toast.success(`Email ${email} скопирован!`);
                    window.location.href = `mailto:${email}?subject=Вопрос по питомцу ${ad.animal_name}`;
                  } else {
                    setShowContactModal(true);
                  }
                }}
              >
                <Mail size={18} className="me-2" />
                Написать
              </Button>
            </div>

            {/* Блок быстрых действий модератора (user_type === 4) */}
            {isModerator && (
              <div className="mt-3 p-3 bg-light rounded-4 border border-danger-subtle shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small fw-bold text-danger d-flex align-items-center gap-1">
                    <ShieldAlert size={16} /> Модерация ZooHub
                  </span>
                  <span className="badge bg-danger text-white small">
                    user_type = 4
                  </span>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <Button
                    variant="warning"
                    className="flex-fill fw-bold text-dark d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
                    onClick={() => navigate(`${EDIT_ADS_ROUTE}/${id}`)}
                  >
                    <Edit3 size={16} />
                    <span>✏️ Редактировать (Модерация)</span>
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-fill fw-bold text-white d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    <span>🗑 Удалить (Модерация)</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Характеристики */}
          <div className="mt-4 ps-3 ps-md-5">
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
              Характеристики
            </h3>
            <Row style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              <div className="mb-2">
                <strong>Порода:</strong> {ad.breed}
              </div>
              <div className="mb-2">
                <strong>Возраст:</strong> {formatAge(ad.age)}
              </div>
            </Row>
          </div>

          {/* Важно для дома */}
          <div className="mt-4 ps-3 ps-md-5">
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
              Важно для дома
            </h3>
            <div className="d-flex flex-wrap gap-2">
              <span
                className={`badge px-3 py-2 fs-6 rounded-pill ${
                  ad.is_sterilized
                    ? "bg-success text-white"
                    : "bg-light text-muted border"
                }`}
              >
                {ad.is_sterilized ? "✓ Стерилизован / кастрирован" : "— Не стерилизован"}
              </span>
              <span
                className={`badge px-3 py-2 fs-6 rounded-pill ${
                  ad.is_vaccinated
                    ? "bg-info text-dark"
                    : "bg-light text-muted border"
                }`}
              >
                {ad.is_vaccinated ? "✓ Привит" : "— Без вакцинации"}
              </span>
              <span
                className={`badge px-3 py-2 fs-6 rounded-pill ${
                  ad.good_with_kids
                    ? "bg-warning text-dark"
                    : "bg-light text-muted border"
                }`}
              >
                {ad.good_with_kids ? "✓ Ладит с детьми" : "— Отношение к детям не указано"}
              </span>
              <span
                className={`badge px-3 py-2 fs-6 rounded-pill ${
                  ad.good_with_animals
                    ? "bg-primary text-white"
                    : "bg-light text-muted border"
                }`}
              >
                {ad.good_with_animals ? "✓ Дружит с другими животными" : "— Отношение к питомцам не указано"}
              </span>
            </div>
          </div>

          {/* Описание */}
          <div className="mt-4 ps-3 ps-md-5">
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
              Описание
            </h3>
            <div className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
              {ad.description}
            </div>
          </div>

          {/* Контакты куратора */}
          {ad.user_type === 2 &&
            (ad.tutor_name || ad.tutor_number || ad.tutor_email) && (
              <div className="mt-4 ps-5">
                <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
                  Контакты куратора
                </h3>
                <div
                  className="d-flex flex-column gap-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  {ad.tutor_name && <div className="mb-2">{ad.tutor_name}</div>}
                  {ad.tutor_number && (
                    <div className="mb-2">{ad.tutor_number}</div>
                  )}
                  {ad.tutor_email && (
                    <div className="mb-2">{ad.tutor_email}</div>
                  )}
                </div>
              </div>
            )}

          {/* Местоположение */}
          <div className="mt-4 ps-5">
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
              Местоположение
            </h3>
            <div className="mb-2">{ad.location_name || "Самара"}</div>
          </div>

          {/* Дата создания */}
          <div className="mt-4 ps-5">
            {(() => {
              const dateObj = new Date(ad.created_at);
              const formattedDate = dateObj.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              return (
                <div className="mb-2">
                  {formattedDate} {formattedTime}
                </div>
              );
            })()}
          </div>

          {/* Этапы / События */}
          {ad.user_type === 2 && ad.stages && ad.stages.length > 0 && (
            <div className="mt-4 ps-5">
              <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
                Этапы / События
              </h3>
              <div
                className="d-flex flex-column gap-3"
                style={{ fontSize: "1.1rem" }}
              >
                {ad.stages.map((stage, idx) => {
                  const startDate = new Date(
                    stage.stage_date_start
                  ).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
                  const finishDate = stage.stage_date_finish
                    ? new Date(stage.stage_date_finish).toLocaleDateString(
                        "ru-RU",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )
                    : null;

                  return (
                    <div key={idx} className="border rounded-3 p-3 bg-light">
                      <div className="fw-bold mb-1">{stage.stage_name}</div>
                      {stage.stage_description && (
                        <div className="mb-1">{stage.stage_description}</div>
                      )}
                      <div className="text-muted small">
                        <span>Начало: {startDate}</span>
                        {finishDate && <span> — Окончание: {finishDate}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal: Контакты куратора */}
      <Modal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Контакты для связи</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            По вопросу усыновления питомца <strong>{ad.animal_name}</strong>:
          </p>
          <div className="p-3 bg-light rounded-3 mb-3">
            <div className="fw-bold mb-1">
              Куратор: {ad.tutor_name || `${ad.user_name} ${ad.user_surname || ""}`}
            </div>
            {ad.tutor_number || ad.user_phone ? (
              <div className="mb-2">
                <strong>Телефон:</strong>{" "}
                <a
                  href={`tel:${ad.tutor_number || ad.user_phone}`}
                  className="text-decoration-none fw-semibold"
                >
                  {ad.tutor_number || ad.user_phone}
                </a>
              </div>
            ) : (
              <div className="text-muted mb-2">Телефон не указан</div>
            )}
            {ad.tutor_email || ad.user_email ? (
              <div>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${ad.tutor_email || ad.user_email}`}
                  className="text-decoration-none fw-semibold"
                >
                  {ad.tutor_email || ad.user_email}
                </a>
              </div>
            ) : null}
          </div>
          <p className="small text-muted mb-0">
            Пожалуйста, сообщите куратору, что вы нашли питомца через платформу ZooHub.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactModal(false)}>
            Закрыть
          </Button>
          {ad.tutor_number || ad.user_phone ? (
            <Button
              variant="warning"
              onClick={() => {
                const phone = ad.tutor_number || ad.user_phone;
                navigator.clipboard?.writeText(phone);
                toast.success("Номер скопирован!");
              }}
            >
              Скопировать номер
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления (Модерация) */}
      <Modal
        show={showDeleteModal}
        onHide={() => !deleting && setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!deleting} className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-danger fs-5">
            <AlertTriangle size={22} />
            Удаление объявления (Модерация)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <p className="mb-3">
            Вы действительно хотите безвозвратно удалить карточку животного:
          </p>
          <div className="p-3 bg-light rounded-3 border mb-3">
            <div className="fw-bold fs-6 text-dark">
              «{ad?.animal_name || "Без клички"}»
            </div>
            <div className="small text-muted">
              ID: #{id} • {ad?.breed || "Порода не указана"}
            </div>
            <div className="small text-muted mt-1">
              Автор: {ad?.user_name} {ad?.user_surname || ""} ({ad?.tutor_email || ad?.user_email || "Email не указан"})
            </div>
          </div>
          <div className="alert alert-warning py-2 px-3 small mb-0 d-flex align-items-center gap-2">
            <ShieldAlert size={18} className="flex-shrink-0" />
            <span>
              Внимание: карточка, все фотографии и история объявления будут полностью удалены из базы данных ZooHub.
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            className="rounded-3 px-3"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="rounded-3 px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
            onClick={async () => {
              try {
                setDeleting(true);
                await deleteAdvertisement(id);
                toast.success(`Объявление «${ad?.animal_name}» успешно удалено`);
                navigate(FIND_PET_ROUTE);
              } catch (err) {
                console.error("Ошибка при удалении:", err);
                toast.error(
                  err.response?.data?.message || "Ошибка при удалении объявления"
                );
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Да, удалить объявление</span>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default AdsPage;
