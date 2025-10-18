import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Row from "react-bootstrap/Row";
import DeviceItem from "./DeviceItem";

const RecDeviceList = observer(() => {
  const [randomDevices, setRandomDevices] = useState([]);
  const { recdevice } = useContext(Context);

  useEffect(() => {
    // Функция для случайного перемешивания массива
    const shuffleArray = (array) => {
      return array.sort(() => Math.random() - 0.5);
    };

    if (recdevice.devices.length > 0) {
      // Перемешиваем массив и берем первые 4 элемента
      const shuffledDevices = shuffleArray([...recdevice.devices]);
      setRandomDevices(shuffledDevices.slice(0, 4));
    }
  }, [recdevice.devices]); // Обновляем при изменении списка устройств

  return (
    <Row className="d-flex">
      {randomDevices.map((device) => (
        <DeviceItem key={device.id} device={device} />
      ))}
    </Row>
  );
});

export default RecDeviceList;
