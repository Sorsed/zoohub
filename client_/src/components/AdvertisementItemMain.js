import React, { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAnimal from "../assets/defaultAnimal.png";
import "../css/AdvertisementItemMain.css";
import { ADS_ROUTE } from "../utils/consts";

const AdvertisementItemMain = ({ ad }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const imageUrl = ad.preview_photo
    ? `${process.env.REACT_APP_API_URL}/${ad.preview_photo}`
    : defaultAnimal;

  const isUrgent = ad.isUrgent || false;

  const handleClick = () => {
    navigate(`${ADS_ROUTE}/${ad.advertisement_id}`);
  };

  // ✅ функция для правильного склонения "год"
  const getYearWord = (n) => {
    const lastDigit = n % 10;
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return "лет";
    if (lastDigit === 1) return "год";
    if (lastDigit >= 2 && lastDigit <= 4) return "года";
    return "лет";
  };

  // ✅ форматирование возраста
  const getFormattedAge = () => {
    if (ad.age == null) return "";
    if (ad.age < 1 && ad.age > 0) {
      return `${Math.round(ad.age * 12)} мес.`;
    }
    return `${Math.floor(ad.age)} ${getYearWord(Math.floor(ad.age))}`;
  };

  return (
    <div
      className="ad-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Card
        className="h-100 shadow-sm border-0 rounded-4"
        style={{
          width: "100%",
          border: isHovered ? "1px solid #ffc107" : "1px solid #eee",
          boxShadow: isHovered
            ? "0 6px 18px rgba(255, 193, 7, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Фото */}
        <div
          style={{
            overflow: "hidden",
            height: "220px",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            backgroundColor: "#f1f3f5",
          }}
        >
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={ad.animal_name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          />
        </div>

        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Card.Title className="mb-0 fw-bold text-dark">
              {ad.animal_name}
            </Card.Title>
          </div>

          <div className="mb-2 d-flex flex-wrap gap-1">
            {Number(ad.type_advertisement) === 2 ? (
              <Badge bg="danger">Потерялся</Badge>
            ) : Number(ad.type_advertisement) === 3 ? (
              <Badge bg="warning" text="dark">Найден</Badge>
            ) : Number(ad.type_advertisement) === 4 ? (
              <Badge bg="info">Нужна передержка</Badge>
            ) : (
              <Badge bg="primary">Ищет дом</Badge>
            )}

            {Number(ad.user_type) === 3 && (
              <Badge bg="success">🐾 Волонтёр</Badge>
            )}
            {Number(ad.user_type) === 2 && (
              <Badge bg="secondary">🏠 Приют</Badge>
            )}
          </div>

          <Card.Text className="text-muted small mb-1">
            {ad.breed} • {getFormattedAge()}
          </Card.Text>

          {(ad.location_name || ad.location) && (
            <div className="d-flex align-items-center text-muted small mb-2">
              <MapPin size={14} className="me-1 text-danger" /> {ad.location_name || ad.location}
            </div>
          )}

          {/* Быстрые теги «Важно для дома» */}
          {(ad.is_sterilized || ad.is_vaccinated || ad.good_with_kids || ad.good_with_animals) && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {ad.is_sterilized && (
                <Badge bg="light" text="dark" className="border text-secondary fw-normal py-1 px-2 small">
                  ✓ Стерилизован
                </Badge>
              )}
              {ad.is_vaccinated && (
                <Badge bg="light" text="dark" className="border text-secondary fw-normal py-1 px-2 small">
                  ✓ Привит
                </Badge>
              )}
              {ad.good_with_kids && (
                <Badge bg="light" text="dark" className="border text-secondary fw-normal py-1 px-2 small">
                  ✓ С детьми
                </Badge>
              )}
              {ad.good_with_animals && (
                <Badge bg="light" text="dark" className="border text-secondary fw-normal py-1 px-2 small">
                  ✓ С животными
                </Badge>
              )}
            </div>
          )}

          {isUrgent && (
            <Badge bg="danger" className="mb-2">
              Срочно ищет дом!
            </Badge>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdvertisementItemMain;
