import React, { useCallback, useEffect, useRef, useState } from "react";
import { ComponentContainer, Loader } from "../templates";
import { Btn, OrderCard } from "../components";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Switch,
} from "@mui/material";
import { IOrder, OrderKeys } from "../types/types";
import { fetchWithAbort, handleError } from "../utils";
import { ordersApi } from "../api";
import "../css/orders.css";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentSortType, setCurrentSortType] = useState<keyof IOrder>("id");
  const [isReverse, setIsReverse] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const currentSortTypeRef = useRef(currentSortType);
  const isReverseRef = useRef(isReverse);

  useEffect(() => {
    currentSortTypeRef.current = currentSortType;
  }, [currentSortType]);

  useEffect(() => {
    isReverseRef.current = isReverse;
  }, [isReverse]);

  const sortBy = useCallback(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      const valueA = a[currentSortTypeRef.current];
      const valueB = b[currentSortTypeRef.current];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return valueA - valueB;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      }

      return 0;
    });

    if (isReverseRef.current) {
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
          <div className="filters-container">
            <FormControl variant="standard">
              <InputLabel id="type-select">Тип</InputLabel>
              <Select
                id="type-select"
                type="select"
                value={currentSortType}
                onChange={(e) =>
                  setCurrentSortType(e.target.value as keyof IOrder)
                }
              >
                {Object.keys(OrderKeys).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl variant="standard">
              <InputLabel id="limit-select">Лимит</InputLabel>
              <Select
                id="limit-select"
                type="select"
                value={`${limit}`}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[5, 10, 20].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Btn onClick={sortBy}>Сортировать</Btn>
          </div>
        </div>
        <Pagination
          page={page}
          count={Math.ceil(orders.length / limit)}
          onChange={(e, value) => setPage(value)}
        />
        <div className="orders">
          {isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {!error ? (
                <div className="orders-container">
                  {orders
                    .slice((page - 1) * limit, page * limit)
                    .map((order, index) => (
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
        <Pagination />
      </ComponentContainer>
    </div>
  );
};

export default Orders;
