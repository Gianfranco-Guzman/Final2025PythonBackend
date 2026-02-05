import os
from typing import Dict, List, Tuple

import requests

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

CATEGORIES = [
    "auricular",
    "mouse",
    "teclado",
    "placa de video",
    "procesador",
]

PRODUCTS = [
    {"name": "HyperX Cloud II", "price": 85000, "stock": 18, "category": "auricular"},
    {"name": "Logitech G Pro X", "price": 120000, "stock": 14, "category": "auricular"},
    {"name": "Razer BlackShark V2", "price": 110000, "stock": 12, "category": "auricular"},
    {"name": "SteelSeries Arctis 5", "price": 95000, "stock": 10, "category": "auricular"},
    {"name": "Corsair HS80", "price": 130000, "stock": 9, "category": "auricular"},
    {"name": "JBL Quantum 200", "price": 65000, "stock": 20, "category": "auricular"},
    {"name": "Sony WH-CH520", "price": 55000, "stock": 22, "category": "auricular"},
    {"name": "Audio-Technica M20x", "price": 70000, "stock": 16, "category": "auricular"},
    {"name": "Astro A10", "price": 80000, "stock": 15, "category": "auricular"},
    {"name": "Redragon Zeus H510", "price": 60000, "stock": 24, "category": "auricular"},
    {"name": "Logitech G203", "price": 45000, "stock": 30, "category": "mouse"},
    {"name": "Logitech G502 Hero", "price": 90000, "stock": 18, "category": "mouse"},
    {"name": "Razer DeathAdder V2", "price": 95000, "stock": 16, "category": "mouse"},
    {"name": "SteelSeries Rival 3", "price": 55000, "stock": 21, "category": "mouse"},
    {"name": "Corsair Harpoon", "price": 60000, "stock": 19, "category": "mouse"},
    {"name": "HyperX Pulsefire FPS", "price": 70000, "stock": 17, "category": "mouse"},
    {"name": "Redragon Cobra M711", "price": 50000, "stock": 26, "category": "mouse"},
    {"name": "Glorious Model O", "price": 120000, "stock": 11, "category": "mouse"},
    {"name": "Logitech G Pro Wireless", "price": 180000, "stock": 8, "category": "mouse"},
    {"name": "Razer Basilisk V3", "price": 130000, "stock": 12, "category": "mouse"},
    {"name": "Redragon K552", "price": 70000, "stock": 20, "category": "teclado"},
    {"name": "Logitech G413", "price": 120000, "stock": 14, "category": "teclado"},
    {"name": "HyperX Alloy FPS", "price": 140000, "stock": 12, "category": "teclado"},
    {"name": "Razer BlackWidow V3", "price": 180000, "stock": 10, "category": "teclado"},
    {"name": "Corsair K60", "price": 150000, "stock": 11, "category": "teclado"},
    {"name": "Keychron K2", "price": 160000, "stock": 13, "category": "teclado"},
    {"name": "SteelSeries Apex 5", "price": 190000, "stock": 9, "category": "teclado"},
    {"name": "Logitech MX Keys", "price": 200000, "stock": 8, "category": "teclado"},
    {"name": "Redragon Kumara", "price": 60000, "stock": 25, "category": "teclado"},
    {"name": "Asus TUF K3", "price": 170000, "stock": 10, "category": "teclado"},
    {"name": "GTX 1650 4GB", "price": 220000, "stock": 15, "category": "placa de video"},
    {"name": "RTX 3050 8GB", "price": 300000, "stock": 12, "category": "placa de video"},
    {"name": "RTX 3060 12GB", "price": 360000, "stock": 10, "category": "placa de video"},
    {"name": "RTX 4060 8GB", "price": 430000, "stock": 9, "category": "placa de video"},
    {"name": "RTX 4060 Ti 8GB", "price": 520000, "stock": 8, "category": "placa de video"},
    {"name": "RTX 4070 12GB", "price": 680000, "stock": 7, "category": "placa de video"},
    {"name": "RX 6600 8GB", "price": 280000, "stock": 14, "category": "placa de video"},
    {"name": "RX 7600 8GB", "price": 390000, "stock": 11, "category": "placa de video"},
    {"name": "RX 7700 XT 12GB", "price": 550000, "stock": 8, "category": "placa de video"},
    {"name": "RX 7800 XT 16GB", "price": 700000, "stock": 6, "category": "placa de video"},
    {"name": "Ryzen 5 5600", "price": 180000, "stock": 16, "category": "procesador"},
    {"name": "Ryzen 5 7600X", "price": 300000, "stock": 12, "category": "procesador"},
    {"name": "Ryzen 7 5800X", "price": 280000, "stock": 11, "category": "procesador"},
    {"name": "Ryzen 7 7700X", "price": 420000, "stock": 9, "category": "procesador"},
    {"name": "Ryzen 9 7900X", "price": 650000, "stock": 7, "category": "procesador"},
    {"name": "Intel i5-12400F", "price": 170000, "stock": 18, "category": "procesador"},
    {"name": "Intel i5-14600K", "price": 380000, "stock": 10, "category": "procesador"},
    {"name": "Intel i7-12700K", "price": 450000, "stock": 8, "category": "procesador"},
    {"name": "Intel i7-14700K", "price": 600000, "stock": 6, "category": "procesador"},
    {"name": "Intel i9-13900K", "price": 780000, "stock": 5, "category": "procesador"},
]


def fetch_categories() -> List[dict]:
    response = requests.get(f"{API_BASE_URL}/categories", params={"skip": 0, "limit": 500})
    response.raise_for_status()
    return response.json()


def fetch_products() -> List[dict]:
    response = requests.get(f"{API_BASE_URL}/products", params={"skip": 0, "limit": 1000})
    response.raise_for_status()
    return response.json()


def ensure_categories() -> Dict[str, int]:
    existing = fetch_categories()
    lookup = {item["name"].strip().lower(): item["id"] for item in existing}
    category_ids: Dict[str, int] = {}

    for name in CATEGORIES:
        key = name.strip().lower()
        if key in lookup:
            category_ids[key] = lookup[key]
            continue

        response = requests.post(f"{API_BASE_URL}/categories", json={"name": name})
        response.raise_for_status()
        created = response.json()
        category_ids[key] = created["id"]

    return category_ids


def ensure_products(category_ids: Dict[str, int]) -> Tuple[int, int]:
    existing_products = fetch_products()
    existing_lookup = {
        (item["name"].strip().lower(), item.get("category_id")): item["id"]
        for item in existing_products
    }

    created_count = 0
    skipped_count = 0

    for product in PRODUCTS:
        category_key = product["category"].strip().lower()
        category_id = category_ids[category_key]
        key = (product["name"].strip().lower(), category_id)

        if key in existing_lookup:
            skipped_count += 1
            continue

        payload = {
            "name": product["name"],
            "price": product["price"],
            "stock": product["stock"],
            "category_id": category_id,
        }
        response = requests.post(f"{API_BASE_URL}/products", json=payload)
        response.raise_for_status()
        created_count += 1

    return created_count, skipped_count


def main() -> None:
    category_ids = ensure_categories()
    created_count, skipped_count = ensure_products(category_ids)

    print("✅ Demo catalog seeding complete")
    print(f"Categories ensured: {len(category_ids)}")
    print(f"Products created: {created_count}")
    print(f"Products skipped (already existed): {skipped_count}")


if __name__ == "__main__":
    main()
