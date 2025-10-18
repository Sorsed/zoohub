import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Badge, Tabs, Tab } from "react-bootstrap";
import { MapPin, Phone, Star } from "lucide-react";
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
        <Tab eventKey="shelters" title="Приюты">
          <Row>
            {shelters.map((shelter) => (
              <Col md={6} className="mb-4" key={shelter.user_id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    {/* Верхняя часть (заголовок + бейдж) */}
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

                    {/* Описание */}
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

                    {/* Нижний блок */}
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
      <div><b>Телефон:</b> ${shelter.user_phone || "не указан"}</div>
      <div><b>Адрес:</b> ${shelter.user_shelter_address || "не указан"}</div>
      <div><b>Профиль:</b> 
        <a href="${OTHER_PROFILE_PAGE_ROUTE}/${shelter.user_id}">
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
                        /** 👇 ОБЯЗАТЕЛЬНО */
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
      </Tabs>
    </div>
  );
};

export default Partners;
