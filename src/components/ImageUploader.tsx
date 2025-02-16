import React, { useRef, useState } from "react";
import { createNewAbortController, fetchWithAbort } from "../utils";
import { serverApi } from "../api";
import Btn from "./Btn";

const ImageUploader: React.FC<{ onUpload: (url: string) => void }> = ({
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const data = await fetchWithAbort(
        (signal) => serverApi.uploadFile(formData, signal),
        signal
      );
      console.log(data);
      onUpload(data.url); // URL загруженного изображения
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Btn onClick={handleUpload}>Загрузить</Btn>
    </div>
  );
};

export default ImageUploader;
