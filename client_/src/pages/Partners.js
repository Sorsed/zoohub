import { useState } from "react";
import { Card, Button, Row, Col, Badge, Tab, Tabs } from "react-bootstrap";
import { MapPin, Phone, Globe, Star, Users, Clock, Heart } from "lucide-react";

const Partners = () => {
  const shelters = [
    {
      id: 1,
      name: 'Приют "Добрые руки"',
      logo: "🏠",
      description:
        "Помогаем бездомным животным найти дом с 2015 года. Наша миссия — дать каждому питомцу шанс на счастливую жизнь.",
      address: "ул. Добрая, 15, Москва",
      phone: "+7 (495) 123-45-67",
      website: "dobrye-ruki.ru",
      rating: 4.9,
      animals: 234,
      workingHours: "Пн-Вс: 9:00-18:00",
      specialization: ["Собаки", "Кошки"],
    },
    {
      id: 2,
      name: 'Центр "Четыре лапы"',
      logo: "🐾",
      description:
        "Специализируемся на реабилитации животных после травм и серьезных заболеваний.",
      address: "пр. Ветеринарный, 8, Екатеринбург",
      phone: "+7 (343) 234-56-78",
      website: "four-paws.ru",
      rating: 4.9,
      animals: 89,
      workingHours: "Пн-Пт: 8:00-20:00",
      specialization: ["Реабилитация", "Экзотические животные"],
    },
    {
      id: 3,
      name: 'Приют "Верность"',
      logo: "❤️",
      description:
        "Более 20 лет заботимся о бездомных животных Новосибирска и области.",
      address: "ул. Забота, 42, Новосибирск",
      phone: "+7 (383) 345-67-89",
      website: "vernost-nsk.ru",
      rating: 4.7,
      animals: 167,
      workingHours: "Пн-Вс: 10:00-17:00",
      specialization: ["Собаки крупных пород", "Социализация"],
    },
    {
      id: 4,
      name: 'Фонд "Хвостики"',
      logo: "🌟",
      description:
        "Благотворительный фонд, занимающийся спасением и пристройством животных.",
      address: "ул. Спасательная, 7, Ростов-на-Дону",
      phone: "+7 (863) 456-78-90",
      website: "hvostiki-fond.ru",
      rating: 4.9,
      animals: 145,
      workingHours: "Пн-Сб: 9:00-19:00",
      specialization: ["Котята", "Щенки"],
    },
  ];

  const clinics = [
    {
      id: 1,
      name: 'Ветклиника "Айболит"',
      logo: "🏥",
      description: "Полный спектр ветеринарных услуг. Экстренная помощь 24/7.",
      address: "пр. Здоровья, 12, Санкт-Петербург",
      phone: "+7 (812) 567-89-01",
      website: "aibolit-spb.ru",
      rating: 4.8,
      patients: 156,
      workingHours: "Круглосуточно",
      specialization: ["Экстренная помощь", "Хирургия"],
      discount: "Скидка 15% по нашему направлению",
    },
    {
      id: 2,
      name: 'Клиника "ВетМир"',
      logo: "🏥",
      description:
        "Современная ветеринарная клиника с собственной лабораторией.",
      address: "ул. Лечебная, 25, Казань",
      phone: "+7 (843) 678-90-12",
      website: "vetmir-kazan.ru",
      rating: 4.8,
      patients: 203,
      workingHours: "Пн-Вс: 8:00-22:00",
      specialization: ["Стерилизация", "Вакцинация", "Диагностика"],
      discount: "Бесплатные консультации для наших подопечных",
    },
    {
      id: 3,
      name: 'Ветцентр "Здоровые лапки"',
      logo: "🏥",
      description:
        "Специализируемся на лечении и профилактике заболеваний мелких животных.",
      address: "бул. Ветеринарный, 18, Краснодар",
      phone: "+7 (861) 789-01-23",
      website: "healthy-paws.ru",
      rating: 4.6,
      patients: 134,
      workingHours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
      specialization: ["Дерматология", "Кардиология"],
      discount: "Скидка 20% на профилактические процедуры",
    },
  ];

  return (
    <div>
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Партнеры, которые помогают нам спасать жизни
          </h1>
          <p className="text-muted">
            Проверенные приюты и ветеринарные клиники, которые разделяют нашу
            миссию и помогают животным обрести дом и здоровье.
          </p>
        </div>

        <Tabs
          defaultActiveKey="shelters"
          id="partners-tabs"
          className="mb-4 justify-content-center"
        >
          <Tab eventKey="shelters" title="Приюты">
            <Row>
              {shelters.map((shelter) => (
                <Col md={6} className="mb-4" key={shelter.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <span className="fs-3 me-2">{shelter.logo}</span>
                          <div>
                            <h5>{shelter.name}</h5>
                            <div className="d-flex align-items-center">
                              <Star size={14} className="text-warning me-1" />
                              <span className="small">{shelter.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge bg="secondary">Партнер</Badge>
                      </div>
                      <p className="small text-muted">{shelter.description}</p>
                      <div className="small text-muted mb-2">
                        <MapPin size={14} className="me-1" /> {shelter.address}
                      </div>
                      <div className="small text-muted mb-2">
                        <Phone size={14} className="me-1" /> {shelter.phone}
                      </div>
                      <div className="small text-muted mb-2">
                        <Globe size={14} className="me-1" /> {shelter.website}
                      </div>
                      <div className="small text-muted mb-2">
                        <Clock size={14} className="me-1" />{" "}
                        {shelter.workingHours}
                      </div>
                      <div className="mb-2">
                        {shelter.specialization.map((spec, idx) => (
                          <Badge
                            key={idx}
                            bg="outline-secondary"
                            className="me-1"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center text-muted">
                          <Users size={14} className="me-1" /> {shelter.animals}{" "}
                          животных
                        </div>
                        <Button variant="outline-primary" size="sm">
                          Показать на карте
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>

          <Tab eventKey="clinics" title="Ветеринарные клиники">
            <Row>
              {clinics.map((clinic) => (
                <Col md={6} className="mb-4" key={clinic.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <span className="fs-3 me-2">{clinic.logo}</span>
                          <div>
                            <h5>{clinic.name}</h5>
                            <div className="d-flex align-items-center">
                              <Star size={14} className="text-warning me-1" />
                              <span className="small">{clinic.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge bg="success">Партнер</Badge>
                      </div>
                      <p className="small text-muted">{clinic.description}</p>
                      <div className="small text-muted mb-2">
                        <MapPin size={14} className="me-1" /> {clinic.address}
                      </div>
                      <div className="small text-muted mb-2">
                        <Phone size={14} className="me-1" /> {clinic.phone}
                      </div>
                      <div className="small text-muted mb-2">
                        <Globe size={14} className="me-1" /> {clinic.website}
                      </div>
                      <div className="small text-muted mb-2">
                        <Clock size={14} className="me-1" />{" "}
                        {clinic.workingHours}
                      </div>
                      <div className="mb-2">
                        {clinic.specialization.map((spec, idx) => (
                          <Badge
                            key={idx}
                            bg="outline-secondary"
                            className="me-1"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      {clinic.discount && (
                        <div className="bg-light p-2 rounded mb-2 d-flex align-items-center">
                          <Heart size={16} className="text-primary me-1" />
                          <span className="small">{clinic.discount}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center text-muted">
                          <Users size={14} className="me-1" /> {clinic.patients}{" "}
                          пациентов
                        </div>
                        <Button variant="outline-primary" size="sm">
                          Показать на карте
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>

        {/* CTA */}
        <Card className="text-center mt-5 shadow-sm">
          <Card.Body>
            <h3 className="fw-bold mb-3">Хотите стать партнером?</h3>
            <p className="text-muted mb-4">
              Присоединяйтесь к нашей сети проверенных организаций и помогите
              большему количеству животных найти дом.
            </p>
            <Row className="justify-content-center mb-3">
              <Col xs={6} md={2} className="mb-2">
                <div className="bg-light rounded p-3">
                  <div className="fs-4 text-primary fw-bold">500+</div>
                  <div className="small text-muted">Заявок в месяц</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="mb-2">
                <div className="bg-light rounded p-3">
                  <div className="fs-4 text-primary fw-bold">95%</div>
                  <div className="small text-muted">Успешных усыновлений</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="mb-2">
                <div className="bg-light rounded p-3">
                  <div className="fs-4 text-primary fw-bold">24/7</div>
                  <div className="small text-muted">Поддержка партнеров</div>
                </div>
              </Col>
            </Row>
            <Button variant="primary" size="lg">
              Стать партнером
            </Button>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
};

export default Partners;
