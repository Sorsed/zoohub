import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

const BrandBar2 = observer(() => {
  const { device } = useContext(Context);
  return (
    <ListGroup>
      <ListGroup.Item
        style={{ cursor: "pointer" }}
        active={
          device.selectedBrand.id == {} || device.selectedBrand.id == undefined
        } // Проверяем, что тип не выбран
        onClick={() => device.setSelectedBrand({})}
        key={0} // Уникальный ключ
      >
        <strong>Все бренды</strong>
      </ListGroup.Item>
      {device.brands?.map((brand) => (
        <ListGroup.Item
          style={{ cursor: "pointer" }}
          active={brand.id === device.selectedBrand.id}
          onClick={() => device.setSelectedBrand(brand)}
          key={brand.id}
        >
          {brand.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default BrandBar2;
