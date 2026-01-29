const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  throw new Error("Falta configurar VITE_API_URL en el archivo .env");
}

const toUrl = (path: string) => `${baseUrl.replace(/\/$/, "")}${path}`;

export const requestJson = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(toUrl(path), options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error HTTP ${response.status}`);
  }

  return (await response.json()) as T;
};

export const requestEmpty = async (
  path: string,
  options?: RequestInit
): Promise<void> => {
  const response = await fetch(toUrl(path), options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error HTTP ${response.status}`);
  }
};
