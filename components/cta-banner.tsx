"use client"

export function CTABanner() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden bg-terracotta py-20 md:py-28">
      {/* Decorative Elements */}
      <div className="absolute left-10 top-10 h-8 w-8 bg-teal/30" />
      <div className="absolute bottom-10 right-10 h-12 w-12 bg-dark/10" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-dark md:text-4xl lg:text-5xl text-balance">
          ¡No esperes más para cumplir tus sueños!
          <br />
          Hazlos realidad con nosotros.
        </h2>
        <button
          onClick={() => scrollTo("contact")}
          className="mt-10 rounded-full bg-dark px-10 py-4 font-medium text-cream transition-all hover:bg-dark/90"
        >
          Contáctanos
        </button>
      </div>
    </section>
  )
}
