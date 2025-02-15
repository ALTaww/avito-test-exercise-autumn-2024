import React, { useEffect, useRef, useState } from "react";
import { IAdvertisment } from "../../types/types";
import { advertisementsApi } from "../api";
import {
  createNewAbortController,
  fetchWithAbort,
  handleError,
} from "../utils";
import { AxiosError } from "axios";
import { AdvertisementCard } from "../components";
import ComponentContainer from "../templates/ComponentContainer";
import { Loader } from "../templates";

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState<IAdvertisment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const abortControllerRef = useRef(new AbortController());
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="page advertisements-page">
      <ComponentContainer>
        <h1>Объявления</h1>
      </ComponentContainer>
      <ComponentContainer>
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
