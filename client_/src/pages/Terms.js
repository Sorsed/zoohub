import React, { useEffect } from "react";
import { Container, Card, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FileCheck, AlertCircle, HeartHandshake, PhoneCall } from "lucide-react";
import { SHOP_ROUTE } from "../utils/consts";

const Terms = () => {
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
          <Breadcrumb.Item active>Условия использования</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5">
          <div className="text-center mb-5">
            <div
              className="bg-warning bg-opacity-25 text-warning rounded-circle d-inline-flex p-3 mb-3"
              style={{ width: "70px", height: "70px", alignItems: "center", justifyContent: "center" }}
            >
              <FileCheck size={36} className="text-dark" />
            </div>
            <h1 className="fw-bold">Условия использования платформы ZooHub</h1>
            <p className="text-muted">
              Правила размещения объявлений и взаимодействия на платформе
            </p>
          </div>

          <div className="content-body" style={{ lineHeight: "1.8", color: "#333" }}>
            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <HeartHandshake size={20} className="me-2 text-warning" />
                1. Назначение сервиса
              </h4>
              <p>
                ZooHub — это некоммерческая социально ориентированная платформа, объединяющая приюты,
                волонтёров и неравнодушных людей для спасения, передержки и поиска семей для
                бездомных животных.
              </p>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <AlertCircle size={20} className="me-2 text-warning" />
                2. Правила публикации объявлений
              </h4>
              <ul>
                <li>
                  Запрещается публикация объявлений о коммерческой продаже животных и разведении
                  (разрешается только пристройство, поиск дома, поиск потерянных животных и помощь
                  приютам).
                </li>
                <li>
                  Пользователь обязуется указывать достоверную информацию о здоровье животного, его
                  характере, возрасте и контактах куратора.
                </li>
                <li>
                  Запрещается размещение фотографий, содержащих сцены жестокого обращения с животными,
                  оскорбительный контент или спам.
                </li>
                <li>
                  Объявление должно быть снято с публикации или удалено куратором сразу после того,
                  как питомец обрел постоянный дом.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold d-flex align-items-center mb-3 text-dark">
                <PhoneCall size={20} className="me-2 text-warning" />
                3. Ответственность сторон
              </h4>
              <p>
                Администрация ZooHub не несет юридической ответственности за действия третьих лиц при
                передаче животных, однако оставляет за собой право блокировать аккаунты нарушителей и
                удалять недостоверные объявления.
              </p>
            </section>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Terms;
