const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/#productos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Footer() {
  return (
    <footer id="contacto" className="bg-covati-brown text-covati-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <p className="text-xl font-semibold tracking-[0.28em] text-white">
              COVATI
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-400">
              Objetos, accesorios y prendas elegidos con sensibilidad, calidad
              y diseño para todos los días.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-white">
              Navegación
            </h2>

            <nav className="mt-5 flex flex-col items-start gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-white">
              Contacto
            </h2>

            <div className="mt-5 space-y-3 text-sm text-stone-400">
              <p>Lunes a viernes, de 9 a 18 h.</p>
              <p>Buenos Aires, Argentina.</p>

              <a
                href="https://www.instagram.com/covati.oficial/"
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-white"
              >
                Instagram ↗
              </a>

              <a
                href="https://wa.me/5492284539404"
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-white"
              >
                WhatsApp ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-covati-cream/20 pt-6">
          <p className="text-xs text-covati-cream/60">
            © 2026 Covati. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}