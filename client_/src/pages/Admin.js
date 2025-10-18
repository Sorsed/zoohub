import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Row, Container } from "react-bootstrap";
import CreateBrand from "../components/models/CreateBrand";
import CreateDevice from "../components/models/CreateDevice";
import CreateType from "../components/models/CreateType";
import DeleteDevice from "../components/models/DeleteDevice";
import { SHOP_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import ChangeDevice from "../components/models/ChangeDevice";
import DeleteType from "../components/models/DeleteType";
import DeleteBrand from "../components/models/DeleteBrand";
const Admin = () => {
  const navigate = useNavigate();
  const [brandVisible, setBrandVisible] = useState(false);
  const { user } = useContext(Context);
  const [typeVisible, setTypeVisible] = useState(false); // изначально false
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [deviceDelVisible, setDeviceDelVisible] = useState(false);
  const [deviceChangeVisible, setDeviceChangeVisible] = useState(false);
  const [typeDelVisible, setTypeDelVisible] = useState(false);
  const [brandDelVisible, setbrandDelVisible] = useState(false);
  console.log(brandVisible, typeVisible, deviceVisible);

  useEffect(() => {
    if (user.user.role !== "ADMIN") {
      navigate(SHOP_ROUTE); // Перенаправление, если роль не "ADMIN"
    }
  }, [user, navigate]); // Хук запускается, когда объект user изменяется
  return (
    <Container className="d-flex flex-column">
      <Row>
        <Col md={3} className="d-flex flex-column">
          {" "}
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            style={{ width: "200px" }}
            onClick={() => setTypeVisible(true)}
          >
            Добавить тип
          </Button>
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            style={{ width: "200px" }}
            onClick={() => setBrandVisible(true)}
          >
            Добавить бренд
          </Button>
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            style={{ width: "200px" }}
            onClick={() => setDeviceVisible(true)}
          >
            Добавить устройство
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={() => setDeviceChangeVisible(true)}
            style={{ width: "200px" }}
          >
            Изменить устройство
          </Button>
        </Col>
        <Col md={3} className="d-flex flex-column">
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={() => setbrandDelVisible(true)}
          >
            Удалить бренд
          </Button>

          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={() => setDeviceDelVisible(true)}
          >
            Удалить устройство
          </Button>
          <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={() => setTypeDelVisible(true)}
          >
            Удалить тип
          </Button>
        </Col>
      </Row>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <DeleteDevice
        show={deviceDelVisible}
        onHide={() => setDeviceDelVisible(false)}
      />
      <ChangeDevice
        show={deviceChangeVisible}
        onHide={() => setDeviceChangeVisible(false)}
      />
      <DeleteBrand
        show={brandDelVisible}
        onHide={() => setbrandDelVisible(false)}
      />
      <DeleteType
        show={typeDelVisible}
        onHide={() => setTypeDelVisible(false)}
      />
    </Container>
  );
};

export default Admin;
