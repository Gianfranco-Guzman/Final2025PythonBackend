# 📘 Guía de Uso y Pruebas del Backend

Esta guía está diseñada para ayudarte a levantar el backend, entender cómo funciona y probar los endpoints en el orden correcto para evitar errores de dependencias (Foreign Keys).

---

## 🚀 1. Cómo levantar el Backend

El proyecto utiliza **Docker** para encapsular la base de datos (PostgreSQL), el caché (Redis) y la API (FastAPI).

### Requisitos previos

- Tener **Docker Desktop** instalado y corriendo.

### Comandos Principales

Abrir una terminal en la carpeta raíz del proyecto (`c:\Proyectos\Final2025PythonBackend\`) y ejecutar:

**Para iniciar todo (Modo Desarrollo):**

```bash
docker compose up --build
```

_Este comando descarga las imágenes, construye el código y levanta los servicios. Verás los logs en la terminal._

**Para detener todo:**
Presiona `Ctrl + C` en la terminal.

**Para detener y borrar todo (incluyendo datos de la BD):**

```bash
docker compose down -v
```

_⚠️ Cuidado: Esto borra la base de datos y empieza de cero._

---

## 🌐 2. Acceso a la Interfaz de Pruebas (Swagger UI)

Una vez que veas en la terminal que la aplicación ha iniciado (busca un mensaje como `Application startup complete`), abre tu navegador:

- **URL:** http://localhost:8000/docs

Verás una lista de todos los "Endpoints" agrupados por colores (GET, POST, PUT, DELETE).

---

## 🧪 3. Orden Lógico de Pruebas

Debido a que la base de datos es relacional, no puedes crear ciertos datos si no existen sus "padres". Sigue este orden para probar el flujo completo de un E-commerce.

### Paso 0: Verificar Salud del Sistema

1. Busca la sección **Health Check**.
2. Usa `GET /health_check`.
3. **Resultado esperado:** Código `200 OK` y estado `healthy`.

### Paso 1: Crear Categorías (Base para Productos)

_Necesitamos categorías antes de crear productos._

1. Ve a **Categories** -> `POST /categories/`.
2. Click en **Try it out**.
3. JSON de ejemplo:
   ```json
   {
     "name": "Tecnología"
   }
   ```
4. **Execute**. Guarda el `id_key` que te devuelve (probablemente sea `1`).

### Paso 2: Crear Productos

_Necesitamos productos para vender._

1. Ve a **Products** -> `POST /products/`.
2. JSON de ejemplo (asegúrate que `category_id` sea el del paso anterior):
   ```json
   {
     "name": "Laptop Gamer",
     "price": 1500.0,
     "stock": 10,
     "category_id": 1
   }
   ```

### Paso 3: Crear Clientes

_Necesitamos a quién venderle._

1. Ve a **Clients** -> `POST /clients/`.
2. JSON de ejemplo:
   ```json
   {
     "name": "Juan",
     "lastname": "Perez",
     "email": "juan@test.com",
     "telephone": "+5491122334455"
   }
   ```

### Paso 4: Crear Dirección (Address)

_Asociamos una dirección al cliente creado._

1. Ve a **Addresses** -> `POST /addresses/`.
2. JSON de ejemplo:
   ```json
   {
     "street": "Av. Siempre Viva 742",
     "city": "Springfield",
     "postal_code": "12345",
     "country": "Argentina",
     "client_id": 1
   }
   ```

### Paso 5: Crear Factura (Bill)

_Un pedido necesita estar asociado a una factura (según la lógica actual)._

1. Ve a **Bills** -> `POST /bills/`.
2. JSON de ejemplo:
   ```json
   {
     "bill_number": "F-0001",
     "discount": 0,
     "date": "2025-01-01",
     "total": 1500.0,
     "payment_type": "cash"
   }
   ```

### Paso 6: Crear Pedido (Order)

_El pedido une al Cliente y la Factura._

1. Ve a **Orders** -> `POST /orders/`.
2. JSON de ejemplo (usa los IDs de cliente y bill creados):
   ```json
   {
     "date": "2025-01-01T10:00:00",
     "total": 1500.0,
     "delivery_method": 1,
     "status": 1,
     "client_id": 1,
     "bill_id": 1
   }
   ```
   _(Nota: delivery_method 1 = Drive Thru, status 1 = Pending)_

### Paso 7: Agregar Detalles al Pedido (Order Details)

_Aquí decimos "qué productos" van en "qué pedido"._

1. Ve a **Order Details** -> `POST /order_details/`.
2. JSON de ejemplo:
   ```json
   {
     "quantity": 1,
     "price": 1500.0,
     "order_id": 1,
     "product_id": 1
   }
   ```
   _Esto descontará automáticamente el stock del producto._

### Paso 8: Crear Reseña (Review)

_Opcional: Dejar una reseña del producto._

1. Ve a **Reviews** -> `POST /reviews/`.
2. JSON de ejemplo:
   ```json
   {
     "rating": 5,
     "comment": "Excelente producto, muy recomendado.",
     "product_id": 1,
     "client_id": 1
   }
   ```

---

## 💾 Persistencia de Datos

- **Tus datos están seguros:** El proyecto usa un "Volumen de Docker" (`postgres_data_dev`) que actúa como un disco duro virtual.
- **Al detener (`Ctrl + C`):** El servidor se apaga, pero los datos quedan guardados en el volumen. Al volver a iniciar (`docker compose up`), todo estará ahí.
- **Para borrar todo:** Debes ejecutar explícitamente `docker compose down -v` (la `-v` elimina el volumen).
