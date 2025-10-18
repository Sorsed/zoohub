import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Context } from "../../index";
import {
  createDevice,
  fetchBrands,
  fetchDevices,
  fetchTypes,
  fetchOneDevice,
  changeDevice,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const ChangeDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState([]);
  // const [number, setNumber] = useState(0);
  //const [device1, setDevice1] = useState({ info: [] });
  const [generalInfo, setGeneralInfo] = useState("");
  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };
  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };
  const changeInfo = (key, value, number) => {
    console.log(number);
    setInfo(
      info.map((i) => (i.number === number ? { ...i, [key]: value } : i))
    );
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addDevice = () => {
    const formData = new FormData();
    formData.append("deviceId", device.selectedDevice.id);
    formData.append("name", name);
    formData.append("price", `${price}`);
    formData.append("img", file);
    formData.append("brandId", device.selectedBrand.id);
    formData.append("typeId", device.selectedType.id);
    formData.append("info", JSON.stringify(info));
    formData.append("generalInfo", generalInfo);
    console.log(formData.get("name"));
    changeDevice(formData).then((data) => onHide());
  };

  const changeFunc = async (id) => {
    console.log(id);
    const data = await fetchOneDevice(id);
    //  setDevice1(data);
    setName(data.name);
    setPrice(data.price);
    setGeneralInfo(data.generalInfo);
    setFile(process.env.REACT_APP_API_URL + data.img);

    let currentIndex = 0;
    const updatedInfo = data.info.map((i) => ({
      title: i.title,
      description: i.description,
      number: currentIndex++,
    }));
    setInfo(updatedInfo);
    //setInfo(data.info);
    console.log(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить устройство
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
                  onClick={() => device.setSelectedType(type)}
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
            <Dropdown.Toggle>{name || "Выберите товар"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.devices.map((device1) => (
                <Dropdown.Item
                  onClick={() => {
                    changeFunc(device1.id);
                    device.setSelectedDevice(device1);
                  }}
                  key={device1.id}
                >
                  {device1.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3"
            placeholder="Введите название устройства"
          />
          <Form.Control
            as="textarea" // Это превращает элемент в текстовую область (textarea)
            value={generalInfo}
            onChange={(e) => setGeneralInfo(e.target.value)}
            className="mt-3"
            placeholder="Введите информацию об устройстве"
            style={{ height: "200px", resize: "both" }} // Устанавливаем высоту и разрешаем изменять размер
          />
          <Form.Control
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-3"
            placeholder="Введите стоимость устройства"
            type="number"
          />
          <Form.Control className="mt-3" type="file" onChange={selectFile} />
          <hr />
          <Button variant={"outline-dark"} onClick={addInfo}>
            Добавить новое свойство
          </Button>
          {info.map((i) => (
            <Row className="mt-4" key={i.number}>
              <Col md={4}>
                <Form.Control
                  value={i.title}
                  onChange={(e) =>
                    changeInfo("title", e.target.value, i.number)
                  }
                  placeholder="Введите название свойства"
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  value={i.description}
                  onChange={(e) =>
                    changeInfo("description", e.target.value, i.number)
                  }
                  placeholder="Введите описание свойства"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeInfo(i.number)}
                  variant={"outline-danger"}
                >
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addDevice}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ChangeDevice;
