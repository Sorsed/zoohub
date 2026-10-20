import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  ShieldAlert,
  Search,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import {
  fetchModerationAdvertisements,
  deleteAdvertisement,
} from "../http/advertisementAPI";
import { SHOP_ROUTE, ADS_ROUTE, EDIT_ADS_ROUTE } from "../utils/consts";
import defaultAnimal from "../assets/defaultAnimal.png";

const Admin = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Состояние модалки удаления
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Проверка прав модератора
  const isModerator = user.isAuth && Number(user.user?.user_type) === 4;

  const loadModerationData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchModerationAdvertisements();
      setAds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки объявлений модерации:", err);
      setError(
        err.response?.data?.message ||
          "Не удалось загрузить объявления для модерации"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Если пользователь загрузился и он не модератор — редирект
    if (!user.isAuth || Number(user.user?.user_type) !== 4) {
      return;
    }
    loadModerationData();
  }, [user.isAuth, user.user?.user_type, loadModerationData]);

  // Подтверждение и выполнение удаления
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteAdvertisement(deleteTarget.advertisement_id);
      toast.success(
        `Объявление «${deleteTarget.animal_name}» (ID: ${deleteTarget.advertisement_id}) успешно удалено!`
      );
      setAds((prev) =>
        prev.filter((a) => a.advertisement_id !== deleteTarget.advertisement_id)
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Ошибка при удалении объявления:", err);
      toast.error(
        err.response?.data?.message || "Ошибка при удалении объявления"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Категория объявления бейдж
  const renderCategoryBadge = (type) => {
    switch (Number(type)) {
      case 1:
        return (
          <Badge bg="primary" className="fw-normal">
            Ищет дом
          </Badge>
        );
      case 2:
        return (
          <Badge bg="danger" className="fw-normal">
            Потерялся
          </Badge>
        );
      case 3:
        return (
          <Badge bg="warning" text="dark" className="fw-normal">
            Найден
          </Badge>
        );
      case 4:
        return (
          <Badge bg="info" className="fw-normal">
            Передержка
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="fw-normal">
            Объявление
          </Badge>
        );
    }
  };

  // Роль автора бейдж
  const renderUserRoleBadge = (userType) => {
    switch (Number(userType)) {
      case 2:
        return <Badge bg="warning" text="dark" className="small">Приют</Badge>;
      case 3:
        return <Badge bg="success" className="small">Волонтёр</Badge>;
      case 4:
        return <Badge bg="danger" className="small">Модератор</Badge>;
      default:
        return <Badge bg="light" text="secondary" className="border small">Пользователь</Badge>;
    }
  };

  // Форматирование даты
  const formatDate = (isoStr) => {
    if (!isoStr) return "—";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Фильтрация данных на клиенте
  const filteredAds = ads.filter((ad) => {
    // Фильтр по категории
    if (categoryFilter !== "all" && Number(ad.type_advertisement) !== Number(categoryFilter)) {
      return false;
    }

    // Поиск
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();

    const animalName = (ad.animal_name || "").toLowerCase();
    const breed = (ad.breed || "").toLowerCase();
    const userName = `${ad.user_name || ""} ${ad.user_surname || ""}`.toLowerCase();
    const userEmail = (ad.user_email || "").toLowerCase();
    const userPhone = (ad.user_phone || "").toLowerCase();
    const tutorPhone = (ad.tutor_number || "").toLowerCase();
    const city = (ad.location_name || "").toLowerCase();
    const adId = String(ad.advertisement_id);

    return (
      animalName.includes(q) ||
      breed.includes(q) ||
      userName.includes(q) ||
      userEmail.includes(q) ||
      userPhone.includes(q) ||
      tutorPhone.includes(q) ||
      city.includes(q) ||
      adId.includes(q)
    );
  });

  // Если нет прав модератора
  if (!isModerator) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div
          className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "80px", height: "80px", background: "#f8d7da", color: "#842029" }}
        >
          <ShieldAlert size={40} />
        </div>
        <h3 className="fw-bold mb-2">Доступ ограничен</h3>
        <p className="text-muted mb-4" style={{ maxWidth: "460px" }}>
          Данный раздел доступен только администраторам и модераторам ZooHub (роль <code>user_type = 4</code>).
        </p>
        <Button variant="warning" className="fw-semibold px-4" onClick={() => navigate(SHOP_ROUTE)}>
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  // Статистика
  const totalCount = ads.length;
  const homeCount = ads.filter((a) => Number(a.type_advertisement) === 1).length;
  const lostCount = ads.filter((a) => Number(a.type_advertisement) === 2 || Number(a.type_advertisement) === 3).length;
  const fosterCount = ads.filter((a) => Number(a.type_advertisement) === 4).length;

  return (
    <section className="py-4 bg-light min-vh-100">
      <Container>
        {/* Заголовок панели */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger fs-6 px-3 py-2 d-flex align-items-center gap-1">
                <ShieldAlert size={16} /> Модерация ZooHub
              </span>
              <span className="badge bg-light text-muted border px-2 py-1 small">
                Пользователь: {user.user?.user_name} (ID: {user.user?.user_id})
              </span>
            </div>
            <h2 className="fw-bold mb-0">Панель управления объявлениями</h2>
            <p className="text-muted small mb-0">
              Быстрое редактирование любых карточек животных, исправление контактных данных и удаление спама.
            </p>
          </div>
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2 align-self-start align-self-md-center rounded-3 bg-white"
            onClick={loadModerationData}
            disabled={loading}
          >
            <RotateCcw size={16} className={loading ? "spin" : ""} />
            <span>Обновить список</span>
          </Button>
        </div>

        {/* Карточки быстрой статистики */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 bg-white h-100">
              <span className="text-muted small fw-semibold">Всего объявлений</span>
              <span className="fs-3 fw-bold text-dark mt-1">{totalCount}</span>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 bg-white h-100">
              <span className="text-muted small fw-semibold">Ищут дом</span>
              <span className="fs-3 fw-bold text-primary mt-1">{homeCount}</span>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 bg-white h-100">
              <span className="text-muted small fw-semibold">Потеряны / Найдены</span>
              <span className="fs-3 fw-bold text-danger mt-1">{lostCount}</span>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 bg-white h-100">
              <span className="text-muted small fw-semibold">Нужна передержка</span>
              <span className="fs-3 fw-bold text-info mt-1">{fosterCount}</span>
            </Card>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="rounded-4 shadow-sm mb-4">
            {error}
          </Alert>
        )}

        {/* Панель поиска и фильтрации */}
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <Row className="g-2 align-items-center">
            <Col lg={7} md={6}>
              <div className="position-relative">
                <Search
                  size={18}
                  className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                />
                <Form.Control
                  type="text"
                  placeholder="Поиск по кличке, породе, автору, телефону, email или ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-5 py-2 rounded-3 border bg-light"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-1"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </Col>
            <Col lg={3} md={4}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 rounded-3 border bg-light"
              >
                <option value="all">Все категории</option>
                <option value="1">Ищет дом</option>
                <option value="2">Потерялся</option>
                <option value="3">Найден</option>
                <option value="4">Нужна передержка</option>
              </Form.Select>
            </Col>
            <Col lg={2} md={2} className="text-md-end text-muted small">
              Найдено: <strong>{filteredAds.length}</strong>
            </Col>
          </Row>
        </Card>

        {/* Таблица объявлений */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          {loading ? (
            <div className="py-5 text-center my-4">
              <Spinner animation="border" variant="warning" />
              <div className="text-muted small mt-2">Загрузка объявлений для модерации...</div>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="py-5 text-center my-4">
              <div className="text-muted fs-5 mb-2">Объявления не найдены</div>
              <p className="text-muted small">
                Попробуйте изменить поисковый запрос или сбросить фильтры категории.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light table-light">
                  <tr className="small text-muted text-uppercase">
                    <th style={{ width: "70px" }}>ID</th>
                    <th style={{ width: "90px" }}>Фото</th>
                    <th>Питомец</th>
                    <th>Категория</th>
                    <th>Город</th>
                    <th>Автор / Куратор</th>
                    <th>Контакты</th>
                    <th>Дата</th>
                    <th className="text-end" style={{ width: "190px" }}>
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.map((ad) => {
                    const photoSrc = ad.preview_photo
                      ? `${process.env.REACT_APP_API_URL}/${ad.preview_photo}`
                      : defaultAnimal;

                    const authorPhone = ad.tutor_number || ad.user_phone || "—";
                    const authorEmail = ad.tutor_email || ad.user_email || "—";

                    return (
                      <tr key={ad.advertisement_id}>
                        {/* ID */}
                        <td className="fw-bold text-muted small">
                          #{ad.advertisement_id}
                        </td>

                        {/* Фото */}
                        <td>
                          <img
                            src={photoSrc}
                            alt={ad.animal_name || "Питомец"}
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid #dee2e6",
                            }}
                            onError={(e) => {
                              e.target.src = defaultAnimal;
                            }}
                          />
                        </td>

                        {/* Питомец */}
                        <td>
                          <div className="fw-bold text-dark">
                            {ad.animal_name || "Без клички"}
                          </div>
                          <div className="text-muted small">
                            {ad.breed || "Порода не указана"}
                            {ad.age ? ` • ${ad.age} г.` : ""}
                          </div>
                          {/* Теги Важно для дома */}
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {ad.is_sterilized && (
                              <span className="badge bg-light text-success border small p-1">
                                Стерилизован
                              </span>
                            )}
                            {ad.is_vaccinated && (
                              <span className="badge bg-light text-info-emphasis border small p-1">
                                Привит
                              </span>
                            )}
                            {ad.good_with_kids && (
                              <span className="badge bg-light text-warning-emphasis border small p-1">
                                С детьми
                              </span>
                            )}
                            {ad.good_with_animals && (
                              <span className="badge bg-light text-primary border small p-1">
                                С животными
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Категория */}
                        <td>{renderCategoryBadge(ad.type_advertisement)}</td>

                        {/* Город */}
                        <td className="small text-muted text-nowrap">
                          <MapPin size={13} className="me-1 text-danger inline" />
                          {ad.location_name || "Самара"}
                        </td>

                        {/* Автор */}
                        <td>
                          <div className="fw-semibold small text-dark d-flex align-items-center gap-1">
                            <User size={13} className="text-muted" />
                            {ad.user_name} {ad.user_surname || ""}
                          </div>
                          <div className="mt-1">
                            {renderUserRoleBadge(ad.user_type)}
                          </div>
                        </td>

                        {/* Контакты */}
                        <td className="small">
                          {authorPhone !== "—" && (
                            <div className="d-flex align-items-center gap-1 text-nowrap">
                              <Phone size={12} className="text-muted" />
                              <a
                                href={`tel:${authorPhone}`}
                                className="text-decoration-none text-dark"
                              >
                                {authorPhone}
                              </a>
                            </div>
                          )}
                          {authorEmail !== "—" && (
                            <div className="d-flex align-items-center gap-1 text-muted text-truncate" style={{ maxWidth: "150px" }}>
                              <Mail size={12} />
                              <span title={authorEmail}>{authorEmail}</span>
                            </div>
                          )}
                        </td>

                        {/* Дата */}
                        <td className="small text-muted text-nowrap">
                          <Calendar size={13} className="me-1 inline" />
                          {formatDate(ad.created_at)}
                        </td>

                        {/* Быстрые действия модератора */}
                        <td className="text-end">
                          <div className="d-inline-flex gap-1">
                            {/* Просмотр */}
                            <Button
                              as={Link}
                              to={`${ADS_ROUTE}/${ad.advertisement_id}`}
                              variant="outline-secondary"
                              size="sm"
                              className="p-1 px-2 rounded-2"
                              title="Открыть карточку питомца"
                            >
                              <Eye size={15} />
                            </Button>

                            {/* Редактировать */}
                            <Button
                              as={Link}
                              to={`${EDIT_ADS_ROUTE}/${ad.advertisement_id}`}
                              variant="warning"
                              size="sm"
                              className="p-1 px-2 fw-semibold text-dark rounded-2 shadow-sm d-flex align-items-center gap-1"
                              title="Редактировать объявление (Модерация)"
                            >
                              <Edit3 size={15} />
                              <span className="d-none d-xl-inline small">Ред.</span>
                            </Button>

                            {/* Удалить */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1 px-2 rounded-2 d-flex align-items-center gap-1"
                              title="Удалить объявление (Модерация)"
                              onClick={() => setDeleteTarget(ad)}
                            >
                              <Trash2 size={15} />
                              <span className="d-none d-xl-inline small">Удалить</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        show={!!deleteTarget}
        onHide={() => !deleting && setDeleteTarget(null)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!deleting} className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-danger fs-5">
            <AlertTriangle size={22} />
            Удаление объявления (Модерация)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          {deleteTarget && (
            <div>
              <p className="mb-3">
                Вы действительно хотите безвозвратно удалить карточку животного:
              </p>
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="fw-bold fs-6 text-dark">
                  «{deleteTarget.animal_name || "Без клички"}»
                </div>
                <div className="small text-muted">
                  ID: #{deleteTarget.advertisement_id} • {deleteTarget.breed || "Порода не указана"}
                </div>
                <div className="small text-muted mt-1">
                  Автор: {deleteTarget.user_name} {deleteTarget.user_surname || ""} ({deleteTarget.user_email})
                </div>
              </div>
              <div className="alert alert-warning py-2 px-3 small mb-0 d-flex align-items-center gap-2">
                <ShieldAlert size={18} className="flex-shrink-0" />
                <span>
                  Это действие необратимо. Карточка, фотографии и все связанные данные будут удалены из базы.
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            className="rounded-3 px-3"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="rounded-3 px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Да, удалить объявление</span>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
});

export default Admin;
