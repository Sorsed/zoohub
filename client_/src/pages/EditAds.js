import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button, Spinner, Card, Row, Col, Image } from "react-bootstrap";
import {
  fetchAdvertisementById,
  updateAdvertisement,
} from "../http/advertisementAPI";
import defaultAnimal from "../assets/defaultAnimal.png";

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type_advertisement: "1",
    animal_name: "",
    breed: "",
    age: "",
    ageUnit: "years",
    description: "",
    location_name: "",
    photos: [],
    tutor_name: "",
    tutor_number: "",
    tutor_email: "",
    is_sterilized: false,
    is_vaccinated: false,
    good_with_kids: false,
    good_with_animals: false,
  });

  const [newFiles, setNewFiles] = useState([]); // новые фото
  const [stages, setStages] = useState([]); // этапы

  // Загружаем объявление
  useEffect(() => {
    const loadAd = async () => {
      try {
        const data = await fetchAdvertisementById(id);

        // возраст
        let ageValue = data.age || 0;
        let ageUnit = "years";
        if (ageValue < 1 && ageValue > 0) {
          ageValue = Math.round(ageValue * 12);
          ageUnit = "months";
        }

        setAd(data);
        setFormData({
          type_advertisement: data.type_advertisement ? String(data.type_advertisement) : "1",
          animal_name: data.animal_name || "",
          breed: data.breed || "",
          age: ageValue,
          ageUnit: ageUnit,
          description: data.description || "",
          location_name: data.location_name || "",
          photos: data.photos?.length
            ? data.photos.map((p) => `${process.env.REACT_APP_API_URL}/${p}`)
            : [],
          tutor_name: data.tutor_name || "",
          tutor_number: data.tutor_number || "",
          tutor_email: data.tutor_email || "",
          is_sterilized: data.is_sterilized || false,
          is_vaccinated: data.is_vaccinated || false,
          good_with_kids: data.good_with_kids || false,
          good_with_animals: data.good_with_animals || false,
        });

        // загружаем этапы, если приют
        if (data.user_type === 2) {
          setStages(
            data.stages?.map((s) => ({
              stage_name: s.stage_name || "",
              stage_description: s.stage_description || "",
              stage_date_start: s.stage_date_start
                ? s.stage_date_start.slice(0, 10)
                : "",
              stage_date_finish: s.stage_date_finish
                ? s.stage_date_finish.slice(0, 10)
                : "",
            })) || []
          );
        }
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить объявление");
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  // Обработка изменений
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Добавление новых фото
  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setNewFiles((prev) => [...prev, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...previewUrls],
    }));
  };

  // Удаление фото
  const handleDeletePhoto = (index) => {
    if (index < formData.photos.length - newFiles.length) {
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }));
      return;
    }

    const newIndex = index - (formData.photos.length - newFiles.length);
    setNewFiles((prev) => prev.filter((_, i) => i !== newIndex));
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Обработка изменений этапов
  const handleStageChange = (index, field, value) => {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      {
        stage_name: "",
        stage_description: "",
        stage_date_start: "",
        stage_date_finish: "",
      },
    ]);
  };

  const handleDeleteStage = (index) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
  };

  // Сохранение изменений
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.animal_name) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    let ageInYears = parseFloat(formData.age) || 0;
    if (formData.ageUnit === "months") ageInYears = ageInYears / 12;

    try {
      const updateData = new FormData();
      updateData.append("animal_name", formData.animal_name);
      updateData.append("breed", formData.breed);
      updateData.append("age", ageInYears);
      updateData.append("description", formData.description);
      updateData.append("location_name", formData.location_name);
      updateData.append("type_advertisement", formData.type_advertisement || 1);

      if (formData.tutor_name) updateData.append("tutor_name", formData.tutor_name || "");
      if (formData.tutor_number) updateData.append("tutor_number", formData.tutor_number || "");
      if (formData.tutor_email) updateData.append("tutor_email", formData.tutor_email || "");

      updateData.append("is_sterilized", formData.is_sterilized);
      updateData.append("is_vaccinated", formData.is_vaccinated);
      updateData.append("good_with_kids", formData.good_with_kids);
      updateData.append("good_with_animals", formData.good_with_animals);

      if (stages.length) updateData.append("stages", JSON.stringify(stages));

      newFiles.forEach((file) => updateData.append("photos", file));

      const remainingOldPhotos = formData.photos
        .filter((url) => !url.startsWith("blob:"))
        .map((url) => url.split("/").pop());

      updateData.append("existing_photos", JSON.stringify(remainingOldPhotos));

      await updateAdvertisement(id, updateData);
      toast.success("Изменения сохранены!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при сохранении изменений");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="text-center py-5 text-muted">
        <p>{error || "Объявление не найдено"}</p>
        <Button variant="outline-warning" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Редактировать объявление</h2>

      <Card className="p-4 shadow-sm border-0 rounded-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Категория объявления</Form.Label>
                <Form.Select
                  name="type_advertisement"
                  value={formData.type_advertisement}
                  onChange={handleChange}
                >
                  <option value="1">Ищет дом / В добрые руки</option>
                  <option value="2">Потерялся (пропал питомец)</option>
                  <option value="3">Найден (ищем хозяев)</option>
                  <option value="4">Нужна передержка</option>
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
                <Form.Label>Местоположение</Form.Label>
                <Form.Control
                  type="text"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              {/* Блок быстрых тегов «Важно для дома» */}
              <div className="border rounded-3 p-3 mb-3 bg-light">
                <h6 className="fw-bold mb-2">Важно для дома</h6>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="edit_is_sterilized"
                      name="is_sterilized"
                      label="Стерилизован / кастрирован"
                      checked={formData.is_sterilized}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="edit_is_vaccinated"
                      name="is_vaccinated"
                      label="Привит"
                      checked={formData.is_vaccinated}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="edit_good_with_kids"
                      name="good_with_kids"
                      label="Ладит с детьми"
                      checked={formData.good_with_kids}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Check
                      type="checkbox"
                      id="edit_good_with_animals"
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
                />
                <Form.Text className="text-muted small">
                  Пишется свободным текстом. А тонкий подбор под образ жизни выполняет интерактивный квиз!
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {ad.user_type === 2 && (
            <>
              <hr />
              <h5 className="mt-3 mb-3 fw-bold">Информация о кураторе</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Имя куратора</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutor_name"
                      value={formData.tutor_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Телефон куратора</Form.Label>
                    <Form.Control
                      type="tel"
                      name="tutor_number"
                      value={formData.tutor_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email куратора</Form.Label>
                    <Form.Control
                      type="email"
                      name="tutor_email"
                      value={formData.tutor_email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h5 className="mt-3 mb-3 fw-bold">Этапы / события</h5>
              {stages.map((stage, index) => (
                <Card className="p-3 mb-3" key={index}>
                  <Row className="mb-2">
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
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Описание этапа</Form.Label>
                        <Form.Control
                          type="text"
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
                  </Row>
                  <Row>
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
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDeleteStage(index)}
                  >
                    Удалить этап
                  </Button>
                </Card>
              ))}
              <Button variant="secondary" onClick={handleAddStage}>
                Добавить этап
              </Button>
            </>
          )}

          <hr />
          <Form.Group className="mb-3">
            <Form.Label>Фотографии</Form.Label>
            <div className="d-flex flex-wrap gap-3 mb-2">
              {formData.photos.length > 0 ? (
                [...formData.photos] // создаём копию массива, чтобы не мутировать оригинал
                  .reverse() // переворачиваем порядок
                  .map((photo, index) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        borderRadius: "1rem",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <Image
                        src={photo || defaultAnimal}
                        alt={`Фото ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          borderRadius: "50%",
                          zIndex: 2,
                        }}
                        onClick={() => handleDeletePhoto(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))
              ) : (
                <p className="text-muted">Нет фото</p>
              )}
            </div>

            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button type="submit" variant="warning">
              Сохранить изменения
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditAd;
