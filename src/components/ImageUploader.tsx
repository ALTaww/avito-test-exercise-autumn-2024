import React, { useCallback, useEffect, useRef, useState } from "react";
import { createNewAbortController, fetchWithAbort } from "../utils";
import { serverApi } from "../api";
import Btn from "./Btn";

interface IComponent {
  onUpload: (url: string) => void;
  uploading?: boolean;
  required?: boolean;
}

const ImageUploader: React.FC<IComponent> = ({
  onUpload,
  uploading,
  required,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Проверяем, является ли файл изображением
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(
          "Пожалуйста, выберите файл изображения (JPEG, PNG, GIF и т.д.)."
        );
        setFile(null);
      }
    }
  };

  const handleUpload = useCallback(
    async (
      e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e?.preventDefault();
      if (!required && !file) {
        onUpload("");
        return;
      }

      if (!file) {
        setError("Пожалуйста, выберите файл.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const { controller, signal } =
        createNewAbortController(abortControllerRef);
      abortControllerRef.current = controller;

      try {
        const data = await fetchWithAbort(
          (signal) => serverApi.uploadFile(formData, signal),
          signal
        );
        onUpload(data.url); // URL загруженного изображения
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        setError(
          "Ошибка при загрузке файла. Пожалуйста, проверьте что вы запустили ts-node server.ts и попробуйте ещё раз."
        );
      }
    },
    [file, onUpload, required]
  );

  // Управление загрузкой изображения извне через uploading
  useEffect(() => {
    if (uploading) {
      handleUpload();
    }
  }, [uploading, handleUpload]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploading !== false && <Btn onClick={handleUpload}>Загрузить</Btn>}
    </div>
  );
};

export default ImageUploader;
