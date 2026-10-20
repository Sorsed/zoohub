import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  MapPin,
  HelpCircle,
  X,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdvertisementListMain from "../components/AdvertisementListMain";
import { fetchAllFilterAdvertisements } from "../http/advertisementAPI";
import { QUIZ_ROUTE } from "../utils/consts";

const FindPet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "Все",
    age: "Любой",
    city: "",
    category: "Все",
    is_sterilized: false,
    is_vaccinated: false,
    good_with_kids: false,
    good_with_animals: false,
  });
  const [sortBy, setSortBy] = useState("newest");

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cities = useMemo(
    () => [
      "Самара",
      "Москва",
      "Санкт-Петербург",
      "Новосибирск",
      "Екатеринбург",
      "Казань",
      "Нижний Новгород",
      "Челябинск",
      "Омск",
      "Ростов-на-Дону",
      "Тольятти",
    ],
    []
  );

  // Преобразование текстового фильтра возраста в числовой диапазон
  const getAgeRange = (ageStr) => {
    switch (ageStr) {
      case "До 3 месяцев":
        return { maxAge: 0.25 };
      case "До 1 года":
        return { maxAge: 1 };
      case "1–3 года":
        return { minAge: 1, maxAge: 3 };
      case "Старше 3 лет":
        return { minAge: 3 };
      default:
        return {};
    }
  };

  // Преобразование текстового вида животного в type_id
  const getTypeId = (typeStr) => {
    switch (typeStr) {
      case "Собаки":
        return 1;
      case "Кошки":
        return 2;
      case "Птицы":
        return 3;
      case "Грызуны":
        return 4;
      case "Другие":
        return 5;
      default:
        return null;
    }
  };

  // Преобразование текстовой категории в type_advertisement
  const getCategoryCode = (categoryStr) => {
    switch (categoryStr) {
      case "Ищет дом":
        return 1;
      case "Потерялся":
        return 2;
      case "Найден":
        return 3;
      case "Нужна передержка":
        return 4;
      default:
        return null;
    }
  };

  // Выполнение запроса с фильтрами к серверу
  const loadData = useCallback(async (activeFilters, query, sort) => {
    try {
      setLoading(true);
      setError("");

      const typeId = getTypeId(activeFilters.type);
      const typeAdvertisement = getCategoryCode(activeFilters.category);
      const ageRange = getAgeRange(activeFilters.age);

      const payload = {
        type_id: typeId,
        type_advertisement: typeAdvertisement,
        minAge: ageRange.minAge,
        maxAge: ageRange.maxAge,
        city: activeFilters.city?.trim() || null,
        search: query?.trim() || null,
        sortBy: sort || "newest",
        is_sterilized: activeFilters.is_sterilized || undefined,
        is_vaccinated: activeFilters.is_vaccinated || undefined,
        good_with_kids: activeFilters.good_with_kids || undefined,
        good_with_animals: activeFilters.good_with_animals || undefined,
      };

      const data = await fetchAllFilterAdvertisements(payload);
      setAds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка при фильтрации объявлений:", err);
      setError("Не удалось загрузить объявления. Попробуйте обновить страницу.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Инициализация фильтров из URL параметров
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const rawType = searchParams.get("type") || searchParams.get("type_id");
    const rawCategory = searchParams.get("category") || searchParams.get("type_advertisement");
    const rawAge = searchParams.get("age") || searchParams.get("age_group");
    const rawCity = searchParams.get("city") || "";
    const rawSearch = searchParams.get("search") || searchParams.get("q") || "";
    const rawSort = searchParams.get("sortBy") || "newest";

    let initType = "Все";
    if (rawType) {
      const lower = rawType.toLowerCase();
      if (rawType === "1" || lower.includes("собак") || lower === "dogs" || lower === "dog") initType = "Собаки";
      else if (rawType === "2" || lower.includes("кош") || lower.includes("кот") || lower === "cats" || lower === "cat") initType = "Кошки";
      else if (rawType === "3" || lower.includes("птиц")) initType = "Птицы";
      else if (rawType === "4" || lower.includes("грыз")) initType = "Грызуны";
      else if (rawType === "5" || lower.includes("друг")) initType = "Другие";
    }

    let initCategory = "Все";
    if (rawCategory) {
      const lower = rawCategory.toLowerCase();
      if (rawCategory === "1" || lower.includes("дом") || lower.includes("руки")) initCategory = "Ищет дом";
      else if (rawCategory === "2" || lower.includes("потер")) initCategory = "Потерялся";
      else if (rawCategory === "3" || lower.includes("найд")) initCategory = "Найден";
      else if (rawCategory === "4" || lower.includes("передерж")) initCategory = "Нужна передержка";
    }

    let initAge = "Любой";
    if (rawAge) {
      const lower = rawAge.toLowerCase();
      if (lower === "baby" || lower === "puppy" || lower === "kitten" || lower.includes("3 месяцев") || lower === "до 3 месяцев") initAge = "До 3 месяцев";
      else if (lower === "junior" || lower.includes("1 года") || lower === "до 1 года") initAge = "До 1 года";
      else if (lower === "young" || lower === "1-3" || lower.includes("1–3 года") || lower.includes("1-3 года")) initAge = "1–3 года";
      else if (lower === "adult" || lower === "senior" || lower.includes("старше 3") || lower.includes("взросл")) initAge = "Старше 3 лет";
    }

    const rawSterilized = searchParams.get("is_sterilized") === "true" || searchParams.get("sterilized") === "1" || searchParams.get("sterilized") === "true";
    const rawVaccinated = searchParams.get("is_vaccinated") === "true" || searchParams.get("vaccinated") === "1" || searchParams.get("vaccinated") === "true";
    const rawKids = searchParams.get("good_with_kids") === "true" || searchParams.get("kids") === "1" || searchParams.get("kids") === "true";
    const rawAnimals = searchParams.get("good_with_animals") === "true" || searchParams.get("animals") === "1" || searchParams.get("animals") === "true";

    const currentFilters = {
      type: initType,
      category: initCategory,
      age: initAge,
      city: rawCity,
      is_sterilized: rawSterilized,
      is_vaccinated: rawVaccinated,
      good_with_kids: rawKids,
      good_with_animals: rawAnimals,
    };

    setFilters(currentFilters);
    setSearchQuery(rawSearch);
    setSortBy(rawSort);

    loadData(currentFilters, rawSearch, rawSort);
  }, [searchParams, loadData]);

  // Синхронизация фильтров с URL
  const updateUrlParams = (newFilters, newSearch, newSort) => {
    const params = {};

    if (newFilters.type !== "Все") {
      const typeId = getTypeId(newFilters.type);
      if (typeId) params.type = typeId;
    }

    if (newFilters.category !== "Все") {
      const catCode = getCategoryCode(newFilters.category);
      if (catCode) params.category = catCode;
    }

    if (newFilters.age !== "Любой") {
      if (newFilters.age === "До 3 месяцев") params.age = "baby";
      else if (newFilters.age === "До 1 года") params.age = "junior";
      else if (newFilters.age === "1–3 года") params.age = "young";
      else if (newFilters.age === "Старше 3 лет") params.age = "adult";
    }

    if (newFilters.city && newFilters.city.trim() !== "") {
      params.city = newFilters.city.trim();
    }

    if (newFilters.is_sterilized) params.sterilized = "1";
    if (newFilters.is_vaccinated) params.vaccinated = "1";
    if (newFilters.good_with_kids) params.kids = "1";
    if (newFilters.good_with_animals) params.animals = "1";

    if (newSearch && newSearch.trim() !== "") {
      params.search = newSearch.trim();
    }

    if (newSort && newSort !== "newest") {
      params.sortBy = newSort;
    }

    setSearchParams(params, { replace: true });
  };

  // Изменение полей фильтра (селекты и чекбоксы)
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Автодополнение города
  const handleCityInputChange = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, city: val }));

    if (val.trim() === "") {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(val.toLowerCase())
    );
    setCitySuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleCitySelect = (selectedCity) => {
    setFilters((prev) => ({ ...prev, city: selectedCity }));
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  // Применение фильтров
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    updateUrlParams(filters, searchQuery, sortBy);
    loadData(filters, searchQuery, sortBy);
  };

  // Сортировка
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateUrlParams(filters, searchQuery, newSort);
    loadData(filters, searchQuery, newSort);
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    const defaultFilters = {
      type: "Все",
      category: "Все",
      age: "Любой",
      city: "",
      is_sterilized: false,
      is_vaccinated: false,
      good_with_kids: false,
      good_with_animals: false,
    };
    setFilters(defaultFilters);
    setSearchQuery("");
    setSortBy("newest");
    setCitySuggestions([]);
    setShowSuggestions(false);
    setSearchParams({}, { replace: true });
    loadData(defaultFilters, "", "newest");
  };

  // Проверка активности фильтров
  const hasActiveFilters =
    filters.type !== "Все" ||
    filters.category !== "Все" ||
    filters.age !== "Любой" ||
    filters.city.trim() !== "" ||
    filters.is_sterilized ||
    filters.is_vaccinated ||
    filters.good_with_kids ||
    filters.good_with_animals ||
    searchQuery.trim() !== "" ||
    sortBy !== "newest";

  return (
    <section className="py-5 bg-light min-vh-100">
      <main className="container py-2">
        {/* Баннер интерактивного теста */}
        <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white overflow-hidden">
          <Card.Body className="p-4 p-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#fff3cd",
                  color: "#d39e00",
                }}
              >
                <Sparkles size={28} />
              </div>
              <div>
                <h5 className="fw-bold mb-1">
                  Не знаете, кого выбрать? Пройдите тест!
                </h5>
                <p className="text-muted small mb-0">
                  Ответьте на 8 простых вопросов, и мы определим ваш идеальный
                  архетип питомца и дадим персональные советы кинолога.
                </p>
              </div>
            </div>
            <Button
              variant="warning"
              className="fw-bold text-dark px-4 py-2 rounded-3 shadow-sm text-nowrap align-self-start align-self-md-center"
              onClick={() => navigate(QUIZ_ROUTE)}
            >
              Пройти тест-подбор →
            </Button>
          </Card.Body>
        </Card>

        {/* Поисковая строка */}
        <Form className="mb-4" onSubmit={handleApplyFilters}>
          <div className="d-flex gap-2">
            <div className="position-relative flex-grow-1">
              <Search
                size={20}
                className="position-absolute top-50 translate-middle-y ms-3 text-muted"
              />
              <Form.Control
                type="text"
                placeholder="Поиск по кличке, породе или описанию питомца..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-5 py-2 py-md-3 rounded-4 shadow-sm border-0 bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-1"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <Button
              type="submit"
              variant="warning"
              className="fw-bold px-4 rounded-4 shadow-sm text-dark d-flex align-items-center gap-2"
              disabled={loading}
            >
              <Search size={18} />
              <span className="d-none d-sm-inline">Искать</span>
            </Button>
          </div>
        </Form>

        {error && (
          <Alert variant="danger" className="rounded-4 shadow-sm mb-4">
            {error}
          </Alert>
        )}

        <Row>
          {/* Левая колонка: Фильтры */}
          <Col lg={3} md={4} className="mb-4">
            <Card className="shadow-sm border-0 rounded-4 find-pet-filter-card">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <SlidersHorizontal size={18} className="text-warning" />
                    Фильтры
                  </h5>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      className="p-0 text-muted small text-decoration-none"
                      onClick={handleResetFilters}
                      title="Сбросить все параметры"
                    >
                      Сбросить
                    </Button>
                  )}
                </div>

                {/* Категория объявления */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted mb-1">
                    Категория
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="rounded-3 shadow-none border"
                  >
                    <option>Все</option>
                    <option>Ищет дом</option>
                    <option>Потерялся</option>
                    <option>Найден</option>
                    <option>Нужна передержка</option>
                  </Form.Select>
                </Form.Group>

                {/* Вид животного */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted mb-1">
                    Вид животного
                  </Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="rounded-3 shadow-none border"
                  >
                    <option>Все</option>
                    <option>Собаки</option>
                    <option>Кошки</option>
                    <option>Птицы</option>
                    <option>Грызуны</option>
                    <option>Другие</option>
                  </Form.Select>
                </Form.Group>

                {/* Возраст */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted mb-1">
                    Возраст
                  </Form.Label>
                  <Form.Select
                    name="age"
                    value={filters.age}
                    onChange={handleFilterChange}
                    className="rounded-3 shadow-none border"
                  >
                    <option>Любой</option>
                    <option>До 3 месяцев</option>
                    <option>До 1 года</option>
                    <option>1–3 года</option>
                    <option>Старше 3 лет</option>
                  </Form.Select>
                </Form.Group>

                {/* Город */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="small fw-semibold text-muted mb-1">
                    Город
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Например: Самара"
                      value={filters.city}
                      onChange={handleCityInputChange}
                      onFocus={() =>
                        filters.city &&
                        setShowSuggestions(citySuggestions.length > 0)
                      }
                      className="rounded-3 shadow-none border"
                    />
                    {filters.city && (
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 text-muted p-1"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, city: "" }))
                        }
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  {showSuggestions && citySuggestions.length > 0 && (
                    <ListGroup
                      className="position-absolute w-100 shadow-sm z-3 mt-1"
                      style={{ maxHeight: "180px", overflowY: "auto" }}
                    >
                      {citySuggestions.map((cityName, idx) => (
                        <ListGroup.Item
                          key={idx}
                          action
                          onClick={() => handleCitySelect(cityName)}
                          className="py-2 small"
                        >
                          <MapPin size={14} className="me-2 text-warning" />
                          {cityName}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  {/* Быстрые города */}
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {["Самара", "Москва", "Казань"].map((c) => (
                      <Badge
                        key={c}
                        bg={filters.city === c ? "warning" : "light"}
                        text={filters.city === c ? "dark" : "secondary"}
                        className="p-1 px-2 fw-normal rounded-2 border cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            city: prev.city === c ? "" : c,
                          }))
                        }
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                {/* Блок быстрых тегов «Важно для дома» */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-muted mb-2">
                    Важно для дома
                  </Form.Label>
                  <div className="d-flex flex-column gap-2 bg-light p-3 rounded-3 border">
                    <Form.Check
                      type="checkbox"
                      id="filter-is_sterilized"
                      name="is_sterilized"
                      label="Стерилизован / кастрирован"
                      checked={filters.is_sterilized}
                      onChange={handleFilterChange}
                      className="small"
                    />
                    <Form.Check
                      type="checkbox"
                      id="filter-is_vaccinated"
                      name="is_vaccinated"
                      label="Привит"
                      checked={filters.is_vaccinated}
                      onChange={handleFilterChange}
                      className="small"
                    />
                    <Form.Check
                      type="checkbox"
                      id="filter-good_with_kids"
                      name="good_with_kids"
                      label="Ладит с детьми"
                      checked={filters.good_with_kids}
                      onChange={handleFilterChange}
                      className="small"
                    />
                    <Form.Check
                      type="checkbox"
                      id="filter-good_with_animals"
                      name="good_with_animals"
                      label="Ладит с другими животными"
                      checked={filters.good_with_animals}
                      onChange={handleFilterChange}
                      className="small"
                    />
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="warning"
                    className="fw-bold py-2 rounded-3 text-dark shadow-sm"
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Применить"
                    )}
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="outline-secondary"
                      className="py-2 rounded-3 text-muted border-0"
                      onClick={handleResetFilters}
                      disabled={loading}
                    >
                      <RotateCcw size={14} className="me-1" />
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Правая колонка: Каталог питомцев */}
          <Col lg={9} md={8}>
            {/* Панель со счётчиком и сортировкой */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-white rounded-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2 mb-sm-0">
                <span className="fw-bold text-dark fs-5">Каталог</span>
                <Badge
                  bg="warning"
                  text="dark"
                  className="px-3 py-2 rounded-pill fw-bold fs-6 shadow-none"
                >
                  Найдено питомцев: {ads.length}
                </Badge>
              </div>

              {/* Панель сортировки */}
              <div className="d-flex align-items-center gap-2">
                <ArrowUpDown size={16} className="text-muted d-none d-sm-inline" />
                <span className="small text-muted text-nowrap d-none d-md-inline">
                  Сортировка:
                </span>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-3 shadow-none border py-1 px-2"
                  style={{ minWidth: "160px" }}
                >
                  <option value="newest">Сначала новые</option>
                  <option value="age_desc">Сначала старше</option>
                  <option value="age_asc">Сначала младше</option>
                  <option value="oldest">Сначала старые</option>
                </Form.Select>
              </div>
            </div>

            {/* Активные теги фильтров «Важно для дома» */}
            {(filters.is_sterilized || filters.is_vaccinated || filters.good_with_kids || filters.good_with_animals) && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {filters.is_sterilized && (
                  <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                    <span>✓ Стерилизован</span>
                    <X
                      size={14}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const updated = { ...filters, is_sterilized: false };
                        setFilters(updated);
                        updateUrlParams(updated, searchQuery, sortBy);
                        loadData(updated, searchQuery, sortBy);
                      }}
                    />
                  </Badge>
                )}
                {filters.is_vaccinated && (
                  <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                    <span>✓ Привит</span>
                    <X
                      size={14}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const updated = { ...filters, is_vaccinated: false };
                        setFilters(updated);
                        updateUrlParams(updated, searchQuery, sortBy);
                        loadData(updated, searchQuery, sortBy);
                      }}
                    />
                  </Badge>
                )}
                {filters.good_with_kids && (
                  <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                    <span>✓ Ладит с детьми</span>
                    <X
                      size={14}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const updated = { ...filters, good_with_kids: false };
                        setFilters(updated);
                        updateUrlParams(updated, searchQuery, sortBy);
                        loadData(updated, searchQuery, sortBy);
                      }}
                    />
                  </Badge>
                )}
                {filters.good_with_animals && (
                  <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                    <span>✓ Ладит с животными</span>
                    <X
                      size={14}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const updated = { ...filters, good_with_animals: false };
                        setFilters(updated);
                        updateUrlParams(updated, searchQuery, sortBy);
                        loadData(updated, searchQuery, sortBy);
                      }}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Содержимое: спиннер, карточки или заглушка */}
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5 my-5">
                <Spinner animation="border" variant="warning" />
              </div>
            ) : ads.length === 0 ? (
              <Card className="text-center py-5 px-3 shadow-sm border-0 rounded-4 bg-white my-3">
                <Card.Body>
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "72px",
                      height: "72px",
                      background: "#fff3cd",
                      color: "#ffc107",
                    }}
                  >
                    <HelpCircle size={36} />
                  </div>
                  <h4 className="fw-bold mb-2">По вашим критериям пока никого нет</h4>
                  <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "450px" }}>
                    Попробуйте изменить параметры поиска, расширить возрастной диапазон или сбросить фильтры.
                  </p>
                  <Button
                    variant="warning"
                    className="fw-bold px-4 py-2 rounded-3 shadow-sm text-dark"
                    onClick={handleResetFilters}
                  >
                    <RotateCcw size={16} className="me-2" />
                    Сбросить фильтры
                  </Button>
                </Card.Body>
              </Card>
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
