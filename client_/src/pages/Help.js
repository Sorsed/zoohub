import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

import {
  Heart,
  Home,
  DollarSign,
  Users,
  Clock,
  MapPin,
  Gift,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchShelters } from "../http/shelterAPI"; // 👈 импорт из partners
import { OTHER_PROFILE_PAGE_ROUTE } from "../utils/consts";
const Help = () => {
  const [shelters, setShelters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShelters().then((data) => {
      if (data) setShelters(data);
    });
  }, []);

  const helpOptions = [
    {
      icon: Users,
      title: "Волонтерство",
      description:
        "Помогайте в приютах, участвуйте в мероприятиях по пристройству животных",
      activities: [
        "Выгул собак",
        "Уборка вольеров",
        "Фотосессии питомцев",
        "Помощь на выставках",
      ],
      time: "От 2 часов в неделю",
      requirements: "Любовь к животным",
    },
    {
      icon: Home,
      title: "Передержка",
      description:
        "Временно приютите животное у себя дома до поиска постоянной семьи",
      activities: [
        "Домашний уход",
        "Социализация",
        "Подготовка к новому дому",
        "Показ потенциальным хозяевам",
      ],
      time: "От 2 недель до 6 месяцев",
      requirements: "Опыт с животными приветствуется",
    },
    {
      icon: DollarSign,
      title: "Финансовая помощь",
      description: "Поддержите работу приютов и оплату ветеринарных услуг",
      activities: [
        "Разовые пожертвования",
        "Ежемесячная поддержка",
        "Оплата лечения",
        "Спонсорство мероприятий",
      ],
      time: "Разово или регулярно",
      requirements: "Любая сумма важна",
    },
  ];

  const urgentNeeds = [
    { item: "Корм для собак", priority: "Высокий", icon: "🥫" },
    { item: "Корм для кошек", priority: "Высокий", icon: "🐱" },
    { item: "Ветеринарные препараты", priority: "Критический", icon: "💊" },
    { item: "Одеяла и подстилки", priority: "Средний", icon: "🛏️" },
    { item: "Игрушки", priority: "Низкий", icon: "🎾" },
    { item: "Переноски", priority: "Высокий", icon: "🧳" },
    { item: "Поводки и ошейники", priority: "Средний", icon: "🦮" },
    { item: "Лотки и наполнители", priority: "Высокий", icon: "📦" },
  ];

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Критический":
        return "danger";
      case "Высокий":
        return "warning";
      case "Средний":
        return "info";
      case "Низкий":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <section className="py-5 bg-light">
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Хочу помочь</h1>
          <p className="text-muted">
            Есть много способов помочь бездомным животным. Выберите тот, который
            подходит именно вам.
          </p>
        </div>

        {/* Варианты помощи */}
        <Row className="mb-5">
          {helpOptions.map((option, index) => (
            <Col md={4} key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <option.icon className="me-2 text-primary" />
                    <h5 className="mb-0">{option.title}</h5>
                  </div>
                  <p className="text-muted">{option.description}</p>
                  <h6 className="fw-semibold mt-3">Что можно делать:</h6>
                  <ul className="small text-muted">
                    {option.activities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                  <p className="small mb-1">
                    <Clock size={14} className="me-1" /> {option.time}
                  </p>
                  <p className="small">
                    <Heart size={14} className="me-1" /> {option.requirements}
                  </p>
                  <Button variant="primary" className="w-100">
                    Узнать больше
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Часто нужны */}
        <Card className="mb-5 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <Gift className="me-2 text-primary" />
              <h4 className="mb-0">Часто нужны</h4>
            </div>
            <Row>
              {urgentNeeds.map((need, i) => (
                <Col sm={6} lg={3} className="mb-3" key={i}>
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                    <span>
                      {need.icon} {need.item}
                    </span>
                    <Badge bg={getPriorityVariant(need.priority)}>
                      {need.priority}
                    </Badge>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Партнёрские приюты (из БД) */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Приютам и клиникам тоже нужна поддержка</h2>
          <p className="text-muted">
            Наши партнеры ежедневно спасают животных и нуждаются в вашей помощи.
            Узнайте, что конкретно нужно каждому приюту прямо сейчас.
          </p>
        </div>

        <Row className="mb-5">
          {shelters.map((shelter) => (
            <Col md={6} key={shelter.user_id} className="mb-4 d-flex">
              <Card className="shadow-sm flex-fill d-flex flex-column h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: "1.5rem" }} className="me-2">
                      🏠
                    </span>
                    <div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `${OTHER_PROFILE_PAGE_ROUTE}/${shelter.user_id}`
                          )
                        }
                      >
                        <h5 className="mb-0">{shelter.user_name}</h5>
                      </div>
                      <div className="small text-muted">
                        <MapPin size={14} className="me-1" />
                        {shelter.user_shelter_address || "Адрес не указан"}
                      </div>
                    </div>
                  </div>

                  {/* Описание */}
                  <div
                    className="small text-muted flex-grow-1 mb-3"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "5rem",
                    }}
                  >
                    {shelter.user_shelter_description ||
                      "Описание приюта пока отсутствует."}
                  </div>

                  <div className="mt-auto">
                    <p className="small mb-1">
                      <Phone size={14} className="me-1" />
                      {shelter.user_phone || "Телефон не указан"}
                    </p>
                    <p className="small mb-3">
                      <Mail size={14} className="me-1" />
                      {shelter.user_email || "Email не указан"}
                    </p>

                    <Link
                      to={`/partner/${shelter.user_id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      Узнать больше <ArrowRight size={16} className="ms-2" />
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <Card className="text-center shadow-sm">
          <Card.Body>
            <h3 className="fw-bold mb-3">Готовы помочь?</h3>
            <p className="text-muted mb-4">
              Свяжитесь с нами, и мы поможем выбрать наиболее подходящий для вас
              способ помощи животным.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Button variant="warning">Стать волонтером</Button>
              <Button variant="outline-primary">Сделать пожертвование</Button>
            </div>
          </Card.Body>
        </Card>
      </main>
    </section>
  );
};

export default Help;
