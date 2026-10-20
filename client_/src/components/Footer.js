import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "react-toastify";
import {
  FIND_PET_ROUTE,
  STORIES_ROUTE,
  HELP_ROUTE,
  PARTNERS_ROUTE,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
} from "../utils/consts";
import { useAccessibility } from "../context/AccessibilityContext";

const Footer = () => {
  const { toggleAccessible } = useAccessibility();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Пожалуйста, введите корректный адрес электронной почты");
      return;
    }
    toast.success("Спасибо за подписку! Мы будем делиться с вами важными новостями и историями питомцев.");
    setEmail("");
  };

  const quickLinks = [
    { label: "Найти питомца", to: FIND_PET_ROUTE },
    { label: "Истории успеха", to: STORIES_ROUTE },
    { label: "Как помочь", to: HELP_ROUTE },
    { label: "Волонтерство", to: HELP_ROUTE },
    { label: "Партнеры и приюты", to: PARTNERS_ROUTE },
  ];

  return (
    <footer className="bg-dark text-light pt-5">
      <div className="container">
        <div className="row gy-4">
          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-2">
              <Heart className="me-2 text-danger" fill="currentColor" />
              <span className="h5 mb-0 fw-bold">ZooHub</span>
            </div>
            <p className="text-secondary small">
              Помогаем бездомным животным найти любящие семьи по всей России.
              Каждая спасённая жизнь бесценна.
            </p>
            <div className="d-flex gap-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
                title="Telegram"
              >
                <Send size={16} />
              </a>
              <a
                href="mailto:help@pethelp.ru"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
                title="Написать нам"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-white">Быстрые ссылки</h6>
            <ul className="list-unstyled">
              {quickLinks.map((item) => (
                <li key={item.label} className="mb-2">
                  <Link
                    to={item.to}
                    className="text-secondary text-decoration-none hover-light"
                    style={{ transition: "color 0.2s" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-white">Контакты</h6>
            <p className="text-secondary small mb-2 d-flex align-items-center">
              <Phone size={16} className="me-2 text-warning flex-shrink-0" />
              <a href="tel:88005550123" className="text-secondary text-decoration-none">
                8 (800) 555-0123
              </a>
            </p>
            <p className="text-secondary small mb-2 d-flex align-items-center">
              <Mail size={16} className="me-2 text-warning flex-shrink-0" />
              <a href="mailto:help@pethelp.ru" className="text-secondary text-decoration-none">
                help@pethelp.ru
              </a>
            </p>
            <p className="text-secondary small mb-2 d-flex align-items-center">
              <MapPin size={16} className="me-2 text-warning flex-shrink-0" />
              <span>г. Самара / Москва, Россия</span>
            </p>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-white">Новости проекта</h6>
            <p className="text-secondary small">
              Подпишитесь на рассылку и узнавайте о новых подопечных и счастливых историях первыми.
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-warning fw-semibold">
                  Подписаться
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top border-secondary py-3 mt-4 small text-secondary">
          <p className="mb-2 mb-md-0">© 2026 ZooHub. Все права защищены.</p>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            <button
              type="button"
              onClick={toggleAccessible}
              className="btn btn-link text-warning text-decoration-none p-0 small fw-bold d-flex align-items-center"
            >
              👓 Версия для слабовидящих
            </button>
            <Link to={PRIVACY_ROUTE} className="text-secondary text-decoration-none">
              Политика конфиденциальности
            </Link>
            <Link to={TERMS_ROUTE} className="text-secondary text-decoration-none">
              Условия использования
            </Link>
            <Link to={PRIVACY_ROUTE} className="text-secondary text-decoration-none">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
