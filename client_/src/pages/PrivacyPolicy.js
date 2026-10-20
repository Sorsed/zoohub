import React, { useEffect } from "react";
import { Container, Card, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Shield, Lock, FileText, CheckCircle, Mail } from "lucide-react";
import { SHOP_ROUTE } from "../utils/consts";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
            Главная
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Политика конфиденциальности</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5">
          <div className="text-center mb-5">
            <div
              className="bg-warning bg-opacity-25 text-warning rounded-circle d-inline-flex p-3 mb-3"
              style={{ width: "70px", height: "70px", alignItems: "center", justifyContent: "center" }}
            >
              <Shield size={36} className="text-dark" />
            </div>
            <h1 className="fw-bold">Политика конфиденциальности</h1>
            <p className="text-muted">
              Редакция от 19 октября 2026 года • Сервис помощи бездомным животным ZooHub
            </p>
          </div>

          <div className="content-body" style={{ lineHeight: "1.8", color: "#333" }}>
            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <FileText size={20} className="me-2 text-warning" />
                1. Общие положения
              </h4>
              <p>
                Настоящая Политика конфиденциальности персональных данных (далее —
                «Политика») действует в отношении всей информации, которую платформа{" "}
                <strong>ZooHub</strong> (далее — «Сервис») может получить о пользователе во время
                использования сайта, сервисов, программ и продуктов ZooHub.
              </p>
              <p>
                Использование сервиса ZooHub означает безоговорочное согласие пользователя с
                настоящей Политикой и указанными в ней условиями обработки его персональной
                информации. В случае несогласия с этими условиями пользователь должен воздержаться от
                использования сайта.
              </p>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <Lock size={20} className="me-2 text-warning" />
                2. Состав собираемых персональных данных
              </h4>
              <p>
                В рамках использования Сервиса пользователь предоставляет о себе следующие данные:
              </p>
              <ul>
                <li>
                  <strong>Для физических лиц и волонтёров:</strong> имя, фамилия, адрес электронной
                  почты, контактный номер телефона, город проживания, фото профиля (аватар).
                </li>
                <li>
                  <strong>Для приютов и организаций:</strong> название организации/приюта, контактный
                  телефон, официальный email, физический адрес местонахождения, ссылка на сайт,
                  описание деятельности и координаты на карте.
                </li>
                <li>
                  <strong>Данные об объявлениях:</strong> клички животных, описания, фотографии,
                  медицинские этапы (прививки, стерилизация), а также контакты кураторов.
                </li>
                <li>
                  <strong>Технические данные:</strong> файлы Cookie, IP-адрес, тип браузера, время
                  доступа и посещенные страницы.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <CheckCircle size={20} className="me-2 text-warning" />
                3. Цели обработки персональных данных
              </h4>
              <p>ZooHub собирает и хранит только те данные, которые необходимы для:</p>
              <ul>
                <li>
                  Создания учётной записи пользователя, авторизации и предоставления доступа к личному
                  кабинету.
                </li>
                <li>
                  Публикации объявлений о поиске дома, передержке или пропаже животных.
                </li>
                <li>
                  Обеспечения прямой связи между потенциальными усыновителями, волонтёрами и
                  приютами.
                </li>
                <li>
                  Отображения приютов и ветеринарных клиник на интерактивной карте города.
                </li>
                <li>
                  Отправки уведомлений о статусе объявлений и новостной рассылки проекта (при
                  добровольном согласии).
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <Shield size={20} className="me-2 text-warning" />
                4. Защита и безопасность данных
              </h4>
              <p>
                Сервис принимает все необходимые организационные и технические меры для защиты
                персональной информации пользователей от неправомерного или случайного доступа,
                уничтожения, изменения, блокирования, копирования, распространения, а также от иных
                неправомерных действий третьих лиц:
              </p>
              <ul>
                <li>Пароли пользователей хранятся исключительно в зашифрованном виде (хэширование bcrypt).</li>
                <li>Сессии пользователей защищены защищенными cookie-файлами с ограниченным временем жизни.</li>
                <li>Мы никогда не продаем и не передаем ваши персональные данные рекламным сетям.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <FileText size={20} className="me-2 text-warning" />
                5. Использование файлов Cookie
              </h4>
              <p>
                ZooHub использует файлы cookie для поддержания сессии авторизованного пользователя,
                сохранения настроек интерфейса и базовой аналитики посещаемости. Вы можете отключить
                сохранение cookie в настройках своего браузера, однако в этом случае авторизация на
                сайте может работать некорректно.
              </p>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <Mail size={20} className="me-2 text-warning" />
                6. Контакты и отзыв согласия
              </h4>
              <p>
                Пользователь вправе в любой момент отредактировать свои данные в Личном кабинете или
                потребовать полного удаления своей учётной записи и всех связанных объявлений.
              </p>
              <p>
                По всем вопросам, связанным с обработкой персональных данных, обращайтесь в службу
                поддержки проекта ZooHub по адресу:{" "}
                <a href="mailto:help@pethelp.ru" className="text-warning fw-bold text-decoration-none">
                  help@pethelp.ru
                </a>{" "}
                или по телефону горячей линии:{" "}
                <span className="fw-semibold">8 (800) 555-0123</span>.
              </p>
            </section>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
