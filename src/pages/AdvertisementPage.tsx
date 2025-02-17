import React, { useEffect, useRef, useState } from "react";
import { ComponentContainer, EditButton, Loader } from "../templates";
import { Link, useParams } from "react-router-dom";
import {
  createNewAbortController,
  fetchWithAbort,
  handleError,
} from "../utils";
import { advertisementsApi } from "../api";
import { IAdvertisment } from "../../types/types";
import { Btn, Modal } from "../components";
import { TextField } from "@mui/material";
import ImageUploader from "../components/ImageUploader";
import { setImage } from "../utils/helpers";
import "../css/advertisement-page.css";

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
  onSave: (newImageUrl: string) => Promise<void>;
}> = ({ onSave }) => {
  const handleSave = async (imageUrl: string) => {
    await onSave(imageUrl);
  };

  return (
    <div>
      <h2>Редактировать изображение</h2>
      <ImageUploader
        onUpload={(url) => {
          handleSave(url);
        }}
      />
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
        setData(fetchData);
      } catch (error) {
        const err = handleError(error);
        setError(err.message);
        console.error(err);
      }
      setIsLoading(false);
    })();

    return () => controller.abort();
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
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  return (
    <div className="page advertisement-page">
      <ComponentContainer>
        <h1>Объявление</h1>
        {!isLoading ? (
          <React.Fragment>
            {data ? (
              <div className="adv">
                <div className="adv-image">
                  {setImage(data.imageUrl)}
                  <EditButton
                    onClick={() =>
                      openModal(
                        <EditImageForm
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
                    Лайки: <span className="likes">{data.likes}</span>,
                    просмотров: <span className="views">{data.views}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-adv">
                <div>
                  Объявление не найдено. Проверьте url, либо напишите нам в{" "}
                  <Link to={"#"}>поддержку</Link>
                  {error && (
                    <div className="error-message">Текст ошибки: {error}</div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ) : (
          <Loader />
        )}
      </ComponentContainer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default AdvertisementPage;
