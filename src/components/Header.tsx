import React from "react";
import { Link } from "react-router-dom";
import { paths } from "../paths";
import "../css/header.css";

const Header = () => {
  return (
    <header>
      <div className="header">
        <Link to={paths.Home}>Home</Link>
        <Link to={paths.Advertisements}>Объявления</Link>
        <Link to={paths.AdvertisementPage + "1"}>Объявление</Link>
        <Link to={paths.Orders}>Заказы</Link>
      </div>
    </header>
  );
};

export default Header;
