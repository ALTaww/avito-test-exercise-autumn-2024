import React, { FC, useState } from "react";
import { IOrder, OrderStatus } from "../types/types";
import Btn from "./Btn";
import Modal from "./Modal";
import Orders from "../pages/Orders";
import { Link } from "react-router-dom";
import { paths } from "../paths";

interface IComponent extends IOrder {}

const OrderCard: FC<IComponent> = ({
  id,
  status,
  createdAt,
  finishedAt,
  total,
  deliveryWay,
  items,
}) => {
  const [isShowAll, setIsShowAll] = useState(false);

  function handleModalClose() {
    setIsShowAll(false);
  }

  return (
    <div className="order-card" style={{ marginBottom: "2rem" }}>
      <div>Номер заказа: {id}</div>
      <div>
        Статус:{" "}
        {Object.keys(OrderStatus).find((k) => OrderStatus[k] === status)}
      </div>
      <div>Дата создания: {createdAt}</div>
      <div>Дата завершения: {finishedAt}</div>
      <div>Общая стоимость: {total}</div>
      <div>Способы доставки: {deliveryWay}</div>
      <div>Количество товаров: {items.length}</div>
      <Btn onClick={(e) => setIsShowAll((prev) => !prev)}>
        Показать все товары
      </Btn>
      <Modal
        isOpen={isShowAll}
        onClose={handleModalClose}
        className="order-card-all"
      >
        <div className="order-items">
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: "2rem" }}>
              <div>Название: {item.name}</div>
              <div>Описание: {item.description || "Нет"}</div>
              <div>Цена: {item.price}</div>
              <Link to={paths.AdvertisementPage + item.id}>
                <Btn>Перейти к товару</Btn>
              </Link>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default OrderCard;
