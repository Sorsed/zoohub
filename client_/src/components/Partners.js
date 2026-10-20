import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tabs, Tab, Image, Badge, Button } from "react-bootstrap";
import { MapPin, Phone, Mail } from "lucide-react";
import { YMaps, Map, Placemark, Clusterer } from "react-yandex-maps";
import { fetchShelters } from "../http/shelterAPI";
import { fetchVolunteers } from "../http/userAPI";
import { OTHER_PROFILE_PAGE_ROUTE } from "../utils/consts";
import defaultAvatar from "../assets/defaultAvatar.png";

const Partners = () => {
  const [shelters, setShelters] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchShelters().then((data) => {
      if (data) setShelters(data);
    });
    fetchVolunteers().then((data) => {
      if (data) setVolunteers(data);
    });
  }, []);

  const center = [53.1959, 50.1]; // Самара

  // Ветклиники
  const vetClinics = [
    {
      id: 1,
      name: "Ветклиника «Лапа и Хвост»",
      address: "Самара, ул. Молодогвардейская, 150 ",
      phone: "+7 (846) 123-45-67",
      email: "info@lapahvost.ru",
      coords: [53.2039, 50.15],
      description:
        "Современная клиника с профессиональной командой ветеринаров и современным оборудованием.",
      operations: [
        "Вакцинация — от 800 ₽",
        "Кастрация кота — от 2500 ₽",
        "Стерилизация кошки — от 3500 ₽",
      ],
    },
    {
      id: 2,
      name: "Ветеринарный центр «Доктор Кот»",
      address: "Самара, ул. Советской Армии, 180 ",
      phone: "+7 (846) 765-43-21",
      email: "clinic@drkot.ru",
      coords: [53.185, 50.09],
      description:
        "Опытные врачи, круглосуточный приём и диагностическое оборудование нового поколения.",
      operations: [
        "Консультация — от 700 ₽",
        "Удаление зубного камня — от 1500 ₽",
        "УЗИ брюшной полости — от 1200 ₽",
      ],
    },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">
          Партнеры, которые помогают нам спасать жизни
        </h1>
        <p className="text-muted">
          Проверенные приюты, которые разделяют нашу миссию и помогают животным
          обрести дом.
        </p>
      </div>

      <Tabs
        defaultActiveKey="shelters"
        id="partners-tabs"
        className="mb-4 justify-content-center"
      >
        {/* --- ПРИЮТЫ --- */}
        <Tab eventKey="shelters" title="Приюты">
          <Row>
            {shelters.map((shelter) => (
              <Col md={6} className="mb-4" key={shelter.user_id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div
                      className="d-flex align-items-start justify-content-between mb-3"
                      style={{ minHeight: "70px" }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="fs-3 me-2">🏠</span>
                        <div>
                          <h5 className="mb-1 text-truncate">
                            <a
                              href={`${OTHER_PROFILE_PAGE_ROUTE}/${shelter.user_id}`}
                              className="text-decoration-none text-dark"
                            >
                              {shelter.user_name}
                            </a>
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div
                      className="small text-muted flex-grow-1 mb-3"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 7,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {shelter.user_shelter_description}
                    </div>

                    <div className="mt-auto">
                      <div className="small text-muted mb-2">
                        <MapPin size={14} className="me-1" />{" "}
                        {shelter.user_shelter_address}
                      </div>
                      <div className="small text-muted mb-2">
                        <Phone size={14} className="me-1" />{" "}
                        {shelter.user_phone || "не указан"}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Карта приютов в Самаре</h4>
              <YMaps
                query={{
                  lang: "ru_RU",
                  apikey: "bab39b62-df5b-4936-9596-c4a173c2e55b",
                }}
              >
                <Map state={{ center, zoom: 12 }} width="100%" height="500px">
                  <Clusterer
                    options={{
                      preset: "islands#invertedBlueClusterIcons",
                      groupByCoordinates: false,
                      clusterDisableClickZoom: false,
                      clusterOpenBalloonOnClick: true,
                    }}
                  >
                    {shelters.map((shelter) => (
                      <Placemark
                        key={shelter.user_id}
                        geometry={[
                          parseFloat(shelter.shelter_latitude),
                          parseFloat(shelter.shelter_longitude),
                        ]}
                        properties={{
                          balloonContentHeader: `<b>${shelter.user_name}</b>`,
                          balloonContentBody: `
                            <div><b>Телефон:</b> ${
                              shelter.user_phone || "не указан"
                            }</div>
                            <div><b>Адрес:</b> ${
                              shelter.user_shelter_address || "не указан"
                            }</div>
                            <div><b>Профиль:</b> 
                              <a href="${OTHER_PROFILE_PAGE_ROUTE}/${
                            shelter.user_id
                          }">
                                Перейти на страницу
                              </a>
                            </div>
                          `,
                        }}
                        options={{
                          preset: "islands#redIcon",
                          balloonCloseButton: true,
                          balloonPanelMaxMapArea: 0,
                        }}
                        modules={[
                          "geoObject.addon.balloon",
                          "geoObject.addon.hint",
                        ]}
                      />
                    ))}
                  </Clusterer>
                </Map>
              </YMaps>
            </Card.Body>
          </Card>
        </Tab>

        {/* --- ВЕТКЛИНИКИ --- */}
        <Tab eventKey="vetclinics" title="Ветклиники">
          <Row>
            {vetClinics.map((clinic) => (
              <Col md={6} className="mb-4" key={clinic.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <span className="fs-3 me-2">🐾</span>
                        <div>
                          <h5 className="mb-1">{clinic.name}</h5>
                        </div>
                      </div>
                    </div>

                    <div className="small text-muted flex-grow-1 mb-3">
                      {clinic.description}
                      <br />
                      <b>Популярные операции:</b>
                      <ul className="mb-2">
                        {clinic.operations.map((op, i) => (
                          <li key={i}>{op}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <div className="small text-muted mb-2">
                        <MapPin size={14} className="me-1" /> {clinic.address}
                      </div>
                      <div className="small text-muted mb-2">
                        <Phone size={14} className="me-1" /> {clinic.phone}
                      </div>
                      <div className="small text-muted mb-2">
                        <Mail size={14} className="me-1" /> {clinic.email}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Карта ветклиник в Самаре</h4>
              <YMaps
                query={{
                  lang: "ru_RU",
                  apikey: "bab39b62-df5b-4936-9596-c4a173c2e55b",
                }}
              >
                <Map state={{ center, zoom: 12 }} width="100%" height="500px">
                  {vetClinics.map((clinic) => (
                    <Placemark
                      key={clinic.id}
                      geometry={clinic.coords}
                      properties={{
                        balloonContentHeader: `<b>${clinic.name}</b>`,
                        balloonContentBody: `
                          <div><b>Адрес:</b> ${clinic.address}</div>
                          <div><b>Телефон:</b> ${clinic.phone}</div>
                          <div><b>Email:</b> ${clinic.email}</div>
                        `,
                      }}
                      options={{
                        preset: "islands#redIcon",
                        balloonCloseButton: true,
                      }}
                      modules={[
                        "geoObject.addon.balloon",
                        "geoObject.addon.hint",
                      ]}
                    />
                  ))}
                </Map>
              </YMaps>
            </Card.Body>
          </Card>
        </Tab>

        {/* --- ВОЛОНТЁРЫ --- */}
        <Tab eventKey="volunteers" title="Волонтёры">
          <div className="mb-4 text-center">
            <h3 className="fw-bold">Наши волонтёры</h3>
            <p className="text-muted">
              Неравнодушные люди, которые спасают животных, организуют передержки и помогают искать дом.
            </p>
          </div>

          <Row>
            {volunteers.length === 0 ? (
              <Col xs={12} className="text-center py-4 text-muted">
                Список волонтёров загружается...
              </Col>
            ) : (
              volunteers.map((vol) => (
                <Col md={4} sm={6} className="mb-4" key={vol.user_id}>
                  <Card className="h-100 shadow-sm border-0 rounded-4">
                    <Card.Body className="d-flex flex-column text-center p-4">
                      <div className="mb-3 d-flex justify-content-center">
                        <Image
                          src={
                            vol.user_ava_photo
                              ? `${process.env.REACT_APP_API_URL}/${vol.user_ava_photo}`
                              : defaultAvatar
                          }
                          roundedCircle
                          width={90}
                          height={90}
                          className="border border-2 border-success object-fit-cover shadow-sm"
                          alt={`${vol.user_name} ${vol.user_surname || ""}`}
                        />
                      </div>
                      <h5 className="fw-bold mb-1">
                        <a
                          href={`${OTHER_PROFILE_PAGE_ROUTE}/${vol.user_id}`}
                          className="text-decoration-none text-dark"
                        >
                          {vol.user_name} {vol.user_surname}
                        </a>
                      </h5>
                      <div className="mb-2">
                        <Badge bg="success" className="px-2 py-1">
                          🐾 Волонтёр
                        </Badge>
                      </div>

                      <div className="small text-muted mb-3 flex-grow-1">
                        {vol.bio ||
                          "Помощь бездомным животным, кураторство, передержка и транспортировка."}
                      </div>

                      <div className="border-top pt-3 text-start small text-muted">
                        <div className="mb-1">
                          <MapPin size={14} className="me-1 text-danger" />{" "}
                          {vol.location_name || "Самара"}
                        </div>
                        {vol.user_phone && (
                          <div className="mb-1">
                            <Phone size={14} className="me-1 text-success" />{" "}
                            <a
                              href={`tel:${vol.user_phone}`}
                              className="text-decoration-none text-muted"
                            >
                              {vol.user_phone}
                            </a>
                          </div>
                        )}
                        {vol.user_email && (
                          <div>
                            <Mail size={14} className="me-1 text-primary" />{" "}
                            <a
                              href={`mailto:${vol.user_email}`}
                              className="text-decoration-none text-muted"
                            >
                              {vol.user_email}
                            </a>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <Card className="mt-4 p-4 text-center border-0 rounded-4 shadow-sm bg-warning bg-opacity-10 border border-warning">
            <h4 className="fw-bold mb-2">Хотите помогать животным вместе с нами?</h4>
            <p className="text-muted mb-3">
              Зарегистрируйтесь на ZooHub, включите статус «Я волонтёр» в настройках своего профиля и присоединяйтесь к команде спасения!
            </p>
            <div>
              <Button
                variant="warning"
                className="fw-bold px-4"
                onClick={() => (window.location.href = "/profile")}
              >
                Стать волонтёром
              </Button>
            </div>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Partners;
