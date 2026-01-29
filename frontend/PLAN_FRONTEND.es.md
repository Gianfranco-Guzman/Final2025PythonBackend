# 📌 Plan de trabajo para el Frontend (consumo de la API)

Este documento resume **qué hace el backend**, **dónde están las guías** y **cómo organizar el desarrollo del frontend** dentro de `frontend/` antes de separar el proyecto.

---

## 1) Mapa rápido del proyecto (backend)

- **`main.py`**: punto de entrada de la API (FastAPI). Levanta la aplicación y expone los endpoints. 
- **`controllers/`**: rutas de la API (endpoints REST). 
- **`services/`**: lógica de negocio (validaciones, stock, cache, etc.).
- **`repositories/`**: acceso a datos y consultas a DB.
- **`models/`** + **`schemas/`**: entidades y validaciones Pydantic.
- **`middleware/`**: CORS, rate limiting, etc.
- **`docs/`**: documentación funcional, despliegue, arquitectura y rendimiento.

> Referencias principales: README.es.md, docs/API_DOCUMENTATION.es.md, docs/GUIA_INICIO_RAPIDO.es.md, docs/DESPLIEGUE.es.md y frontend/BACKEND_GUIDE.md.

---

## 2) Documentación clave para ti (estudiante)

- **Cómo levantar la API con Docker** (rápido): `docs/GUIA_INICIO_RAPIDO.es.md`.
- **Orden lógico para crear datos y evitar errores de foreign keys**: `frontend/BACKEND_GUIDE.md`.
- **Lista detallada de endpoints, respuestas, paginación, errores**: `docs/API_DOCUMENTATION.es.md`.
- **Guía de despliegue en producción**: `docs/DESPLIEGUE.es.md` (útil como base para Render).

---

## 3) Endpoints principales que consumirá el frontend

Agrupados por recurso (CRUD con paginación):

- **Categorías**: `/categories`
- **Productos**: `/products`
- **Clientes**: `/clients`
- **Direcciones**: `/addresses`
- **Facturas**: `/bills`
- **Pedidos**: `/orders`
- **Detalles de pedido**: `/order_details`
- **Reseñas**: `/reviews`
- **Health check**: `/health_check`

> Para evitar errores al poblar datos, usa el **orden de creación** sugerido en `frontend/BACKEND_GUIDE.md` (categorías → productos → clientes → direcciones → facturas → pedidos → detalles → reseñas).

---

## 4) Flujo recomendado del trabajo (paso a paso)

1. **Levantar el backend local** con Docker y verificar `/health_check`.
2. **Explorar Swagger** en `/docs` para ver schemas y ejemplos.
3. **Definir el frontend** (framework + páginas). Idea mínima:
   - Home / catálogo
   - Detalle de producto (con reviews)
   - Carrito / pedido
   - Admin simple (categorías, productos, clientes)
4. **Crear un cliente HTTP** (axios/fetch) con `baseURL` configurable.
5. **Consumir endpoints** por pantalla y validar errores.
6. **Deploy en Render** (backend) → actualizar el `baseURL` del frontend.
7. **Verificar funcionamiento** (flujo completo).
8. **Grabar video** de la funcionalidad final.

---

## 4.1) Estructura creada en `frontend/`

- **Vite + React + TypeScript** como base.
- **`.env`** con `VITE_API_URL` para apuntar al backend.
- **Cliente API** en `src/api/client.ts` consumiendo endpoints existentes:
  - `GET /health_check`
  - `GET /categories`
  - `GET /products`

> Si faltan endpoints o tipos, todo debe quedar parametrizado y documentado aquí.

### Comandos rápidos

```bash
cd frontend
npm install
npm run dev
```

### Variables de entorno

Archivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

Si usas otra URL (Render), solo reemplaza ese valor. También puedes copiar `frontend/.env.example` a `frontend/.env`.

---

## 5) Sugerencia de commits para el frontend

> **Ejemplo de orden y título** (ajusta según avances):

1. `chore(frontend): inicializar estructura base y dependencias`
2. `feat(frontend): configurar cliente API y variables de entorno`
3. `feat(frontend): listar categorias y productos`
4. `feat(frontend): detalle de producto con reseñas`
5. `feat(frontend): flujo de pedido y carrito`
6. `feat(frontend): panel simple de administración CRUD`
7. `docs(frontend): agregar instrucciones de uso y despliegue`

---

## 6) Notas para el despliegue en Render

- El repo trae **Dockerfile** y **docker-compose** (desarrollo/producción). Render puede desplegar con Dockerfile.
- Deberás configurar variables de entorno equivalentes a `.env.production`.
- Luego de desplegar, tomar la **URL pública** y usarla como `baseURL` del frontend.

---

## 7) Checklist de entrega (tu tarea)

- [ ] API REST instalada y probada localmente.
- [ ] Endpoints revisados en Swagger.
- [ ] Deploy en Render funcionando.
- [ ] Frontend consumiendo endpoints.
- [ ] Verificación funcional completa.
- [ ] Video de demo subido a YouTube.
- [ ] Entrega final: **Front**, **Back**, **Reporte PDF**.

---

Si quieres, en el siguiente paso definimos **framework de frontend**, estructura de carpetas y el plan de pantallas.
