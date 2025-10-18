import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Dropdown } from "react-bootstrap";
import { deleteType } from "../../http/deviceAPI";
import { Context } from "..//..";
import { fetchBrands, fetchDevices, fetchTypes } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const DeleteType = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [value, setValue] = useState("");

  const delType = () => {
    deleteType({ typeId: device.selectedType.id }).then((data) => {
      // alert("Тип удален");
      device.setSelectedType({});
      onHide();
    });
    fetchTypes().then((data) => device.setTypes(data));
  };
  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
  }, [device.selectedType, device.selectedBrand]); // Only fetch types, not devices

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Удалить тип
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={delType}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default DeleteType;
