import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Dropdown } from "react-bootstrap";
import { deleteBrand } from "../../http/deviceAPI";
import { Context } from "..//..";
import { fetchBrands, fetchDevices, fetchTypes } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const DeleteBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [value, setValue] = useState("");

  const delBrand = () => {
    deleteBrand({ brandId: device.selectedBrand.id }).then((data) => {
      //  alert("Бренд удален");
      device.setSelectedBrand({});
      onHide();
    });
    fetchBrands().then((data) => device.setBrands(data));
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
          Удалить бренд
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={delBrand}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default DeleteBrand;
