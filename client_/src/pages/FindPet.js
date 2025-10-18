import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Search } from "lucide-react";
import AdvertisementListMain from "../components/AdvertisementListMain";
import {
  fetchAllFilterAdvertisements,
  fetchAllAdvertisements,
} from "../http/advertisementAPI";

const FindPet = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "Все",
    age: "Любой",
    city: "",
  });

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cities = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
    "Нижний Новгород",
    "Челябинск",
    "Самара",
    "Омск",
    "Ростов-на-Дону",
  ];

  // 🟡 При загрузке страницы — все объявления
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllAdvertisements();
        setAds(data);
      } catch (error) {
        console.error("Ошибка при загрузке всех объявлений:", error);
        setError("Не удалось загрузить объявления. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // 📌 Изменение фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Автоподсказки для городов
  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, city: value }));

    if (value.trim() === "") {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setCitySuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleCitySelect = (city) => {
    setFilters((prev) => ({ ...prev, city }));
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  // 🔍 Применить фильтры
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      setError("");

      let typeId = null;
      if (filters.type === "Кошки") typeId = 2;
      else if (filters.type === "Собаки") typeId = 1;

      let ageFilter = {};
      switch (filters.age) {
        case "До 3 месяцев":
          ageFilter = { maxAge: 0.25 };
          break;
        case "До 1 года":
          ageFilter = { maxAge: 1 };
          break;
        case "1–3 года":
          ageFilter = { minAge: 1, maxAge: 3 };
          break;
        case "Старше 3 лет":
          ageFilter = { minAge: 3 };
          break;
        default:
          ageFilter = {};
      }

      const formData = new FormData();
      if (typeId !== null) formData.append("typeId", typeId);
      if (ageFilter.minAge !== undefined)
        formData.append("minAge", ageFilter.minAge);
      if (ageFilter.maxAge !== undefined)
        formData.append("maxAge", ageFilter.maxAge);
      if (searchQuery) formData.append("search", searchQuery);

      const data = await fetchAllFilterAdvertisements(formData);
      console.log("✅ Результаты фильтрации:", data);
      setAds(data);
    } catch (error) {
      console.error("Ошибка фильтрации:", error);
      setError("Ошибка при применении фильтров. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light">
      <main className="container py-4">
        {/* Поиск */}
        <Form className="mb-4 d-flex">
          <div className="position-relative flex-grow-1">
            <Search
              size={18}
              className="position-absolute top-50 translate-middle-y ms-2 text-muted"
            />
            <Form.Control
              type="text"
              placeholder="Найти питомца по имени, породе или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-5"
            />
          </div>
          <Button
            variant="warning"
            className="ms-2"
            onClick={handleApplyFilters} // та же функция, что и фильтры
          >
            Искать
          </Button>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {/* Левая панель фильтров */}
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body>
                <h5 className="mb-3 fw-bold">Фильтры</h5>

                {/* Тип */}
                <Form.Group className="mb-3">
                  <Form.Label>Тип</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option>Все</option>
                    <option>Кошки</option>
                    <option>Собаки</option>
                  </Form.Select>
                </Form.Group>

                {/* Возраст */}
                <Form.Group className="mb-3">
                  <Form.Label>Возраст</Form.Label>
                  <Form.Select
                    name="age"
                    value={filters.age}
                    onChange={handleFilterChange}
                  >
                    <option>Любой</option>
                    <option>До 3 месяцев</option>
                    <option>До 1 года</option>
                    <option>1–3 года</option>
                    <option>Старше 3 лет</option>
                  </Form.Select>
                </Form.Group>

                {/* Город */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Город</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Любой"
                    value={filters.city}
                    onChange={handleCityInputChange}
                    onFocus={() =>
                      filters.city &&
                      setShowSuggestions(citySuggestions.length > 0)
                    }
                  />

                  {showSuggestions && citySuggestions.length > 0 && (
                    <ListGroup
                      className="position-absolute w-100 shadow-sm z-3"
                      style={{ maxHeight: "180px", overflowY: "auto" }}
                    >
                      {citySuggestions.map((city, index) => (
                        <ListGroup.Item
                          key={index}
                          action
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>

                <Button
                  variant="warning"
                  className="w-100 fw-semibold"
                  onClick={handleApplyFilters}
                  disabled={loading}
                >
                  {loading ? "Загрузка..." : "Применить"}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Правая часть — список объявлений */}
          <Col md={9}>
            <h2 className="mb-4 fw-bold">Найти питомца</h2>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="warning" />
              </div>
            ) : (
              <AdvertisementListMain ads={ads} />
            )}
          </Col>
        </Row>
      </main>
    </section>
  );
};

export default FindPet;
