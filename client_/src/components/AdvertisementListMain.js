import React from "react";
import { Spinner, Alert, Row, Col } from "react-bootstrap";
import AdvertisementItemMain from "./AdvertisementItemMain";

const AdvertisementListMain = ({ ads = [], loading }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return <p className="text-center text-muted mt-3">Объявлений пока нет</p>;
  }

  return (
    <Row xs={1} md={4} className="g-4 mt-2">
      {ads.map((ad) => (
        <Col key={ad.advertisement_id}>
          <AdvertisementItemMain ad={ad} />
        </Col>
      ))}
    </Row>
  );
};

export default AdvertisementListMain;
