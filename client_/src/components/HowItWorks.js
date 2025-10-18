import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { UserPlus, Heart, Home, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Регистрация",
    description:
      "Создайте профиль и расскажите о себе. Это поможет нам подобрать идеального питомца.",
  },
  {
    icon: Heart,
    number: "02",
    title: "Выбор питомца",
    description:
      "Просматривайте анкеты животных, знакомьтесь с их историями и характером.",
  },
  {
    icon: Home,
    number: "03",
    title: "Знакомство",
    description:
      "Встречайтесь с питомцем в приюте, узнавайте друг друга лучше.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Новая семья",
    description:
      "Оформляйте усыновление и начинайте новую счастливую жизнь вместе.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-5 bg-light">
      <Container className="text-center">
        <h2 className="display-6 fw-bold mb-3">Как это работает</h2>
        <p className="lead text-muted mb-5">
          Простой и безопасный процесс усыновления, который мы совершенствовали
          годами.
        </p>

        <Row className="g-4">
          {steps.map((step, i) => (
            <Col key={i} xs={12} md={6} lg={3}>
              <div className="p-4 border rounded-3 h-100 shadow-sm">
                <div className="position-relative d-inline-block mb-3">
                  <div
                    className="bg-warning rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: 70, height: 70 }}
                  >
                    <step.icon size={32} className="text-dark" />
                  </div>
                  <div
                    className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 30, height: 30, fontSize: 14 }}
                  >
                    {step.number}
                  </div>
                </div>

                <h5 className="fw-bold">{step.title}</h5>
                <p className="text-muted small">{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;
