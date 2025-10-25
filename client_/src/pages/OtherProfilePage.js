import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Image, Spinner, Row, Col } from "react-bootstrap";
import { getUserById } from "../http/profileAPI";
import defaultAvatar from "../assets/defaultAvatar.png";
import { fetchUserAds } from "../http/advertisementAPI";
import AdvertisementItemMain from "../components/AdvertisementItemMain";

const OtherProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // прокрутка в верх

    const loadData = async () => {
      try {
        const userData = await getUserById(id);
        setUser(userData);

        const userAds = await fetchUserAds(id);
        setAds(userAds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  if (!user)
    return <h3 className="text-center mt-5">Пользователь не найден</h3>;

  return (
    <div className="container py-4">
      <Card className="p-4 mb-4 shadow-sm border-0 rounded-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Image
            src={
              user.user_ava_photo
                ? `${process.env.REACT_APP_API_URL}/${user.user_ava_photo}`
                : defaultAvatar
            }
            roundedCircle
            width={100}
            height={100}
          />
          <div>
            <h3 className="fw-bold mb-0">
              {user.user_name} {user.user_surname}
            </h3>
            <p className="text-muted mb-1">
              {user.user_type === 2
                ? "Приют"
                : user.user_type === 3
                ? "Частное лицо - Волонтёр"
                : "Частное лицо"}
            </p>

            {/* 🔗 Сайт приюта */}
            {user.user_type === 2 && user.user_shelter_site && (
              <a
                href={user.user_shelter_site}
                target="_blank"
                rel="noreferrer"
                className=" text-decoration-none"
              >
                {user.user_shelter_site}
              </a>
            )}
          </div>
        </div>

        {/* ℹ️ Информация только для приютов */}
        {user.user_type === 2 && (
          <div className="mt-3">
            {user.user_shelter_description && (
              <p className="mb-2">{user.user_shelter_description}</p>
            )}

            {user.user_shelter_address && (
              <p className="mb-0 text-muted">
                <strong>Адрес:</strong> {user.user_shelter_address}
              </p>
            )}
          </div>
        )}
      </Card>

      <h4 className="fw-bold mb-3">Объявления пользователя</h4>

      <Row xs={1} md={4} className="g-4 mt-2">
        {ads.length ? (
          ads.map((ad) => (
            <Col key={ad.advertisement_id}>
              <AdvertisementItemMain ad={ad} />
            </Col>
          ))
        ) : (
          <p>Пока нет объявлений</p>
        )}
      </Row>
    </div>
  );
};

export default OtherProfilePage;
