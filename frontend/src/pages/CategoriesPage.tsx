import { FormEvent, useEffect, useState } from "react";
import { api, CategoryPayload } from "../api/client";
import { ApiCategory } from "../api/types";

type CategoryFormState = {
  id_key?: number;
  name: CategoryPayload["name"];
};

const emptyForm: CategoryFormState = {
  name: ""
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<CategoryFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      setError("El nombre es obligatorio.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      if (formState.id_key) {
        await api.updateCategory(formState.id_key, {
          name: trimmedName
        });
      } else {
        await api.createCategory({ name: trimmedName });
      }
      setFormState(emptyForm);
      await loadCategories();
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
      const category = await api.getCategory(idKey);
      setFormState({
        id_key: category.id_key,
        name: category.name
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta categoría?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteCategory(idKey);
      await loadCategories();
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
          <h1>Categorías</h1>
          <p>Administra categorías con operaciones CRUD básicas.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar categoría" : "Crear categoría"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
                placeholder="Nombre de la categoría"
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
          {loading ? <p>Cargando categorías...</p> : null}
          {!loading && categories.length === 0 ? (
            <p className="empty">No hay categorías cargadas.</p>
          ) : null}
          {!loading && categories.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id_key}>
                    <td>{category.id_key}</td>
                    <td>{category.name}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(category.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(category.id_key)}
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
