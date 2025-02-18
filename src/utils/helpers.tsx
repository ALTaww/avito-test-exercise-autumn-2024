import placeholderImageUrl from "../assets/images/placeholder-image.webp";

export const setImage = (imageUrl: string | undefined | null) => {
  return imageUrl ? (
    <img src={imageUrl} alt="Фото отсутствует" />
  ) : (
    <img src={placeholderImageUrl} alt="Фото отсутствует" />
  );
};
