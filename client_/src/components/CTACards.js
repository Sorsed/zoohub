import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Search, MapPin, Heart } from "lucide-react";

const CTACards = () => {
  const cards = [
    {
      icon: <Search size={40} className="text-danger" />,
      title: "Потерял питомца",
      description:
        "Разместите объявление о пропаже. Наша сеть волонтеров поможет в поисках.",
      action: "Сообщить о пропаже",
      btnClass: "btn btn-danger w-100",
    },
    {
      icon: <MapPin size={40} className="text-primary" />,
      title: "Нашел питомца",
      description:
        "Сообщите о найденном животном. Поможем найти хозяев или временный дом.",
      action: "Сообщить о находке",
      btnClass: "btn btn-primary w-100",
    },
    {
      icon: <Heart size={40} className="text-success" />,
      title: "Хочу помочь",
      description:
        "Станьте волонтером, усыновите питомца или поддержите проект финансово.",
      action: "Начать помогать",
      btnClass: "btn btn-success w-100",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">Как вы можете помочь</h2>
          <p className="text-muted">
            Каждое действие имеет значение. Выберите способ, как вы можете
            изменить жизнь животного к лучшему.
          </p>
        </div>

        <Row>
          {cards.map((card, index) => (
            <Col key={index} md={4} className="mb-4">
              <div className="card h-100 shadow-sm text-center p-4">
                <div className="mb-3">{card.icon}</div>
                <h5 className="fw-semibold">{card.title}</h5>
                <p className="text-muted">{card.description}</p>
                <button className={card.btnClass}>{card.action}</button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CTACards;
