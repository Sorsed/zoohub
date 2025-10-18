import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Dropdown } from "react-bootstrap";
import { createType } from "../../http/deviceAPI";
import { Context } from "..//..";
import {
  fetchBrands,
  fetchDevices,
  fetchTypes,
  deleteDevice,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const DeleteDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const delDevice = () => {
    console.log(device.selectedDevice.id);
    deleteDevice({ deviceId: device.selectedDevice.id }).then((data) => {
      onHide();
    });
  };

  useEffect(() => {
    fetchDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      device.limit,
      device.selectedPriceFrom,
      device.selectedPriceBefore
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [
    device.page,
    device.selectedType,
    device.selectedBrand,
    device.selectedPriceFrom,
    device.selectedPriceBefore,
  ]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Удалить товар
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedType.name || "Выберите тип"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map((type) => (
                <Dropdown.Item
                  onClick={() => {
                    device.setSelectedType(type);
                  }}
                  key={type.id}
                >
                  {type.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedBrand.name || "Выберите бренд"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.brands.map((brand) => (
                <Dropdown.Item
                  onClick={() => device.setSelectedBrand(brand)}
                  key={brand.id}
                >
                  {brand.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedDevice.name || "Выберите товар"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.devices.map((device1) => (
                <Dropdown.Item
                  onClick={() => {
                    device.setSelectedDevice(device1);
                    console.log(device.selectedDevice.id);
                  }}
                  key={device1.id}
                >
                  {device1.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={delDevice}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default DeleteDevice;
