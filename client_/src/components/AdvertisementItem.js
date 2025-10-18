import React from "react";
import { Card, Button } from "react-bootstrap";
import defaultAnimal from "../assets/defaultAnimal.png";
import { EDIT_ADS_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { deleteAdvertisement } from "../http/advertisementAPI"; // твой API
import { ADS_ROUTE } from "../utils/consts";

const AdvertisementItem = ({ ad, onDelete }) => {
  const navigate = useNavigate();

  const imageUrl = ad.preview_photo
    ? `${process.env.REACT_APP_API_URL}/${ad.preview_photo}`
    : defaultAnimal;

  const getYearWord = (n) => {
    if (n % 1 !== 0) return "года";

    const lastDigit = n % 10;
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return "лет";
    if (lastDigit === 1) return "год";
    if (lastDigit >= 2 && lastDigit <= 4) return "года";
    return "лет";
  };

  const handleClick = () => {
    navigate(`${ADS_ROUTE}/${ad.advertisement_id}`);
  };

  const getFormattedAge = () => {
    if (ad.age == null) return "";
    if (ad.age < 1 && ad.age > 0) {
      return `${Math.round(ad.age * 12)} мес.`;
    }
    return `${Math.floor(ad.age)} ${getYearWord(Math.floor(ad.age))}`;
  };

  const delHandle = async (e) => {
    e.preventDefault();
    if (!window.confirm("Вы уверены, что хотите удалить объявление?")) return;

    try {
      await deleteAdvertisement(ad.advertisement_id);
      if (onDelete) onDelete(ad.advertisement_id); // 💥 Убираем карточку из списка
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении объявления");
    }
  };
  return (
    <div
      className="ad-card-container"
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="d-flex flex-column flex-md-row">
          {/* Фото с размытым фоном */}
          <div
            style={{
              width: "100%",
              height: "220px",
              position: "relative",
              borderRadius: "1rem 1rem 0 0",
              overflow: "hidden",
              backgroundColor: "#f8f9fa",
              display: "flex",
              alignItems: "center", // центрируем по вертикали
              justifyContent: "center",
            }}
          >
            {/* Размытый фон */}
            <img
              src={imageUrl}
              alt={`${ad.animal_name} фон`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(20px) brightness(0.7)",
                transform: "scale(1.1)",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />

            {/* Основное изображение */}
            <img
              src={imageUrl}
              alt={ad.animal_name}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 2,
              }}
            />
          </div>

          {/* Контент */}
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title className="fw-bold fs-5 mb-1">
                {ad.animal_name || "Без имени"}
              </Card.Title>
              <Card.Subtitle className="text-muted mb-2">
                {ad.breed} • {getFormattedAge()}
              </Card.Subtitle>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-auto">
              <Button
                variant="outline-dark"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // 🚫 остановить всплытие
                  navigate(`${EDIT_ADS_ROUTE}/${ad.advertisement_id}`);
                }}
              >
                Редактировать
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // 🚫 остановить всплытие
                  delHandle(e);
                }}
              >
                Удалить
              </Button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default AdvertisementItem;
