import auricularImage from "../assets/images/auricular.jpg";
import mouseImage from "../assets/images/mouse.jpg";
import placaVideoImage from "../assets/images/placa-video.jpg";
import procesadorImage from "../assets/images/procesador.jpg";
import tecladoImage from "../assets/images/teclado.jpg";

export const categoryImageMap = {
  "placa de video": placaVideoImage,
  procesador: procesadorImage,
  auricular: auricularImage,
  mouse: mouseImage,
  teclado: tecladoImage
} as const;

export type DemoCategoryKey = keyof typeof categoryImageMap;

export const resolveCategoryImage = (categoryName: string) => {
  const normalized = categoryName.trim().toLowerCase();

  if (normalized.includes("placa")) {
    return categoryImageMap["placa de video"];
  }
  if (normalized.includes("proces")) {
    return categoryImageMap.procesador;
  }
  if (normalized.includes("auricular") || normalized.includes("head")) {
    return categoryImageMap.auricular;
  }
  if (normalized.includes("mouse")) {
    return categoryImageMap.mouse;
  }
  if (normalized.includes("tecl")) {
    return categoryImageMap.teclado;
  }

  return categoryImageMap["placa de video"];
};
