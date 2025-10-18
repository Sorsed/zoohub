import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Carousel,
  ListGroup,
} from "react-bootstrap";
import {
  Calendar,
  Ruler,
  Heart,
  Share2,
  Home,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react";

const PetDetail = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const pet = {
    id: 1,
    name: "Мурка",
    breed: "Домашняя короткошерстная",
    age: "2 года",
    gender: "Женский",
    size: "Средний",
    weight: "4 кг",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    shelter: {
      id: 1,
      name: 'Приют "Добрые руки"',
      phone: "+7 (495) 123-45-67",
      address: "ул. Добрая, 15, Москва",
    },
    isUrgent: false,
    isVaccinated: true,
    isSterilized: true,
    attributes: [
      { icon: "🎾", label: "Игривая" },
      { icon: "👶", label: "Ладит с детьми" },
      { icon: "🏠", label: "Домашняя" },
      { icon: "❤️", label: "Ласковая" },
    ],
    description: `Мурка — невероятно ласковая и игривая кошечка...`,
    curator: {
      name: "Анна Петрова",
      phone: "+7 (903) 123-45-67",
      email: "anna.petrova@shelter.ru",
      workingHours: "Пн-Пт: 10:00-18:00",
    },
    rescueStory: `Мурка была найдена волонтерами...`,
    helpStages: [
      {
        stage: "Спасение",
        date: "15 октября 2023",
        description: "Найдена волонтерами",
        completed: true,
      },
      {
        stage: "Ветеринарная помощь",
        date: "16 октября 2023",
        description: "Вакцинация",
        completed: true,
      },
      {
        stage: "Реабилитация",
        date: "20 октября 2023",
        description: "Социализация",
        completed: true,
      },
      {
        stage: "Поиск дома",
        date: "Сейчас",
        description: "Ищем семью",
        completed: false,
      },
    ],
  };

  return (
    <section className="py-5 bg-light">
      <div>
        <Container className="py-4">
          <Link
            to="/find-pet"
            className="d-flex align-items-center mb-3 text-decoration-none"
          >
            <ChevronLeft className="me-2" /> Назад к каталогу
          </Link>

          <Row>
            {/* Слайдер изображений */}
            <Col lg={6} className="mb-3">
              <Carousel
                activeIndex={currentIndex}
                onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)}
              >
                {pet.images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`${pet.name} ${idx + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              {pet.isUrgent && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-0 m-3"
                >
                  Срочно
                </Badge>
              )}
            </Col>

            {/* Информация о питомце */}
            <Col lg={6}>
              <h2>{pet.name}</h2>
              <p className="text-muted">{pet.breed}</p>

              <p className="d-flex align-items-center">
                <Home className="me-2" /> Находится в:{" "}
                <Link to={`/partner/${pet.shelter.id}`} className="ms-1">
                  {pet.shelter.name}
                </Link>
              </p>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <Calendar className="me-2" /> Возраст: {pet.age}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Ruler className="me-2" /> Размер: {pet.size}
                </ListGroup.Item>
                <ListGroup.Item>Пол: {pet.gender}</ListGroup.Item>
                <ListGroup.Item>Вес: {pet.weight}</ListGroup.Item>
              </ListGroup>

              {/* Здоровье и атрибуты */}
              <div className="mb-3">
                {pet.isVaccinated && (
                  <Badge bg="success" className="me-2">
                    <Shield className="me-1" />
                    Привит
                  </Badge>
                )}
                {pet.isSterilized && (
                  <Badge bg="info">
                    <Award className="me-1" />
                    Стерилизован
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                {pet.attributes.map((attr, idx) => (
                  <Badge bg="secondary" className="me-2 mb-1" key={idx}>
                    {attr.icon} {attr.label}
                  </Badge>
                ))}
              </div>

              <div className="d-flex gap-2">
                <Button variant="primary" className="d-flex align-items-center">
                  <Heart className="me-2" /> Забрать домой
                </Button>
                <Button
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  <Share2 className="me-2" /> Поделиться
                </Button>
              </div>
            </Col>
          </Row>

          {/* Описание */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Описание</Card.Title>
              <Card.Text>{pet.description}</Card.Text>
            </Card.Body>
          </Card>

          {/* Контакты куратора */}
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Контакты куратора</Card.Title>
              <p>{pet.curator.name}</p>
              <p>
                <Phone className="me-2" /> {pet.curator.phone}
              </p>
              <p>
                <Mail className="me-2" /> {pet.curator.email}
              </p>
              <p>
                <strong>Часы работы:</strong> {pet.curator.workingHours}
              </p>
            </Card.Body>
          </Card>

          {/* История спасения и этапы помощи */}
          <Row className="mt-4">
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <Card.Title>История спасения</Card.Title>
                  <Card.Text>{pet.rescueStory}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Этапы помощи</Card.Title>
                  <ListGroup variant="flush">
                    {pet.helpStages.map((stage, idx) => (
                      <ListGroup.Item
                        key={idx}
                        className="d-flex align-items-center"
                      >
                        <CheckCircle
                          className={`me-2 ${
                            stage.completed ? "text-success" : "text-muted"
                          }`}
                        />
                        <div>
                          <div>
                            {stage.stage}{" "}
                            <small className="text-muted">{stage.date}</small>
                          </div>
                          <div className="text-muted">{stage.description}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default PetDetail;
