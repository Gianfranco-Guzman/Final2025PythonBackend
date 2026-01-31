import { FormEvent, useEffect, useState } from "react";
import { api, ReviewPayload } from "../api/client";
import { ApiReview } from "../api/types";

type ReviewFormState = {
  id_key?: number;
  rating: string;
  comment: string;
  product_id: string;
};

const emptyForm: ReviewFormState = {
  rating: "",
  comment: "",
  product_id: ""
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<ReviewFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ratingValue = Number(formState.rating);
    const commentValue = formState.comment.trim();
    const productValue = Number(formState.product_id);

    if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setError("La calificación debe estar entre 1 y 5.");
      return;
    }

    if (commentValue && commentValue.length < 10) {
      setError("El comentario debe tener al menos 10 caracteres.");
      return;
    }

    if (!Number.isInteger(productValue) || productValue <= 0) {
      setError("El producto debe ser un ID válido.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: ReviewPayload = {
        rating: ratingValue,
        comment: commentValue ? commentValue : null,
        product_id: productValue
      };
      if (formState.id_key) {
        await api.updateReview(formState.id_key, payload);
      } else {
        await api.createReview(payload);
      }
      setFormState(emptyForm);
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (idKey: number) => {
    setFormLoading(true);
    setError(null);
    try {
      const review = await api.getReview(idKey);
      setFormState({
        id_key: review.id_key,
        rating: String(review.rating),
        comment: review.comment ?? "",
        product_id: String(review.product_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta reseña?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteReview(idKey);
      await loadReviews();
      if (formState.id_key === idKey) {
        setFormState(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const isEditing = Boolean(formState.id_key);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Reviews</h1>
          <p>Administra reseñas de productos y sus calificaciones.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar reseña" : "Crear reseña"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Calificación (1-5)</span>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={formState.rating}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    rating: event.target.value
                  }))
                }
                placeholder="5"
                required
              />
            </label>
            <label className="field">
              <span>Comentario</span>
              <textarea
                value={formState.comment}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    comment: event.target.value
                  }))
                }
                placeholder="Comentario (opcional)"
                rows={4}
              />
            </label>
            <label className="field">
              <span>Producto (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.product_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    product_id: event.target.value
                  }))
                }
                placeholder="ID de producto"
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={formLoading}>
                {formLoading
                  ? "Guardando..."
                  : isEditing
                  ? "Guardar cambios"
                  : "Crear"}
              </button>
              {isEditing ? (
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setFormState(emptyForm)}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Listado</h2>
          {loading ? <p>Cargando reseñas...</p> : null}
          {!loading && reviews.length === 0 ? (
            <p className="empty">No hay reseñas cargadas.</p>
          ) : null}
          {!loading && reviews.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Calificación</th>
                  <th>Comentario</th>
                  <th>Producto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id_key}>
                    <td>{review.id_key}</td>
                    <td>{review.rating.toFixed(1)}</td>
                    <td>{review.comment ?? "—"}</td>
                    <td>{review.product_id}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(review.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(review.id_key)}
                        disabled={formLoading}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>
    </div>
  );
}
