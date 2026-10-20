import React, { useState, useContext } from "react";
import { Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { createAdvertisement } from "../http/advertisementAPI";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";

const animalTypeMap = {
  Собака: 1,
  Кошка: 2,
  Птица: 3,
  Грызун: 4,
  Другое: 5,
  Попугай: 3,
  Хомяк: 4,
  Кролик: 4,
  Черепаха: 5,
  Лошадь: 5,
  Рыбка: 5,
  Игуана: 5,
};

const CreateAds = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type_advertisement: "1",
    animal_type: "",
    animal_name: "",
    breed: "",
    age: "",
    ageUnit: "years",
    description: "",
    location_name: "",
    tutor_name: "",
    tutor_number: "",
    tutor_email: "",
    is_sterilized: false,
    is_vaccinated: false,
    good_with_kids: false,
    good_with_animals: false,
  });

  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // 🧩 События (этапы)
  const [stages, setStages] = useState([
    {
      stage_name: "",
      stage_description: "",
      stage_date_start: "",
      stage_date_finish: "",
    },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 10) {
      toast.error("Можно загрузить максимум 10 фото");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // 🔄 Управление этапами
  const addStage = () => {
    setStages([
      ...stages,
      {
        stage_name: "",
        stage_description: "",
        stage_date_start: "",
        stage_date_finish: "",
      },
    ]);
  };

  const removeStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleStageChange = (index, field, value) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.animal_name ||
      !formData.animal_type ||
      !formData.location_name
    ) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    const type_id = animalTypeMap[formData.animal_type];
    if (!type_id) {
      toast.error("Выберите корректный тип животного");
      return;
    }

    let ageInYears = parseFloat(formData.age) || 0;
    if (formData.ageUnit === "months") ageInYears /= 12;

    try {
      const data = new FormData();
      data.append("animal_name", formData.animal_name);
      data.append("breed", formData.breed);
      data.append("age", ageInYears);
      data.append("description", formData.description);
      data.append("type_id", type_id);
      data.append("type_advertisement", formData.type_advertisement || 1);
      data.append("location_name", formData.location_name);

      if (formData.tutor_name) data.append("tutor_name", formData.tutor_name);
      if (formData.tutor_number) data.append("tutor_number", formData.tutor_number);
      if (formData.tutor_email) data.append("tutor_email", formData.tutor_email);

      data.append("is_sterilized", formData.is_sterilized);
      data.append("is_vaccinated", formData.is_vaccinated);
      data.append("good_with_kids", formData.good_with_kids);
      data.append("good_with_animals", formData.good_with_animals);

      // Добавляем массив этапов как JSON
      const validStages = stages.filter((s) => s.stage_name && s.stage_name.trim() !== "");
      if (validStages.length) {
        data.append("stages", JSON.stringify(validStages));
      }

      photos.forEach((file) => data.append("photos", file));

      const response = await createAdvertisement(data);
      toast.success("Объявление успешно создано!");
      navigate(`/ads/${response.advertisement.advertisement_id}`);
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при создании объявления");
    }
  };

  return (
    <div className="container py-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="fw-bold mb-3 text-center">Создание объявления</h3>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Категория объявления</Form.Label>
                <Form.Select
                  name="type_advertisement"
                  value={formData.type_advertisement}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Ищет дом / В добрые руки</option>
                  <option value="2">Потерялся (пропал питомец)</option>
                  <option value="3">Найден (ищем хозяев)</option>
                  <option value="4">Нужна передержка</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Тип животного</Form.Label>
                <Form.Select
                  name="animal_type"
                  value={formData.animal_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите тип</option>
                  {Object.keys(animalTypeMap).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Имя животного</Form.Label>
                <Form.Control
                  type="text"
                  name="animal_name"
                  value={formData.animal_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Порода</Form.Label>
                <Form.Control
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Возраст</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    style={{ maxWidth: "120px" }}
                  />
                  <Form.Select
                    name="ageUnit"
                    value={formData.ageUnit}
                    onChange={handleChange}
                    style={{ maxWidth: "120px" }}
                  >
                    <option value="years">Годы</option>
                    <option value="months">Месяцы</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Местоположение / Город</Form.Label>
                <Form.Control
                  type="text"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Контакты куратора / автора объявления */}
              <div className="border rounded-3 p-3 mb-3 bg-light">
                <h6 className="fw-bold mb-2">Контакты для связи</h6>
                <Form.Group className="mb-2">
                  <Form.Label className="small text-muted mb-1">Имя куратора / контактного лица</Form.Label>
                  <Form.Control
                    type="text"
                    name="tutor_name"
                    value={formData.tutor_name}
                    onChange={handleChange}
                    placeholder="Например: Анна"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small text-muted mb-1">Телефон для связи</Form.Label>
                  <Form.Control
                    type="text"
                    name="tutor_number"
                    value={formData.tutor_number}
                    onChange={handleChange}
                    placeholder="+7 (999) 000-00-00"
                  />
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Label className="small text-muted mb-1">Email (необязательно)</Form.Label>
                  <Form.Control
                    type="email"
                    name="tutor_email"
                    value={formData.tutor_email}
                    onChange={handleChange}
                    placeholder="contact@zoohub.ru"
                  />
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              {/* Блок быстрых тегов «Важно для дома» */}
              <div className="border rounded-3 p-3 mb-3 bg-light">
                <h6 className="fw-bold mb-2">Важно для дома</h6>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="is_sterilized"
                      name="is_sterilized"
                      label="Стерилизован / кастрирован"
                      checked={formData.is_sterilized}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="is_vaccinated"
                      name="is_vaccinated"
                      label="Привит"
                      checked={formData.is_vaccinated}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="good_with_kids"
                      name="good_with_kids"
                      label="Ладит с детьми"
                      checked={formData.good_with_kids}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="good_with_animals"
                      name="good_with_animals"
                      label="Ладит с другими животными"
                      checked={formData.good_with_animals}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Описание</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Расскажите живым языком о характере подопечного, его истории, привычках, приученности к поводку или лотку..."
                  required
                />
                <Form.Text className="text-muted small">
                  Пишется свободным текстом. А тонкий подбор под образ жизни будущего хозяина определит интерактивный тест!
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фотографии (до 10)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddPhotos}
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {previewUrls.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      thumbnail
                      width={90}
                      height={90}
                      className="rounded-3"
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {(user.user?.user_type === 2 || user.user?.user_type === 3) && (
            <div className="mt-4">
              <h5 className="fw-bold mb-3">Этапы (события)</h5>
              {stages.map((stage, index) => (
                <Card key={index} className="p-3 mb-3 shadow-sm">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Название этапа</Form.Label>
                        <Form.Control
                          type="text"
                          value={stage.stage_name}
                          onChange={(e) =>
                            handleStageChange(
                              index,
                              "stage_name",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={stage.stage_description}
                          onChange={(e) =>
                            handleStageChange(
                              index,
                              "stage_description",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Дата начала</Form.Label>
                        <Form.Control
                          type="date"
                          value={stage.stage_date_start}
                          onChange={(e) =>
                            handleStageChange(
                              index,
                              "stage_date_start",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Дата окончания (необязательно)</Form.Label>
                        <Form.Control
                          type="date"
                          value={stage.stage_date_finish}
                          onChange={(e) =>
                            handleStageChange(
                              index,
                              "stage_date_finish",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {stages.length > 1 && (
                    <div className="d-flex justify-content-end mt-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeStage(index)}
                      >
                        Удалить этап
                      </Button>
                    </div>
                  )}
                </Card>
              ))}

              <Button variant="outline-primary" size="sm" onClick={addStage}>
                + Добавить этап
              </Button>
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button variant="warning" type="submit">
              Создать объявление
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default CreateAds;
