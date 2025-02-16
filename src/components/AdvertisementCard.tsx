import React, { FC } from "react";
import placeholderImage from "../assets/images/placeholder-image.webp";
import "../css/advertisement-card.css";

interface IComponent {
  name: string;
  price: number;
  imageUrl?: string;
  views: number;
  likes: number;
  props?: unknown;
}

const AdvertisementCard: FC<IComponent> = ({
  name,
  imageUrl,
  price,
  views,
  likes,
  ...props
}) => {
  return (
    <div className="advertisement-card">
      <div className="advertisement-card-image">
        {imageUrl?.length ? (
          <img src={imageUrl} alt="" />
        ) : (
          <img src={placeholderImage} alt="" />
        )}
      </div>
      <div className="advertisement-card-info">
        <div>Название: {name}</div>
        <div>Цена {price}</div>
        <div>Просмотры: {views}</div>
        <div>Лайки: {likes}</div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
