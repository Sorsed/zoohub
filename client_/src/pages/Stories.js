import React, { useState } from "react";
import { Card, Button, Badge, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { Heart, Calendar, User, Home, ArrowLeft, BookOpen, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import story1 from "../assets/story-1.jpg";
import story2 from "../assets/story-2.jpg";
import { FIND_PET_ROUTE } from "../utils/consts";

const Stories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Form state for sharing a story
  const [shareData, setShareData] = useState({
    name: "",
    petName: "",
    email: "",
    story: "",
  });

  const stories = [
    {
      id: 1,
      title: "Рекс обрел свою семью",
      excerpt:
        "История о том, как большой пес нашел дом после долгих месяцев в приюте",
      image: story1,
      date: "15 марта 2024",
      author: "Мария Волкова",
      category: "Успешное усыновление",
      readTime: "5 мин",
      shelter: 'Приют "Добрые руки"',
      content: `Рекс попал в наш приют в ноябре прошлого года. Этот красивый немецкий овчар был найден истощенным и напуганным на окраине города. 

Первые недели Рекс не доверял людям. Он прятался в углу вольера и вздрагивал от каждого звука. Волонтеры проявили невероятное терпение — каждый день приносили ему лакомства, разговаривали спокойным голосом, постепенно завоевывая доверие.

Через месяц Рекс начал подходить к людям. Еще через месяц — вилять хвостом при виде знакомых волонтеров. А в феврале произошло чудо — семья Ивановых увидела фотографию Рекса на нашем сайте и сразу поняла, что это их собака.

Сейчас Рекс живет в загородном доме, обожает долгие прогулки по лесу и стал верным защитником для двоих детей. Эта история напоминает нам, что терпение и доброта способны сотворить настоящее чудо.`,
    },
    {
      id: 2,
      title: "Котята Пушок и Снежок: двойное счастье",
      excerpt: "Брат и сестра не хотели расставаться, и их мечта сбылась",
      image: story2,
      date: "8 марта 2024",
      author: "Елена Петрова",
      category: "Особая история",
      readTime: "4 мин",
      shelter: 'Центр "Четыре лапы"',
      content: `Пушок и Снежок — белоснежные котята, которые попали к нам в январе. Их нашли в подъезде жилого дома совсем маленькими, около двух месяцев отроду.

Малыши были неразлучны с самого первого дня. Если одного забирали на осмотр к ветеринару, второй начинал тревожно мяукать. Мы очень переживали, что пристроить сразу двоих котят в одну семью будет сложной задачей.

Однако на весенней выставке-пристройстве ZooHub молодая пара сразу обратила внимание на эту дружную парочку. «Мы не можем разлучить таких друзей!» — сказали они.

Теперь Пушок и Снежок радуют своих хозяев совместными играми и свернувшись калачиком спят вместе на мягком пледе.`,
    },
  ];

  const handleShareSubmit = (e) => {
    e.preventDefault();
    if (!shareData.name || !shareData.story) {
      toast.error("Пожалуйста, заполните имя и текст истории");
      return;
    }
    toast.success("Спасибо за вашу историю! После проверки модератором она появится на сайте.");
    setShowShareModal(false);
    setShareData({ name: "", petName: "", email: "", story: "" });
  };

  return (
    <>
      <section className="py-5 bg-light">
        <Container className="py-4">
          <div className="text-center mb-5">
            <h1 className="fw-bold">Истории счастья</h1>
            <p className="text-muted">
              Каждая история усыновления уникальна. Читайте о том, как наши
              подопечные обрели любящие семьи и новую жизнь.
            </p>
          </div>

          <Row xs={1} md={2} className="g-4">
            {stories.map((story) => (
              <Col key={story.id}>
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <div className="position-relative" style={{ height: "260px" }}>
                    <Card.Img
                      variant="top"
                      src={story.image}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                    <Badge
                      bg="light"
                      text="dark"
                      className="position-absolute top-0 start-0 m-3 shadow-sm px-3 py-2 fw-semibold"
                    >
                      {story.category}
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="fw-bold mb-2 fs-4">{story.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      {story.excerpt}
                    </Card.Text>

                    <div className="d-flex flex-wrap gap-3 mb-3 text-muted small">
                      <span className="d-flex align-items-center">
                        <Calendar size={14} className="me-1 text-warning" /> {story.date}
                      </span>
                      <span className="d-flex align-items-center">
                        <User size={14} className="me-1 text-warning" /> {story.author}
                      </span>
                      <span className="d-flex align-items-center">
                        <Home size={14} className="me-1 text-warning" /> {story.shelter}
                      </span>
                    </div>

                    <Card.Text className="text-secondary flex-grow-1" style={{ whiteSpace: "pre-line" }}>
                      {story.content.split("\n\n").slice(0, 2).join("\n\n")}...
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <small className="text-muted">
                        Время чтения: {story.readTime}
                      </small>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="fw-semibold d-flex align-items-center"
                        onClick={() => setSelectedStory(story)}
                      >
                        <BookOpen size={16} className="me-1" /> Читать полностью
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Link to={FIND_PET_ROUTE}>
              <Button variant="outline-secondary" className="fw-semibold px-4 py-2">
                <ArrowLeft size={18} className="me-2" />
                Вернуться к поиску питомца
              </Button>
            </Link>
          </div>

          <Card className="text-center mt-5 shadow-sm border-0 rounded-4 p-4 p-md-5">
            <Card.Body>
              <Card.Title className="fw-bold fs-3 mb-3">Поделитесь своей историей</Card.Title>
              <Card.Text className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
                Если вы усыновили питомца через наш сервис или приют-партнёр, мы будем рады
                услышать вашу историю и поделиться ею с другими. Ваш опыт может вдохновить других
                людей подарить дом бездомному хвостику!
              </Card.Text>
              <Button
                variant="primary"
                className="fw-semibold px-4 py-2"
                onClick={() => setShowShareModal(true)}
              >
                <Heart size={18} className="me-2" fill="currentColor" /> Рассказать историю
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Modal: Полная история */}
      <Modal
        show={!!selectedStory}
        onHide={() => setSelectedStory(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{selectedStory?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedStory?.image && (
            <img
              src={selectedStory.image}
              alt={selectedStory.title}
              className="w-100 rounded-3 mb-4"
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />
          )}
          <div className="d-flex flex-wrap gap-3 mb-3 text-muted small border-bottom pb-2">
            <span>📅 {selectedStory?.date}</span>
            <span>👤 Автор: {selectedStory?.author}</span>
            <span>🏠 {selectedStory?.shelter}</span>
          </div>
          <div style={{ whiteSpace: "pre-line", lineHeight: "1.8", color: "#333" }}>
            {selectedStory?.content}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedStory(null)}>
            Закрыть
          </Button>
          <Link to={FIND_PET_ROUTE} className="btn btn-warning fw-semibold">
            Найти своего питомца
          </Link>
        </Modal.Footer>
      </Modal>

      {/* Modal: Рассказать историю */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
      >
        <Form onSubmit={handleShareSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Ваша счастливая история</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Ваше имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Как вас зовут?"
                value={shareData.name}
                onChange={(e) => setShareData({ ...shareData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Кличка питомца</Form.Label>
              <Form.Control
                type="text"
                placeholder="Имя вашего хвостика"
                value={shareData.petName}
                onChange={(e) => setShareData({ ...shareData, petName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Контактный email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={shareData.email}
                onChange={(e) => setShareData({ ...shareData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ваша история</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Расскажите, как вы встретились и как изменилась ваша жизнь..."
                value={shareData.story}
                onChange={(e) => setShareData({ ...shareData, story: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowShareModal(false)}>
              Отмена
            </Button>
            <Button variant="warning" type="submit" className="fw-semibold">
              <Send size={16} className="me-1" /> Отправить историю
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Stories;
