import React, { useEffect, useRef, useState } from "react";
import { IAdvertisment } from "../types/types";
import { advertisementsApi } from "../api";
import {
  createNewAbortController,
  fetchWithAbort,
  handleError,
} from "../utils";
import {
  AdvertisementCard,
  AdvertisementForm,
  Btn,
  Modal,
} from "../components";
import ComponentContainer from "../templates/ComponentContainer";
import { Loader } from "../templates";
import "../css/advertisements.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState<IAdvertisment[]>([]);
  const [visibleAdvertisements, setVisibleAdvertisements] =
    useState<IAdvertisment[]>(advertisements);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const abortControllerRef = useRef(new AbortController());
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    getAdvertisements();
  }, []);

  async function getAdvertisements() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const adv = await fetchWithAbort(
        (signal) => advertisementsApi.getAdvertisements(0, 999, signal),
        signal
      );
      setAdvertisements(adv);
      setVisibleAdvertisements(adv);
    } catch (error) {
      const err = handleError(error);
      console.error(err);
    }
    setIsLoading(false);
  }

  function searchItems() {
    const sortedAdvertisements = advertisements.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    setVisibleAdvertisements(sortedAdvertisements);
  }

  return (
    <div className="page advertisements-page">
      <ComponentContainer>
        <h1>Объявления</h1>
        <div className="place-adv">
          <Btn
            variant="contained"
            color="success"
            onClick={() => setIsModalOpen(true)}
          >
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
          <div>
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
            <Btn onClick={searchItems}>Искать</Btn>
          </div>
        </div>
        <Pagination
          className="pagination"
          page={page}
          count={Math.ceil(visibleAdvertisements.length / limit)}
          onChange={(e, value) => setPage(value)}
        />
        <div className="advertisements">
          {isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {visibleAdvertisements
                .slice((page - 1) * limit, page * limit)
                .map((advertisement) => (
                  <AdvertisementCard
                    key={advertisement.id}
                    {...advertisement}
                  />
                ))}
            </React.Fragment>
          )}
        </div>
        <Pagination
          className="pagination"
          page={page}
          count={Math.ceil(visibleAdvertisements.length / limit)}
          onChange={(e, value) => setPage(value)}
        />
      </ComponentContainer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AdvertisementForm
          onCreate={(data) => {
            setAdvertisements([...advertisements, data]);
            closeModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Advertisements;
