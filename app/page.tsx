import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="border-b border-covati-sand/70 bg-covati-bg">
          <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8">
            <p className="mb-5 text-sm uppercase tracking-[0.22em] text-covati-taupe">
              INDUMENTARIA
            </p>

            <img 
              src="/logo.png" 
              alt="Covati Logo" 
              className="h-auto w-48 object-contain sm:w-64 lg:w-80"
            />

            <p className="mt-7 max-w-xl text-base leading-relaxed text-covati-taupe sm:text-lg">
              Objetos, accesorios y prendas elegidos para acompañar tus días con
              simpleza, calidad y estilo.
            </p>

            <div className="mt-10">
              <a
                href="#productos"
                className="inline-flex rounded-full bg-covati-brown px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-covati-taupe"
              >
                Ver productos
              </a>
            </div>
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