import React, { FC } from "react";
import "../css/advertisement-card.css";
import { setImage } from "../utils/helpers";
import Btn from "./Btn";
import { Link } from "react-router-dom";
import { paths } from "../paths";

interface IComponent {
  id: number | string;
  name: string;
  price: number;
  imageUrl?: string;
  views: number;
  likes: number;
  props?: unknown;
}

const AdvertisementCard: FC<IComponent> = ({
  id,
  name,
  imageUrl,
  price,
  views,
  likes,
  ...props
}) => {
  return (
    <div className="advertisement-card">
      <div className="advertisement-card-image">{setImage(imageUrl)}</div>
      <div className="advertisement-card-info">
        <div>Название: {name}</div>
        <div>Цена {price}</div>
        <div>Просмотры: {views}</div>
        <div>Лайки: {likes}</div>
      </div>
      <div className="advertisement-card-button">
        <Link to={paths.AdvertisementPage + id}>
          <Btn>Открыть</Btn>
        </Link>
      </div>
    </div>
  );
};

export default AdvertisementCard;
