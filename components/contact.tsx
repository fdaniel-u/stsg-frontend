"use client"

import { useState, useEffect, useRef } from "react"

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

interface ContactData {
  phone: string
  email: string
  address: string
  maps_url: string
  contact_description: string
}

interface ServiceItem {
  id: number
  title: string
}

const FALLBACK_CONTACT: ContactData = {
  phone: "+48 601 908 812",
  email: "contact@stsgcalidadtotal.com",
  address: "Lorem ipsum 123, Ciudad Regional, País",
  maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.123456789!2d-75.7298!3d-14.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110f0a0a0a0a0a1%3A0x1234567890abcdef!2sIca%2C%20Peru!5e0!3m2!1ses!2spe!4v1234567890",
  contact_description: "",
}

const FALLBACK_SERVICES = [
  "Construcción de viviendas",
  "Renovación",
  "Adaptación de ático",
  "Garajes",
  "Instalaciones",
  "Acabados",
]

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactData>(FALLBACK_CONTACT)
  const [loadingContact, setLoadingContact] = useState(true)
  const [serviceOptions, setServiceOptions] = useState<string[]>(FALLBACK_SERVICES)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const forceWhiteText = () => {
      document.querySelectorAll('#contact input, #contact select, #contact textarea').forEach((el) => {
        (el as HTMLElement).style.color = 'white'
      })
    }
    forceWhiteText()
    const timeout = setTimeout(forceWhiteText, 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (data) {
          setContactInfo({
            phone: data.phone ?? FALLBACK_CONTACT.phone,
            email: data.email ?? FALLBACK_CONTACT.email,
            address: data.address ?? FALLBACK_CONTACT.address,
            maps_url: data.maps_url ?? FALLBACK_CONTACT.maps_url,
            contact_description: data.contact_description ?? FALLBACK_CONTACT.contact_description,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoadingContact(false))
  }, [])

  useEffect(() => {
    fetch("/api/content/services")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServiceOptions(data.map((s: ServiceItem) => s.title))
        }
      })
      .catch(() => {})
  }, [])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (!formData.service) {
      newErrors.service = "Please select a service"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#1a1a1a] py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a882]">
              CONTACTO
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-[#f5f0eb] md:text-4xl lg:text-5xl">
              Construyamos Algo Juntos
            </h2>

            {contactInfo.contact_description && (
              <p className="mt-4 text-[#f5f0eb]/60">
                {contactInfo.contact_description}
              </p>
            )}

            {isSuccess ? (
              <div className="mt-8 flex items-center gap-4 rounded-lg bg-[#7ec8c0]/20 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7ec8c0]">
                  <svg className="h-6 w-6 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0eb]">¡Gracias!</p>
                  <p className="text-[#f5f0eb]/60">Nos pondremos en contacto contigo pronto.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className={`w-full rounded-lg border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c8a882] ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className={`w-full rounded-lg border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c8a882] ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Tu número de teléfono"
                      className={`w-full rounded-lg border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c8a882] ${
                        errors.phone ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    style={{ colorScheme: 'dark' }}
                    className={`w-full appearance-none rounded-lg border bg-[#2a2a2a] px-4 py-3 pr-10 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c8a882] ${
                      errors.service ? "border-red-500" : "border-gray-700"
                    } ${!formData.service ? "text-gray-400" : ""}`}
                  >
                    <option value="" className="bg-[#2a2a2a] text-white">Selecciona un servicio</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service} className="bg-[#2a2a2a] text-white">
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500">{errors.service}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    rows={4}
                    className={`w-full resize-none rounded-lg border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c8a882] ${
                      errors.message ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#c8a882] px-8 py-4 font-medium text-white transition-all hover:bg-[#c8a882]/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </form>
            )}
          </div>

          <div
            className={`flex flex-col justify-center transition-all delay-200 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            {loadingContact ? (
              <div className="animate-pulse space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-[#c8a882]/30" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded bg-[#f5f0eb]/20" />
                      <div className="h-3 w-40 rounded bg-[#f5f0eb]/10" />
                    </div>
                  </div>
                ))}
                <div className="mt-12 h-64 rounded-xl bg-[#2a2a2a]" />
              </div>
            ) : (<>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8a882]">
                  <svg className="h-5 w-5 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0eb]">Teléfono</p>
                  <p className="text-[#f5f0eb]/60">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8a882]">
                  <svg className="h-5 w-5 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0eb]">Correo</p>
                  <p className="text-[#f5f0eb]/60">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8a882]">
                  <svg className="h-5 w-5 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0eb]">Dirección</p>
                  <p className="text-[#f5f0eb]/60">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-xl bg-[#2a2a2a]">
              <iframe
                src={contactInfo.maps_url}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg w-full h-64"
                title="Ubicación en Ica, Perú"
              />
            </div>
            </>)}
          </div>
        </div>
      </div>
    </section>
  )
}
