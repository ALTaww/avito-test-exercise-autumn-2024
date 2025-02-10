import React, { FC } from "react";
import placeholderImage from "../assets/images/placeholder-image.webp";

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
      {imageUrl?.length ? (
        <img src={imageUrl} alt="" />
      ) : (
        <img src={placeholderImage} alt="" />
      )}
      <div>{name}</div>
      <div>{price}</div>
      <div>{views}</div>
      <div>{likes}</div>
    </div>
  );
};

export default AdvertisementCard;
