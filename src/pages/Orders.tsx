import React, { useEffect, useState } from "react";
import { ComponentContainer, Loader } from "../templates";
import { Btn, OrderCard } from "../components";
import { MenuItem, TextField } from "@mui/material";
import { IOrder, OrderStatus } from "../types/types";
import { fetchWithAbort, handleError } from "../utils";
import { ordersApi } from "../api";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const ordersData = await fetchWithAbort(
          (signal) => ordersApi.getOrders(0, 999, signal),
          signal
        );
        setOrders(ordersData);
        setError(null);
      } catch (error) {
        const err = handleError(error);
        setError(err.message);
      }
      setIsLoading(false);
    })();

    return () => controller.abort();
  }, []);

  return (
    <div className="page orders-page">
      <ComponentContainer>
        <h1>Мои заказы</h1>
        <div className="filters">
          <TextField type="select">
            {Object.keys(OrderStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <Btn>Сортировать</Btn>
        </div>
        <div className="orders">
          {isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {!error ? (
                <div className="order">
                  {orders.map((order, index) => (
                    <OrderCard key={index} {...order} />
                  ))}
                </div>
              ) : (
                <div className="error-message" style={{ color: "red" }}>
                  {error}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </ComponentContainer>
    </div>
  );
};

export default Orders;
