import React, { useCallback, useEffect, useState } from "react";
import { ComponentContainer, Loader } from "../templates";
import { Btn, OrderCard } from "../components";
import { FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import { IOrder, OrderKeys } from "../types/types";
import { fetchWithAbort, handleError } from "../utils";
import { ordersApi } from "../api";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentSortType, setCurrentSortType] = useState<keyof IOrder>("id");
  const [isReverse, setIsReverse] = useState(false);

  const sortBy = useCallback(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      const valueA = a[currentSortType];
      const valueB = b[currentSortType];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return valueA - valueB;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      }

      return 0;
    });

    if (isReverse) {
      sortedOrders.reverse();
    }

    setOrders(sortedOrders);
  }, [orders, setOrders]);

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
          <h3>Сортировка</h3>
          <Select
            type="select"
            value={currentSortType}
            onChange={(e) => setCurrentSortType(e.target.value as keyof IOrder)}
          >
            {Object.keys(OrderKeys).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <FormControlLabel
            control={
              <Switch
                checked={isReverse}
                onChange={(e) => setIsReverse(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
                name="reversed"
              />
            }
            label="Обратная сортировка"
          />
          <Btn onClick={sortBy}>Сортировать</Btn>
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
