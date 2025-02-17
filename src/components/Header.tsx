import React from "react";
import { Link } from "react-router-dom";
import { paths } from "../paths";
import "../css/header.css";
import { ComponentContainer } from "../templates";

const Header = () => {
  return (
    <header>
      <ComponentContainer>
        <div className="header">
          <Link to={paths.Home}>Home</Link>
          <Link to={paths.Advertisements}>Объявления</Link>
          <Link to={paths.AdvertisementPage + "1"}>Объявление</Link>
          <Link to={paths.Orders}>Заказы</Link>
        </div>
      </ComponentContainer>
    </header>
  );
};

export default Header;
