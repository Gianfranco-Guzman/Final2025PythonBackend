const demoSections = [
  {
    title: "Categorías reales en la próxima fase",
    description:
      "Aquí vivirá el grid de productos con filtros por categoría y búsqueda.",
  },
  {
    title: "Layout listo para crecer",
    description:
      "El layout de tienda ya es independiente del admin y soporta rutas /store/*.",
  },
];

export default function StoreProducts() {
  return (
    <section className="store-grid">
      {demoSections.map((section) => (
        <article className="store-card" key={section.title}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </article>
      ))}
    </section>
  );
}
