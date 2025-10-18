import React from "react";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5">
      <div className="container">
        <div className="row gy-4">
          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-2">
              <Heart className="me-2 text-danger" />
              <span className="h5 mb-0">ZooHub</span>
            </div>
            <p className="text-secondary">
              Помогаем бездомным животным найти любящие семьи по всей России.
              Каждая жизнь важна.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">
                <Facebook />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <Twitter />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-lg-3 col-md-6">
            <h6>Быстрые ссылки</h6>
            <ul className="list-unstyled">
              {[
                "Найти питомца",
                "Истории успеха",
                "Как помочь",
                "Волонтерство",
                "Партнеры",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-secondary text-decoration-none">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-lg-3 col-md-6">
            <h6>Контакты</h6>
            <p>
              <Phone className="me-2" /> 8 (800) 555-0123
            </p>
            <p>
              <Mail className="me-2" /> help@pethelp.ru
            </p>
            <p>
              <MapPin className="me-2" /> Москва, Россия
            </p>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6>Новости проекта</h6>
            <p className="text-secondary small">
              Подпишитесь на рассылку и узнавайте о новых питомцах первыми.
            </p>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Ваш email"
              />
              <button className="btn btn-warning">Подписаться</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top border-secondary py-3 mt-3 small text-secondary">
          <p className="mb-2 mb-md-0">© 2025 ZooHub. Все права защищены.</p>
          <div className="d-flex gap-3">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
            <a href="#">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
