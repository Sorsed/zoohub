import React from "react";
import { ArrowRight } from "lucide-react";
import { Container, Row, Col, Button } from "react-bootstrap";
import heroImage from "../assets/hero-pets.jpg";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="align-items-center g-5">
          {/* Текстовый блок */}
          <Col lg={6}>
            <h1 className="display-4 fw-bold mb-4">
              Дарим вторую жизнь{" "}
              <span className="text-warning">бездомным питомцам</span>
            </h1>
            <p className="lead text-muted mb-4">
              Помогаем найти дом для каждого хвостика. Более 10,000 счастливых
              историй за последний год.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              <NavLink
                to="/find-pet"
                className="btn btn-warning btn-lg d-flex align-items-center"
              >
                Найти питомца <ArrowRight size={20} className="ms-2" />
              </NavLink>
              <NavLink to="/stories" className="btn btn-outline-primary btn-lg">
                Посмотреть истории
              </NavLink>
            </div>

            <div className="d-flex gap-5 pt-3">
              <div className="text-center">
                <div className="h4  fw-bold">10,247</div>
                <div className="small text-muted">Спасенных животных</div>
              </div>
              <div className="text-center">
                <div className="h4  fw-bold">156</div>
                <div className="small text-muted">Партнерских приютов</div>
              </div>
              <div className="text-center">
                <div className="h4 fw-bold">24/7</div>
                <div className="small text-muted">Поддержка</div>
              </div>
            </div>
          </Col>

          {/* Картинка */}
          <Col lg={6} className="position-relative">
            <div className="rounded-4 overflow-hidden shadow">
              <img
                src={heroImage}
                alt="Счастливые питомцы"
                className="img-fluid"
              />
            </div>
            {/* Плавающая карточка */}
            <div
              className="position-absolute bg-white border rounded-3 shadow-sm p-3"
              style={{ bottom: "-20px", left: "-20px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-success rounded-circle"
                  style={{ width: 12, height: 12 }}
                ></div>
                <span className="small fw-medium">
                  Сейчас онлайн: 1,247 волонтеров
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
