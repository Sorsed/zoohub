import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

const TypeBar = observer(() => {
  const { device } = useContext(Context);
  console.log(device.selectedType);
  return (
    <ListGroup>
      <ListGroup.Item
        style={{ cursor: "pointer" }}
        active={
          device.selectedType.id == {} || device.selectedType.id == undefined
        } // Проверяем, что тип не выбран
        onClick={() => device.setSelectedType({})}
        key={0} // Уникальный ключ
      >
        <strong>Все типы</strong>
      </ListGroup.Item>
      {device.types?.map((type) => (
        <ListGroup.Item
          style={{ cursor: "pointer" }}
          active={type.id === device.selectedType.id}
          onClick={() => device.setSelectedType(type)}
          key={type.id}
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
