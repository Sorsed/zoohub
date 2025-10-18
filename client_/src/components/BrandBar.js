import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";

const BrandBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <Row>
      {" "}
      <Col className="d-flex">
        <Card
          style={{ cursor: "pointer" }}
          key={1}
          className="p-3"
          onClick={() => device.setSelectedBrand({})}
          border={device.selectedBrand.id == undefined ? "danger" : "light"}
        >
          {"пуе"}
        </Card>
        {device.brands?.map((brand) => (
          <Card
            style={{ cursor: "pointer" }}
            key={brand.id}
            className="p-3"
            onClick={() => device.setSelectedBrand(brand)}
            border={brand.id === device.selectedBrand.id ? "danger" : "light"}
          >
            {brand.name}
          </Card>
        ))}
      </Col>
    </Row>
  );
});

export default BrandBar;
