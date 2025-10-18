import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

import { Form, Row, Col, InputGroup, Button, Card } from "react-bootstrap";

const Cost = observer(() => {
  const { device } = useContext(Context);
  const [price1, setPrice1] = useState(device.selectedPriceFrom);
  const [price2, setPrice2] = useState(device.selectedPriceBefore);

  return (
    <Card className="p-2 mb-4">
      <Card.Title>
        <h6>
          <strong>Цена</strong>
        </h6>
      </Card.Title>
      <Row>
        <Col xs={12} md={6}>
          <Form.Label>От</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>₽</InputGroup.Text>
            <Form.Control
              value={price1}
              onChange={(e) => setPrice1(Number(e.target.value))}
              placeholder="Введите цену"
              type="number"
              min={0}
            />
          </InputGroup>
        </Col>

        <Col xs={12} md={6}>
          <Form.Label>До</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>₽</InputGroup.Text>
            <Form.Control
              value={price2}
              onChange={(e) => setPrice2(Number(e.target.value))}
              placeholder="Введите цену"
              type="number"
              min={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Button
        variant="primary"
        onClick={() => {
          device.setSelectedPriceFrom(price1);
          device.setSelectedPriceBefore(price2);
          console.log(device.selectedPriceFrom);
        }}
      >
        Применить фильтр
      </Button>
    </Card>
  );
});

export default Cost;
