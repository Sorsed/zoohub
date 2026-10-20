import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Badge, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
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
  CheckCircle,
} from "lucide-react";
import { fetchShelters } from "../http/shelterAPI";
import { OTHER_PROFILE_PAGE_ROUTE, LOGIN_ROUTE } from "../utils/consts";

const Help = () => {
  const [shelters, setShelters] = useState([]);
  const navigate = useNavigate();

  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'volunteer' | 'foster' | 'donate' | null
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchShelters().then((data) => {
      if (data) setShelters(data);
    });
  }, []);

  const helpOptions = [
    {
      id: "volunteer",
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
      requirements: "Любовь к животным, ответственность и готовность помогать",
      details:
        "Волонтёры — главная сила приютов. Вы можете приходить в удобные для вас дни для социализации собак и кошек, фотосъемки подопечных для сайта или транспортировки к ветеринару.",
    },
    {
      id: "foster",
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
      requirements: "Опыт с животными приветствуется, согласие всех членов семьи",
      details:
        "Передержка спасает жизни, когда в приютах нет свободных теплых мест или когда животное проходит курс реабилитации после травмы. Корм и медикаменты обычно предоставляются куратором.",
    },
    {
      id: "donate",
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
      details:
        "Все средства направляются на оплату дорогостоящих операций, вакцин, закупку кормов и оплату отопления вольеров в зимнее время. Вы можете помочь напрямую любому приюту из списка ниже.",
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

  const handleOpenOption = (option) => {
    setSelectedOption(option);
    setActiveModal("option");
  };

  return (
    <section className="py-5 bg-light">
      <main className="container py-4">
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
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <option.icon className="me-2 text-primary" size={28} />
                    <h5 className="mb-0 fw-bold">{option.title}</h5>
                  </div>
                  <p className="text-muted">{option.description}</p>
                  <h6 className="fw-semibold mt-3">Что можно делать:</h6>
                  <ul className="small text-muted mb-3">
                    {option.activities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                  <p className="small mb-1">
                    <Clock size={14} className="me-1 text-warning" /> {option.time}
                  </p>
                  <p className="small text-muted">
                    <Heart size={14} className="me-1 text-danger" /> {option.requirements}
                  </p>
                  <div className="mt-auto pt-3">
                    <Button
                      variant="outline-primary"
                      className="w-100 fw-semibold"
                      onClick={() => handleOpenOption(option)}
                    >
                      Узнать больше
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Часто нужны */}
        <Card className="mb-5 shadow-sm border-0 rounded-4 p-3">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <Gift className="me-2 text-warning" size={28} />
              <h4 className="mb-0 fw-bold">Часто нужны</h4>
            </div>
            <Row>
              {urgentNeeds.map((need, i) => (
                <Col sm={6} lg={3} className="mb-3" key={i}>
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                    <span className="fw-medium">
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
              <Card className="shadow-sm flex-fill d-flex flex-column h-100 border-0 rounded-4">
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: "1.75rem" }} className="me-2">
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
                        <h5 className="mb-0 fw-bold text-dark">{shelter.user_name}</h5>
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
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "4rem",
                    }}
                  >
                    {shelter.user_shelter_description ||
                      "Описание приюта пока отсутствует."}
                  </div>

                  <div className="mt-auto">
                    <p className="small mb-1 text-muted">
                      <Phone size={14} className="me-1" />
                      {shelter.user_phone ? (
                        <a href={`tel:${shelter.user_phone}`} className="text-muted text-decoration-none">
                          {shelter.user_phone}
                        </a>
                      ) : (
                        "Телефон не указан"
                      )}
                    </p>
                    <p className="small mb-3 text-muted">
                      <Mail size={14} className="me-1" />
                      {shelter.user_email ? (
                        <a href={`mailto:${shelter.user_email}`} className="text-muted text-decoration-none">
                          {shelter.user_email}
                        </a>
                      ) : (
                        "Email не указан"
                      )}
                    </p>

                    <Link
                      to={`${OTHER_PROFILE_PAGE_ROUTE}/${shelter.user_id}`}
                      className="btn btn-outline-primary w-100 fw-semibold"
                    >
                      Перейти в профиль <ArrowRight size={16} className="ms-2" />
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <Card className="text-center shadow-sm border-0 rounded-4 p-4 p-md-5">
          <Card.Body>
            <h3 className="fw-bold mb-3">Готовы помочь?</h3>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
              Свяжитесь с нами или зарегистрируйтесь как волонтёр, и мы поможем
              выбрать наиболее подходящий для вас способ помощи животным.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button
                variant="warning"
                className="fw-semibold px-4 py-2"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Стать волонтером
              </Button>
              <Button
                variant="outline-primary"
                className="fw-semibold px-4 py-2"
                onClick={() => setActiveModal("donateInfo")}
              >
                Сделать пожертвование
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Modal: Подробности варианта помощи */}
        <Modal
          show={activeModal === "option"}
          onHide={() => setActiveModal(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{selectedOption?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-3">{selectedOption?.details}</p>
            <h6 className="fw-bold mb-2">Направления помощи:</h6>
            <ul className="small text-muted mb-3">
              {selectedOption?.activities.map((act, i) => (
                <li key={i} className="mb-1">
                  <CheckCircle size={14} className="me-1 text-success" /> {act}
                </li>
              ))}
            </ul>
            <div className="p-3 bg-light rounded-3 small">
              <strong>Требования:</strong> {selectedOption?.requirements}
              <br />
              <strong>Занятость:</strong> {selectedOption?.time}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Закрыть
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                setActiveModal(null);
                navigate(LOGIN_ROUTE);
              }}
            >
              Присоединиться к проекту
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal: Реквизиты и пожертвования */}
        <Modal
          show={activeModal === "donateInfo"}
          onHide={() => setActiveModal(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Финансовая поддержка</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ZooHub — некоммерческий сервис. Мы не принимаем прямые платежи на
              свой баланс, но рекомендуем направлять адресную помощь
              непосредственно проверенным приютам-партнёрам.
            </p>
            <h6 className="fw-bold mb-2">Как помочь приюту:</h6>
            <ol className="small text-muted">
              <li>Выберите приют из списка партнёров на странице выше.</li>
              <li>Свяжитесь с куратором по указанному телефону или почте.</li>
              <li>
                Уточните, какой сбор сейчас открыт (лекарства, корм или оплата
                счетов в клинике).
              </li>
            </ol>
            <div className="alert alert-info py-2 px-3 small mb-0">
              По общим вопросам сотрудничества: <strong>help@pethelp.ru</strong>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Понятно
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </section>
  );
};

export default Help;
