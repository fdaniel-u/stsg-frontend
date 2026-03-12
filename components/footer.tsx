"use client"

import { useEffect, useState } from "react"
import { SocialIcon } from "./social-icon"

interface SocialLink {
  id: number
  network_name: string
  url: string
  icon: string
}

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loadingSocial, setLoadingSocial] = useState(true)

  useEffect(() => {
    fetch("/api/content/social")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialLinks(data)
        }
      })
      .catch(() => {
        setSocialLinks([
          { id: 1, network_name: "Facebook", url: "https://www.facebook.com", icon: "facebook" },
          { id: 2, network_name: "Instagram", url: "https://www.instagram.com", icon: "instagram" },
          { id: 3, network_name: "TikTok", url: "https://www.tiktok.com", icon: "tiktok" },
        ])
      })
      .finally(() => setLoadingSocial(false))
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <button 
              onClick={() => scrollTo("hero")}
              className="font-serif text-2xl font-bold text-cream"
            >
              STSG Calidad Total
            </button>
            <p className="mt-4 text-sm text-cream/50">
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </p>
            <p className="mt-4 text-sm text-terracotta">
              contact@stsgcalidadtotal.com
            </p>
            <p className="text-sm text-cream/50">+48 601 908 812</p>
          </div>

          <div>
            <h4 className="font-semibold text-cream">Navegación</h4>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Inicio", id: "hero" },
                { label: "Nosotros", id: "about" },
                { label: "Servicios", id: "services" },
                { label: "Proyectos", id: "projects" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-sm text-cream/50 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream">Servicios</h4>
            <ul className="mt-4 space-y-3">
              {[
                "Construcción",
                "Renovación",
                "Garajes",
                "Instalaciones",
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollTo("services")}
                    className="text-sm text-cream/50 transition-colors hover:text-cream"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream">Contacto</h4>
            <ul className="mt-4 space-y-3">
              {["contact@stsgcalidadtotal.com", "+48 601 908 812"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-cream/50">{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-8 font-semibold text-cream">Redes sociales</h4>
            <div className="mt-4 flex gap-4">
              {loadingSocial ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-10 animate-pulse rounded-full bg-cream/10" />
                ))
              ) : (
                socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
                    aria-label={link.network_name}
                  >
                    <SocialIcon icon={link.icon} />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-sm text-cream/40">
            © {currentYear} STSG Calidad Total. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
