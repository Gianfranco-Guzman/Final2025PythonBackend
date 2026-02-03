import placaVideoImg from "../assets/images/placa-video.jpg";
import procesadorImg from "../assets/images/procesador.jpg";
import auricularImg from "../assets/images/auricular.jpg";
import mouseImg from "../assets/images/mouse.jpg";
import tecladoImg from "../assets/images/teclado.jpg";

export type DemoCategoryKey = "placa de video" | "procesador" | "auricular" | "mouse" | "teclado";

export const categoryImageMap: Record<DemoCategoryKey, string> = {
  "placa de video": placaVideoImg,
  procesador: procesadorImg,
  auricular: auricularImg,
  mouse: mouseImg,
  teclado: tecladoImg
};

export type DemoProductSeed = {
  name: string;
  price: number;
  stock: number;
  categoryName: DemoCategoryKey;
};

export const demoProducts: DemoProductSeed[] = [
  {
    name: "RTX 4060 Ti 8GB",
    price: 449000,
    stock: 12,
    categoryName: "placa de video"
  },
  {
    name: "RX 7700 XT 12GB",
    price: 519000,
    stock: 8,
    categoryName: "placa de video"
  },
  {
    name: "Ryzen 5 7600X",
    price: 289000,
    stock: 15,
    categoryName: "procesador"
  },
  {
    name: "Intel Core i5-14600K",
    price: 369000,
    stock: 10,
    categoryName: "procesador"
  },
  {
    name: "HyperX Cloud II",
    price: 99000,
    stock: 20,
    categoryName: "auricular"
  },
  {
    name: "Logitech G Pro X",
    price: 149000,
    stock: 14,
    categoryName: "auricular"
  },
  {
    name: "Logitech G502 Hero",
    price: 59000,
    stock: 25,
    categoryName: "mouse"
  },
  {
    name: "Razer Basilisk V3",
    price: 85000,
    stock: 18,
    categoryName: "mouse"
  },
  {
    name: "Keychron K2",
    price: 98000,
    stock: 16,
    categoryName: "teclado"
  },
  {
    name: "SteelSeries Apex 7",
    price: 179000,
    stock: 9,
    categoryName: "teclado"
  }
];
