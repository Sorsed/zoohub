import React, { useEffect, useState } from "react";
import { Spinner, Alert, Row, Col } from "react-bootstrap";
import AdvertisementItem from "./AdvertisementItem";
import { fetchAllMyAdvertisements } from "../http/advertisementAPI";

const AdvertisementList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchAllMyAdvertisements();
        setAds(data);
      } catch (e) {
        setError("Ошибка при загрузке объявлений");
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  // ✅ функция для удаления объявления из списка без перезагрузки
  const handleDelete = (id) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.advertisement_id !== id));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (ads.length === 0) {
    return <p className="text-center text-muted mt-3">Объявлений пока нет</p>;
  }

  return (
    <Row xs={1} md={2} className="g-4 mt-2">
      {ads.map((ad) => (
        <Col key={ad.advertisement_id}>
          {/* 👉 Передаём колбэк для удаления */}
          <AdvertisementItem ad={ad} onDelete={handleDelete} />
        </Col>
      ))}
    </Row>
  );
};

export default AdvertisementList;
