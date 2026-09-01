import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="relative w-full h-[75vh] sm:h-[85vh] min-h-[480px] overflow-hidden bg-covati-cream">
          {/* Imagen adaptable para Escritorio y Móvil */}
          <picture className="absolute inset-0 w-full h-full">
            <source media="(max-width: 768px)" srcSet="/logo-principal-mobile.png" />
            <img
              src="/logo-principal-desktop.png"
              alt="Covati Indumentaria - Colección Principal"
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {/* Capa de oscurecimiento sutil opcional */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Contenedor del botón: Centrado en móvil / Inferior izquierdo en escritorio */}
          <div className="absolute inset-x-0 bottom-10 sm:bottom-16 flex justify-center sm:justify-start sm:left-16 lg:left-10 z-10 px-4 sm:px-0">
            <a
              href="#productos"
              className="group relative inline-flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-covati-brown shadow-xl transition-all duration-300 hover:bg-covati-brown hover:text-white active:scale-95"
            >
              Ver productos
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ProductGrid />
        </div>

        <AboutSection />
      </main>

      <Footer />
    </>
  );
}