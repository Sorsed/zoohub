import React from "react";
import FavouriteList from "../components/FavouriteList";
import { Card } from "react-bootstrap";

const Favourites = () => {
  return (
    <div className="container py-4">
      <Card className="p-4 border-0 shadow-sm rounded-4">
        <h3 className="fw-bold mb-4 text-center">Избранные объявления</h3>
        <FavouriteList />
      </Card>
    </div>
  );
};

export default Favourites;
