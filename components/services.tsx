"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface ServiceItem {
  title: string
  description: string
}

interface AccordionItemProps {
  title: string
  description: string
  isOpen: boolean
  onClick: () => void
}

function AccordionItem({ title, description, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-cream/10">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-lg text-cream">{title}</span>
        <svg
          className={`h-5 w-5 text-cream transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-48 pb-5" : "max-h-0"
        }`}
      >
        <p className="border-l-2 border-terracotta pl-4 text-cream/60">{description}</p>
      </div>
    </div>
  )
}

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    title: "Construcción de todo tipo de viviendas",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
  },
  {
    title: "Renovación y modernización",
    description: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.",
  },
  {
    title: "Adaptaciones de ático",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  },
  {
    title: "Construcción de garajes",
    description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.",
  },
  {
    title: "Instalaciones públicas",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  },
  {
    title: "Acabados e instalaciones",
    description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur.",
  },
]

export function Services() {
  const [openIndex, setOpenIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES)
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
    fetch("/api/content/services")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data.map((s: { title: string; description: string }) => ({
            title: s.title,
            description: s.description,
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-dark py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              LO QUE OFRECEMOS
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-cream md:text-4xl lg:text-5xl">
              Nuestros Servicios
              <br />
              de Construcción
            </h2>
            <p className="mt-6 max-w-md text-cream/60 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 rounded-full border border-cream/30 px-8 py-3.5 text-sm font-medium text-cream transition-all hover:bg-cream/10"
            >
              Ver Todos los Servicios
            </button>

            <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&fit=crop"
                alt="Construction worker"
                fill
                className="object-cover"
              />
              <div className="absolute -right-4 -top-4 h-8 w-8 bg-teal" />
            </div>
          </div>

          <div
            className={`transition-all delay-200 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-cream/10 py-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-cream/10" />
                  </div>
                ))}
              </div>
            ) : (
              services.map((service, index) => (
                <AccordionItem
                  key={index}
                  title={service.title}
                  description={service.description}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
