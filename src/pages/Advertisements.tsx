import React, { useEffect, useRef, useState } from "react";
import { IAdvertisment } from "../types/types";
import { advertisementsApi } from "../api";
import {
  createNewAbortController,
  fetchWithAbort,
  handleError,
} from "../utils";
import { AdvertisementCard, Btn } from "../components";
import ComponentContainer from "../templates/ComponentContainer";
import { Loader } from "../templates";
import "../css/advertisements.css";
import { MenuItem, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { paths } from "../paths";

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState<IAdvertisment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const abortControllerRef = useRef(new AbortController());
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdvertisements();
  }, []);

  async function getAdvertisements() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const adv = await fetchWithAbort(
        (signal) =>
          advertisementsApi.getAdvertisements(
            (page - 1) * limit,
            limit,
            signal
          ),
        signal
      );
      setAdvertisements(adv);
    } catch (error) {
      const err = handleError(error);
      console.error(err);
    }
    setIsLoading(false);
  }

  function openModalForm() {}

  return (
    <div className="page advertisements-page">
      <ComponentContainer>
        <h1>Объявления</h1>
        <div className="place-adv">
          <Btn variant="contained" color="success" onClick={openModalForm}>
            Создать новое объявление
          </Btn>
        </div>
        <div
          className="sorting"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <div>
            <TextField
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ m: "0 1rem 2rem 0", minWidth: 180 }}
              label="Искать по названию"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchItems();
                }
              }}
            />
            <TextField
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={"Все"}
              label="Категория"
              sx={{ m: "0 1rem 2rem 0" }}
            >
              <MenuItem value={"Все"}>Все</MenuItem>

              {[10,20,30].map((value) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </TextField>
            <Btn onClick={searchItems}>Искать</Btn>
          </div> */}
        </div>
        <div className="advertisements">
          {isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {advertisements.map((advertisement) => (
                <AdvertisementCard key={advertisement.id} {...advertisement} />
              ))}
            </React.Fragment>
          )}
        </div>
      </ComponentContainer>
    </div>
  );
};

export default Advertisements;
