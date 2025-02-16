import React, { useEffect, useRef, useState } from "react";
import { ComponentContainer, EditButton } from "../templates";
import { Link, useParams } from "react-router-dom";
import {
  createNewAbortController,
  fetchWithAbort,
  handleError,
} from "../utils";
import { advertisementsApi } from "../api";
import { IAdvertisment } from "../../types/types";
import placeholderImageUrl from "../assets/images/placeholder-image.webp";
import { Btn, Modal } from "../components";
import { TextField } from "@mui/material";

const EditNameForm: React.FC<{
  initialValue: string;
  onSave: (newName: string) => Promise<void>;
}> = ({ initialValue, onSave }) => {
  const [name, setName] = useState(initialValue);

  const handleSave = async () => {
    await onSave(name);
  };

  return (
    <div>
      <h2>Редактировать название</h2>
      <TextField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите новое название"
      />
      <Btn onClick={handleSave}>Сохранить</Btn>
    </div>
  );
};

const EditPriceForm: React.FC<{
  initialValue: number;
  onSave: (newPrice: number) => Promise<void>;
}> = ({ initialValue, onSave }) => {
  const [price, setPrice] = useState(initialValue);

  const handleSave = async () => {
    await onSave(price);
  };

  return (
    <div>
      <h2>Редактировать цену</h2>
      <TextField
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Введите новую цену"
      />
      <Btn onClick={handleSave}>Сохранить</Btn>
    </div>
  );
};

const EditDescriptionForm: React.FC<{
  initialValue: string;
  onSave: (newDescription: string) => Promise<void>;
}> = ({ initialValue, onSave }) => {
  const [description, setDescription] = useState(initialValue);

  const handleSave = async () => {
    await onSave(description);
  };

  return (
    <div>
      <h2>Редактировать описание</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите новое описание"
      />
      <Btn onClick={handleSave}>Сохранить</Btn>
    </div>
  );
};

const EditImageForm: React.FC<{
  initialValue: string;
  onSave: (newImageUrl: string) => Promise<void>;
}> = ({ initialValue, onSave }) => {
  const [imageUrl, setImageUrl] = useState(initialValue);

  const handleSave = async () => {
    await onSave(imageUrl);
  };

  return (
    <div>
      <h2>Редактировать изображение</h2>
      <TextField
        type="file"
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Введите URL нового изображения"
      />
      <Btn onClick={handleSave}>Сохранить</Btn>
    </div>
  );
};

const AdvertisementPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<IAdvertisment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const abortControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const fetchData = await fetchWithAbort(
          (signal) => advertisementsApi.getAdvertisement(id, signal),
          signal
        );
        console.log(fetchData);
        setData(fetchData);
      } catch (error) {
        const err = handleError(error);
        setError(err.message);
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [id]);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Функция для сохранения изменений на сервер
  const handleSave = async (field: keyof IAdvertisment, value: any) => {
    if (!id) return;
    const updatedInfo = { [field]: value };
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const updatedData = await fetchWithAbort(
        (signal) =>
          advertisementsApi.changeAdvertisement(id, updatedInfo, signal),
        signal
      );
      setData(updatedData);
      closeModal();
      console.log("Данные успешно обновлены:", updatedData);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  return (
    <div className="page advertisement-page">
      <ComponentContainer>
        {data ? (
          <div className="adv">
            <div className="adv-image">
              {data?.imageUrl ? (
                <img src={data.imageUrl} alt="" />
              ) : (
                <img src={placeholderImageUrl} alt="" />
              )}
              <EditButton
                onClick={() =>
                  openModal(
                    <EditImageForm
                      initialValue={data.imageUrl || ""}
                      onSave={(newImageUrl) =>
                        handleSave("imageUrl", newImageUrl)
                      }
                    />
                  )
                }
              />
            </div>
            <div className="adv-info">
              <div className="adv-info-name">
                Название: {data.name}{" "}
                <EditButton
                  onClick={() =>
                    openModal(
                      <EditNameForm
                        initialValue={data.name}
                        onSave={(newName) => handleSave("name", newName)}
                      />
                    )
                  }
                />
              </div>
              <div className="adv-info-price">
                Цена: {data.price}{" "}
                <EditButton
                  onClick={() =>
                    openModal(
                      <EditPriceForm
                        initialValue={data.price}
                        onSave={(newPrice) => handleSave("price", newPrice)}
                      />
                    )
                  }
                />
              </div>
              <div className="adv-info-description">
                {data.description
                  ? `Описание: ${data.description}`
                  : `Описания нет`}
                <EditButton
                  onClick={() =>
                    openModal(
                      <EditDescriptionForm
                        initialValue={data.description || ""}
                        onSave={(newDescription) =>
                          handleSave("description", newDescription)
                        }
                      />
                    )
                  }
                />
              </div>
              <div className="adv-info-likes-views">
                Лайки: <span className="likes">{data.likes}</span>, просмотров:{" "}
                <span className="views">{data.views}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-adv">
            <p>
              Объявление не найдено. Проверьте url, либо напишите нам в{" "}
              <Link to={"#"}>поддержку</Link>
              {error && (
                <div className="error-message">Текст ошибки: {error}</div>
              )}
            </p>
          </div>
        )}
      </ComponentContainer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default AdvertisementPage;
