import React, { useEffect, useState } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
import { getALLFavourites } from "../http/fauvoriteAPI";
import FavouriteItem from "../components/FavouriteItem";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavourites = async () => {
    try {
      const data = await getALLFavourites();
      setFavourites(data);
    } catch (error) {
      console.error("Ошибка при загрузке избранных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!favourites.length) {
    return (
      <div className="text-center text-muted py-5">
        <h4>У вас пока нет избранных объявлений 😿</h4>
        <p className="small">Нажимайте на сердечко в карточках питомцев, чтобы сохранить их здесь.</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <Row xs={1} md={2} lg={2} xl={3} className="g-3">
        {favourites.map((fav) => (
          <Col key={fav.advertisement_id}>
            <FavouriteItem ad={fav} onChange={loadFavourites} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Favourites;
