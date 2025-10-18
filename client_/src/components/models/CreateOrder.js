import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { addOrder } from "../../http/orderAPI";
import { Context } from "..//..";

const CreateOrder = ({ show, onHide }) => {
  const { basket } = useContext(Context);
  const { user } = useContext(Context);
  const [infoOrder, setInfoOrder] = useState([]);

  // Обновляем состояние totalAmount каждый раз, когда basket изменяется
  const totalAmount = basket.devices.reduce((sum, device) => {
    return sum + device.price * device.basket_devices[0].count;
  }, 0);

  // Обновляем информацию о заказе при изменении корзины
  useEffect(() => {
    const orderItems = basket.devices.map((device) => ({
      name: device.name,
      price: device.price,
      quantity: device.basket_devices[0].count,
    }));
    setInfoOrder(orderItems);
  }, [basket.devices]); // отслеживаем изменения в корзине

  const createOrder = async () => {
    console.log(infoOrder);
    try {
      await addOrder(infoOrder, user.user.id).then(
        (data) => alert("Заказ успешно добавлен!"),
        onHide()
      );
    } catch (error) {
      console.error("Ошибка при добавлении заказа", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Заказ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <tr>
          <td style={{ padding: "1rem" }}>Товар</td>
          <td style={{ padding: "1rem" }}>Колво</td>
          <td style={{ padding: "1rem" }}>Цена</td>
          <td style={{ padding: "1rem" }}>Общая стоимость ₽</td>
        </tr>
        {basket.devices.map((device) => (
          <tr key={device.id}>
            <td style={{ padding: "1rem" }}>{device.name}</td>
            <td style={{ padding: "1rem" }}>
              {device.basket_devices[0].count}
            </td>
            <td style={{ padding: "1rem" }}>{device.price}</td>
            <td style={{ padding: "1rem" }}>
              {device.price * device.basket_devices[0].count}
            </td>
          </tr>
        ))}
        <div style={{ padding: "1rem", textAlign: "right" }}>
          Итого: {totalAmount}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={() => {
            createOrder();
          }}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateOrder;
