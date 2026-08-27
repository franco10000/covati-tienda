const highlights = [
  {
    title: "Envíos a todo el país",
    description: "Llevamos tus elegidos hasta donde estés.",
    icon: "✦",
  },
  {
    title: "Atención personalizada por WhatsApp",
    description: "Estamos para acompañarte en cada compra.",
    icon: "◔",
  },
  {
    title: "Pago seguro",
    description: "Transferencia bancaria o efectivo.",
    icon: "✓",
  },
];

export default function AboutSection() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-covati-cream/35">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-covati-taupe">
            Nuestra esencia
          </p>
            
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-covati-brown sm:text-5xl">
            Sobre Covati
          </h2>
            
          <p className="mt-6 text-base leading-relaxed text-covati-taupe sm:text-lg">
            En Covati seleccionamos productos pensados para acompañar el día a
            día. Creemos en la calidad, el diseño simple y esos pequeños
            detalles que hacen que lo cotidiano se sienta especial.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-2xl border border-covati-sand/70 bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-lg text-stone-950">
                {highlight.icon}
              </span>

              <h3 className="mt-5 text-base font-medium text-stone-950">
                {highlight.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}