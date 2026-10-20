import React, { useState } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAnimal from "../assets/defaultAnimal.png";
import { ADS_ROUTE } from "../utils/consts";
import { removeFromFavourites } from "../http/fauvoriteAPI";

const FavouriteItem = ({ ad, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleRemove = async (e) => {
    e.stopPropagation();
    try {
      await removeFromFavourites(ad.advertisement_id);
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
    }
  };

  const imageUrl = ad.preview_photo
    ? `${process.env.REACT_APP_API_URL}/${ad.preview_photo}`
    : defaultAnimal;

  console.log(imageUrl);
  const handleClick = () => {
    navigate(`${ADS_ROUTE}/${ad.advertisement_id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
      }}
    >
      <Card
        className="shadow-sm border-0 rounded-4 d-flex flex-column"
        style={{
          width: "350px",
          height: "500px", // фиксированная высота карточки
          border: isHovered ? "1px solid #ffc107" : "1px solid #eee",
          boxShadow: isHovered
            ? "0 6px 18px rgba(255, 193, 7, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
          margin: "0 auto",
        }}
      >
        {/* Фото с размытым фоном */}
        {/* Фото с размытым фоном */}
        <div
          style={{
            position: "relative",
            height: "350px", // фиксированная высота блока с фото
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          {imageUrl !== defaultAnimal && (
            <>
              {/* Размытый фон */}
              <img
                src={imageUrl}
                alt={ad.animal_name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "blur(20px) brightness(0.6)",
                  transform: "scale(1.1)",
                }}
              />
              {/* Основное фото */}
              <img
                src={imageUrl}
                alt={ad.animal_name}
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </>
          )}

          {imageUrl === defaultAnimal && (
            <img
              src={defaultAnimal}
              alt="default animal"
              style={{
                maxWidth: "80%", // чтобы не растягивалась
                maxHeight: "80%",
                objectFit: "contain",
                zIndex: 1,
              }}
            />
          )}
        </div>

        {/* Тело карточки */}
        <Card.Body
          className="d-flex flex-column justify-content-between"
          style={{ flexGrow: 1, padding: "1rem 1.25rem" }}
        >
          <div>
            <Card.Title
              className="mb-1 fw-bold text-dark text-truncate"
              style={{
                fontSize: "1.2rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ad.animal_name}
            </Card.Title>

            <Card.Text
              className="text-muted small mb-2"
              style={{
                height: "2.8em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ad.breed} • {ad.age} лет
            </Card.Text>

            {ad.location_name && (
              <div className="d-flex align-items-center text-muted small mb-2">
                <MapPin size={14} className="me-1" /> {ad.location_name}
              </div>
            )}
          </div>

          {ad.isUrgent && (
            <Badge bg="danger" className="align-self-start mb-2">
              Срочно ищет дом!
            </Badge>
          )}

          <div className="d-flex justify-content-end mt-2 pt-2 border-top">
            <Button
              variant="outline-danger"
              size="sm"
              className="d-flex align-items-center gap-1 rounded-3"
              onClick={handleRemove}
              title="Удалить из избранного"
            >
              <Trash2 size={14} />
              <span>Удалить</span>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FavouriteItem;
