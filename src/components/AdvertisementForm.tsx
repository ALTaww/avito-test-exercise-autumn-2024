import { FormControl, TextField } from "@mui/material";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import ImageUploader from "./ImageUploader";
import Btn from "./Btn";
import { createNewAbortController, fetchWithAbort } from "../utils";
import { advertisementsApi } from "../api";
import { IAdvertisment } from "../types/types";
import "../css/advertisement-form.css";

interface IComponent {
  onCreate: (data: IAdvertisment) => void;
}

const AdvertisementForm: FC<IComponent> = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCreateAdvertisement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(price && name && description)) {
      setError("Заполните все необходимые поля");
      return;
    }
    setIsUploading(true); // Начинаем загрузку изображения
  }

  const createAdv = useCallback(async () => {
    if (!(price && name && description)) {
      setError("Заполните все необходимые поля");
      return;
    }
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;
    setIsLoading(true);

    try {
      const data = await fetchWithAbort(
        (signal) =>
          advertisementsApi.makeAdvertisement(
            {
              name,
              description,
              price,
              imageUrl: image,
            },
            signal
          ),
        signal
      );
      console.log(data);
      onCreate(data);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }, [description, name, price, image, onCreate]);

  // Вызываем createAdv после загрузки изображения
  useEffect(() => {
    if (image && isUploading) {
      createAdv();
      setIsUploading(false); // Сбрасываем флаг загрузки
    }
  }, [image, isUploading, createAdv]);

  const handleOnUpload = useCallback((url: string) => {
    setImage(url);
  }, []);

  return (
    <form
      onSubmit={(e) => handleCreateAdvertisement(e)}
      className="advertisement-form"
    >
      <FormControl className="advertisement-form-container">
        <h2>Создать новое объявление</h2>
        <TextField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Название"
          required={true}
        />
        <TextField
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          label="Цена"
          required={true}
        />
        <TextField
          type="textarea"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Описание"
          required={true}
        />
        <ImageUploader
          onUpload={handleOnUpload}
          uploading={isUploading}
          required={false}
        />
        {error && <span className="error-message">{error}</span>}
        <Btn type="submit" loading={isLoading}>
          Создать
        </Btn>
      </FormControl>
    </form>
  );
};

export default AdvertisementForm;
