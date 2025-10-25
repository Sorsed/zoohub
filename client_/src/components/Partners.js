import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tabs, Tab } from "react-bootstrap";
import { MapPin, Phone, Mail } from "lucide-react";
import { YMaps, Map, Placemark, Clusterer } from "react-yandex-maps";
import { fetchShelters } from "../http/shelterAPI";
import { OTHER_PROFILE_PAGE_ROUTE } from "../utils/consts";

const Partners = () => {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    fetchShelters().then((data) => {
      if (data) setShelters(data);
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
      </Tabs>
    </div>
  );
};

export default Partners;
