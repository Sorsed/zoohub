import React, { useContext, useState } from "react";
import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Profile from "./Profile";
import AdvertisementList from "../components/AdvertisementList";
import FavouriteList from "../components/FavouriteList";
import { CREATE_ADS_ROUTE } from "../utils/consts";

const ProfilePage = observer(() => {
  const { user } = useContext(Context);
  const [key, setKey] = useState("myAds");
  const navigate = useNavigate();

  const handleCreateAd = () => {
    navigate(CREATE_ADS_ROUTE);
  };

  return (
    <div className="container py-4">
      <Row>
        {/* Левая колонка — профиль */}
        <Col md={4} className="mb-4">
          <Profile />
        </Col>

        {/* Правая колонка — вкладки и кнопка */}
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Личный кабинет</h4>
            <Button variant="warning" className="fw-semibold" onClick={handleCreateAd}>
              + Создать объявление
            </Button>
          </div>

          <Tabs
            id="profile-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            justify
          >
            <Tab eventKey="myAds" title="Мои объявления">
              <AdvertisementList userId={user.user?.user_id} />
            </Tab>
            <Tab eventKey="favourites" title="Избранное">
              <FavouriteList />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
});

export default ProfilePage;
