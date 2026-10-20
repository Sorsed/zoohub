import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  EyeOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Image as ImageIcon,
  ImageOff,
  Type,
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";
import "../css/accessibility.css";

const AccessibilityBar = () => {
  const {
    isAccessible,
    fontSize,
    colorScheme,
    hideImages,
    letterSpacing,
    speechEnabled,
    toggleAccessible,
    setFontSize,
    setColorScheme,
    setHideImages,
    setLetterSpacing,
    setSpeechEnabled,
    resetSettings,
  } = useAccessibility();

  if (!isAccessible) return null;

  return (
    <div className="accessibility-bar shadow-sm">
      <Container fluid className="px-lg-4">
        <Row className="gy-2 align-items-center justify-content-between">
          {/* Размер шрифта */}
          <Col xs="auto" className="d-flex align-items-center gap-1">
            <span className="me-2 text-warning fw-bold d-flex align-items-center">
              <Type size={16} className="me-1 accessibility-icon" /> Размер шрифта:
            </span>
            <button
              type="button"
              className={`btn-access ${fontSize === "large" || !fontSize ? "active" : ""}`}
              onClick={() => setFontSize("large")}
              title="Крупный шрифт (20px)"
            >
              А (20px)
            </button>
            <button
              type="button"
              className={`btn-access ${fontSize === "xlarge" ? "active" : ""}`}
              onClick={() => setFontSize("xlarge")}
              title="Очень крупный шрифт (24px)"
              style={{ fontSize: "15px" }}
            >
              А+ (24px)
            </button>
            <button
              type="button"
              className={`btn-access ${fontSize === "huge" ? "active" : ""}`}
              onClick={() => setFontSize("huge")}
              title="Огромный шрифт (28px)"
              style={{ fontSize: "17px" }}
            >
              А++ (28px)
            </button>
          </Col>

          {/* Цветовая схема */}
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <span className="me-1 text-warning fw-bold">Цвета:</span>
            <button
              type="button"
              className={`color-btn color-btn-wb ${
                colorScheme === "white-black" ? "active" : ""
              }`}
              onClick={() => setColorScheme("white-black")}
              title="Черным по белому"
            >
              Ц
            </button>
            <button
              type="button"
              className={`color-btn color-btn-bw ${
                colorScheme === "black-white" ? "active" : ""
              }`}
              onClick={() => setColorScheme("black-white")}
              title="Белым по черному"
            >
              Ц
            </button>
            <button
              type="button"
              className={`color-btn color-btn-bc ${
                colorScheme === "blue-cyan" ? "active" : ""
              }`}
              onClick={() => setColorScheme("blue-cyan")}
              title="Темно-синим по голубому"
            >
              Ц
            </button>
            <button
              type="button"
              className={`color-btn color-btn-bb ${
                colorScheme === "brown-beige" ? "active" : ""
              }`}
              onClick={() => setColorScheme("brown-beige")}
              title="Коричневым по бежевому"
            >
              Ц
            </button>
          </Col>

          {/* Изображения */}
          <Col xs="auto" className="d-flex align-items-center gap-1">
            <span className="me-2 text-warning fw-bold">Изображения:</span>
            <button
              type="button"
              className={`btn-access ${!hideImages ? "active" : ""}`}
              onClick={() => setHideImages(false)}
              title="Включить изображения"
            >
              <ImageIcon size={14} className="me-1 accessibility-icon" /> Вкл
            </button>
            <button
              type="button"
              className={`btn-access ${hideImages ? "active" : ""}`}
              onClick={() => setHideImages(true)}
              title="Отключить изображения"
            >
              <ImageOff size={14} className="me-1 accessibility-icon" /> Выкл
            </button>
          </Col>

          {/* Интервал между буквами (Кернинг) */}
          <Col xs="auto" className="d-flex align-items-center gap-1">
            <span className="me-2 text-warning fw-bold">Интервал:</span>
            <button
              type="button"
              className={`btn-access ${letterSpacing === "normal" ? "active" : ""}`}
              onClick={() => setLetterSpacing("normal")}
              title="Стандартный интервал"
            >
              Стандарт
            </button>
            <button
              type="button"
              className={`btn-access ${letterSpacing === "medium" ? "active" : ""}`}
              onClick={() => setLetterSpacing("medium")}
              title="Средний интервал"
            >
              Средний
            </button>
            <button
              type="button"
              className={`btn-access ${letterSpacing === "large" ? "active" : ""}`}
              onClick={() => setLetterSpacing("large")}
              title="Большой интервал"
            >
              Большой
            </button>
          </Col>

          {/* Синтез речи / Озвучка */}
          <Col xs="auto" className="d-flex align-items-center gap-1">
            <button
              type="button"
              className={`btn-access ${speechEnabled ? "active" : ""}`}
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title={
                speechEnabled
                  ? "Озвучивание включено (выделите текст для чтения)"
                  : "Включить чтение выделенного текста голосом"
              }
            >
              {speechEnabled ? (
                <>
                  <Volume2 size={14} className="me-1 accessibility-icon text-success" />
                  Голос (Вкл)
                </>
              ) : (
                <>
                  <VolumeX size={14} className="me-1 accessibility-icon" />
                  Голос
                </>
              )}
            </button>
          </Col>

          {/* Сброс и Выход */}
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn-access"
              onClick={resetSettings}
              title="Сбросить настройки к стандартным"
            >
              <RotateCcw size={14} className="me-1 accessibility-icon" /> Сброс
            </button>
            <button
              type="button"
              className="btn-access bg-danger border-danger text-white fw-bold"
              onClick={toggleAccessible}
              title="Выйти из режима для слабовидящих"
            >
              <EyeOff size={14} className="me-1 accessibility-icon" /> Обычная версия
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AccessibilityBar;
