"use client"

import { useEffect, useState } from "react"

interface HeroData {
  title: string
  subtitle: string
  image_url: string
  button1_text: string
  button2_text: string
}

const FALLBACK_HERO: HeroData = {
  title: "Construyendo Tu Visión, Un Proyecto a la Vez",
  subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expertos regionales en construcción residencial y comercial desde 2003.",
  image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
  button1_text: "Ver Servicios",
  button2_text: "Ver Proyectos",
}

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hero, setHero] = useState<HeroData>(FALLBACK_HERO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (data) {
          setHero({
            title: data.title ?? FALLBACK_HERO.title,
            subtitle: data.subtitle ?? FALLBACK_HERO.subtitle,
            image_url: data.image_url ?? FALLBACK_HERO.image_url,
            button1_text: data.button1_text ?? FALLBACK_HERO.button1_text,
            button2_text: data.button2_text ?? FALLBACK_HERO.button2_text,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-dark"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${hero.image_url}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/50" />
      </div>

      <div className="absolute left-8 top-32 h-4 w-4 bg-teal md:h-6 md:w-6" />
      <div className="absolute bottom-40 right-12 h-8 w-8 bg-terracotta md:h-12 md:w-12" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="max-w-2xl animate-pulse space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-3/4 rounded bg-cream/10 sm:h-16" />
              <div className="h-12 w-2/3 rounded bg-cream/10 sm:h-16" />
              <div className="h-12 w-1/2 rounded bg-cream/10 sm:h-16" />
            </div>
            <div className="h-6 w-2/3 rounded bg-cream/10" />
            <div className="flex gap-4">
              <div className="h-12 w-36 rounded-full bg-cream/10" />
              <div className="h-12 w-36 rounded-full bg-cream/10" />
            </div>
          </div>
        ) : (
          <div
            className={`max-w-2xl transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.title}
            </h1>

            <p className="mt-6 max-w-lg text-lg text-cream/70">
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("services")}
                className="rounded-full bg-terracotta px-8 py-3.5 text-sm font-medium text-dark transition-all hover:bg-terracotta/90"
              >
                {hero.button1_text}
              </button>
              <button
                onClick={() => scrollTo("projects")}
                className="rounded-full border border-cream/30 px-8 py-3.5 text-sm font-medium text-cream transition-all hover:bg-cream/10"
              >
                {hero.button2_text}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-cream/30 p-2">
          <div className="h-2 w-1 animate-bounce rounded-full bg-cream/50" />
        </div>
      </div>
    </section>
  )
}
