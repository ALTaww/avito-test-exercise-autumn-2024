export function handleError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err)); // Приводим к Error, если тип неизвестен
}
