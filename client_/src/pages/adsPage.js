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
} from "react-bootstrap";
import { MapPin, ArrowLeft } from "lucide-react";
import { fetchAdvertisementById } from "../http/advertisementAPI";
import defaultAnimal from "../assets/defaultAnimal.png";
import defaultAvatar from "../assets/defaultAvatar.png";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../index";
import {
  getALLFavourites,
  addToFavourites,
  removeFromFavourites,
  checkFavourite,
} from "../http/fauvoriteAPI";
import { OTHER_PROFILE_PAGE_ROUTE } from "../utils/consts";

const AdsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(true);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadAd = async () => {
      try {
        const data = await fetchAdvertisementById(id);
        setAd(data);
      } catch (e) {
        setError("Не удалось загрузить объявление");
      }
      try {
        const data2 = await checkFavourite(id);
        setIsFavorite(data2.isFavourite);
      } catch (e) {
        setError("Не удалось загрузить избранное");
      } finally {
        setLoading(false);
      }
    };
    loadAd();
  }, [id]);

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
        addToFavourites(id).then(() => setIsFavorite(true));
      } else {
        removeFromFavourites(id).then(() => setIsFavorite(false));
      }
    } else {
      alert("Пользователь не авторизован!");
    }
  };

  const handleClick = () => {
    navigate(`${OTHER_PROFILE_PAGE_ROUTE}/${ad.user_id}`);
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

            {ad.location && (
              <p className="text-muted small d-flex align-items-center mb-2">
                <MapPin size={14} className="me-1" />
                {ad.location}
              </p>
            )}

            {ad.isUrgent && (
              <Badge bg="danger" className="mb-3">
                Срочно ищет дом!
              </Badge>
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
                  <div className="text-warning">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}{" "}
                    <span className="text-dark">15 отзывов</span>
                  </div>
                  <div>
                    <h5>
                      {Number(ad.user_type) === 2
                        ? "Приют"
                        : Number(ad.user_type) === 3
                        ? "Частное лицо - Волонтёр"
                        : "Частное лицо"}
                    </h5>
                  </div>
                </div>
                <Image src={ownerAvatar} roundedCircle width={60} height={60} />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button
                variant="warning"
                className="flex-fill fw-semibold"
                style={{ borderRadius: "1rem" }}
                onClick={() => alert("Позвонить")}
              >
                Позвонить
              </Button>
              <Button
                variant="warning"
                className="flex-fill fw-semibold"
                style={{ borderRadius: "1rem" }}
                onClick={() => alert("Написать")}
              >
                Написать
              </Button>
            </div>
          </div>

          {/* Характеристики */}
          <div className="mt-4 ps-5">
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
              Характеристики
            </h3>
            <Row style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              <div className="mb-2">
                <strong>Порода:</strong> {ad.breed}
              </div>
              <div className="mb-2">
                <strong>Возраст:</strong> {ad.age} лет
              </div>
            </Row>
          </div>

          {/* Описание */}
          <div className="mt-4 ps-5">
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
    </div>
  );
};

export default AdsPage;
