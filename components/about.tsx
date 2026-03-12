"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface AboutData {
  tag: string
  title: string
  paragraph1: string
  paragraph2: string
  image_url: string
}

const FALLBACK: AboutData = {
  tag: "QUIÉNES SOMOS",
  title: "20 Años Construyendo el Futuro de Nuestra Región",
  paragraph1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  paragraph2: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa.",
  image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&fit=crop",
}

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [about, setAbout] = useState<AboutData>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (data) {
          setAbout({
            tag: data.tag ?? FALLBACK.tag,
            title: data.title ?? FALLBACK.title,
            paragraph1: data.paragraph1 ?? FALLBACK.paragraph1,
            paragraph2: data.paragraph2 ?? FALLBACK.paragraph2,
            image_url: data.image_url ?? FALLBACK.image_url,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-cream py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className={`relative transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={about.image_url}
                  alt="Construction site with workers"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="absolute -left-4 -top-4 h-8 w-8 bg-teal" />
              <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-terracotta" />
              
              <div className="absolute -bottom-8 -left-8 hidden aspect-square w-48 overflow-hidden rounded-lg border-4 border-cream shadow-xl md:block">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80&fit=crop"
                  alt="Construction worker at sunset"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col justify-center transition-all delay-200 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-3 w-24 rounded bg-dark/10" />
                <div className="h-10 w-3/4 rounded bg-dark/10" />
                <div className="h-20 w-full rounded bg-dark/10" />
                <div className="h-16 w-full rounded bg-dark/10" />
                <div className="h-10 w-32 rounded-full bg-dark/10" />
              </div>
            ) : (
              <>
                <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
                  {about.tag}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
                  {about.title}
                </h2>
                <p className="mt-6 text-dark/70 leading-relaxed">
                  {about.paragraph1}
                </p>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  {about.paragraph2}
                </p>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-medium text-cream transition-all hover:bg-dark/90"
                >
                  Saber Más
                </button>
              </>
            )}
          </div>
        </div>


      </div>
    </section>
  )
}
