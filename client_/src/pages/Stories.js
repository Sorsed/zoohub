import { Card, Button, Badge, Container, Row, Col } from "react-bootstrap";
import { Heart, Calendar, User, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import story1 from "../assets/story-1.jpg";
import story2 from "../assets/story-2.jpg";

const Stories = () => {
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

Через месяц Рекс начал подходить к людям. Еще через месяц — вилять хвостом при виде знакомых волонтеров. А в феврале произошло чудо — семья Ивановых увидела фотографию Рекса на нашем сайте и сразу поняла, что это их собака.`,
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
      content: `Пушок и Снежок — белоснежные котята, которые попали к нам в январе. Их нашли в подъезде жилого дома совсем маленькими, около двух месяцев отроду.`,
    },
  ];

  return (
    <>
      <section className="py-5 bg-light">
        <Container className="py-4">
          <div className="text-center mb-5">
            <h1>Истории счастья</h1>
            <p className="text-muted">
              Каждая история усыновления уникальна. Читайте о том, как наши
              подопечные обрели любящие семьи и новую жизнь.
            </p>
          </div>

          <Row xs={1} md={2} className="g-4">
            {stories.map((story) => (
              <Col key={story.id}>
                <Card className="h-100">
                  <div className="position-relative">
                    <Card.Img variant="top" src={story.image} />
                    <Badge
                      bg="light"
                      text="dark"
                      className="position-absolute top-0 start-0 m-2"
                    >
                      {story.category}
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{story.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {story.excerpt}
                    </Card.Text>

                    <div className="d-flex flex-wrap gap-3 mb-2 text-muted small">
                      <span className="d-flex align-items-center">
                        <Calendar className="me-1" /> {story.date}
                      </span>
                      <span className="d-flex align-items-center">
                        <User className="me-1" /> {story.author}
                      </span>
                      <span className="d-flex align-items-center">
                        <Home className="me-1" /> {story.shelter}
                      </span>
                    </div>

                    <Card.Text className="text-muted flex-grow-1">
                      {story.content.split("\n\n").slice(0, 2).join("\n\n")}
                      {story.content.split("\n\n").length > 2 && "..."}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Время чтения: {story.readTime}
                      </small>
                      <Button variant="outline-primary">
                        Читать полностью
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Link to="/find-pet">
              <Button variant="outline-secondary">
                <ArrowLeft className="me-2" />
                Вернуться к поиску питомца
              </Button>
            </Link>
          </div>

          <Card className="text-center mt-5">
            <Card.Body>
              <Card.Title>Поделитесь своей историей</Card.Title>
              <Card.Text className="text-muted mb-3">
                Если вы усыновили питомца через наш сервис, мы будем рады
                услышать вашу историю и поделиться ею с другими людьми. Ваш опыт
                может вдохновить кого-то еще!
              </Card.Text>
              <Button variant="primary">
                <Heart className="me-2" /> Рассказать историю
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Stories;
