import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import star from "../assets/star.png";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";

const DeviceItem = ({ device }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const cardContainerStyle = {
    transition: "transform 0.3s ease",
    transform: isHovered ? "translateY(-10px)" : "translateY(0)",
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Col
      md={3}
      className="mt-3"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardContainerStyle}
    >
      <Card
        style={{ width: 230, height: 280, cursor: "pointer" }}
        border="green"
      >
        <Image
          className="ms-2"
          width={160}
          height={200}
          src={process.env.REACT_APP_API_URL + device.img}
        />
        <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center"></div>
        <div className="ms-2">{device.name}</div>
        <div className="d-flex justify-content-end ">{device.price} ₽</div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
