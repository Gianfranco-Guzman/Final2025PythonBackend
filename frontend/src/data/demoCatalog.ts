import { categoryImageMap, DemoCategoryKey } from "./storeAssets";

export { categoryImageMap, type DemoCategoryKey };

export type DemoProductSeed = {
  name: string;
  price: number;
  stock: number;
  categoryName: DemoCategoryKey;
};

export const demoProducts: DemoProductSeed[] = [
  {
    name: "HyperX Cloud II",
    price: 85000,
    stock: 18,
    categoryName: "auricular"
  },
  {
    name: "Logitech G Pro X",
    price: 120000,
    stock: 14,
    categoryName: "auricular"
  },
  {
    name: "Razer BlackShark V2",
    price: 110000,
    stock: 12,
    categoryName: "auricular"
  },
  {
    name: "SteelSeries Arctis 5",
    price: 95000,
    stock: 10,
    categoryName: "auricular"
  },
  {
    name: "Corsair HS80",
    price: 130000,
    stock: 9,
    categoryName: "auricular"
  },
  {
    name: "JBL Quantum 200",
    price: 65000,
    stock: 20,
    categoryName: "auricular"
  },
  {
    name: "Sony WH-CH520",
    price: 55000,
    stock: 22,
    categoryName: "auricular"
  },
  {
    name: "Audio-Technica M20x",
    price: 70000,
    stock: 16,
    categoryName: "auricular"
  },
  {
    name: "Astro A10",
    price: 80000,
    stock: 15,
    categoryName: "auricular"
  },
  {
    name: "Redragon Zeus H510",
    price: 60000,
    stock: 24,
    categoryName: "auricular"
  },
  {
    name: "Logitech G203",
    price: 45000,
    stock: 30,
    categoryName: "mouse"
  },
  {
    name: "Logitech G502 Hero",
    price: 90000,
    stock: 18,
    categoryName: "mouse"
  },
  {
    name: "Razer DeathAdder V2",
    price: 95000,
    stock: 16,
    categoryName: "mouse"
  },
  {
    name: "SteelSeries Rival 3",
    price: 55000,
    stock: 21,
    categoryName: "mouse"
  },
  {
    name: "Corsair Harpoon",
    price: 60000,
    stock: 19,
    categoryName: "mouse"
  },
  {
    name: "HyperX Pulsefire FPS",
    price: 70000,
    stock: 17,
    categoryName: "mouse"
  },
  {
    name: "Redragon Cobra M711",
    price: 50000,
    stock: 26,
    categoryName: "mouse"
  },
  {
    name: "Glorious Model O",
    price: 120000,
    stock: 11,
    categoryName: "mouse"
  },
  {
    name: "Logitech G Pro Wireless",
    price: 180000,
    stock: 8,
    categoryName: "mouse"
  },
  {
    name: "Razer Basilisk V3",
    price: 130000,
    stock: 12,
    categoryName: "mouse"
  },
  {
    name: "Redragon K552",
    price: 70000,
    stock: 20,
    categoryName: "teclado"
  },
  {
    name: "Logitech G413",
    price: 120000,
    stock: 14,
    categoryName: "teclado"
  },
  {
    name: "HyperX Alloy FPS",
    price: 140000,
    stock: 12,
    categoryName: "teclado"
  },
  {
    name: "Razer BlackWidow V3",
    price: 180000,
    stock: 10,
    categoryName: "teclado"
  },
  {
    name: "Corsair K60",
    price: 150000,
    stock: 11,
    categoryName: "teclado"
  },
  {
    name: "Keychron K2",
    price: 160000,
    stock: 13,
    categoryName: "teclado"
  },
  {
    name: "SteelSeries Apex 5",
    price: 190000,
    stock: 9,
    categoryName: "teclado"
  },
  {
    name: "Logitech MX Keys",
    price: 200000,
    stock: 8,
    categoryName: "teclado"
  },
  {
    name: "Redragon Kumara",
    price: 60000,
    stock: 25,
    categoryName: "teclado"
  },
  {
    name: "Asus TUF K3",
    price: 170000,
    stock: 10,
    categoryName: "teclado"
  },
  {
    name: "GTX 1650 4GB",
    price: 220000,
    stock: 15,
    categoryName: "placa de video"
  },
  {
    name: "RTX 3050 8GB",
    price: 300000,
    stock: 12,
    categoryName: "placa de video"
  },
  {
    name: "RTX 3060 12GB",
    price: 360000,
    stock: 10,
    categoryName: "placa de video"
  },
  {
    name: "RTX 4060 8GB",
    price: 430000,
    stock: 9,
    categoryName: "placa de video"
  },
  {
    name: "RTX 4060 Ti 8GB",
    price: 520000,
    stock: 8,
    categoryName: "placa de video"
  },
  {
    name: "RTX 4070 12GB",
    price: 680000,
    stock: 7,
    categoryName: "placa de video"
  },
  {
    name: "RX 6600 8GB",
    price: 280000,
    stock: 14,
    categoryName: "placa de video"
  },
  {
    name: "RX 7600 8GB",
    price: 390000,
    stock: 11,
    categoryName: "placa de video"
  },
  {
    name: "RX 7700 XT 12GB",
    price: 550000,
    stock: 8,
    categoryName: "placa de video"
  },
  {
    name: "RX 7800 XT 16GB",
    price: 700000,
    stock: 6,
    categoryName: "placa de video"
  },
  {
    name: "Ryzen 5 5600",
    price: 180000,
    stock: 16,
    categoryName: "procesador"
  },
  {
    name: "Ryzen 5 7600X",
    price: 300000,
    stock: 12,
    categoryName: "procesador"
  },
  {
    name: "Ryzen 7 5800X",
    price: 280000,
    stock: 11,
    categoryName: "procesador"
  },
  {
    name: "Ryzen 7 7700X",
    price: 420000,
    stock: 9,
    categoryName: "procesador"
  },
  {
    name: "Ryzen 9 7900X",
    price: 650000,
    stock: 7,
    categoryName: "procesador"
  },
  {
    name: "Intel i5-12400F",
    price: 170000,
    stock: 18,
    categoryName: "procesador"
  },
  {
    name: "Intel i5-14600K",
    price: 380000,
    stock: 10,
    categoryName: "procesador"
  },
  {
    name: "Intel i7-12700K",
    price: 450000,
    stock: 8,
    categoryName: "procesador"
  },
  {
    name: "Intel i7-14700K",
    price: 600000,
    stock: 6,
    categoryName: "procesador"
  },
  {
    name: "Intel i9-13900K",
    price: 780000,
    stock: 5,
    categoryName: "procesador"
  }
];
