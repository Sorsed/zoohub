import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Search, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import { CREATE_ADS_ROUTE, HELP_ROUTE, LOGIN_ROUTE } from "../utils/consts";

const CTACards = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const handleAction = (type) => {
    if (type === "help") {
      navigate(HELP_ROUTE);
      return;
    }

    if (user.isAuth) {
      navigate(CREATE_ADS_ROUTE);
    } else {
      navigate(LOGIN_ROUTE);
    }
  };

  const cards = [
    {
      icon: <Search size={40} className="text-danger" />,
      title: "Потерял питомца",
      description:
        "Разместите объявление о пропаже. Наша сеть волонтеров поможет в поисках.",
      action: "Сообщить о пропаже",
      btnVariant: "danger",
      type: "lost",
    },
    {
      icon: <MapPin size={40} className="text-primary" />,
      title: "Нашел питомца",
      description:
        "Сообщите о найденном животном. Поможем найти хозяев или временный дом.",
      action: "Сообщить о находке",
      btnVariant: "primary",
      type: "found",
    },
    {
      icon: <Heart size={40} className="text-success" />,
      title: "Хочу помочь",
      description:
        "Станьте волонтером, усыновите питомца или поддержите проект финансово.",
      action: "Начать помогать",
      btnVariant: "success",
      type: "help",
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
              <div className="card h-100 shadow-sm text-center p-4 border-0 rounded-4">
                <div className="mb-3">{card.icon}</div>
                <h5 className="fw-semibold">{card.title}</h5>
                <p className="text-muted flex-grow-1">{card.description}</p>
                <Button
                  variant={card.btnVariant}
                  className="w-100 fw-semibold"
                  onClick={() => handleAction(card.type)}
                >
                  {card.action}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CTACards;
